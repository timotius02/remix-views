import { CSSTransition, SwitchTransition } from "react-transition-group";

import checkmark from "../../public/checkmark.png";
import x from "../../public/x.png";

export type VERSUS_TYPES = "default" | "correct" | "incorrect";

type Versusprops = {
  state: VERSUS_TYPES;
};
const Versus = ({ state }: Versusprops) => {
  let style;
  let icon;
  switch (state) {
    case "correct":
      style = "bg-green-500 p-6";
      icon = <img src={checkmark} alt="check" />;
      break;
    case "incorrect":
      style = "bg-red-500 p-6";
      icon = <img src={x} alt="x" />;
      break;
    default:
      style = "bg-white p-6";
      icon = "VS";
  }

  return (
    <SwitchTransition>
      <CSSTransition key={state} timeout={200} classNames="versus" appear>
        <div
          className={`absolute rounded-full origin-top-left top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${style}`}
        >
          <h1 className="font-extrabold text-2xl md:text-3xl text-black">
            {icon}
          </h1>
        </div>
      </CSSTransition>
    </SwitchTransition>
  );
};

export default Versus;
