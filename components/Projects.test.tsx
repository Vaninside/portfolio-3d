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

  it("renders StockFlow as the first project card", () => {
    const { container } = render(<Projects />);
    // CardTitle renders as <div data-slot="card-title"> (not a heading) in this codebase.
    const titles = Array.from(
      container.querySelectorAll('[data-slot="card-title"]'),
    ).map((el) => el.textContent);
    expect(titles[0]).toBe("StockFlow");
  });

  it("renders all four project titles", () => {
    render(<Projects />);
    for (const name of ["StockFlow", "Portfolio 3D", "RUKUN", "PUSON"]) {
      expect(screen.getByText(name)).toBeInTheDocument();
    }
  });

  it("links StockFlow to its live demo and repo", () => {
    render(<Projects />);
    // RUKUN/PUSON still render demo buttons in this task (conditional removal is
    // a later task), so multiple "View Demo" links exist. StockFlow is first.
    expect(
      screen.getAllByRole("link", { name: /view demo/i })[0],
    ).toHaveAttribute("href", "https://stock-flow-web-iota.vercel.app/");
    expect(
      screen.getAllByRole("link", { name: /view (code|source)/i })[0],
    ).toHaveAttribute("href", "https://github.com/Vaninside/Stock-flow");
  });
});
