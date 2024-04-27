import { getCollection } from "astro:content";
import { categoryToFilterClass, normalizeCategory } from "./categories";

export const sortPortfolioItemsWith =
  (portfolioOrder: string[]) =>
  (
    a: { title?: string; data?: { title: string } },
    b: { title?: string; data?: { title: string } }
  ) => {
    const aTitle = a.title ?? a.data?.title ?? "";
    const bTitle = b.title ?? b.data?.title ?? "";
    const aIndex = portfolioOrder.indexOf(aTitle);
    const bIndex = portfolioOrder.indexOf(bTitle);
    if (aIndex === -1 && bIndex === -1) return aTitle.localeCompare(bTitle);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  };

export const getPortfolioItems = async () => {
  const clientsCollection = await getCollection("clients");
  const portfolioOrder = (
    clientsCollection.find((client) => client.slug === "index-portfolio")?.data
      .order || ([] as Array<{ item: string }>)
  ).map(({ item }) => item);

  const portfolio = await getCollection("portfolio", (entry) => {
    return portfolioOrder.includes(entry.data.title);
  });
  let portfolioItems = portfolio.map((item) => {
    const categories = item.data.categories.map(normalizeCategory);
    const filterCategories = item.data.categories.map(categoryToFilterClass);
    return {
      ...item.data,
      categories,
      filterCategories,
      slug: item.slug,
    };
  });

  portfolioItems.sort(sortPortfolioItemsWith(portfolioOrder));

  return portfolioItems;
};
