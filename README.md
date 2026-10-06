# THREADPOP — React + TypeScript + Sequelize + Stripe Test

E-commerce de produits numériques, sans création de compte, avec checkout Stripe en **mode test**.

## Stack
- Frontend: React + TypeScript + Vite + React Router + Zustand
- Backend: Node.js + TypeScript + Express + Sequelize
- DB: PostgreSQL
- Paiement: Stripe Checkout + Stripe CLI/webhooks

## Démarrage
1. `docker compose up -d db`
2. `cd backend && cp .env.example .env`
3. Renseigner `STRIPE_SECRET_KEY=sk_test_...` et `ADMIN_TOKEN=...`
4. `npm install && npm run db:migrate && npm run db:seed && npm run dev`
5. `cd ../frontend && npm install && npm run dev`
6. Dans un autre terminal: `stripe login && stripe listen --forward-to localhost:4242/api/webhooks/stripe`
7. Copier `whsec_...` dans `backend/.env`, puis redémarrer le backend.

Carte de test Stripe: `4242 4242 4242 4242`, date future, CVC quelconque. Aucun argent réel n'est débité.

## Admin
- Front: `/admin`
- Header API: `x-admin-token: <ADMIN_TOKEN>`
- Produits: `GET/POST /api/products/admin`, `PUT/DELETE /api/products/admin/:id`
- Ventes CSV: `GET /api/orders/admin/sales.csv` avec le header admin.

## Stock
Le stock est contrôlé côté serveur avant le checkout. Une quantité est réservée pendant le paiement pour éviter les doubles ventes concurrentes. La quantité disponible est décrémentée uniquement lorsque Stripe confirme le paiement. Une session expirée ou un paiement asynchrone échoué libère la réservation.

## Checkout
Le payload utilise les mêmes noms des deux côtés : `firstName`, `lastName`, `email`, `addressLine1`, `addressLine2`, `postalCode`, `city`, `country`.

## Paiement
- Succès: `/success?session_id=...` avec transaction Stripe et bouton de facture PDF.
- Échec/annulation: `/payment-error`.
- Le webhook Stripe est la source de vérité pour `PAID`.

## Facture
`GET /api/orders/session/:sessionId/invoice` produit une facture PDF avec récapitulatif, commande, client, montant et identifiant de transaction Stripe.
