import { render, screen } from "@testing-library/react";
import Versus from "./Versus";

describe("Versus", () => {
  it("shows 'VS' as default", () => {
    render(<Versus state="default" />);
    expect(screen.getByText("VS")).toBeInTheDocument();
  });

  it("shows checkmark image when 'correct'", () => {
    render(<Versus state="correct" />);
    expect(screen.getByAltText("check")).toBeInTheDocument();
  });

  it("shows x image when 'incorrect'", () => {
    render(<Versus state="incorrect" />);
    expect(screen.getByAltText("x")).toBeInTheDocument();
  });
});
