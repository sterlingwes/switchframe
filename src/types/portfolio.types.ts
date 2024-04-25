import type { AstroComponentFactory } from "astro/dist/runtime/server";

export type RenderedPortfolioProps = {
  meta: {
    title: string;
    thumbnail: string;
    client: string;
    categories: string[];
    filterCategories: string[];
    videos: string[];
  };
  rendered: {
    Content: AstroComponentFactory;
  };
};
