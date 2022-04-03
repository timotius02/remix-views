import { Video } from "@prisma/client";
import { AnimationControls, motion } from "framer-motion";
import { CSSTransition, TransitionGroup } from "react-transition-group";

type VideoSlide = {
  video: Video;
  showButtons?: boolean;
  handleClick?: (choice: string) => void;
  controls?: AnimationControls;
};

const VideoSlide = ({
  video,
  showButtons = false,
  handleClick,
  controls,
}: VideoSlide) => {
  const onClick = () => {
    if (handleClick) {
      handleClick("more");
    }
  };
  return (
    <motion.div
      animate={controls}
      className="flex flex-col w-full h-1/2 md:w-1/2 md:h-full bg-cover bg-center items-center justify-center shrink-0 relative"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${video.thumbnail})`,
      }}
    >
      <h3 className="text-2xl md:text-4xl font-bold md:mb3 text-center overflow-hidden w-3/4">
        “{video.title}”
      </h3>
      has
      <CSSTransition
        timeout={500}
        in={showButtons && handleClick !== undefined}
        classNames="buttons"
      >
        <div
          className={`flex flex-col items-center ${
            showButtons ? "" : "opacity-0"
          }`}
        >
          <div className="flex md:flex-col gap-3 my-3 z-10">
            <button
              className="border-2 border-white px-10 py-2 font-bold text-yellow-400 text-lg rounded-full hover:bg-white hover:text-black"
              onClick={onClick}
            >
              More
            </button>
            <button
              className="border-2 border-white px-10 py-2 font-bold text-yellow-400 text-lg rounded-full hover:bg-white hover:text-black"
              onClick={onClick}
            >
              Less
            </button>
          </div>
        </div>
      </CSSTransition>
      <CSSTransition
        timeout={500}
        in={!showButtons}
        classNames="views-counter"
        mountOnEnter
        unmountOnExit
      >
        <div className="absolute top-1/2">
          <h1 className="text-3xl md:text-6xl font-bold text-center">
            {parseInt(video.viewCount).toLocaleString()}
          </h1>
          <h3 className="text-xl md:text-3xl font-medium text-center">Views</h3>
        </div>
      </CSSTransition>
    </motion.div>
  );
};

export default VideoSlide;
