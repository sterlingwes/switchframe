import type { AstroComponentFactory } from "astro/dist/runtime/server";

export type RenderedPortfolioProps = {
  meta: {
    title: string;
    client: string;
    categories: string[];
    videos: string[];
  };
  rendered: {
    Content: AstroComponentFactory;
  };
};
