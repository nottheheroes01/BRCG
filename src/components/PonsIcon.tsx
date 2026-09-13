// The pons launchpad mark, using their own icon asset (transparent padding trimmed
// so it fills the slot). `invert` is kept for drop-in compatibility with the icon it
// replaces, but the branding asset is used as-is.
export const PonsIcon = ({
  className = "",
  invert = false,
}: {
  className?: string;
  invert?: boolean;
}) => (
  <img
    src="/pons.png"
    alt=""
    aria-hidden="true"
    className={className}
    data-invert={invert ? "" : undefined}
    style={{ objectFit: "contain" }}
  />
);
