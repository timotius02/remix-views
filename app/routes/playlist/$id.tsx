import { Video } from "@prisma/client";
import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { motion, useAnimation } from "framer-motion";
import { useState } from "react";
import { db } from "~/utils/db.server";
import getRandomInt from "~/utils/getRandomNumber";
import useLocalStorage from "~/utils/useLocalStorage";

export const meta: MetaFunction = () => {
  return {
    title: `Guess view for your favorite creators | The VIEWS Game`,
    description: "A boilerplate for using Next.js with Prisma & Planetscale",
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
  const [index, setIndex] = useState(data.index);
  const [index2, setIndex2] = useState(data.index2);
  const [index3, setIndex3] = useState(data.index3);

  const controls = useAnimation();

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

    controls
      .start({
        x: "-100%",
        transition: { duration: 0.5 },
        transitionEnd: {
          x: "0%",
        },
      })
      .then(() => {
        setIndex(index2);
        setIndex2(index3);
        setIndex3(getRandomInt(data.playlist.length, index));
      });
  };

  return (
    <>
      <div className="flex flex-col md:flex-row w-screen h-screen overflow-hidden relative text-white">
        <motion.div
          animate={controls}
          className="flex flex-col md:w-1/2 bg-cover bg-center items-center justify-center shrink-0"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${video1.thumbnail})`,
          }}
        >
          <h3 className="text-4xl font-bold mb-3 text-center overflow-hidden max-w-full">
            “{video1.title}”
          </h3>
          has
          <h1 className="text-5xl font-bold mt-3 text-center">
            {parseInt(video1.viewCount).toLocaleString()} views
          </h1>
        </motion.div>
        <motion.div
          animate={controls}
          className="flex flex-col md:w-1/2 bg-cover bg-center items-center justify-center shrink-0"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${video2.thumbnail})`,
          }}
        >
          <h3 className="text-4xl font-bold mb-3 text-center overflow-hidden max-w-full">
            “{video2.title}”
          </h3>
          has
          <button
            className="border-2 border-white px-10 py-2 font-bold text-yellow-400 text-lg rounded-full hover:bg-white hover:text-black my-3"
            onClick={() => handleClick("more")}
          >
            More
          </button>
          <button
            className="border-2 border-white px-10 py-2 font-bold text-yellow-400 text-lg rounded-full hover:bg-white hover:text-black mb-3"
            onClick={() => handleClick("less")}
          >
            Less
          </button>
          views than "{video1.title}"
        </motion.div>

        <motion.div
          animate={controls}
          className="flex flex-col md:w-1/2 bg-cover bg-center items-center justify-center shrink-0"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${video3.thumbnail})`,
          }}
        >
          <h3 className="text-4xl font-bold mb-3 text-center overflow-hidden max-w-full">
            “{video3.title}”
          </h3>
          has
          <button
            className="border-2 border-white px-10 py-2 font-bold text-yellow-400 text-lg rounded-full hover:bg-white hover:text-black my-3"
            onClick={() => handleClick("more")}
          >
            More
          </button>
          <button
            className="border-2 border-white px-10 py-2 font-bold text-yellow-400 text-lg rounded-full hover:bg-white hover:text-black mb-3"
            onClick={() => handleClick("less")}
          >
            Less
          </button>
          views than "{video2.title}"
        </motion.div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-6">
          <h1 className="font-bold text-4xl text-black">VS</h1>
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
