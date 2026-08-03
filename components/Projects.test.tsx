import { render, screen, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Projects from "@/components/Projects";

function cardFor(title: string): HTMLElement {
  const heading = screen.getByText(title);
  const card = heading.closest("[data-project-card]");
  if (!(card instanceof HTMLElement)) {
    throw new Error(`card wrapper not found for ${title}`);
  }
  return card;
}

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

  it("renders all five project titles", () => {
    render(<Projects />);
    for (const name of [
      "StockFlow",
      "Portfolio 3D",
      "Absensi Karyawan",
      "RUKUN",
      "PUSON",
    ]) {
      expect(screen.getByText(name)).toBeInTheDocument();
    }
  });

  it("renders Absensi Karyawan as the third project card", () => {
    const { container } = render(<Projects />);
    const titles = Array.from(
      container.querySelectorAll('[data-slot="card-title"]'),
    ).map((el) => el.textContent);
    expect(titles[2]).toBe("Absensi Karyawan");
  });

  it("links Absensi Karyawan to its live demo and repo", () => {
    render(<Projects />);
    const card = cardFor("Absensi Karyawan");
    expect(
      within(card).getByRole("link", { name: /view demo/i }),
    ).toHaveAttribute("href", "https://absensi-karyawan-five-liard.vercel.app/");
    expect(
      within(card).getByRole("link", { name: /view (code|source)/i }),
    ).toHaveAttribute("href", "https://github.com/Vaninside/absensi-karyawan");
  });

  it("renders the Absensi Karyawan screenshot", () => {
    render(<Projects />);
    const card = cardFor("Absensi Karyawan");
    expect(
      within(card).getByRole("img", {
        name: /absensi karyawan dashboard screenshot/i,
      }),
    ).toHaveAttribute("src", "/absensi.webp");
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

  it("hides the demo button and shows an offline note for RUKUN", () => {
    render(<Projects />);
    const card = cardFor("RUKUN");
    expect(within(card).queryByRole("link", { name: /view demo/i })).toBeNull();
    expect(within(card).getByText(/database sudah offline/i)).toBeInTheDocument();
    expect(
      within(card).getByRole("link", { name: /view source|view code/i }),
    ).toHaveAttribute("href", "https://github.com/rukun-dev/Rukun");
  });

  it("shows the demo button for StockFlow (demo available)", () => {
    render(<Projects />);
    const card = cardFor("StockFlow");
    expect(
      within(card).getByRole("link", { name: /view demo/i }),
    ).toBeInTheDocument();
  });

  it("renders a screenshot image for cards that have one", () => {
    render(<Projects />);
    const card = cardFor("StockFlow");
    const img = within(card).getByRole("img", {
      name: /stockflow dashboard screenshot/i,
    });
    expect(img).toHaveAttribute("src", "/stock-flow.webp");
  });

  it("renders the screenshot even when the live demo is offline", () => {
    render(<Projects />);
    const card = cardFor("RUKUN");
    expect(
      within(card).getByRole("img", { name: /rukun dashboard screenshot/i }),
    ).toHaveAttribute("src", "/rukun.webp");
  });
});
