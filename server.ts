import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // Endpoints API
  app.all(['/v1/endpoints', '/api/v1/endpoints'], (_req: Request, res: Response) => {
    res.json({
      is_successful: true,
      result: {
        trading_cluster_websocket: "wss://ws.oriontraderbot.app/echo/websocket",
        web_static_endpoint: "",
        gateway_api: "",
        billing_api: "",
        web_endpoint: "",
        terms_endpoint: "",
        user_verify_api: ""
      }
    });
  });

  // Countries API
  app.all(['/v5/countries/short', '/v1/countries', '/api/v1/countries'], (_req: Request, res: Response) => {
    res.json({
      countries: [
        { id: 1, name: "Brasil", name_short: "BR", phone_code: "55" }
      ],
      result: [
        { id: 1, name: "Brasil", name_short: "BR", phone_code: "55" }
      ],
      is_successful: true
    });
  });

  app.all(['/v2/countries'], (_req: Request, res: Response) => {
    res.json({
      id: 1,
      name: "Brasil",
      name_short: "BR",
      result: { id: 1, name: "Brasil", name_short: "BR" },
      is_successful: true
    });
  });

  // Features API
  app.all(['/v2/features', '/api/v2/features'], (_req: Request, res: Response) => {
    res.json({
      identity: "anon_user_1",
      features: {},
      is_successful: true,
      result: {}
    });
  });

  // Users API
  app.all(['/v1/users', '/api/v1/users'], (_req: Request, res: Response) => {
    res.json({
      is_successful: true,
      result: {
        id: 1,
        email: "trader@orionbot.app",
        name: "Trader Orion",
        currency: "BRL",
        balance: 500.00
      }
    });
  });

  // Sessions API
  app.all(['/v1/sessions', '/api/v1/sessions'], (_req: Request, res: Response) => {
    res.json({
      is_successful: true,
      result: { id: "sess_1", status: "active" }
    });
  });

  // Catch-all for any other API route
  app.all(['/v1/*', '/v2/*', '/v3/*', '/v5/*', '/api/*'], (_req: Request, res: Response) => {
    res.json({
      is_successful: true,
      result: {},
      countries: [
        { id: 1, name: "Brasil", name_short: "BR", phone_code: "55" }
      ],
      features: {}
    });
  });

  // Vite middleware in development
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
