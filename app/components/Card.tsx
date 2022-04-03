import { Video } from "@prisma/client";
import { AnimationControls, motion } from "framer-motion";

type CardProps = {
  video: Video;
  showButtons?: boolean;
  handleClick?: (choice: string) => void;
  controls?: AnimationControls;
};

const Card = ({
  video,
  showButtons = false,
  handleClick,
  controls,
}: CardProps) => {
  return (
    <motion.div
      animate={controls}
      className="flex flex-col w-full h-1/2 md:w-1/2 md:h-full bg-cover bg-center items-center justify-center shrink-0"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${video.thumbnail})`,
      }}
    >
      <h3 className="text-2xl md:text-4xl font-bold mb-3 text-center overflow-hidden w-3/4">
        “{video.title}”
      </h3>
      has
      {showButtons && handleClick !== undefined ? (
        <>
          <div className="flex md:flex-col gap-3 my-3">
            <button
              className="border-2 border-white px-10 py-2 font-bold text-yellow-400 text-lg rounded-full hover:bg-white hover:text-black"
              onClick={() => handleClick("more")}
            >
              More
            </button>
            <button
              className="border-2 border-white px-10 py-2 font-bold text-yellow-400 text-lg rounded-full hover:bg-white hover:text-black"
              onClick={() => handleClick("less")}
            >
              Less
            </button>
          </div>

          <p className="text-center w-3/4">views than "{video.title}"</p>
        </>
      ) : (
        <>
          <h1 className="text-3xl md:text-5xl font-bold mt-3 text-center">
            {parseInt(video.viewCount).toLocaleString()} views
          </h1>
        </>
      )}
    </motion.div>
  );
};

export default Card;
