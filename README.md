# Readwise Highlights Dashboard

A personal dashboard for browsing, filtering, and exploring connections across Readwise highlights. Live data via the Readwise API.

## Deploy to Netlify (5 minutes)

### Step 1 — Push to GitHub
Create a new GitHub repo and push this folder's contents to it.

### Step 2 — Connect to Netlify
1. Go to [app.netlify.com](https://app.netlify.com)
2. Click **Add new site → Import an existing project**
3. Connect GitHub and select your repo
4. Build settings are auto-detected from `netlify.toml` — no changes needed
5. Click **Deploy site**

### Step 3 — Set your custom subdomain (optional)
In Netlify: **Site configuration → Domain management → Options → Edit site name**
Set it to something like `highlights` → your URL becomes `highlights.netlify.app`

### Step 4 — Use it
Visit your Netlify URL, paste your Readwise token from [readwise.io/access_token](https://readwise.io/access_token), and your highlights load live. The token is saved in your browser — you only need to paste it once per device.

---

## Link from bradkreit.com

Since bradkreit.com is on GitHub, add a link wherever you want in your site — for example in a nav or links page:

```html
<a href="https://your-site.netlify.app">Reading Highlights</a>
```

Or if you want it on a subdomain of bradkreit.com (e.g. `highlights.bradkreit.com`):
1. In Netlify: **Domain management → Add a domain alias** → enter `highlights.bradkreit.com`
2. In your GitHub (bradkreit.com) repo's DNS / `_config.yml` or wherever your DNS is managed, add a CNAME record: `highlights` → `your-site.netlify.app`

---

## File structure

```
├── index.html              # Main app shell
├── app.js                  # All dashboard logic
├── netlify.toml            # Netlify build config
└── netlify/
    └── functions/
        └── readwise.js     # Server-side proxy (handles CORS)
```

## Adding new books/themes

Themes are defined in `app.js` in the `TITLE_TO_THEME` object. Add new book titles there as your library grows. Any book not in the map gets tagged as "Other" and still appears in the dashboard.
