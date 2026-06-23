// Full jigsaw category taxonomy (groups → subcategories). Every node maps to a
// Pixabay search query, so selecting one fills the gallery with live photos
// (requires a key; falls back to the curated catalogue otherwise).

export interface CategoryNode {
  key: string
  label: string
  query: string
}

export interface CategoryGroup {
  key: string
  label: string
  query: string
  children: CategoryNode[]
}

const n = (key: string, label: string, query: string): CategoryNode => ({ key, label, query })

export const CATEGORY_GROUPS: CategoryGroup[] = [
  { key: 'amusement', label: 'Amusement', query: 'amusement park carnival fair', children: [] },
  {
    key: 'animals',
    label: 'Animals',
    query: 'animals wildlife',
    children: [
      n('birds', 'Birds', 'bird'),
      n('cats', 'Cats', 'cat kitten'),
      n('cows', 'Cows', 'cow cattle'),
      n('dogs', 'Dogs', 'dog puppy'),
      n('fish', 'Fish', 'fish underwater'),
      n('frogs', 'Frogs', 'frog'),
      n('horses', 'Horses', 'horse'),
      n('insects', 'Insects', 'insect butterfly'),
      n('other-animals', 'Other Animals', 'wildlife animal'),
      n('primates', 'Primates', 'monkey ape primate'),
      n('reptiles', 'Reptiles', 'reptile lizard snake'),
      n('water-buffalo', 'Water Buffalo', 'water buffalo'),
    ],
  },
  {
    key: 'art',
    label: 'Art',
    query: 'art',
    children: [
      n('abstract', 'Abstract', 'abstract art'),
      n('classic-paintings', 'Classic Paintings', 'classic painting renaissance'),
      n('costumes', 'Costumes', 'costume mask'),
      n('creative', 'Creative', 'creative artwork'),
      n('illustrations', 'Illustrations', 'illustration drawing'),
      n('mural', 'Mural', 'mural wall art'),
      n('paintings', 'Paintings', 'painting canvas'),
      n('sculpture', 'Sculpture', 'sculpture statue'),
      n('street-art', 'Street Art', 'street art graffiti'),
    ],
  },
  { key: 'bible', label: 'Bible', query: 'bible religious church', children: [] },
  {
    key: 'composition',
    label: 'Composition',
    query: 'still life composition',
    children: [
      n('collages', 'Collages', 'collage'),
      n('collections', 'Collections', 'collection objects'),
      n('doors-windows', 'Doors and Windows', 'door window'),
      n('patterns', 'Patterns', 'pattern texture'),
      n('still-life', 'Still Life', 'still life'),
      n('writing-print', 'Writing and Print', 'typography writing print'),
    ],
  },
  { key: 'events', label: 'Events', query: 'festival event celebration', children: [] },
  { key: 'food', label: 'Food', query: 'food delicious', children: [] },
  { key: 'funny', label: 'Funny', query: 'funny cute humor', children: [] },
  {
    key: 'holidays',
    label: 'Holidays',
    query: 'holiday festive',
    children: [
      n('christmas', 'Christmas', 'christmas'),
      n('halloween', 'Halloween', 'halloween'),
      n('new-years', "New Year's Day", 'new year fireworks'),
      n('thanksgiving', 'Thanksgiving', 'thanksgiving autumn harvest'),
      n('valentines', "Valentine's Day", 'valentine love heart'),
    ],
  },
  { key: 'machines', label: 'Machines', query: 'machine mechanical engine', children: [] },
  { key: 'misc', label: 'Miscellaneous', query: 'objects colorful', children: [] },
  { key: 'mystery', label: 'Mystery', query: 'mysterious fog mystery', children: [] },
  { key: 'mythical', label: 'Mythical', query: 'fantasy dragon mythical', children: [] },
  {
    key: 'nature',
    label: 'Nature',
    query: 'nature landscape scenic',
    children: [
      n('beaches', 'Beaches', 'beach ocean'),
      n('farms', 'Farms', 'farm rural'),
      n('flowers', 'Flowers', 'flowers blossom'),
      n('lakes', 'Lakes', 'lake reflection'),
      n('landscapes', 'Landscapes', 'landscape'),
      n('lawn-garden', 'Lawn and Garden', 'garden landscaping'),
      n('other-nature', 'Other Nature', 'nature'),
      n('scenic', 'Scenic', 'scenic view'),
      n('seasons', 'Seasons', 'four seasons'),
      n('sky', 'Sky', 'sky clouds blue sky'),
      n('sunsets', 'Sunsets', 'sunset golden sky'),
      n('waterfalls', 'Waterfalls', 'waterfall'),
    ],
  },
  { key: 'people', label: 'People', query: 'people portrait', children: [] },
  {
    key: 'promotional',
    label: 'Promotional',
    query: 'vintage advertisement',
    children: [
      n('ads', 'Ads', 'vintage advertisement'),
      n('posters', 'Posters', 'poster'),
      n('signs', 'Signs', 'sign signage'),
    ],
  },
  { key: 'space', label: 'Space', query: 'space galaxy nebula stars', children: [] },
  { key: 'sports', label: 'Sports', query: 'sports', children: [] },
  { key: 'stamps-coins', label: 'Stamps and Coins', query: 'stamp coin currency', children: [] },
  {
    key: 'structures',
    label: 'Structures',
    query: 'architecture building',
    children: [
      n('barns', 'Barns', 'barn'),
      n('bridges', 'Bridges', 'bridge'),
      n('buildings', 'Buildings', 'building architecture'),
      n('castles', 'Castles', 'castle palace'),
      n('churches', 'Churches', 'church cathedral'),
      n('houses', 'Houses', 'house home'),
      n('lighthouses', 'Lighthouses', 'lighthouse'),
      n('mills', 'Mills', 'windmill mill'),
      n('other-structures', 'Other Structures', 'structure architecture'),
    ],
  },
  { key: 'technology', label: 'Technology', query: 'technology gadget', children: [] },
  {
    key: 'transportation',
    label: 'Transportation',
    query: 'transportation vehicle',
    children: [
      n('airplanes', 'Airplanes', 'airplane aircraft'),
      n('cars', 'Cars', 'car automobile'),
      n('other-transportation', 'Other Transportation', 'vehicle transport'),
      n('ships', 'Ships', 'ship boat'),
      n('streetcars', 'Streetcars', 'tram streetcar'),
      n('trains', 'Trains', 'train railway'),
      n('trucks', 'Trucks', 'truck'),
    ],
  },
  {
    key: 'travel',
    label: 'Travel',
    query: 'travel landmark',
    children: [n('skylines', 'Skylines', 'city skyline')],
  },
]

/**
 * Flat list of INDEPENDENT categories (no groups / no subcategories). Groups
 * that had subcategories contribute their children; standalone groups
 * contribute themselves. Each is its own top-level category.
 */
export const ALL_CATEGORIES: CategoryNode[] = CATEGORY_GROUPS.flatMap((g) =>
  g.children.length > 0 ? g.children : [{ key: g.key, label: g.label, query: g.query }],
)

/** Representative cover photo (permanent Pixabay CDN URLs, 1280px) per category. */
export const CATEGORY_COVERS: Record<string, string> = {
  amusement: 'https://cdn.pixabay.com/photo/2013/07/27/05/09/carousel-168125_1280.jpg',
  bible: 'https://cdn.pixabay.com/photo/2017/09/04/09/38/crosses-2713356_1280.jpg',
  events: 'https://cdn.pixabay.com/photo/2021/07/25/12/06/balloons-6491687_1280.jpg',
  food: 'https://cdn.pixabay.com/photo/2017/11/25/17/17/sandwich-2977251_1280.jpg',
  funny: 'https://cdn.pixabay.com/photo/2018/06/21/19/55/toys-3489323_1280.jpg',
  machines: 'https://cdn.pixabay.com/photo/2014/06/18/16/31/jet-engine-371412_1280.jpg',
  misc: 'https://cdn.pixabay.com/photo/2016/03/05/21/50/cocktail-umbrella-1239115_1280.jpg',
  mystery: 'https://cdn.pixabay.com/photo/2022/10/31/18/44/spider-web-7560535_1280.jpg',
  mythical: 'https://cdn.pixabay.com/photo/2014/01/05/01/19/dragon-238931_1280.jpg',
  people: 'https://cdn.pixabay.com/photo/2021/05/29/03/00/beach-6292382_1280.jpg',
  space: 'https://cdn.pixabay.com/photo/2011/12/14/12/17/galaxy-11098_1280.jpg',
  sports: 'https://cdn.pixabay.com/photo/2014/10/14/20/24/soccer-488700_1280.jpg',
  'stamps-coins': 'https://cdn.pixabay.com/photo/2016/09/01/21/54/coins-1637722_1280.jpg',
  technology: 'https://cdn.pixabay.com/photo/2016/11/29/08/41/apple-1868496_1280.jpg',
  birds: 'https://cdn.pixabay.com/photo/2022/03/23/08/13/flamingo-7086655_1280.jpg',
  cats: 'https://cdn.pixabay.com/photo/2017/02/20/18/03/cat-2083492_1280.jpg',
  cows: 'https://cdn.pixabay.com/photo/2013/10/09/02/26/cattle-192976_1280.jpg',
  dogs: 'https://cdn.pixabay.com/photo/2016/12/13/05/15/puppy-1903313_1280.jpg',
  fish: 'https://cdn.pixabay.com/photo/2020/10/12/20/57/aquarium-5650174_1280.jpg',
  frogs: 'https://cdn.pixabay.com/photo/2018/04/11/23/05/frog-3312038_1280.jpg',
  horses: 'https://cdn.pixabay.com/photo/2014/12/08/17/52/horse-561221_1280.jpg',
  insects: 'https://cdn.pixabay.com/photo/2020/05/17/06/45/butterfly-5180306_1280.jpg',
  'other-animals': 'https://cdn.pixabay.com/photo/2024/12/27/14/58/owl-9294302_1280.jpg',
  primates: 'https://cdn.pixabay.com/photo/2022/01/20/15/34/monkey-6952630_1280.jpg',
  reptiles: 'https://cdn.pixabay.com/photo/2026/06/12/14/19/14-19-50-321_1280.jpg',
  'water-buffalo': 'https://cdn.pixabay.com/photo/2023/07/04/10/57/water-buffalo-8106043_1280.jpg',
  abstract: 'https://cdn.pixabay.com/photo/2022/09/15/09/59/water-7456116_1280.jpg',
  'classic-paintings': 'https://cdn.pixabay.com/photo/2013/02/17/13/15/c-m-coolidge-82531_1280.jpg',
  costumes: 'https://cdn.pixabay.com/photo/2014/04/17/13/30/carnival-326494_1280.jpg',
  creative: 'https://cdn.pixabay.com/photo/2017/07/03/20/17/colorful-2468874_1280.jpg',
  illustrations: 'https://cdn.pixabay.com/photo/2018/10/08/14/46/bird-3732867_1280.jpg',
  mural: 'https://cdn.pixabay.com/photo/2017/12/28/16/18/bicycle-3045580_1280.jpg',
  paintings: 'https://cdn.pixabay.com/photo/2017/08/06/13/15/painting-2592410_1280.jpg',
  sculpture: 'https://cdn.pixabay.com/photo/2016/02/03/13/05/buddha-1177009_1280.jpg',
  'street-art': 'https://cdn.pixabay.com/photo/2016/05/08/22/44/graffiti-1380108_1280.jpg',
  collages: 'https://cdn.pixabay.com/photo/2018/02/15/14/37/paper-3155438_1280.jpg',
  collections: 'https://cdn.pixabay.com/photo/2021/07/10/03/04/old-camera-6400520_1280.jpg',
  'doors-windows': 'https://cdn.pixabay.com/photo/2023/05/30/17/25/door-8029228_1280.jpg',
  patterns: 'https://cdn.pixabay.com/photo/2018/08/25/20/58/wall-3630911_1280.jpg',
  'still-life': 'https://cdn.pixabay.com/photo/2016/11/29/13/09/cappuccino-1869731_1280.jpg',
  'writing-print': 'https://cdn.pixabay.com/photo/2016/04/30/13/12/sutterlin-1362879_1280.jpg',
  christmas: 'https://cdn.pixabay.com/photo/2021/12/16/16/52/window-6874834_1280.jpg',
  halloween: 'https://cdn.pixabay.com/photo/2016/10/16/21/30/halloween-1746354_1280.jpg',
  'new-years': 'https://cdn.pixabay.com/photo/2021/12/27/16/40/sylvester-6897648_1280.jpg',
  thanksgiving: 'https://cdn.pixabay.com/photo/2024/10/20/14/12/corn-9135131_1280.jpg',
  valentines: 'https://cdn.pixabay.com/photo/2015/02/05/01/33/valentines-day-624440_1280.jpg',
  beaches: 'https://cdn.pixabay.com/photo/2016/10/18/21/22/beach-1751455_1280.jpg',
  farms: 'https://cdn.pixabay.com/photo/2021/06/11/22/41/wheat-6329586_1280.jpg',
  flowers: 'https://cdn.pixabay.com/photo/2023/04/19/09/34/flower-7937334_1280.jpg',
  lakes: 'https://cdn.pixabay.com/photo/2019/09/18/17/22/mountain-lake-4487292_1280.jpg',
  landscapes: 'https://cdn.pixabay.com/photo/2022/12/10/11/05/snow-7646952_1280.jpg',
  'lawn-garden': 'https://cdn.pixabay.com/photo/2023/04/19/09/34/flower-7937334_1280.jpg',
  'other-nature': 'https://cdn.pixabay.com/photo/2022/08/08/19/36/landscape-7373484_1280.jpg',
  scenic: 'https://cdn.pixabay.com/photo/2019/05/16/09/47/beach-4206785_1280.jpg',
  seasons: 'https://cdn.pixabay.com/photo/2015/01/31/16/39/tree-618636_1280.jpg',
  sky: 'https://cdn.pixabay.com/photo/2015/12/01/20/28/sky-1072828_1280.jpg',
  sunsets: 'https://cdn.pixabay.com/photo/2016/05/05/02/37/sunset-1373171_1280.jpg',
  waterfalls: 'https://cdn.pixabay.com/photo/2023/04/13/02/20/waterfall-7921517_1280.jpg',
  ads: 'https://cdn.pixabay.com/photo/2014/06/04/16/41/thank-you-362164_1280.jpg',
  posters: 'https://cdn.pixabay.com/photo/2016/11/29/08/43/blank-1868502_1280.jpg',
  signs: 'https://cdn.pixabay.com/photo/2016/11/23/17/22/open-1853924_1280.jpg',
  barns: 'https://cdn.pixabay.com/photo/2014/12/04/14/32/barn-556696_1280.jpg',
  bridges: 'https://cdn.pixabay.com/photo/2017/05/18/21/54/london-bridge-2324875_1280.jpg',
  buildings: 'https://cdn.pixabay.com/photo/2023/05/25/08/03/glass-facade-8016589_1280.jpg',
  castles: 'https://cdn.pixabay.com/photo/2015/05/29/17/39/noble-789501_1280.jpg',
  churches: 'https://cdn.pixabay.com/photo/2023/01/23/23/20/altar-7739897_1280.jpg',
  houses: 'https://cdn.pixabay.com/photo/2017/07/09/03/19/home-2486092_1280.jpg',
  lighthouses: 'https://cdn.pixabay.com/photo/2024/11/08/14/31/lighthouse-9183463_1280.jpg',
  mills: 'https://cdn.pixabay.com/photo/2022/08/24/17/11/windmill-7408365_1280.jpg',
  'other-structures': 'https://cdn.pixabay.com/photo/2022/10/17/15/40/frankfurt-7528062_1280.jpg',
  airplanes: 'https://cdn.pixabay.com/photo/2021/11/04/16/54/sky-6768714_1280.jpg',
  cars: 'https://cdn.pixabay.com/photo/2022/08/28/19/39/steering-wheel-7417390_1280.jpg',
  'other-transportation': 'https://cdn.pixabay.com/photo/2017/04/06/15/53/oldtimer-2208636_1280.png',
  ships: 'https://cdn.pixabay.com/photo/2018/05/14/08/38/sailing-boat-3399014_1280.jpg',
  streetcars: 'https://cdn.pixabay.com/photo/2017/04/04/22/27/trolley-2203329_1280.jpg',
  trains: 'https://cdn.pixabay.com/photo/2013/07/07/13/49/train-143847_1280.jpg',
  trucks: 'https://cdn.pixabay.com/photo/2019/12/01/20/07/truck-4666300_1280.jpg',
  skylines: 'https://cdn.pixabay.com/photo/2024/12/28/13/30/city-9296128_1280.jpg',
}

export function categoryCover(key: string): string | undefined {
  return CATEGORY_COVERS[key]
}

/** URL slug that mirrors the page title, e.g. "horses-online-free-jigsaw-puzzles". */
export function categorySlug(label: string): string {
  const base = label
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return `${base}-online-free-jigsaw-puzzles`
}

const SLUG_TO_CATEGORY = new Map<string, CategoryNode>(
  ALL_CATEGORIES.map((c) => [categorySlug(c.label), c]),
)

export function categoryBySlug(slug: string): CategoryNode | undefined {
  return SLUG_TO_CATEGORY.get(slug)
}

// The 20 categories that make the BEST jigsaw puzzles - the most colorful,
// detailed and varied subjects (scenery, animals, architecture, transport).
const HOME_KEYS = [
  'landscapes', 'beaches', 'sunsets', 'waterfalls', 'lakes', 'flowers',
  'birds', 'horses',
  'castles', 'lighthouses', 'churches', 'bridges', 'skylines',
  'trains', 'cars', 'ships', 'space', 'food',
]
export const HOME_CATEGORIES: CategoryNode[] = HOME_KEYS.map(
  (k) => ALL_CATEGORIES.find((c) => c.key === k)!,
).filter(Boolean)

