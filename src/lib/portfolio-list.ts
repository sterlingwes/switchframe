import { getCollection } from "astro:content";
import { categoryToFilterClass, normalizeCategory } from "./categories";

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

  portfolioItems.sort((a, b) => {
    const aIndex = portfolioOrder.indexOf(a.title);
    const bIndex = portfolioOrder.indexOf(b.title);
    if (aIndex === -1 && bIndex === -1) return a.title.localeCompare(b.title);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  return portfolioItems;
};
