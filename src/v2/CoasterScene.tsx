import { useEffect, useRef, useState, type MutableRefObject } from 'react';
import * as THREE from 'three';

// One continuous 3D track: the cart and the camera share the same curve.
export function CoasterScene({ progress, paused, reduced }: { progress: MutableRefObject<number>; paused: boolean; reduced: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const options = useRef({ paused, reduced });
  options.current = { paused, reduced };
  const [unavailable, setUnavailable] = useState(false);
  useEffect(() => {
    if (!host.current) return;
    const container = host.current;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); }
    catch { setUnavailable(true); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.setClearColor(0xf2eee5, 0);
    container.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xf2eee5, 95, 210);
    const camera = new THREE.PerspectiveCamera(39, 1, .1, 320);
    scene.add(new THREE.HemisphereLight(0xffffff, 0xa98f62, 2.6));
    const sun = new THREE.DirectionalLight(0xfff8dc, 3.4);
    sun.position.set(-8, 34, 16); sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -70, right: 70, top: 70, bottom: -70 });
    sun.shadow.bias = -.001; scene.add(sun);
    const material = (color: number, metalness = 0, roughness = .55) => new THREE.MeshStandardMaterial({ color, metalness, roughness });
    const dark = material(0x292b25, .5), lime = material(0xc7f52d, .15), gold = material(0xff6508, .12, .45), black = material(0x171c17), timber = material(0x8e846d);
    const mesh = (geometry: THREE.BufferGeometry, mat: THREE.Material, parent: THREE.Object3D, x = 0, y = 0, z = 0) => {
      const m = new THREE.Mesh(geometry, mat); m.position.set(x,y,z); m.castShadow = true; m.receiveShadow = true; parent.add(m); return m;
    };
    const rod = (a: THREE.Vector3, b: THREE.Vector3, radius: number, mat: THREE.Material, parent: THREE.Object3D) => {
      const m = mesh(new THREE.CylinderGeometry(radius, radius, a.distanceTo(b), 8), mat, parent);
      m.position.copy(a).add(b).multiplyScalar(.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), b.clone().sub(a).normalize()); return m;
    };
    // ---- Track ---------------------------------------------------------------
    // Hand-placed control points: a steep lift hill, a ~60° first drop, camelback
    // hills and one full vertical loop. The loop's two legs are offset along z so
    // the rails pass beside each other instead of intersecting at the crossing.
    const P = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
    // The front straight is generated from a slope profile: a steep lift, a ~50°
    // first drop and camelback hills, with every transition kept at a radius big
    // enough that the rails never crease.
    const straight: THREE.Vector3[] = [P(-34, 7, -14)];
    let gx = -34, gy = 7, gs = 0;
    const seg = (dx: number, slopeEnd: number) => {
      const steps = Math.max(2, Math.round(dx / 1.1));
      const slopeStart = gs;
      for (let i = 1; i <= steps; i++) {
        const slopeBefore = slopeStart + (slopeEnd - slopeStart) * ((i - 1) / steps);
        const slopeAfter = slopeStart + (slopeEnd - slopeStart) * (i / steps);
        gx += dx / steps;
        gy += (slopeBefore + slopeAfter) / 2 * (dx / steps);
        straight.push(P(gx, gy, -14));
      }
      gs = slopeEnd;
    };
    seg(3, .45); seg(4, 1.15); seg(3.5, .55); seg(2.5, 0);        // lift hill up to y≈14.5
    seg(3, -.38); seg(4, -1.05); seg(3, -1.2); seg(3.5, -.6); seg(3.5, 0); // first drop → valley y≈3.9
    seg(3.5, .85); seg(3, .3); seg(2.5, 0); seg(3, -.75);          // camelback hills
    seg(3.5, -.4); seg(3, .5); seg(2, .35); seg(2, .35);           // dip, then rise into the loop
    const trackPoints: THREE.Vector3[] = [
      ...straight,
      // the loop (x/y plane, legs separated along z)
      P(19.5, 6.2, -14), P(24.83, 8.87, -13.7), P(25.9, 14.2, -13.4), P(23.23, 17.93, -13.1),
      P(19.5, 19, -12.8), P(15.77, 17.93, -12.5), P(13.1, 14.2, -12.2), P(14.17, 8.87, -11.9), P(19.5, 6.2, -11.6),
      // out of the loop into the right-hand turn
      P(24.5, 6.4, -11.6), P(31, 7.6, -11.6), P(37.5, 8.2, -10.6),
      P(43.5, 8.8, -4.5), P(45.2, 9.4, 3.5), P(42.5, 9.8, 10.5), P(37, 8.6, 15),
      // back straight: rolling hills
      P(28, 12.4, 17.5), P(18, 15.8, 18), P(6, 16.6, 18.2), P(-6, 11.2, 18),
      P(-16, 13.4, 17.2), P(-25, 8.6, 16),
      // left turn back to the start
      P(-34.5, 7.6, 11), P(-42.5, 7.2, 3), P(-44, 7, -5.5), P(-40, 7.2, -11),
      P(-36.5, 7.1, -13.2), P(-35.5, 7.05, -13.6), // transitions back onto the straight (smooth seam)
    ];
    const track = new THREE.CatmullRomCurve3(trackPoints, true, 'centripetal');
    track.arcLengthDivisions = 2000; track.updateArcLengths();
    // World-up is the right reference everywhere except the loop, where the
    // track turns vertical. There the frame rolls a full 360° across the loop
    // (measured along the track) so the cart and rails roll over the top.
    const uAt = (target: THREE.Vector3) => {
      let best = 0, bestD = Infinity;
      for (let i = 0; i < 1200; i++) {
        const u = i / 1200;
        const d = track.getPointAt(u).distanceToSquared(target);
        if (d < bestD) { bestD = d; best = u; }
      }
      return best;
    };
    const loopStart = uAt(P(19.5, 6.2, -14));
    const loopEnd = uAt(P(19.5, 6.2, -11.6));
    const frame = (t: number) => {
      const u = ((t % 1) + 1) % 1;
      const p = track.getPointAt(u);
      const tangent = track.getTangentAt(u);
      const roll = THREE.MathUtils.smoothstep(u, loopStart - .006, loopEnd + .006) * Math.PI * 2;
      const upRef = new THREE.Vector3(-Math.sin(roll), Math.cos(roll), 0);
      const side = new THREE.Vector3().crossVectors(tangent, upRef);
      if (side.lengthSq() < 1e-6) side.set(1, 0, 0);
      side.normalize();
      const normal = new THREE.Vector3().crossVectors(side, tangent).normalize();
      return { p, tangent, side, normal, u };
    };
    const up = new THREE.Vector3(0, 1, 0);
    const railGroup = new THREE.Group(); scene.add(railGroup);
    class Rail extends THREE.Curve<THREE.Vector3> {
      constructor(private sign: number, private lift = 0) { super(); }
      getPoint(t: number, target = new THREE.Vector3()) {
        const f = frame(t);
        return target.copy(f.p).addScaledVector(f.side, this.sign * .92).addScaledVector(f.normal, this.lift);
      }
    }
    for (const sign of [-1, 1]) {
      mesh(new THREE.TubeGeometry(new Rail(sign), 1400, .115, 8, true), dark, railGroup);
      mesh(new THREE.TubeGeometry(new Rail(sign, .09), 1400, .032, 5, true), lime, railGroup);
    }
    for (let i = 0; i < 320; i++) {
      const f = frame(i / 320);
      const tie = mesh(new THREE.BoxGeometry(2.55, .16, .25), timber, railGroup);
      tie.position.copy(f.p).addScaledVector(f.normal, -.18);
      tie.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(f.side, f.normal, f.tangent.clone().negate()));
      // Supports only where the track is upright and off the floor, so the loop
      // does not sprout poles into the sky.
      if (f.normal.y > .55 && i % 10 === 0) {
        for (const s of [-1, 1]) { const top = f.p.clone().addScaledVector(f.side, s * .85); const bottom = top.clone(); bottom.y = -1.8; rod(bottom, top, .11, timber, railGroup); }
        if (i % 20 === 0) { const a = f.p.clone().addScaledVector(f.side, -.85); const b = f.p.clone().addScaledVector(f.side, .85); b.y = -1.8; rod(a, b, .065, timber, railGroup); }
      }
    }
    // Ground pillars holding the loop's outer edges.
    for (const top of [P(25.9, 14.2, -13.4), P(13.1, 14.2, -12.2), P(19.5, 19, -12.8)]) {
      const base = top.clone(); base.y = -1.8; rod(base, top, .16, timber, railGroup);
    }
    const floor = mesh(new THREE.PlaneGeometry(250, 250), material(0xe8e4d8), scene, 0, -1.85, 0); floor.rotation.x = -Math.PI / 2;
    const grid = new THREE.GridHelper(220, 110, 0xd2cebd, 0xdedace); grid.position.y = -1.82; scene.add(grid);
    // Sculpted mascot, inspired by the supplied orange / acid-green artwork.
    const cart = new THREE.Group(); cart.scale.setScalar(1.35); scene.add(cart);
    mesh(new THREE.BoxGeometry(2.25, .28, 2.45), dark, cart, 0, .28);
    mesh(new THREE.BoxGeometry(2.05, .85, 2.1), lime, cart, 0, .8);
    mesh(new THREE.BoxGeometry(1.72, .65, 1.5), dark, cart, 0, 1.24, -.12);
    mesh(new THREE.BoxGeometry(2.12, .9, .17), lime, cart, 0, 1.03, 1.02);
    for (const x of [-1.08, 1.08]) for (const z of [-.76, .76]) { const wheel = mesh(new THREE.CylinderGeometry(.32, .32, .22, 20), dark, cart, x, .14, z); wheel.rotation.z = Math.PI / 2; }
    const coin = mesh(new THREE.CylinderGeometry(.97, .97, .3, 64), gold, cart, 0, 2.08, .04); coin.rotation.x = Math.PI / 2;
    for (let i = 0; i < 32; i++) { const a = i / 32 * Math.PI * 2; const edge = mesh(new THREE.BoxGeometry(.05, .1, .34), dark, cart, Math.sin(a) * .965, 2.08 + Math.cos(a) * .965, .04); edge.rotation.z = -a; }
    const face = document.createElement('canvas'); face.width = 512; face.height = 512;
    const ctx = face.getContext('2d')!;
    const texture = new THREE.CanvasTexture(face); texture.colorSpace = THREE.SRGBColorSpace;
    const paintFace = (clock: number, excitement: number) => {
      ctx.clearRect(0, 0, 512, 512);
      ctx.fillStyle = '#ff7808'; ctx.beginPath(); ctx.arc(256, 256, 249, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#191b15'; ctx.lineWidth = 10; ctx.stroke();
      const blink = clock % 3.7 > 3.52 ? .13 : 1;
      ctx.fillStyle = '#191b15';
      for (const x of [202, 302]) { ctx.beginPath(); ctx.ellipse(x + Math.sin(clock * 1.4) * 4, 135, 18, (27 + excitement * 7) * blink, 0, 0, Math.PI * 2); ctx.fill(); }
      const mouth = 43 + Math.sin(clock * 3.7) * 5 + excitement * 18;
      ctx.beginPath(); ctx.ellipse(256, 210, 66, mouth, 0, 0, Math.PI); ctx.fill();
      ctx.fillStyle = '#fff9e9'; ctx.fillRect(201, 211, 110, 12);
      ctx.fillStyle = '#ee393d'; ctx.beginPath(); ctx.ellipse(262, 211 + mouth * .72, 26, mouth * .2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff9e9'; ctx.font = 'bold 182px Arial'; ctx.textAlign = 'center'; ctx.lineWidth = 10; ctx.strokeText('₿', 256, 430); ctx.fillText('₿', 256, 430);
      texture.needsUpdate = true;
    };
    paintFace(0, 0);
    mesh(new THREE.CircleGeometry(.96, 64), new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }), cart, 0, 2.08, .201);
    const backFace = mesh(new THREE.CircleGeometry(.96, 64), new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }), cart, 0, 2.08, -.121); backFace.rotation.y = Math.PI;
    const arms: THREE.Group[] = [];
    for (const s of [-1, 1]) {
      const limb = new THREE.Group(); limb.position.set(s * .8, 1.8, 0); cart.add(limb); arms.push(limb);
      const arm = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), new THREE.Vector3(s * .4, .6, .02), new THREE.Vector3(s * .52, 1.5, .05)]);
      mesh(new THREE.TubeGeometry(arm, 16, .065, 8, false), black, limb);
      mesh(new THREE.SphereGeometry(.13, 12, 12), black, limb, s * .52, 1.5, .05);
      for (let j = 0; j < 4; j++) rod(new THREE.Vector3(s * .52, 1.5, .05), new THREE.Vector3(s * .52 + (j - 1.5) * .1, 1.83 - Math.abs(j - 1.5) * .06, .05), .037, black, limb);
    }
    // Small sculptural trees and coins make the track feel like a miniature world.
    for (let i = 0; i < 18; i++) {
      const angle = i / 18 * Math.PI * 2;
      const x = Math.sin(angle) * 29, z = Math.cos(angle) * 20;
      mesh(new THREE.CylinderGeometry(.1, .15, 1.4, 7), timber, scene, x, -1.1, z);
      mesh(new THREE.IcosahedronGeometry(.7 + (i % 3) * .25, 0), material(i % 2 ? 0xb1be8f : 0x919f72), scene, x, .1, z);
    }
    // Candlestick sculptures echo the local ascent / descent of the track.
    const green = material(0x6cbd38, .1), red = material(0xee4938, .1);
    const floating: THREE.Group[] = [];
    const billCanvas = document.createElement('canvas'); billCanvas.width = 256; billCanvas.height = 128;
    const billCtx = billCanvas.getContext('2d')!;
    billCtx.fillStyle = '#a8d97b'; billCtx.fillRect(0, 0, 256, 128); billCtx.strokeStyle = '#244d2d'; billCtx.lineWidth = 5; billCtx.strokeRect(9, 9, 238, 110);
    billCtx.font = 'bold 75px Arial'; billCtx.textAlign = 'center'; billCtx.fillStyle = '#244d2d'; billCtx.fillText('$', 128, 90);
    billCtx.font = 'bold 20px Arial'; billCtx.fillText('100', 40, 40); billCtx.fillText('100', 216, 109);
    const billTexture = new THREE.CanvasTexture(billCanvas); billTexture.colorSpace = THREE.SRGBColorSpace;
    const billMaterial = new THREE.MeshStandardMaterial({ map: billTexture, side: THREE.DoubleSide, roughness: .7 });
    for (let i = 0; i < 7; i++) {
      const f = frame(.2 + i * .105), rising = f.tangent.y >= 0;
      const group = new THREE.Group(); group.position.copy(f.p).addScaledVector(f.side, 11); group.position.y = -1.65;
      group.rotation.y = Math.atan2(f.tangent.x, f.tangent.z); scene.add(group);
      mesh(new THREE.BoxGeometry(6, .24, 1.9), dark, group, 0, 0, 0);
      const chartMaterial = rising ? green : red;
      for (let j = 0; j < 5; j++) {
        const h = 1.5 + (rising ? j : 4 - j) * .85;
        mesh(new THREE.BoxGeometry(.6, 1.25 + (j % 2) * .4, .65), chartMaterial, group, (j - 2) * 1.05, h, 0);
        rod(new THREE.Vector3((j - 2) * 1.05, h - 1.3, 0), new THREE.Vector3((j - 2) * 1.05, h + 1.4, 0), .055, chartMaterial, group);
      }
      const treasures = new THREE.Group(); treasures.position.copy(f.p).addScaledVector(f.side, -10); treasures.position.y += 3.2; scene.add(treasures); floating.push(treasures);
      if (i % 2 === 0) {
        mesh(new THREE.BoxGeometry(2.4, .12, 1.2), green, treasures);
        for (let j = 0; j < 3; j++) { const bill = mesh(new THREE.PlaneGeometry(2.4, 1.2), billMaterial, treasures, .12 * j, .1 + j * .18, 0); bill.rotation.x = -Math.PI / 2; bill.rotation.z = j * .13; }
        const flying = mesh(new THREE.PlaneGeometry(2.4, 1.2), billMaterial, treasures, .5, 1.4, 0); flying.rotation.set(-.4, .2, .35);
      } else {
        for (let j = 0; j < 3; j++) { const token = mesh(new THREE.CylinderGeometry(.8, .8, .18, 32), gold, treasures, 0, j * .23, 0); token.rotation.z = .1; }
        const token = mesh(new THREE.CylinderGeometry(.8, .8, .18, 32), gold, treasures, .4, 1.5, 0); token.rotation.x = Math.PI / 2;
        mesh(new THREE.CircleGeometry(.76, 32), new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }), treasures, .4, 1.5, .1);
      }
      treasures.userData.baseY = treasures.position.y;
    }
    let raf = 0, last = 0, idle = 0, smooth = progress.current, paintClock = -1;
    // Eased ride "excitement": the mascot's arms and face follow this instead of the
    // raw track angle, so a fast scroll between steep sections can't make the limbs
    // flail about — the wave stays soft and continuous.
    let armEnergy = 0;
    const cameraAim = new THREE.Vector3(); let firstFrame = true;
    // Smoothed heading of the ride (the cart's travel direction). Starts on the
    // front straight, which the cart rides in +x.
    const fwdDir = new THREE.Vector3(1, 0, 0);
    const resize = () => {
      const w = container.clientWidth, h = container.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.fov = camera.aspect < .9 ? 48 : 39;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize); observer.observe(container); resize();
    const draw = (time: number) => {
      const delta = Math.min((time - last) / 1000, .05); last = time;
      if (!options.current.paused && !options.current.reduced) idle += delta;
      // Follow the scroll gently and cap the ride speed, so a fast flick glides the
      // cart along the track instead of throwing it out of the camera's frame.
      if (options.current.reduced) smooth = progress.current;
      else {
        const glide = (progress.current - smooth) * Math.min(1, delta * 2.2);
        const cap = delta * .2; // at most 20% of the circuit per second
        smooth += Math.max(-cap, Math.min(cap, glide));
      }
      const f = frame(smooth);
      const excitement = Math.min(1, Math.abs(f.tangent.y) * 1.8);
      armEnergy += (excitement - armEnergy) * Math.min(1, delta * 1.5);
      if (idle - paintClock > 1 / 20) { paintFace(idle, armEnergy); paintClock = idle; }
      arms.forEach((limb, i) => { limb.rotation.z = Math.sin(idle * (1.15 + armEnergy * 1.15) + i * 1.6) * (.1 + armEnergy * .11); limb.rotation.x = Math.sin(idle * .85 + i) * .075; });
      floating.forEach((object, i) => { object.position.y = object.userData.baseY + Math.sin(idle * 1.4 + i) * .3; object.rotation.y = Math.sin(idle * .6 + i) * .35; });
      cart.position.copy(f.p).addScaledVector(f.normal, .45);
      cart.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(f.side.clone().negate(), f.normal, f.tangent));
      // Camera: sits ahead-side of the cart and looks back at it — the framing the
      // ride was designed around, so the cart keeps coming toward the viewer and the
      // ride reads as moving forward. The heading is spring-smoothed and stiffens
      // where the track turns vertical, so it never whips around inside the loop.
      const portrait = camera.aspect < .9;
      const level = new THREE.Vector3(f.tangent.x, 0, f.tangent.z);
      const levelMag = level.length();
      if (levelMag > 1e-4) {
        level.multiplyScalar(1 / levelMag);
        const howLevel = Math.min(1, levelMag / .6) * Math.min(1, delta * 2.5);
        fwdDir.lerp(level, howLevel).normalize();
      }
      const cameraSide = new THREE.Vector3(-fwdDir.z, 0, fwdDir.x);
      const wanted = f.p.clone()
        .addScaledVector(fwdDir, portrait ? 22 : 18)
        .addScaledVector(cameraSide, portrait ? 19 : 16);
      wanted.y = f.p.y + (portrait ? 11 : 10);
      const aim = f.p.clone().addScaledVector(up, 1.5);
      if (firstFrame || options.current.reduced) { camera.position.copy(wanted); cameraAim.copy(aim); firstFrame = false; }
      else { camera.position.lerp(wanted, Math.min(1, delta * 2.6)); cameraAim.lerp(aim, Math.min(1, delta * 5)); }
      camera.lookAt(cameraAim);
      renderer.render(scene, camera); raf = requestAnimationFrame(draw);
    }; raf = requestAnimationFrame(draw);
    const lost = (e: Event) => { e.preventDefault(); setUnavailable(true); cancelAnimationFrame(raf); }; renderer.domElement.addEventListener('webglcontextlost', lost);
    return () => { cancelAnimationFrame(raf); observer.disconnect(); renderer.domElement.removeEventListener('webglcontextlost', lost); scene.traverse(o => { if (o instanceof THREE.Mesh) { o.geometry.dispose(); const mats = Array.isArray(o.material) ? o.material : [o.material]; mats.forEach(m => m.dispose()); } }); texture.dispose(); billTexture.dispose(); grid.geometry.dispose(); (grid.material as THREE.Material).dispose(); renderer.dispose(); renderer.domElement.remove(); };
  }, [progress]);
  return <div className="ride-scene" ref={host} role="img" aria-label="3D Bitcoin mascot riding a roller coaster with steep drops and a vertical loop">{unavailable && <img className="ride-fallback" src="/brcgstocklogo2.jpg" alt="Bitcoin roller coaster mascot" />}</div>;
}
