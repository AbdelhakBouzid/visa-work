import path from 'path';
import { fileURLToPath } from 'url';
import app from './app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = Number(process.env.PORT) || 5000;

const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(frontendDistPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      next();
      return;
    }

    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
