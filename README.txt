SINCHO DROPSHIP — BODYWORLD IMPORTER (FULL PROJECT)

FILES
- worker.js: Complete Cloudflare Worker. Serves the Turkish UI and /api/scrape endpoint.
- index.html: Standalone static interface (manual/HTML import and CSV export fallback).
- wrangler.jsonc: Worker deployment configuration.
- package.json: Wrangler dev/deploy commands.

IMPORTANT DEPLOYMENT NOTE
This is a Cloudflare Worker project, not a Pages drag-and-drop static ZIP. The Cloudflare uploader warning means it must be deployed as a Worker.

OPTION A — CLOUDFLARE DASHBOARD (no terminal)
1. Open https://dash.cloudflare.com/
2. Go to Workers & Pages and create a Worker.
3. Choose Edit code.
4. Replace the editor's code with the full contents of worker.js.
5. Click Deploy.
The Worker serves the full application at its workers.dev URL and provides /api/scrape.

OPTION B — WRANGLER CLI
1. Install Node.js LTS from https://nodejs.org/
2. Extract this ZIP and open a terminal in this folder.
3. Run: npm install
4. Run: npx wrangler login
5. Run: npm run deploy

PRODUCT DATA
The importer only extracts product data present in accessible JSON-LD Product markup. It does not invent product names, prices, images, stock or variants. If BodyWorld blocks server requests or provides no readable structured product data, scraping may fail; use an authorized product feed/API or permitted export. Do not use the Pages direct-upload screen for this Worker project.

CSV, local editable product records, JSON backup and Italian eBay draft helpers are included in the UI. It does not publish listings to eBay automatically.
