import { useEffect, useState } from "react";

type BarProps = {
  percent: number;
  color: string;
  visible: boolean;
  delay?: number;
};

const Bar = ({ percent, color, visible, delay = 0 }: BarProps) => {
  const [w, setW] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setW(percent), delay);
    return () => clearTimeout(t);
  }, [visible, percent, delay]);

  return (
    <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
      <div
        className="h-full rounded-full"
        style={{
          width: `${w}%`,
          background: color,
          transition: "width 1.3s cubic-bezier(.4,0,.2,1)",
        }}
      />
    </div>
  );
};

export default Bar;