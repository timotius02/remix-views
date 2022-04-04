import { Video } from "@prisma/client";
import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import {
  ChoiceSlide,
  HiddenSlide,
  StaticVideoSlide,
} from "~/components/VideoSlides";
import { db } from "~/utils/db.server";
import getRandomInt from "~/utils/getRandomNumber";
import useLocalStorage from "~/utils/useLocalStorage";
import useWindowSize from "~/utils/useWindowSize";

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
  const playlist = await db.video.findMany({
    where: {
      playlistId: params.id,
    },
  });

  const index = getRandomInt(playlist.length);
  let index2 = getRandomInt(playlist.length, index);
  let index3 = getRandomInt(playlist.length, index2);

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
  const [score, setScore] = useState(0);
  const [highScore, setHighscore] = useLocalStorage(`highscore-${data.id}`, 0);
  const [showButtons, setShowButtons] = useState(true);
  const [index, setIndex] = useState(data.index);
  const [index2, setIndex2] = useState(data.index2);
  const [index3, setIndex3] = useState(data.index3);
  const [sliding, setSliding] = useState(false);
  const [animateButtons, setAnimateButtons] = useState(false);

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
    if (choice === "more") {
      if (parseInt(video1.viewCount) <= parseInt(video2.viewCount)) {
        addScore();
      }
    } else {
      if (parseInt(video1.viewCount) >= parseInt(video2.viewCount)) {
        addScore();
      }
    }

    setShowButtons(false);
    setTimeout(() => {
      setSliding(true);
    }, 1000);
  };

  const onAnimationsComplete = () => {
    setSliding(false);
    setIndex(index2);
    setIndex2(index3);
    setIndex3(getRandomInt(data.playlist.length, index));
  };

  return (
    <>
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
          <h5 className="text-2xl font-bold">Score: {score}</h5>
        </div>

        <div className="absolute bottom-0 right-0 p-6">
          <h5 className="text-2xl font-bold">High Score: {highScore}</h5>
        </div>
      </div>
    </>
  );
}
