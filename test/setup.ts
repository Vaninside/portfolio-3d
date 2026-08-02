import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import React from "react";

// next/image → plain <img> so jsdom can render it
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const { src, alt, fill, priority, ...rest } = props as {
      src: string;
      alt: string;
      fill?: boolean;
      priority?: boolean;
      [k: string]: unknown;
    };
    return React.createElement("img", { src, alt, ...rest });
  },
}));

// framer-motion useInView relies on IntersectionObserver
class IO {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
vi.stubGlobal("IntersectionObserver", IO);

// matchMedia used for prefers-reduced-motion / hover detection
vi.stubGlobal(
  "matchMedia",
  (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }),
);
