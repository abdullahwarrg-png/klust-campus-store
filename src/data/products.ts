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
    description: 'A relaxed-fit cotton T-shirt with the KLUST crest.',
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
    collection: 'MUG COLLECTION',
    category: 'mugs',
    price: 2900,
    badge: 'Crest design',
    capacity: '350 ml',
    description: 'A 350 ml glazed ceramic mug with the KLUST crest and a curved handle.',
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
    description: 'A relaxed-fit cotton T-shirt with varsity lettering and the KLUST crest.',
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
    description: 'A regular-fit cotton T-shirt with a small chest crest print.',
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
    collection: 'MUG COLLECTION',
    category: 'mugs',
    price: 3200,
    capacity: '350 ml',
    description: 'A 350 ml glazed ceramic mug with the KLUST crest and a contrast white interior.',
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
    description: 'A relaxed-fit cotton T-shirt with the KLUST crest and campus lettering.',
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
    description: 'A relaxed-fit cotton T-shirt with a KLUST graphic and sporty stripes.',
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
    collection: 'MUG COLLECTION',
    category: 'mugs',
    price: 2500,
    capacity: '300 ml',
    description: 'A compact 300 ml glazed ceramic mug with the KLUST crest.',
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
    description: 'A regular-fit cotton T-shirt with the KLUST crest.',
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
    description: 'A relaxed-fit cotton T-shirt with alumni lettering and the KLUST crest.',
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
    collection: 'MUG COLLECTION',
    category: 'mugs',
    price: 3500,
    capacity: '400 ml',
    description: 'A 400 ml glazed ceramic mug with a contrast handle and rim.',
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
    description: 'A relaxed-fit cotton T-shirt with the KLUST crest and knowledge lettering.',
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
