export const LongIcon = ({
  className = "",
  invert = false,
}: {
  className?: string;
  invert?: boolean;
}) => {
  const tile = invert ? "#0B0B0B" : "#FA660F";
  const glyph = invert ? "#FA660F" : "#0B0B0B";
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className} aria-hidden="true">
      <rect width="28" height="28" rx="7" fill={tile} />
      <path
        d="M8.5 19.5 19.5 8.5"
        stroke={glyph}
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <path
        d="M12.5 8.5H19.5V15.5"
        stroke={glyph}
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
