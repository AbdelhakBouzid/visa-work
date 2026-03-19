import mongoose from 'mongoose';
import { createSlug } from '../utils/createSlug.js';

const categorySchema = new mongoose.Schema(
  {
    name: {
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
    description: {
      type: String,
      default: '',
      trim: true
    }
  },
  { timestamps: true }
);

categorySchema.pre('validate', function preValidate(next) {
  if (!this.slug && this.name) {
    this.slug = createSlug(this.name, 'category');
  }

  next();
});

export const Category = mongoose.model('Category', categorySchema);
