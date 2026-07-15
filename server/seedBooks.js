const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = require('./config/connect');
const Seller = require('./models/Seller/sellerModel');
const Book = require('./models/Seller/bookModel');

const demoSellerData = {
  businessName: 'BookStore Demo Shelf',
  email: 'demo-seller@bookstore.com',
  password: 'DemoSeller123!',
  profileInfo: {
    phone: '555-010-2048',
    address: '123 Demo Street, New York, NY',
    description: 'Demo seller account for seeding sample books.',
    website: 'https://bookstore.example.com',
  },
  isApproved: true,
};

const sampleBooks = [
  {
    title: 'The Midnight Archive',
    authors: ['Elena Hart'],
    genres: ['Fiction', 'Mystery'],
    description: 'A burned-out librarian uncovers a hidden catalog that rewrites the city after dark.',
    price: 16.99,
    stock: 18,
    image: 'https://i.scdn.co/image/ab6765630000ba8a0628d31295a5d31f2d30767a',
    averageRating: 4.5,
    reviewCount: 124,
    inventory: { quantity: 18, location: 'warehouse-a', condition: 'new' },
  },
  {
    title: 'Orbit of Ashes',
    authors: ['Noah Vale'],
    genres: ['Sci-Fi', 'Adventure'],
    description: 'A salvage crew drifts through a broken solar system while chasing a signal from Earth.',
    price: 24.99,
    stock: 12,
    image: 'https://picsum.photos/seed/orbit-of-ashes-book/400/600',
    averageRating: 4.2,
    reviewCount: 89,
    inventory: { quantity: 12, location: 'warehouse-a', condition: 'new' },
  },
  {
    title: 'Small Steps, Big Change',
    authors: ['Maya Chen'],
    genres: ['Self-Help', 'Non-Fiction'],
    description: 'Practical habits and mindset shifts for building a calmer, more focused life.',
    price: 14.5,
    stock: 30,
    image: 'https://picsum.photos/seed/small-steps-big-change-book/400/600',
    averageRating: 4.7,
    reviewCount: 203,
    inventory: { quantity: 30, location: 'warehouse-b', condition: 'new' },
  },
  {
    title: 'Letters After Rain',
    authors: ['Ava Sterling'],
    genres: ['Romance', 'Fiction'],
    description: 'Two former pen pals reunite in a coastal town and discover unfinished feelings still linger.',
    price: 12.99,
    stock: 22,
    image: 'https://picsum.photos/seed/letters-after-rain-book/400/600',
    averageRating: 4.1,
    reviewCount: 145,
    inventory: { quantity: 22, location: 'warehouse-b', condition: 'like-new' },
  },
  {
    title: 'The Practical Investor',
    authors: ['Daniel Brooks'],
    genres: ['Non-Fiction', 'Finance'],
    description: 'A straightforward guide to budgeting, investing basics, and long-term wealth habits.',
    price: 21.0,
    stock: 15,
    image: 'https://picsum.photos/seed/practical-investor-book/400/600',
    averageRating: 4.3,
    reviewCount: 76,
    inventory: { quantity: 15, location: 'warehouse-c', condition: 'new' },
  },
  {
    title: 'Moonlight for Beginners',
    authors: ['Sofia Reyes'],
    genres: ['Fantasy', 'Young Adult'],
    description: 'A shy apprentice learns moon magic and must save her village from a fading sky.',
    price: 18.75,
    stock: 26,
    image: 'https://picsum.photos/seed/moonlight-for-beginners-book/400/600',
    averageRating: 4.6,
    reviewCount: 167,
    inventory: { quantity: 26, location: 'warehouse-a', condition: 'new' },
  },
  {
    title: 'The Last Train Home',
    authors: ['Marcus Bell'],
    genres: ['Thriller', 'Mystery'],
    description: 'A night commuter becomes the only witness to a disappearance on the final train of the evening.',
    price: 15.99,
    stock: 19,
    image: 'https://picsum.photos/seed/last-train-home-book/400/600',
    averageRating: 4.0,
    reviewCount: 98,
    inventory: { quantity: 19, location: 'warehouse-c', condition: 'good' },
  },
  {
    title: 'Cooking at Home',
    authors: ['Lina Patel'],
    genres: ['Non-Fiction', 'Cooking'],
    description: 'Easy recipes and kitchen fundamentals for weeknight meals, desserts, and everything in between.',
    price: 27.5,
    stock: 8,
    image: 'https://picsum.photos/seed/cooking-at-home-book/400/600',
    averageRating: 4.4,
    reviewCount: 64,
    inventory: { quantity: 8, location: 'warehouse-b', condition: 'new' },
  },
  {
    title: 'Quiet Courage',
    authors: ['Nora Finch'],
    genres: ['Self-Help', 'Non-Fiction'],
    description: 'A reflective book about confidence, boundaries, and learning to lead without noise.',
    price: 13.99,
    stock: 34,
    image: 'https://picsum.photos/seed/quiet-courage-book/400/600',
    averageRating: 4.8,
    reviewCount: 212,
    inventory: { quantity: 34, location: 'warehouse-a', condition: 'new' },
  },
  {
    title: 'Beneath the Cedar Sky',
    authors: ['J. T. Holloway'],
    genres: ['Historical Fiction', 'Drama'],
    description: 'A family saga unfolds across generations on a farm marked by loss, resilience, and renewal.',
    price: 19.25,
    stock: 14,
    image: 'https://picsum.photos/seed/beneath-the-cedar-sky-book/400/600',
    averageRating: 4.2,
    reviewCount: 51,
    inventory: { quantity: 14, location: 'warehouse-c', condition: 'good' },
  },
  {
    title: 'Data Stories',
    authors: ['Priya Nair'],
    genres: ['Non-Fiction', 'Technology'],
    description: 'An approachable explanation of how data shapes business decisions, design, and daily life.',
    price: 23.99,
    stock: 10,
    image: 'https://picsum.photos/seed/data-stories-book/400/600',
    averageRating: 4.5,
    reviewCount: 87,
    inventory: { quantity: 10, location: 'warehouse-b', condition: 'new' },
  },
  {
    title: 'The Harbor Between Us',
    authors: ['Claire Donovan'],
    genres: ['Romance', 'Drama'],
    description: 'Two people rebuilding their lives discover that starting over is harder when the past keeps calling.',
    price: 11.5,
    stock: 28,
    image: 'https://picsum.photos/seed/harbor-between-us-book/400/600',
    averageRating: 4.1,
    reviewCount: 73,
    inventory: { quantity: 28, location: 'warehouse-c', condition: 'like-new' },
  },
  {
    title: 'Into the Greenlight',
    authors: ['Andre Malik'],
    genres: ['Sci-Fi', 'Suspense'],
    description: 'A research engineer follows a signal through an alien forest where every answer changes the rules.',
    price: 29.99,
    stock: 6,
    image: 'https://picsum.photos/seed/into-the-greenlight-book/400/600',
    averageRating: 4.6,
    reviewCount: 111,
    inventory: { quantity: 6, location: 'warehouse-a', condition: 'new' },
  },
  {
    title: 'Everyday Mindfulness',
    authors: ['Harper Lane'],
    genres: ['Self-Help', 'Wellness'],
    description: 'Simple practices for staying grounded during work, family, and everything in between.',
    price: 8.99,
    stock: 50,
    image: 'https://picsum.photos/seed/everyday-mindfulness-book/400/600',
    averageRating: 4.3,
    reviewCount: 134,
    inventory: { quantity: 50, location: 'warehouse-b', condition: 'new' },
  },
];

const seedBooks = async () => {
  try {
    await connectDB();

    let demoSeller = await Seller.findOne({ email: demoSellerData.email });

    if (!demoSeller) {
      demoSeller = await Seller.create(demoSellerData);
    } else {
      demoSeller.businessName = demoSellerData.businessName;
      demoSeller.profileInfo = demoSellerData.profileInfo;
      demoSeller.isApproved = true;
      await demoSeller.save();
    }

    if (!demoSeller.isApproved) {
      demoSeller.isApproved = true;
      await demoSeller.save();
    }

    await Book.deleteMany({ sellerId: demoSeller._id });

    const booksToInsert = sampleBooks.map((book) => ({
      ...book,
      sellerId: demoSeller._id,
    }));

    const insertedBooks = await Book.insertMany(booksToInsert);

    await Seller.findByIdAndUpdate(demoSeller._id, {
      $set: { listedBooks: insertedBooks.map((book) => book._id) },
    });

    console.log(`Seed complete: ${insertedBooks.length} books inserted for demo seller ${demoSeller.email}`);
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seedBooks();