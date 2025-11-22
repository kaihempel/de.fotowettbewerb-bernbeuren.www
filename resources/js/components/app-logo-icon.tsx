import { SVGAttributes } from "react";

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
  return (
    <svg
      aria-labelledby="title"
      {...props}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>BB Kamera Logo</title>
      <g transform="translate(0 5)">
        <path className="kamera-body" d="m10 20v60h40a30 30 0 0 1 0-60h-40z" />
        <path className="kamera-body" d="m90 20v60h-40a30 30 0 0 0 0-60h40z" />
        <line className="kamera-body" x1="10" x2="20" y1="50" y2="50" />
        <line className="kamera-body" x1="80" x2="90" y1="50" y2="50" />
        <g className="kamera-top">
          <rect x="40" y="12" width="20" height="6" rx="2" />
          <rect x="75" y="12" width="8" height="6" rx="2" />
        </g>
      </g>
    </svg>
  );
}
