import { Store } from '@/types';

const CITY_SYNONYMS: Record<string, string[]> = {
  душанбе: ['душанбе', 'dushanbe', 'dushanbe'],
  хуҷанд: ['хуҷанд', 'худжанд', 'khujand', 'хujand', 'худжан'],
  бохтар: ['бохтар', 'bokhtar', 'курган', 'қурғон'],
  кулоб: ['кулоб', 'kulob', 'kulyab'],
};

export function normalizeStoreText(text: string): string {
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
  const n = normalizeStoreText(q);
  const terms = new Set<string>([n]);
  for (const [canonical, aliases] of Object.entries(CITY_SYNONYMS)) {
    if (aliases.some((a) => normalizeStoreText(a) === n || n.includes(normalizeStoreText(a)))) {
      terms.add(canonical);
      aliases.forEach((a) => terms.add(normalizeStoreText(a)));
    }
  }
  return Array.from(terms);
}

export function storeSearchHaystack(store: Store): string {
  return normalizeStoreText(
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

export function matchesStoreSearch(store: Store, query?: string): boolean {
  if (!query?.trim()) return true;
  const haystack = storeSearchHaystack(store);
  const terms = expandCityQuery(query);
  return terms.some((t) => t.length > 0 && haystack.includes(t));
}

export function matchesStoreCity(store: Store, city?: string): boolean {
  if (!city?.trim()) return true;
  if (store.storeCity && normalizeStoreText(store.storeCity) === normalizeStoreText(city)) {
    return true;
  }
  const haystack = storeSearchHaystack(store);
  return expandCityQuery(city).some((t) => haystack.includes(t));
}

export function getStoreCitiesFromData(stores: Store[]): string[] {
  const set = new Set<string>();
  stores.forEach((s) => {
    if (s.storeCity?.trim()) set.add(s.storeCity.trim());
  });
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'ru'));
}
