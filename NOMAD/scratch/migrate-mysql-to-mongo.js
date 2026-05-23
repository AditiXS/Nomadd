/**
 * One-time: copy users/posts/reviews from local MySQL into MongoDB Atlas.
 * Run: node scratch/migrate-mysql-to-mongo.js
 */
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { connectDB } from '../db/connect.js';
import { User, CommunityPost, FoodReview, CarpoolPost } from '../db/models.js';

dotenv.config();

async function main() {
  await connectDB();

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'nomad_db',
  });

  const [users] = await conn.query('SELECT * FROM users');
  for (const u of users) {
    await User.updateOne(
      { email: u.email.toLowerCase() },
      {
        $set: {
          name: u.name,
          email: u.email.toLowerCase(),
          password: u.password,
          idType: u.idType,
          idNumber: u.idNumber,
          phone: u.phone,
          designation: u.designation || 'nomad',
        },
      },
      { upsert: true }
    );
  }
  console.log(`✅ users: ${users.length}`);

  const [posts] = await conn.query('SELECT * FROM community_posts');
  for (const p of posts) {
    await CommunityPost.create({
      city: p.city,
      author_name: p.author_name,
      content: p.content,
      createdAt: p.created_at,
    });
  }
  console.log(`✅ community_posts: ${posts.length}`);

  const [reviews] = await conn.query('SELECT * FROM food_reviews');
  for (const r of reviews) {
    await FoodReview.create({
      city: r.city,
      restaurant_name: r.restaurant_name,
      user_name: r.user_name,
      stars: r.stars,
      review_text: r.review_text,
      createdAt: r.created_at,
    });
  }
  console.log(`✅ food_reviews: ${reviews.length}`);

  const [carpool] = await conn.query('SELECT * FROM carpool_posts');
  for (const c of carpool) {
    await CarpoolPost.create({
      city: c.city,
      author_name: c.author_name,
      origin: c.origin,
      destination: c.destination,
      travel_date: c.travel_date,
      travel_time: c.travel_time,
      seats: c.seats,
      note: c.note,
      createdAt: c.created_at,
    });
  }
  console.log(`✅ carpool_posts: ${carpool.length}`);

  await conn.end();
  await import('mongoose').then((m) => m.default.disconnect());
  console.log('Migration complete.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
