import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
    // Off-screen carousel slides are aria-hidden, so reach them with { hidden: true }.
    expect(
      within(card).getByRole("link", { name: /view demo/i, hidden: true }),
    ).toHaveAttribute("href", "https://absensi-karyawan-five-liard.vercel.app/");
    expect(
      within(card).getByRole("link", { name: /view (code|source)/i, hidden: true }),
    ).toHaveAttribute("href", "https://github.com/Vaninside/absensi-karyawan");
  });

  it("renders the Absensi Karyawan screenshot", () => {
    render(<Projects />);
    const card = cardFor("Absensi Karyawan");
    expect(
      within(card).getByRole("img", {
        name: /absensi karyawan dashboard screenshot/i,
        hidden: true,
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
    expect(
      within(card).queryByRole("link", { name: /view demo/i, hidden: true }),
    ).toBeNull();
    expect(within(card).getByText(/database sudah offline/i)).toBeInTheDocument();
    expect(
      within(card).getByRole("link", { name: /view source|view code/i, hidden: true }),
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
      within(card).getByRole("img", {
        name: /rukun dashboard screenshot/i,
        hidden: true,
      }),
    ).toHaveAttribute("src", "/rukun.webp");
  });
});

describe("Projects carousel", () => {
  it("exposes a carousel region", () => {
    render(<Projects />);
    expect(
      screen.getByRole("region", { name: /projects carousel/i }),
    ).toHaveAttribute("aria-roledescription", "carousel");
  });

  it("renders previous and next controls", () => {
    render(<Projects />);
    expect(
      screen.getByRole("button", { name: /previous project/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /next project/i }),
    ).toBeInTheDocument();
  });

  it("keeps both controls enabled (looping carousel)", () => {
    render(<Projects />);
    expect(screen.getByRole("button", { name: /previous project/i })).toBeEnabled();
    expect(screen.getByRole("button", { name: /next project/i })).toBeEnabled();
  });

  it("marks the first slide active initially", () => {
    render(<Projects />);
    const first = cardFor("StockFlow");
    expect(first).toHaveAttribute("data-active", "true");
  });

  it("advances the active slide when Next is clicked", async () => {
    const user = userEvent.setup();
    render(<Projects />);
    expect(cardFor("StockFlow")).toHaveAttribute("data-active", "true");

    await user.click(screen.getByRole("button", { name: /next project/i }));

    expect(cardFor("StockFlow")).toHaveAttribute("data-active", "false");
    expect(cardFor("Portfolio 3D")).toHaveAttribute("data-active", "true");
    expect(screen.getByRole("button", { name: /previous project/i })).toBeEnabled();
  });

  it("goes back to the previous slide when Previous is clicked", async () => {
    const user = userEvent.setup();
    render(<Projects />);
    await user.click(screen.getByRole("button", { name: /next project/i }));
    await user.click(screen.getByRole("button", { name: /previous project/i }));

    expect(cardFor("StockFlow")).toHaveAttribute("data-active", "true");
    expect(screen.getByRole("button", { name: /previous project/i })).toBeEnabled();
  });

  it("wraps from the last slide back to the first when Next is clicked", async () => {
    const user = userEvent.setup();
    render(<Projects />);
    const next = screen.getByRole("button", { name: /next project/i });
    // 5 projects → advance to the last slide (PUSON).
    for (let i = 0; i < 4; i++) {
      await user.click(next);
    }
    expect(cardFor("PUSON")).toHaveAttribute("data-active", "true");

    // One more Next wraps around to the first slide (StockFlow).
    await user.click(next);
    expect(cardFor("StockFlow")).toHaveAttribute("data-active", "true");
    expect(cardFor("PUSON")).toHaveAttribute("data-active", "false");
    expect(next).toBeEnabled();
  });

  it("wraps from the first slide to the last when Previous is clicked", async () => {
    const user = userEvent.setup();
    render(<Projects />);
    expect(cardFor("StockFlow")).toHaveAttribute("data-active", "true");

    await user.click(screen.getByRole("button", { name: /previous project/i }));

    expect(cardFor("PUSON")).toHaveAttribute("data-active", "true");
    expect(cardFor("StockFlow")).toHaveAttribute("data-active", "false");
  });

  it("still renders all five project titles inside the carousel", () => {
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
});

describe("Projects carousel — desktop (2 cards per view)", () => {
  function stubDesktopMatchMedia() {
    const original = window.matchMedia;
    // Desktop: min-width breakpoints match; other queries (reduced-motion) do not.
    window.matchMedia = ((query: string) => ({
      matches: query.includes("min-width"),
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    })) as typeof window.matchMedia;
    return () => {
      window.matchMedia = original;
    };
  }

  it("marks the first two cards active on desktop", () => {
    const restore = stubDesktopMatchMedia();
    try {
      render(<Projects />);
      expect(cardFor("StockFlow")).toHaveAttribute("data-active", "true");
      expect(cardFor("Portfolio 3D")).toHaveAttribute("data-active", "true");
      expect(cardFor("Absensi Karyawan")).toHaveAttribute("data-active", "false");
    } finally {
      restore();
    }
  });

  it("advances by one card and wraps back to the first pair on desktop", async () => {
    const restore = stubDesktopMatchMedia();
    const user = userEvent.setup();
    try {
      render(<Projects />);
      const next = screen.getByRole("button", { name: /next project/i });

      await user.click(next);
      // Window shifts to cards 2 and 3 (Portfolio 3D + Absensi Karyawan).
      expect(cardFor("StockFlow")).toHaveAttribute("data-active", "false");
      expect(cardFor("Portfolio 3D")).toHaveAttribute("data-active", "true");
      expect(cardFor("Absensi Karyawan")).toHaveAttribute("data-active", "true");

      // 5 projects, 2 per view → 4 windows (positions 0..3). Advance to the last
      // window (cards 4 & 5, RUKUN + PUSON): 3 more clicks from position 1.
      await user.click(next);
      await user.click(next);
      expect(cardFor("RUKUN")).toHaveAttribute("data-active", "true");
      expect(cardFor("PUSON")).toHaveAttribute("data-active", "true");

      // One more Next wraps back to the first pair (StockFlow + Portfolio 3D).
      await user.click(next);
      expect(cardFor("StockFlow")).toHaveAttribute("data-active", "true");
      expect(cardFor("Portfolio 3D")).toHaveAttribute("data-active", "true");
      expect(cardFor("RUKUN")).toHaveAttribute("data-active", "false");
      expect(next).toBeEnabled();
    } finally {
      restore();
    }
  });
});
