import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Projects from "@/components/Projects";

describe("Projects", () => {
  it("renders the section heading", () => {
    render(<Projects />);
    expect(
      screen.getByRole("heading", { name: /my project/i }),
    ).toBeInTheDocument();
  });
});
