export default function Logo({ size = 32, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Paper sheet with folded corner */}
      <path
        d="M8 4C8 2.89543 8.89543 2 10 2H25L34 11V36C34 37.1046 33.1046 38 32 38H10C8.89543 38 8 37.1046 8 36V4Z"
        fill="#FAF7F0"
        stroke="#17263D"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path d="M25 2V9C25 10.1046 25.8954 11 27 11H34" stroke="#17263D" strokeWidth="2.2" strokeLinejoin="round" />
      {/* Ruled lines */}
      <line x1="13" y1="18" x2="24" y2="18" stroke="#E4DFD2" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="13" y1="23" x2="24" y2="23" stroke="#E4DFD2" strokeWidth="1.6" strokeLinecap="round" />
      {/* Amber checkmark badge */}
      <circle cx="27" cy="27" r="8" fill="#D98C3D" />
      <path d="M23.5 27L26 29.5L31 24" stroke="#17263D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
