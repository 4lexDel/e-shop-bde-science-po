# ThreadPop — Digital Fashion Themes

E-commerce React + TypeScript pour produits numériques, sans création de compte.

## Architecture

- `frontend/src/components`, `pages`, `services`, `store`, `types`
- `backend/src/routes`, `services`, `webhooks`
- Sequelize + PostgreSQL
- Stripe Checkout en mode TEST

## Démarrage

1. `docker compose up -d db`
2. `cd backend && cp .env.example .env && npm install`
3. Renseigne `STRIPE_SECRET_KEY=sk_test_...`
4. `npm run db:migrate && npm run db:seed && npm run dev`
5. `cd ../frontend && npm install && npm run dev`
6. Dans un autre terminal: `stripe login` puis `stripe listen --all-snapshot --forward-to localhost:4242/api/webhooks/stripe`
7. Copie le `whsec_...` dans `backend/.env`, redémarre le backend.

Utilise `4242 4242 4242 4242` avec une date future et un CVC quelconque. C'est le mode test Stripe: aucun argent réel.
