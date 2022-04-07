import { Video } from "@prisma/client";
import { useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import useWindowSize from "~/utils/useWindowSize";
import CountUp from "./CountUp";

type ChoiceSlideProps = {
  video: Video;
  sliding?: boolean;
  onClick?: (choice: string) => void;
  onAnimationComplete?: () => void;
};

export const ChoiceSlide = ({
  video,
  sliding,
  onClick = (s: string) => {},
  onAnimationComplete = () => {},
}: ChoiceSlideProps) => {
  const [windowSize, setWindowSize] = useWindowSize();
  const [showButtons, setShowButtons] = useState(true);

  const handleClick = (choice: string) => {
    onClick(choice);
    setShowButtons(false);
  };

  const handleAnimationComplete = () => {
    setShowButtons(true);
    onAnimationComplete();
  };
  return (
    <CSSTransition
      in={sliding}
      timeout={500}
      classNames={windowSize.width > 768 ? "slide-left" : "slide-up"}
      onEntered={handleAnimationComplete}
    >
      <div
        className="flex flex-col w-full h-1/2 md:w-1/2 md:h-full bg-cover bg-center items-center justify-center shrink-0 relative"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${video.thumbnail})`,
        }}
      >
        <h3 className="text-2xl md:text-4xl font-bold md:mb-2 text-center overflow-hidden w-3/4">
          “{video.title}”
        </h3>
        has
        <div className="h-20 relative w-1/2">
          <TransitionGroup component={null}>
            {showButtons ? (
              <CSSTransition
                timeout={500}
                classNames="buttons"
                key={video.id + "buttons"}
                unmountOnExit
              >
                <div className={`flex flex-col items-center absolute inset-0`}>
                  <div className="flex md:flex-col gap-3 my-3 z-10">
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
                  <span>Views</span>
                </div>
              </CSSTransition>
            ) : (
              <CSSTransition
                timeout={500}
                classNames={"views-counter"}
                key={video.id + "views"}
              >
                <div className={`flex flex-col items-center absolute inset-0 `}>
                  <CountUp target={+video.viewCount} />
                  <h3 className="text-xl md:text-3xl font-medium text-center">
                    Views
                  </h3>
                </div>
              </CSSTransition>
            )}
          </TransitionGroup>
        </div>
      </div>
    </CSSTransition>
  );
};

type staticVideoSlideProps = {
  video: Video;
  sliding: boolean;
};
export const StaticVideoSlide = ({ video, sliding }: staticVideoSlideProps) => {
  const [windowSize, setWindowSize] = useWindowSize();
  return (
    <CSSTransition
      in={sliding}
      timeout={500}
      classNames={windowSize.width > 768 ? "slide-left" : "slide-up"}
    >
      <div
        className="flex flex-col w-full h-1/2 md:w-1/2 md:h-full bg-cover bg-center items-center justify-center shrink-0 relative"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${video.thumbnail})`,
        }}
      >
        <h3 className="text-2xl md:text-4xl font-bold md:mb-2 text-center overflow-hidden w-3/4">
          “{video.title}”
        </h3>
        has
        <div className="h-20 relative w-1/2">
          <div className={`flex flex-col items-center absolute inset-0 `}>
            <h1 className="text-3xl md:text-6xl font-bold text-center">
              {parseInt(video.viewCount).toLocaleString()}
            </h1>
            <h3 className="text-xl md:text-3xl font-medium text-center">
              Views
            </h3>
          </div>
        </div>
      </div>
    </CSSTransition>
  );
};

type HiddenSlide = {
  video: Video;
  sliding: boolean;
};
export const HiddenSlide = ({ video, sliding }: HiddenSlide) => {
  const [windowSize, setWindowSize] = useWindowSize();
  return (
    <CSSTransition
      in={sliding}
      timeout={500}
      classNames={windowSize.width > 768 ? "slide-left" : "slide-up"}
    >
      <div
        className="flex flex-col w-full h-1/2 md:w-1/2 md:h-full bg-cover bg-center items-center justify-center shrink-0 relative"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${video.thumbnail})`,
        }}
      >
        <h3 className="text-2xl md:text-4xl font-bold md:mb-2 text-center overflow-hidden w-3/4">
          “{video.title}”
        </h3>
        has
        <div className="h-20 relative w-1/2">
          <div className={`flex flex-col items-center absolute inset-0`}>
            <div className="flex md:flex-col gap-3 my-3 z-10">
              <button className="border-2 border-white px-10 py-2 font-bold text-yellow-400 text-lg rounded-full hover:bg-white hover:text-black">
                More
              </button>
              <button className="border-2 border-white px-10 py-2 font-bold text-yellow-400 text-lg rounded-full hover:bg-white hover:text-black">
                Less
              </button>
            </div>
          </div>
        </div>
      </div>
    </CSSTransition>
  );
};
