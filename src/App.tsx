import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { LaunchBar } from "./components/LaunchBar";
import { About } from "./components/About";
import { Tokenomics } from "./components/Tokenomics";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden border-[10px] border-[#FA660F] bg-[#0B0B0B] font-sans text-white selection:bg-[#FA660F] selection:text-black">
      <Header />
      <main className="mt-[108px] flex-1 md:mt-[110px]">
        <Hero />
        <LaunchBar />
        <About />
        <Tokenomics />
      </main>
      <Footer />
    </div>
  );
}
