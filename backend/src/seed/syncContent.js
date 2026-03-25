import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { loadEnv } from '../utils/loadEnv.js';
import { syncContentLibrary } from './syncContentLibrary.js';

loadEnv();

const run = async () => {
  await connectDB();

  const result = await syncContentLibrary({
    includeArticles: true,
    removeLegacySeed: true,
    forceHomepageCuration: true
  });

  console.log(`Categories synced: ${result.categories.length}`);
  console.log(`Articles created: ${result.articleSync.created}`);
  console.log(`Articles updated: ${result.articleSync.updated}`);
  console.log(`Legacy sample articles removed: ${result.articleSync.removedLegacy}`);
  console.log(`Homepage settings ready: ${result.settings.siteName}`);

  await mongoose.connection.close();
};

run().catch(async (error) => {
  console.error(error);
  await mongoose.connection.close();
  process.exit(1);
});
