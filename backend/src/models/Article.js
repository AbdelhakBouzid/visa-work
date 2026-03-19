import mongoose from 'mongoose';
import { createSlug } from '../utils/createSlug.js';

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    excerpt: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true
    },
    featuredImage: {
      type: String,
      default: ''
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    tags: {
      type: [String],
      default: []
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft'
    },
    seoTitle: {
      type: String,
      default: ''
    },
    seoDescription: {
      type: String,
      default: ''
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    views: {
      type: Number,
      default: 0
    },
    publishedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

articleSchema.index({ title: 'text', excerpt: 'text', tags: 'text' });

articleSchema.pre('validate', function preValidate(next) {
  if (!this.slug && this.title) {
    this.slug = createSlug(this.title, 'article');
  }

  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  if (this.status === 'draft') {
    this.publishedAt = null;
  }

  next();
});

export const Article = mongoose.model('Article', articleSchema);
