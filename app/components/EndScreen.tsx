import { Link } from "@remix-run/react";
import { useEffect, useRef } from "react";
import ConfettiGenerator from "confetti-js";
import sadge from "../../public/sadge.svg";

type EndScreenProps = {
  score: number;
  highScore: number;
  resetGame: () => void;
};

const EndScreen = ({ score, highScore, resetGame }: EndScreenProps) => {
  const ref = useRef(null);
  useEffect(() => {
    const confettiSettings = {
      target: ref.current,
      props: [
        "circle",
        "square",
        "triangle",
        "line",
        // { type: "svg", src: sadge },
      ],
    };
    const confetti = new ConfettiGenerator(confettiSettings);
    confetti.render();

    return () => confetti.clear();
  }, []);
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <canvas
        ref={ref}
        className="absolute top-0 left-0 w-full h-full"
        style={{ zIndex: -1 }}
      ></canvas>
      <h1 className="text-3xl font-extrabold text-white sm:text-4xl mb-6">
        You finished the game!
      </h1>
      <h2 className="text-4xl font-extrabold text-white sm:text-6xl mt-6 mb-2">
        Your score: <span className="text-red-500">{score}</span>
      </h2>
      <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-6">
        High Score: {highScore}
      </h2>
      <div className="flex mt-6 gap-2 flex-col md:flex-row md:gap-6">
        <Link
          to="/"
          className="flex-1 bg-transparent rounded-full border-2 border-white px-12 py-6 text-white hover:bg-white hover:text-black text-base font-bold text-center whitespace-nowrap"
        >
          Back to Menu
        </Link>

        <button
          className="flex-1 bg-transparent rounded-full border-2 border-white px-12 py-6 text-white hover:bg-white hover:text-black text-base font-bold"
          onClick={resetGame}
        >
          Play again
        </button>
      </div>
    </div>
  );
};

export default EndScreen;
