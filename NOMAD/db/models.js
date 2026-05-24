import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    idType: String,
    idNumber: String,
    phone: String,
    designation: { type: String, default: 'nomad' },
    avatar: String,
    bio: String,
    age: Number,
    interests: { type: [String], default: [] },
    socialLink: String,
    city: { type: String }, // Bound city for the user
  },
  { timestamps: true }
);

const replySchema = new mongoose.Schema(
  {
    author_name: { type: String, required: true },
    content: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
  }
);

const communityPostSchema = new mongoose.Schema(
  {
    city: { type: String, required: true, lowercase: true, trim: true },
    author_name: { type: String, required: true },
    content: { type: String, required: true },
    replies: [replySchema],
  },
  { timestamps: true }
);

const foodReviewSchema = new mongoose.Schema(
  {
    city: { type: String, required: true, lowercase: true, trim: true },
    restaurant_name: { type: String, required: true },
    user_name: { type: String, required: true },
    stars: { type: Number, required: true, min: 1, max: 5 },
    review_text: { type: String, required: true },
  },
  { timestamps: true }
);

const carpoolPostSchema = new mongoose.Schema(
  {
    city: { type: String, required: true, lowercase: true, trim: true },
    author_name: { type: String, required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    travel_date: { type: String, required: true },
    travel_time: { type: String, required: true },
    seats: { type: Number, default: 1 },
    note: String,
  },
  { timestamps: true }
);

const messageSchema = new mongoose.Schema(
  {
    senderEmail: { type: String, required: true },
    receiverEmail: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
export const CommunityPost = mongoose.model('CommunityPost', communityPostSchema);
export const FoodReview = mongoose.model('FoodReview', foodReviewSchema);
export const CarpoolPost = mongoose.model('CarpoolPost', carpoolPostSchema);
export const Message = mongoose.model('Message', messageSchema);

/** Shape Mongo documents like the old MySQL rows for the frontend */
export function toApiDoc(doc) {
  if (!doc) return null;
  const o = doc.toObject ? doc.toObject() : { ...doc };
  return {
    ...o,
    id: o._id?.toString?.() ?? o.id,
    created_at: o.createdAt ?? o.created_at,
  };
}

export function toApiDocs(docs) {
  return docs.map(toApiDoc);
}
