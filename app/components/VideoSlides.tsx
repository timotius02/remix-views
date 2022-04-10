import { Video } from "@prisma/client";
import { useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import useWindowSize from "~/utils/useWindowSize";
import CountUp from "./CountUp";
import youtubeIcon from "../../public/youtube.png";

type ChoiceSlideProps = {
  video: Video;
  sliding?: boolean;
  onClick?: (choice: string) => void;
  onAnimationComplete?: () => void;
  openModal: () => void;
};

export const ChoiceSlide = ({
  video,
  sliding,
  onClick = (s: string) => {},
  onAnimationComplete = () => {},
  openModal,
}: ChoiceSlideProps) => {
  const windowSize = useWindowSize();
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
        <div className="h-24 md:h-44 relative">
          <TransitionGroup component={null}>
            {showButtons ? (
              <CSSTransition
                timeout={500}
                classNames="buttons"
                key={video.id + "buttons"}
                unmountOnExit
              >
                <div className="flex flex-col items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
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
                classNames="views-counter"
                key={video.id + "views"}
              >
                <div className="flex flex-col items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <CountUp target={+video.viewCount} />
                  <h3 className="text-xl md:text-3xl font-medium text-center">
                    Views
                  </h3>
                </div>
              </CSSTransition>
            )}
          </TransitionGroup>
        </div>
        <button onClick={openModal} title="Watch Video">
          <img
            className="hover:brightness-75"
            src={youtubeIcon}
            alt="youtube icon"
          />
        </button>
      </div>
    </CSSTransition>
  );
};

type staticSlideProps = {
  video: Video;
  sliding: boolean;
  openModal: () => void;
};
export const StaticSlide = ({
  video,
  sliding,
  openModal,
}: staticSlideProps) => {
  const windowSize = useWindowSize();
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
        <div className="h-24 md:h-44 relative">
          <div className="flex flex-col items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <h1 className="text-3xl md:text-6xl font-bold text-center">
              {parseInt(video.viewCount).toLocaleString()}
            </h1>
            <h3 className="text-xl md:text-3xl font-medium text-center">
              Views
            </h3>
          </div>
        </div>
        <button onClick={openModal} title="Watch Video">
          <img
            className="hover:brightness-75"
            src={youtubeIcon}
            alt="youtube icon"
          />
        </button>
      </div>
    </CSSTransition>
  );
};

type HiddenSlide = {
  video: Video;
  sliding: boolean;
};
export const HiddenSlide = ({ video, sliding }: HiddenSlide) => {
  const windowSize = useWindowSize();
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
        <div className="h-24 md:h-44 relative">
          <div className="flex flex-col items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="flex md:flex-col gap-3 my-3 z-10">
              <button className="border-2 border-white px-10 py-2 font-bold text-yellow-400 text-lg rounded-full hover:bg-white hover:text-black">
                More
              </button>
              <button className="border-2 border-white px-10 py-2 font-bold text-yellow-400 text-lg rounded-full hover:bg-white hover:text-black">
                Less
              </button>
            </div>
            <span>Views</span>
          </div>
        </div>
        <img src={youtubeIcon} alt="youtube icon" />
      </div>
    </CSSTransition>
  );
};
