import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 40"
      width="120"
      height="40"
      {...props}
    >
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontFamily="Playfair Display, serif"
        fontSize="32"
        fontWeight="600"
        fill="currentColor"
        className="text-foreground"
      >
        Naari
      </text>
    </svg>
  );
}
