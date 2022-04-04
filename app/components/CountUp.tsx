import { useEffect, useState } from "react";

type CountUpProps = {
  target: number;
};

const CountUp = ({ target }: CountUpProps) => {
  const [count, setCount] = useState(target - 50);
  useEffect(() => {
    if (count < target) {
      setTimeout(() => {
        setCount((count) => count + 1);
      }, 10);
    }
  }, [count]);

  return (
    <h1 className="text-3xl md:text-6xl font-bold text-center">
      {count.toLocaleString()}
    </h1>
  );
};

export default CountUp;
