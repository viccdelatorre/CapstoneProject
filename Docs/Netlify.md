# Deploying the Frontend to Netlify

This project contains a Vite + React frontend in the `Frontend/` folder and a Django backend in `Backend/`.
Netlify will build and publish the frontend. The backend must be deployed separately (Render, Heroku, DigitalOcean, etc.).

Quick summary (Netlify Site settings):
- Base directory: `Frontend`
- Build command: `npm ci && npm run build`
- Publish directory: `dist`

Environment variables
- Vite exposes environment variables prefixed with `VITE_` at build time. Set the following in Netlify under Site settings → Build & deploy → Environment:
  - `VITE_API_URL` — the full base URL of your backend API (e.g. `https://api.yourdomain.com/`).

How the frontend picks the API URL
- The frontend's API client reads `import.meta.env.VITE_API_URL` and falls back to `http://127.0.0.1:8000/` for local development. This means Netlify will bake the backend URL into the built assets at deploy time.

SPA routing
- A SPA fallback is configured so client-side routes will return `index.html`.

Steps to create a Netlify site for this repo
1. Sign in to Netlify and choose "New site from Git".
2. Connect your repository and pick the branch you want to deploy.
3. In the build settings set:
   - Base directory: `Frontend`
   - Build command: `npm ci && npm run build`
   - Publish directory: `dist`
4. In Site settings → Build & deploy → Environment variables, add `VITE_API_URL` with your backend URL.
5. Deploy the site. After deployment, verify the frontend talks to your backend.

Optional: Add a Netlify deploy badge to the `README.md` after you create the site. Netlify provides a badge snippet in the site deploy settings that you can paste into the README.

Notes and troubleshooting
- If you need server-side functionality (Django API), deploy that separately and point `VITE_API_URL` to it.
- If the frontend still hits localhost in production, confirm `VITE_API_URL` is set in Netlify and that you rebuilt the site after changing env vars.
