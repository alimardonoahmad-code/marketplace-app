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
    title: 'Вот это скидки!',
    sub: 'Тахфифи то 70% — ҳозир харид кунед',
    href: '/products',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=75&auto=format&fit=crop',
  },
  {
    id: 'delivery',
    title: 'Доставкаи ройгон',
    sub: 'Барои фармоишҳои калон дар Душанбе',
    href: '/products',
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&q=75&auto=format&fit=crop',
  },
  {
    id: 'stores',
    title: 'Мағозаҳои маҳаллӣ',
    sub: '1000+ маҳсулот аз фурӯшандагони Тоҷикистон',
    href: '/stores',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=75&auto=format&fit=crop',
  },
];
