import lev from "fastest-levenshtein";
import { getCollection } from "astro:content";
import { sortPortfolioItemsWith } from "./portfolio-list";

const getPortfolioEntries = async (filter?: (entry: any) => boolean) => {
  const portfolioEntries = await getCollection("portfolio", filter);
  return portfolioEntries;
};

const getClientsCollection = async () => {
  const clientsCollection = await getCollection("clients");
  return clientsCollection;
};

type PortfolioEntries = Awaited<ReturnType<typeof getPortfolioEntries>>;
type ClientsCollection = Awaited<ReturnType<typeof getClientsCollection>>;
const cached = {
  portfolioEntries: null as PortfolioEntries | null,
  clientsCollection: null as ClientsCollection | null,
};

const getCachedPortfolioEntries = async (filter?: (entry: any) => boolean) => {
  if (cached.portfolioEntries) return cached.portfolioEntries;
  const portfolioEntries = await getPortfolioEntries(filter);
  cached.portfolioEntries = portfolioEntries;
  return portfolioEntries;
};

const getCachedClientsCollection = async () => {
  if (cached.clientsCollection) return cached.clientsCollection;
  const clientsCollection = await getClientsCollection();
  cached.clientsCollection = clientsCollection;
  return clientsCollection;
};

export const getCachedPortfolioWithOrdering = async () => {
  const clientsCollection = await getCachedClientsCollection();

  const portfolioOrder = (
    clientsCollection.find((client) => client.slug === "index-portfolio")?.data
      .order || ([] as Array<{ item: string }>)
  ).map(({ item }) => item);

  const portfolioEntries = (
    await getCachedPortfolioEntries((entry) =>
      portfolioOrder.includes(entry.data.title)
    )
  ).sort(sortPortfolioItemsWith(portfolioOrder));

  return { portfolioEntries, portfolioOrder };
};

const clientNameThreshold = 4;
export const getRelatedItems = async (
  entry: PortfolioEntries[0],
  index: number
) => {
  const { portfolioEntries, portfolioOrder } =
    await getCachedPortfolioWithOrdering();
  const last = portfolioEntries[index - 1];
  const next = portfolioEntries[index + 1];

  const relatedItems = portfolioEntries
    .slice()
    .filter((otherEntry) => {
      return (
        otherEntry.slug !== entry.slug &&
        otherEntry.slug !== last?.slug &&
        otherEntry.slug !== next?.slug &&
        (lev.distance(entry.data.client, otherEntry.data.client) <
          clientNameThreshold ||
          !!otherEntry.data.categories.some((cat) =>
            entry.data.categories.includes(cat)
          ))
      );
    })
    .map((otherEntry) => ({
      ...otherEntry.data,
      slug: otherEntry.slug,
      clientDistance: lev.distance(entry.data.client, otherEntry.data.client),
    }))
    .sort((a, b) => {
      if (
        a.clientDistance < clientNameThreshold &&
        b.clientDistance >= clientNameThreshold
      ) {
        return -1;
      }
      if (
        b.clientDistance < clientNameThreshold &&
        a.clientDistance >= clientNameThreshold
      ) {
        return 1;
      }
      const aIndex = portfolioOrder.indexOf(a.title);
      const bIndex = portfolioOrder.indexOf(b.title);
      if (aIndex === -1 && bIndex === -1) return a.title.localeCompare(b.title);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    })
    .slice(0, 4);

  return {
    relatedItems,
    last: last && {
      title: last.data.title,
      categories: last.data.categories,
      slug: last.slug,
    },
    next: next && {
      title: next.data.title,
      categories: next.data.categories,
      slug: next.slug,
    },
  };
};
