import { useEffect, useState } from "react";

type RingProps = {
  percent: number;
  color: string;
  size?: number;
  visible: boolean;
  delay?: number;
};

const Ring = ({ percent, color, size = 88, visible, delay = 0 }: RingProps) => {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const [offset, setOffset] = useState(circ);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(
      () => setOffset(circ - (circ * percent) / 100),
      delay
    );
    return () => clearTimeout(t);
  }, [visible, circ, percent, delay]);

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.06)" strokeWidth={6} fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={color}
        strokeWidth={6}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        fill="none"
        style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)" }}
      />
    </svg>
  );
};

export default Ring;