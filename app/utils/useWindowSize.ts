import { useEffect, useState } from "react";

type window = {
  width: number;
  height: number;
};
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<window>({
    width: 0,
    height: 0,
  });

  const handleResize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }
  useEffect(() => {
    if (typeof window !== "undefined") {

      window.addEventListener("resize", handleResize);

      handleResize();

      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return windowSize;
};

export default useWindowSize;
