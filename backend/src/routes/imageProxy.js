import express from 'express';
import http from 'http';
import https from 'https';
import { URL } from 'url';

const router = express.Router();

// GET /api/image?url=<encodedUrl>
router.get('/', (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send('Missing url');

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return res.status(400).send('Invalid url');
  }

  if (!/^https?:$/i.test(parsed.protocol)) {
    return res.status(400).send('Invalid protocol');
  }

  const client = parsed.protocol === 'https:' ? https : http;

  const request = client.get(
    url,
    {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        Accept: '*/*',
      },
    },
    (upstream) => {
      if ((upstream.statusCode || 500) >= 400) {
        res.status(502).send('Failed to fetch image');
        upstream.resume();
        return;
      }
      const contentType = upstream.headers['content-type'] || 'image/jpeg';
      res.setHeader('Content-Type', contentType);
      upstream.pipe(res);
    }
  );

  request.on('error', () => res.status(500).send('Proxy error'));
});

export default router;
