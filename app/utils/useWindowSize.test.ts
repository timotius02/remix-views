import { renderHook } from "@testing-library/react-hooks";
import useWindowSize from "./useWindowSize";

describe("useWindowSize", () => {
  it("should be defined", () => {
    expect(useWindowSize).toBeDefined();
  });

  function getHook() {
    return renderHook(() => useWindowSize());
  }

  function triggerResize(dimension: "width" | "height", value: number) {
    if (dimension === "width") {
      (window.innerWidth as number) = value;
    } else if (dimension === "height") {
      (window.innerHeight as number) = value;
    }

    window.dispatchEvent(new Event("resize"));
  }

  it("should return current window dimensions", () => {
    const hook = getHook();

    expect(typeof hook.result.current).toBe("object");
    expect(typeof hook.result.current.height).toBe("number");
    expect(typeof hook.result.current.width).toBe("number");
  });

  it("should re-render after height change", () => {
    const hook = getHook();

    triggerResize("height", 360);

    expect(hook.result.current.height).toBe(360);

    triggerResize("height", 2048);

    expect(hook.result.current.height).toBe(2048);
  });

  it("should re-render after width change", () => {
    const hook = getHook();

    triggerResize("width", 360);

    expect(hook.result.current.width).toBe(360);

    triggerResize("width", 2048);

    expect(hook.result.current.width).toBe(2048);
  });
});
