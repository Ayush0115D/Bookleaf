const User = require('../models/User');
const Book = require('../models/Book');
const Ticket = require('../models/Ticket');

const authors = [
  {
    name: 'Ravi Sharma',
    email: 'ravi.sharma@email.com',
    password: 'author123',
    role: 'author',
    bankDetails: { accountHolder: 'Ravi Sharma', accountNumber: 'XXXX1234', ifscCode: 'SBIN001234', bankName: 'State Bank of India' },
  },
  {
    name: 'Priya Patel',
    email: 'priya.patel@email.com',
    password: 'author123',
    role: 'author',
    bankDetails: { accountHolder: 'Priya Patel', accountNumber: 'XXXX5678', ifscCode: 'HDFC005678', bankName: 'HDFC Bank' },
  },
  {
    name: 'Amit Kumar',
    email: 'amit.kumar@email.com',
    password: 'author123',
    role: 'author',
    bankDetails: { accountHolder: 'Amit Kumar', accountNumber: 'XXXX9012', ifscCode: 'ICIC009012', bankName: 'ICICI Bank' },
  },
  {
    name: 'Sneha Reddy',
    email: 'sneha.reddy@email.com',
    password: 'author123',
    role: 'author',
    bankDetails: { accountHolder: 'Sneha Reddy', accountNumber: 'XXXX3456', ifscCode: 'AXIS003456', bankName: 'Axis Bank' },
  },
  {
    name: 'Vikram Singh',
    email: 'vikram.singh@email.com',
    password: 'author123',
    role: 'author',
    bankDetails: { accountHolder: 'Vikram Singh', accountNumber: 'XXXX7890', ifscCode: 'PNB007890', bankName: 'Punjab National Bank' },
  },
  {
    name: 'Ananya Gupta',
    email: 'ananya.gupta@email.com',
    password: 'author123',
    role: 'author',
    bankDetails: { accountHolder: 'Ananya Gupta', accountNumber: 'XXXX2345', ifscCode: 'KOTK002345', bankName: 'Kotak Mahindra' },
  },
  {
    name: 'Rajesh Verma',
    email: 'rajesh.verma@email.com',
    password: 'author123',
    role: 'author',
    bankDetails: { accountHolder: 'Rajesh Verma', accountNumber: 'XXXX6789', ifscCode: 'YESB006789', bankName: 'Yes Bank' },
  },
  {
    name: 'Deepika Joshi',
    email: 'deepika.joshi@email.com',
    password: 'author123',
    role: 'author',
    bankDetails: { accountHolder: 'Deepika Joshi', accountNumber: 'XXXX0123', ifscCode: 'IDBI000123', bankName: 'IDBI Bank' },
  },
  {
    name: 'Suresh Nair',
    email: 'suresh.nair@email.com',
    password: 'author123',
    role: 'author',
    bankDetails: { accountHolder: 'Suresh Nair', accountNumber: 'XXXX4567', ifscCode: 'CANB004567', bankName: 'Canara Bank' },
  },
  {
    name: 'Kavita Desai',
    email: 'kavita.desai@email.com',
    password: 'author123',
    role: 'author',
    bankDetails: { accountHolder: 'Kavita Desai', accountNumber: 'XXXX8901', ifscCode: 'BOI008901', bankName: 'Bank of India' },
  },
];

const booksData = [
  { title: 'Whispers of the Ganges', isbn: '978-81-1234-001-1', genre: 'Fiction', status: 'Published & Live', mrp: 399, copiesSold: 1200, royaltyEarned: 120000, royaltyPaid: 80000, royaltyPending: 40000, authorIndex: 0 },
  { title: 'Code of the Heart', isbn: '978-81-1234-002-8', genre: 'Romance', status: 'Published & Live', mrp: 299, copiesSold: 800, royaltyEarned: 60000, royaltyPaid: 30000, royaltyPending: 30000, authorIndex: 0 },
  { title: 'The Silent Revolution', isbn: '978-81-1234-003-5', genre: 'History', status: 'Published & Live', mrp: 499, copiesSold: 500, royaltyEarned: 50000, royaltyPaid: 50000, royaltyPending: 0, authorIndex: 1 },
  { title: 'Moonlit Melodies', isbn: '978-81-1234-004-2', genre: 'Poetry', status: 'Published & Live', mrp: 199, copiesSold: 1500, royaltyEarned: 45000, royaltyPaid: 0, royaltyPending: 45000, authorIndex: 1 },
  { title: 'Bharat: The Untold Story', isbn: '978-81-1234-005-9', genre: 'Non-Fiction', status: 'Published & Live', mrp: 599, copiesSold: 200, royaltyEarned: 24000, royaltyPaid: 0, royaltyPending: 24000, authorIndex: 2 },
  { title: 'Echoes of Eternity', isbn: '978-81-1234-006-6', genre: 'Fantasy', status: 'Cover Design', mrp: 449, copiesSold: 0, royaltyEarned: 0, royaltyPaid: 0, royaltyPending: 0, authorIndex: 2 },
  { title: 'The Art of Letting Go', isbn: '978-81-1234-007-3', genre: 'Self-Help', status: 'Published & Live', mrp: 349, copiesSold: 3000, royaltyEarned: 210000, royaltyPaid: 100000, royaltyPending: 110000, authorIndex: 3 },
  { title: 'Spices of Kerala', isbn: '978-81-1234-008-0', genre: 'Cookbook', status: 'Published & Live', mrp: 699, copiesSold: 100, royaltyEarned: 14000, royaltyPaid: 14000, royaltyPending: 0, authorIndex: 3 },
  { title: 'Digital Dharma', isbn: '978-81-1234-009-7', genre: 'Technology', status: 'Published & Live', mrp: 449, copiesSold: 750, royaltyEarned: 67500, royaltyPaid: 30000, royaltyPending: 37500, authorIndex: 4 },
  { title: 'Monsoon Memoirs', isbn: '978-81-1234-010-3', genre: 'Fiction', status: 'Proofreading', mrp: 299, copiesSold: 0, royaltyEarned: 0, royaltyPaid: 0, royaltyPending: 0, authorIndex: 4 },
  { title: "The Entrepreneur's Compass", isbn: '978-81-1234-011-0', genre: 'Business', status: 'Published & Live', mrp: 549, copiesSold: 450, royaltyEarned: 49500, royaltyPaid: 20000, royaltyPending: 29500, authorIndex: 5 },
  { title: 'Sacred Sands', isbn: '978-81-1234-012-7', genre: 'Travel', status: 'Published & Live', mrp: 399, copiesSold: 600, royaltyEarned: 48000, royaltyPaid: 0, royaltyPending: 48000, authorIndex: 5 },
  { title: 'The Lost Manuscript', isbn: '978-81-1234-013-4', genre: 'Mystery', status: 'Published & Live', mrp: 349, copiesSold: 1800, royaltyEarned: 126000, royaltyPaid: 80000, royaltyPending: 46000, authorIndex: 6 },
  { title: 'Gardening in the Tropics', isbn: '978-81-1234-014-1', genre: 'Lifestyle', status: 'Published & Live', mrp: 499, copiesSold: 150, royaltyEarned: 15000, royaltyPaid: 15000, royaltyPending: 0, authorIndex: 6 },
  { title: 'Yoga for Modern Life', isbn: '978-81-1234-015-8', genre: 'Health', status: 'Published & Live', mrp: 399, copiesSold: 2000, royaltyEarned: 160000, royaltyPaid: 100000, royaltyPending: 60000, authorIndex: 7 },
  { title: 'The Street Food Diaries', isbn: '978-81-1234-016-5', genre: 'Food', status: 'Typesetting', mrp: 449, copiesSold: 0, royaltyEarned: 0, royaltyPaid: 0, royaltyPending: 0, authorIndex: 7 },
  { title: 'Mumbai Noir', isbn: '978-81-1234-017-2', genre: 'Crime', status: 'Published & Live', mrp: 299, copiesSold: 900, royaltyEarned: 54000, royaltyPaid: 25000, royaltyPending: 29000, authorIndex: 8 },
  { title: 'Stories from the Village', isbn: '978-81-1234-018-9', genre: 'Fiction', status: 'Published & Live', mrp: 249, copiesSold: 350, royaltyEarned: 17500, royaltyPaid: 0, royaltyPending: 17500, authorIndex: 8 },
];

async function seedDatabase({ force } = {}) {
  const userCount = await User.countDocuments();
  if (!force && userCount > 0) {
    console.log('Database already has data, skipping seed.');
    return;
  }

  if (force) {
    await User.deleteMany({});
    await Book.deleteMany({});
    await Ticket.deleteMany({});
    console.log('Cleared existing data.');
  }

  console.log('Seeding database...');

  const admin = await User.create({
    name: 'BookLeaf Admin',
    email: 'admin@bookleaf.com',
    password: 'Admin@123',
    role: 'admin',
  });
  console.log(`Created admin: ${admin.email} / Admin@123`);

  const createdAuthors = [];
  for (const authorData of authors) {
    const author = await User.create(authorData);
    createdAuthors.push(author);
  }
  console.log(`Created ${createdAuthors.length} authors (password: author123)`);

  for (const bookData of booksData) {
    const { authorIndex, ...rest } = bookData;
    await Book.create({
      ...rest,
      authorId: createdAuthors[authorIndex]._id,
      publishDate: rest.status === 'Published & Live'
        ? new Date(`2024-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`)
        : undefined,
    });
  }
  console.log(`Created ${booksData.length} books`);
  console.log('Seed complete.');
}

if (require.main === module) {
  const mongoose = require('mongoose');
  const dotenv = require('dotenv');
  const path = require('path');
  dotenv.config({ path: path.join(__dirname, '..', '.env') });

  mongoose.connect(process.env.MONGODB_URI)
    .then(() => seedDatabase({ force: true }))
    .then(() => process.exit(0))
    .catch((err) => { console.error(err); process.exit(1); });
}

module.exports = seedDatabase;
