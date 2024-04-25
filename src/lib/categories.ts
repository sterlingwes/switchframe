export const normalizeCategory = (category: string): string => {
  return category.trim().replace("_", " ");
};

export const categoryToFilterClass = (category: string) => {
  return (
    "portfolio_category_" + category.trim().replace(" ", "_").toLowerCase()
  );
};
