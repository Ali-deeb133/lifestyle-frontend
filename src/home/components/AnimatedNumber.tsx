import { useEffect, useState } from "react";

type AnimatedNumberProps = {
  target: number;
  decimals?: number;
  visible: boolean;
  delay?: number;
};

const AnimatedNumber = ({ target, decimals = 0, visible, delay = 0 }: AnimatedNumberProps) => {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!visible) return;

    const timeout = setTimeout(() => {
      let start: number | null = null;
      const duration = 1400;

      const step = (ts: number) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setVal(parseFloat((eased * target).toFixed(decimals)));
        if (p < 1) requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    }, delay);

    return () => clearTimeout(timeout);
  }, [visible, target, decimals, delay]);

  return <>{val.toFixed(decimals)}</>;
};

export default AnimatedNumber;
