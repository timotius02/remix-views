import { Dispatch, SetStateAction, useEffect, useState } from "react";

type window = {
  width: number;
  height: number;
};
const useWindowSize = (): [window, Dispatch<SetStateAction<window>>] => {
  const [windowSize, setWindowSize] = useState<window>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      function handleResize() {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }

      window.addEventListener("resize", handleResize);

      handleResize();

      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return [windowSize, setWindowSize];
};

export default useWindowSize;
