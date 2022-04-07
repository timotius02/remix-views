import { Video } from "@prisma/client";
import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import {
  ChoiceSlide,
  HiddenSlide,
  StaticVideoSlide,
} from "~/components/VideoSlides";
import { db } from "~/utils/db.server";
import getRandomNumber from "~/utils/getRandomNumber";
import useLocalStorage from "~/utils/useLocalStorage";

export const meta: MetaFunction = () => {
  return {
    title: `Guess view for your favorite creators | The VIEWS Game`,
    description:
      "Do you think you can guess the views of your favorite creators?",
    "theme-color": "#000",
  };
};

type PlaylistLoaderData = {
  playlist: Video[];
  index: number;
  index2: number;
  index3: number;
  id: string;
};

export const loader: LoaderFunction = async ({ params }) => {
  // This is getting called when the page is preload. Need to fix
  await db.playlist.update({
    where: {
      id: params.id,
    },
    data: {
      plays: {
        increment: 1,
      },
    },
  });

  const playlist = await db.video.findMany({
    where: {
      playlistId: params.id,
    },
  });

  const index = getRandomNumber(playlist.length);
  let index2 = getRandomNumber(playlist.length, [index]);
  let index3 = getRandomNumber(playlist.length, [index, index2]);

  const data: PlaylistLoaderData = {
    playlist,
    index,
    index2,
    index3,
    id: params.id || "",
  };

  return json(data);
};

export default function Index() {
  const data = useLoaderData<PlaylistLoaderData>();
  const [highScore, setHighscore] = useLocalStorage(`highscore-${data.id}`, 0);
  const [score, setScore] = useState(0);
  const [index, setIndex] = useState(data.index);
  const [index2, setIndex2] = useState(data.index2);
  const [index3, setIndex3] = useState(data.index3);
  const [prevIndices, setPrevIndices] = useState([index, index2, index3]);
  const [sliding, setSliding] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);

  const video1 = data.playlist[index];
  const video2 = data.playlist[index2];
  const video3 = data.playlist[index3];

  const addScore = () => {
    setScore(score + 1);
    if (score + 1 > highScore) {
      setHighscore(score + 1);
    }
  };

  const handleClick = (choice: string) => {
    if (
      choice === "more" &&
      parseInt(video1.viewCount) <= parseInt(video2.viewCount)
    ) {
      addScore();
      setTimeout(() => {
        setSliding(true);
      }, 1000);
    } else if (
      choice === "less" &&
      parseInt(video1.viewCount) >= parseInt(video2.viewCount)
    ) {
      addScore();
      setTimeout(() => {
        setSliding(true);
      }, 1000);
    } else {
      setHasEnded(true);
    }
  };

  const onAnimationsComplete = () => {
    setSliding(false);
    setIndex(index2);
    setIndex2(index3);

    let newIndex = getRandomNumber(data.playlist.length, prevIndices);
    if (newIndex === -1) {
      // TODO: SHould do something here if we run out of numbers

      newIndex = getRandomNumber(data.playlist.length);
      setIndex3(newIndex);
      setPrevIndices([newIndex]);
    } else {
      setIndex3(newIndex);
      setPrevIndices((prevIndices) => [...prevIndices, newIndex]);
    }
  };
  const reset = () => {
    setScore(0);
    setHasEnded(false);
    const index = getRandomNumber(data.playlist.length);
    const index2 = getRandomNumber(data.playlist.length, [index]);
    const index3 = getRandomNumber(data.playlist.length, [index, index2]);

    setIndex(index);
    setIndex2(index2);
    setIndex3(index3);
    setPrevIndices([index, index2, index3]);
  };
  return hasEnded ? (
    <div className="bg-gray-800 w-screen h-screen flex flex-col justify-center items-center">
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
          onClick={reset}
        >
          Play again
        </button>
      </div>
    </div>
  ) : (
    <div className="flex flex-col md:flex-row w-screen h-screen overflow-hidden relative text-white">
      <StaticVideoSlide video={video1} sliding={sliding} />
      <ChoiceSlide
        video={video2}
        onClick={(choice) => handleClick(choice)}
        sliding={sliding}
        onAnimationComplete={onAnimationsComplete}
      />
      <HiddenSlide video={video3} sliding={sliding} />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-4 md:p-6">
        <h1 className="font-bold text-2xl md:text-4xl text-black">VS</h1>
      </div>

      <div className="absolute bottom-0 left-0 p-6">
        <h5 className="text-2xl md:text-4xl font-extrabold">Score: {score}</h5>
      </div>

      <div className="absolute bottom-0 right-0 p-6">
        <h5 className="text-2xl md:text-4xl font-extrabold">
          High Score: {highScore}
        </h5>
      </div>
    </div>
  );
}
