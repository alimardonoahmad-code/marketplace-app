export interface HomeBanner {
  id: string;
  title: string;
  sub: string;
  href: string;
  /** Реклама — акси мувофиқ ба матн */
  image: string;
}

export const HOME_BANNERS: HomeBanner[] = [
  {
    id: 'deals',
    title: 'ТАХФИФИ КАЛОН',
    sub: 'Маҳсулоти интихобшуда — нархи хуб',
    href: '/products?hasDiscount=true',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=75&auto=format&fit=crop',
  },
  {
    id: 'delivery',
    title: 'ДОСТАВКАИ РОЙГОН',
    sub: 'Барои фармоишҳои калон дар Душанбе',
    href: '/products',
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&q=75&auto=format&fit=crop',
  },
  {
    id: 'stores',
    title: 'МАҒОЗАҲОИ МАҲАЛЛӢ',
    sub: '1000+ маҳсулот аз Тоҷикистон',
    href: '/stores',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=75&auto=format&fit=crop',
  },
];
