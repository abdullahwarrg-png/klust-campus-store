import type { Product, Size } from '../types/shop';

const sizes: Size[] = ['S', 'M', 'L', 'XL', 'XXL'];

export const products: Product[] = [
  {
    id: 'heritage-tee',
    name: 'The Heritage Tee',
    collection: 'THE EVERYDAY COLLECTION',
    category: 'tshirts',
    price: 4900,
    badge: 'Bestseller',
    sizes,
    description:
      'A little campus pride, wherever the day takes you. Our signature crest tee pairs an easy, relaxed fit with soft cotton you will reach for on repeat.',
    details: [
      '100% cotton · 200 gsm',
      'Relaxed unisex fit',
      'Official KLUST crest print',
      'Machine wash cold, inside out',
    ],
    colours: [
      {
        name: 'Cloud',
        hex: '#EEEDE5',
        image: require('../../assets/products/heritage-tee-cloud.png'),
      },
      {
        name: 'Navy',
        hex: '#233A60',
        image: require('../../assets/products/heritage-tee-navy.png'),
      },
      {
        name: 'Blue',
        hex: '#4277BB',
        image: require('../../assets/products/heritage-tee-blue.png'),
      },
    ],
  },
  {
    id: 'campus-mug',
    name: 'The Campus Mug',
    collection: 'LITTLE CAMPUS RITUALS',
    category: 'mugs',
    price: 2900,
    badge: 'Campus favourite',
    capacity: '350 ml',
    description:
      'For early lectures, late study sessions, and everything in between. A comfortable ceramic mug with our university crest and a generous everyday pour.',
    details: [
      'Glazed ceramic · 350 ml',
      'Comfortable curved handle',
      'Official KLUST crest print',
      'Hand wash recommended',
    ],
    colours: [
      {
        name: 'Cloud',
        hex: '#EEEDE5',
        image: require('../../assets/products/campus-mug-cloud.png'),
      },
      { name: 'Blue', hex: '#4277BB', image: require('../../assets/products/campus-mug-blue.png') },
    ],
  },
  {
    id: 'varsity-tee',
    name: 'The Varsity Tee',
    collection: 'THE VARSITY EDIT',
    category: 'tshirts',
    price: 5500,
    sizes,
    badge: 'New arrival',
    description:
      'Big university energy in a laid-back silhouette. Varsity lettering and our crest make this a new favourite for class days and weekends.',
    details: [
      '100% cotton · 220 gsm',
      'Relaxed unisex fit',
      'Varsity lettering and KLUST crest',
      'Machine wash cold, inside out',
    ],
    colours: [
      {
        name: 'Navy',
        hex: '#233A60',
        image: require('../../assets/products/varsity-tee-navy.png'),
      },
      {
        name: 'Cloud',
        hex: '#EEEDE5',
        image: require('../../assets/products/varsity-tee-cloud.png'),
      },
    ],
  },
  {
    id: 'studio-tee',
    name: 'The Studio Tee',
    collection: 'THE EVERYDAY COLLECTION',
    category: 'tshirts',
    price: 4500,
    sizes,
    description:
      'Clean, simple, and unmistakably KLUST. A smaller crest placement keeps things understated, with soft cotton doing the rest.',
    details: [
      '100% cotton · 180 gsm',
      'Regular unisex fit',
      'Small chest crest print',
      'Machine wash cold, inside out',
    ],
    colours: [
      { name: 'Blue', hex: '#4277BB', image: require('../../assets/products/studio-tee-blue.png') },
      {
        name: 'Cloud',
        hex: '#EEEDE5',
        image: require('../../assets/products/studio-tee-cloud.png'),
      },
    ],
  },
  {
    id: 'crest-mug',
    name: 'The Crest Mug',
    collection: 'LITTLE CAMPUS RITUALS',
    category: 'mugs',
    price: 3200,
    capacity: '350 ml',
    description:
      'A navy finish, a familiar crest, and your favourite drink. An easy addition to your desk or a thoughtful gift for a fellow student.',
    details: [
      'Glazed ceramic · 350 ml',
      'Contrast white interior',
      'Official KLUST crest print',
      'Hand wash recommended',
    ],
    colours: [
      { name: 'Navy', hex: '#233A60', image: require('../../assets/products/crest-mug-navy.png') },
      {
        name: 'Cloud',
        hex: '#EEEDE5',
        image: require('../../assets/products/crest-mug-cloud.png'),
      },
    ],
  },
  {
    id: 'weekender-tee',
    name: 'The Weekender Tee',
    collection: 'THE EVERYDAY COLLECTION',
    category: 'tshirts',
    price: 4900,
    sizes,
    description:
      'An off-duty essential with a campus twist. The easy shape and university print go just as well with jeans as they do with your favourite joggers.',
    details: [
      '100% cotton · 200 gsm',
      'Relaxed unisex fit',
      'KLUST crest and campus lettering',
      'Machine wash cold, inside out',
    ],
    colours: [
      {
        name: 'Cloud',
        hex: '#EEEDE5',
        image: require('../../assets/products/weekender-tee-cloud.png'),
      },
      {
        name: 'Blue',
        hex: '#4277BB',
        image: require('../../assets/products/weekender-tee-blue.png'),
      },
    ],
  },
  {
    id: 'athletics-tee',
    name: 'The Athletics Tee',
    collection: 'THE VARSITY EDIT',
    category: 'tshirts',
    price: 5900,
    sizes,
    description:
      'Bring a little team spirit to your everyday rotation. A bold crest and sporty stripes give this cotton tee its distinctive campus character.',
    details: [
      '100% cotton · 220 gsm',
      'Relaxed unisex fit',
      'Sport-inspired KLUST graphic',
      'Machine wash cold, inside out',
    ],
    colours: [
      {
        name: 'Blue',
        hex: '#4277BB',
        image: require('../../assets/products/athletics-tee-blue.png'),
      },
      {
        name: 'Navy',
        hex: '#233A60',
        image: require('../../assets/products/athletics-tee-navy.png'),
      },
    ],
  },
  {
    id: 'daily-mug',
    name: 'The Daily Mug',
    collection: 'LITTLE CAMPUS RITUALS',
    category: 'mugs',
    price: 2500,
    capacity: '300 ml',
    description:
      'Small rituals make busy days better. This compact ceramic mug adds a familiar KLUST touch to your morning coffee or evening tea.',
    details: [
      'Glazed ceramic · 300 ml',
      'Compact everyday shape',
      'Official KLUST crest print',
      'Hand wash recommended',
    ],
    colours: [
      { name: 'Blue', hex: '#4277BB', image: require('../../assets/products/daily-mug-blue.png') },
      {
        name: 'Cloud',
        hex: '#EEEDE5',
        image: require('../../assets/products/daily-mug-cloud.png'),
      },
    ],
  },
  {
    id: 'essential-tee',
    name: 'The Essential Tee',
    collection: 'THE EVERYDAY COLLECTION',
    category: 'tshirts',
    price: 3900,
    sizes,
    description:
      'Your everyday staple, made a little more personal. A classic cut with the university crest for an easy introduction to the campus collection.',
    details: [
      '100% cotton · 180 gsm',
      'Regular unisex fit',
      'Official KLUST crest print',
      'Machine wash cold, inside out',
    ],
    colours: [
      {
        name: 'Navy',
        hex: '#233A60',
        image: require('../../assets/products/essential-tee-navy.png'),
      },
      {
        name: 'Cloud',
        hex: '#EEEDE5',
        image: require('../../assets/products/essential-tee-cloud.png'),
      },
    ],
  },
  {
    id: 'alumni-tee',
    name: 'The Alumni Tee',
    collection: 'THE VARSITY EDIT',
    category: 'tshirts',
    price: 5500,
    sizes,
    description:
      'Keep a piece of campus with you. Bold alumni lettering, the university crest, and a comfortable fit made for your next chapter.',
    details: [
      '100% cotton · 220 gsm',
      'Relaxed unisex fit',
      'Alumni lettering and KLUST crest',
      'Machine wash cold, inside out',
    ],
    colours: [
      {
        name: 'Cloud',
        hex: '#EEEDE5',
        image: require('../../assets/products/alumni-tee-cloud.png'),
      },
      { name: 'Navy', hex: '#233A60', image: require('../../assets/products/alumni-tee-navy.png') },
    ],
  },
  {
    id: 'duo-mug',
    name: 'The Two Tone Mug',
    collection: 'LITTLE CAMPUS RITUALS',
    category: 'mugs',
    price: 3500,
    capacity: '400 ml',
    description:
      'A bigger cup for longer conversations. A two-tone finish frames the KLUST crest, with plenty of room for your favourite brew.',
    details: [
      'Glazed ceramic · 400 ml',
      'Contrast colour handle and rim',
      'Official KLUST crest print',
      'Hand wash recommended',
    ],
    colours: [
      { name: 'Cloud', hex: '#EEEDE5', image: require('../../assets/products/duo-mug-cloud.png') },
      { name: 'Blue', hex: '#4277BB', image: require('../../assets/products/duo-mug-blue.png') },
    ],
  },
  {
    id: 'scholars-tee',
    name: 'The Scholars Tee',
    collection: 'THE EVERYDAY COLLECTION',
    category: 'tshirts',
    price: 5200,
    sizes,
    description:
      'For curious minds and full calendars. A clean crest graphic and comfortable cotton fit make a dependable companion for the campus day.',
    details: [
      '100% cotton · 200 gsm',
      'Relaxed unisex fit',
      'KLUST crest and knowledge lettering',
      'Machine wash cold, inside out',
    ],
    colours: [
      {
        name: 'Blue',
        hex: '#4277BB',
        image: require('../../assets/products/scholars-tee-blue.png'),
      },
      {
        name: 'Cloud',
        hex: '#EEEDE5',
        image: require('../../assets/products/scholars-tee-cloud.png'),
      },
    ],
  },
];

export const getProduct = (id: string) => products.find((product) => product.id === id);
