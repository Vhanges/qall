# Qall Website Deployment Guide

This repository contains the source code for the **Qall** website built with Next.js 16 (App Router), React 19, and Tailwind CSS.

---

## 🚀 Quick Start / Deployment Options

### Option 1: Managed Hosting (Vercel / Netlify / Render) — *Recommended*

1. Connect this repository or upload the package to **Vercel**, **Netlify**, or **Render**.
2. Configure the **Environment Variables** in your deployment dashboard:
   - `N8N_WEBHOOK_URL` — Your n8n webhook URL for the chat assistant (e.g. `https://n8n.yourdomain.com/webhook/qall`). The chat widget now proxies through an n8n workflow instead of calling OpenAI directly.
   - `RESEND_API_KEY` — Your Resend API Key (used for sending contact form emails at `/api/contact`).
   - `BUSINESS_EMAIL` — Destination address for incoming contact messages (e.g. `team@theqall.com`).
   - `FROM_EMAIL` — Verified sender domain email in Resend (e.g. `noreply@theqall.com`).
   - `NEXT_PUBLIC_CAL_LINK` — Cal.com event link handle (e.g. `tom-xalnfw/demo`).
3. Deploy! Next.js will build and deploy the frontend assets and serverless API endpoints automatically.

---

### Option 2: Self-Hosted Linux Server (Nginx + PM2)

If deploying to an Ubuntu/Debian Linux VPS:

#### 1. Prerequisites
- **Node.js**: v18.17.0 or v20.x+
- **Nginx** & **PM2** installed globally (`npm install -g pm2`)

#### 2. Setup & Environment
```bash
cd /var/www/qall
npm install
```
Create a `.env.local` file from `.env.example`:
```bash
cp .env.example .env.local
```
Fill in the live values for `N8N_WEBHOOK_URL`, `RESEND_API_KEY`, and `NEXT_PUBLIC_CAL_LINK`.

#### 3. Build & Run with PM2
```bash
npm run build
pm2 start ecosystem.config.js
pm2 save
```

#### 4. Nginx Reverse Proxy
An Nginx configuration is provided in `nginx/qall.conf`.
Copy it to `/etc/nginx/sites-available/qall.conf`, set up SSL with Certbot, and reload Nginx:
```bash
sudo cp nginx/qall.conf /etc/nginx/sites-available/qall.conf
sudo ln -s /etc/nginx/sites-available/qall.conf /etc/nginx/sites-enabled/
sudo certbot --nginx -d theqall.com -d www.theqall.com
sudo systemctl reload nginx
```

---

## 🛠 Features & Backend API Endpoints

- **Cal.com Booking Embed**: Powered by `@calcom/embed-react` on client side. Uses `NEXT_PUBLIC_CAL_LINK`.
- **AI Chat Assistant**: API handler at `/api/chat` proxies to an n8n workflow via `N8N_WEBHOOK_URL`. The wire contract is `POST { sessionId, message }` → `{ "response": string }`. The n8n workflow owns all AI logic (LLM call, conversation memory keyed by sessionId). **The chatbot system prompt lives only in the n8n `qall-marketing` workflow — edit it there; there is no copy in this repo.** `OPENAI_API_KEY` is no longer needed by this application.
- **Contact Form**: API handler at `/api/contact` using `resend` to send notifications and user confirmation emails.

---

## 📦 Package Summary
This package has been cleaned of temporary development scripts, video renders, and unneeded assets.
