/** Ҷустуҷӯи мағоза — синонимҳои шаҳрҳо ва нормализатсия */

const CITY_SYNONYMS: Record<string, string[]> = {
  душанбе: ['душанбе', 'dushanbe', 'dushanbe', 'ду́шанбе'],
  хуҷанд: ['хуҷанд', 'худжанд', 'khujand', 'хujand', 'худжан'],
  бохтар: ['бохтар', 'bokhtar', 'курган', 'қурғон'],
  кулоб: ['кулоб', 'kulob', 'kulyab'],
};

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[ӯӯ]/g, 'у')
    .replace(/[ӣӣ]/g, 'и')
    .replace(/[ққ]/g, 'к')
    .replace(/[ғғ]/g, 'г')
    .replace(/[ҳҳ]/g, 'х')
    .replace(/[ҷҷ]/g, 'ч')
    .trim();
}

function expandCityQuery(q: string): string[] {
  const n = normalize(q);
  const terms = new Set<string>([n]);
  for (const [canonical, aliases] of Object.entries(CITY_SYNONYMS)) {
    if (aliases.some((a) => normalize(a) === n || n.includes(normalize(a)))) {
      terms.add(canonical);
      aliases.forEach((a) => terms.add(normalize(a)));
    }
  }
  return Array.from(terms);
}

export interface StoreSearchable {
  name?: string;
  storeName?: string;
  storeAddress?: string;
  storeCity?: string;
  storeDescription?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export function storeSearchHaystack(store: StoreSearchable): string {
  return normalize(
    [
      store.storeName,
      store.name,
      store.storeAddress,
      store.storeCity,
      store.storeDescription,
      store.email,
      store.phone,
      store.address,
    ]
      .filter(Boolean)
      .join(' '),
  );
}

export function matchesStoreSearch(store: StoreSearchable, query?: string): boolean {
  if (!query?.trim()) return true;
  const haystack = storeSearchHaystack(store);
  const terms = expandCityQuery(query);
  return terms.some((t) => t.length > 0 && haystack.includes(t));
}

export function matchesStoreCity(store: StoreSearchable, city?: string): boolean {
  if (!city?.trim()) return true;
  const haystack = storeSearchHaystack(store);
  const cityNorm = normalize(city);
  const cityTerms = expandCityQuery(city);
  if (store.storeCity && normalize(store.storeCity) === cityNorm) return true;
  return cityTerms.some((t) => haystack.includes(t));
}
