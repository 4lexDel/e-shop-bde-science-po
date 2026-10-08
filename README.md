# THREADPOP — React + TypeScript + Sequelize + Stripe Test

Boutique en ligne du BDE pour vendre des vêtements, sans création de compte, avec checkout Stripe en **mode test**.

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
7. Copier le `whsec_...` affiché par Stripe CLI dans `backend/.env` (`STRIPE_WEBHOOK_SECRET=...`), puis redémarrer le backend. **Ne pas utiliser `/` comme destination du forward.**

Carte de test Stripe: `4242 4242 4242 4242`, date future, CVC quelconque. Aucun argent réel n'est débité.

## Admin
- Front: `/admin`
- Header API: `x-admin-token: <ADMIN_TOKEN>`
- Produits: `GET/POST /api/products/admin`, `PUT/DELETE /api/products/admin/:id`
- Ventes CSV: `GET /api/orders/admin/sales.csv` avec le header admin. Le CSV ne contient que les commandes `PAID`; une commande payée est synchronisée avec Stripe même si le webhook est légèrement retardé.

## Stock
Le stock est contrôlé côté serveur avant le checkout. Une quantité est réservée pendant le paiement pour éviter les doubles ventes concurrentes. La quantité disponible est décrémentée uniquement lorsque Stripe confirme le paiement. Une session expirée ou un paiement asynchrone échoué libère la réservation.

## Checkout
Le checkout collecte les coordonnées de livraison avant le paiement. Le payload utilise les mêmes noms des deux côtés : `firstName`, `lastName`, `email`, `addressLine1`, `addressLine2`, `postalCode`, `city`, `country`.

## Paiement
- Succès: `/success?session_id=...` attend la confirmation réelle Stripe, affiche la transaction et déclenche automatiquement le téléchargement de la facture PDF.
- Pour le développement local, Stripe CLI doit impérativement forwarder vers `/api/webhooks/stripe`. Si le webhook est retardé, le backend vérifie aussi directement le statut de la Checkout Session Stripe.
- Échec/annulation: `/payment-error`; l’annulation libère immédiatement la réservation côté serveur.
- Le webhook Stripe est la source de vérité pour `PAID`.

## Facture
`GET /api/orders/session/:sessionId/invoice` produit une facture PDF avec récapitulatif, commande, client, montant et identifiant de transaction Stripe.
