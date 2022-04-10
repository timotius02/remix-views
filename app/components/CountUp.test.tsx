import CountUp from "./CountUp";
import { render, waitFor, screen } from "@testing-library/react";

describe("Countup", () => {
  it("should render", async () => {
    render(<CountUp target={2000} />);
    // Initially -50 from target
    expect(screen.getByText("1,950")).toBeInTheDocument();

    // then animates to target
    expect(screen.queryByText("2,000")).not.toBeInTheDocument();
    waitFor(() => expect(screen.getByText("2,000")).toBeInTheDocument());
  });
});
