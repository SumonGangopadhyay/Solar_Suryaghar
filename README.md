# Solar Surya Ghar — Website

A production-oriented, multi-page rooftop-solar company website for **Solar Surya Ghar**
(`solarsuryaghar.co.in`). Static HTML/CSS/JS, no build step required, structured so a
Flask backend can be plugged in later for real form submissions.

---

## 1. File structure

```
solarsuryaghar/
├── index.html                     Homepage
├── about.html
├── solar-solutions.html           Solutions hub
├── solar-solutions/
│   ├── residential.html
│   ├── commercial.html
│   ├── industrial.html
│   ├── on-grid.html
│   ├── off-grid.html
│   └── hybrid.html
├── solar-calculator.html
├── subsidy.html
├── services.html
├── projects.html
├── blog.html
├── contact.html
├── get-a-quote.html
├── privacy-policy.html
├── terms.html
├── disclaimer.html
├── 404.html
├── css/
│   ├── style.css                  Design tokens, reset, layout, typography
│   ├── components.css             Nav, buttons, cards, footer, forms, calculator, accordion...
│   └── responsive.css             Breakpoints: 360 / 480 / 768 / 1024 / 1280 / 1440+
├── js/
│   ├── config.js                  ⭐ Single place to set phone/email/WhatsApp/API/analytics
│   ├── main.js                    Nav, mobile menu, scroll-reveal, accordion, config injection
│   ├── calculator.js              Solar savings calculator logic
│   └── forms.js                   Form validation + submission (Flask-ready)
├── assets/
│   └── icons/favicon.svg
├── sitemap.xml
├── robots.txt
└── README.md
```

Every page shares the same header, footer, mobile sticky action bar and WhatsApp
button, so updates to `css/` and `js/` apply everywhere automatically.

---

## 2. How to run it locally

Because a couple of pages use root-relative links (`/about.html`, `/css/style.css`),
open the site through a local server rather than double-clicking the HTML files.

**Option A — Python (already on your machine if you've used Flask before):**
```bash
cd solarsuryaghar
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

**Option B — VS Code:** install the "Live Server" extension, right-click
`index.html`, choose "Open with Live Server."

---

## 3. Placeholders you need to replace

Search the project for these and swap in real values before launch:

| Placeholder | Where it lives | What to do |
|---|---|---|
| `[PHONE NUMBER]` | `js/config.js` → `PHONE_NUMBER`, `PHONE_DISPLAY` | Real business phone number |
| `[EMAIL ADDRESS]` | `js/config.js` → `EMAIL_ADDRESS` | Real business email |
| `[SERVICE_LOCATION]` / `[SERVICE LOCATION]` | `js/config.js` → `SERVICE_LOCATION` | City/area you serve |
| `[WHATSAPP_NUMBER]` | `js/config.js` → `WHATSAPP_NUMBER` | Digits only, e.g. `919812345678` |
| Map placeholder | `contact.html` | Replace the placeholder box with a real Google Maps embed once you have an address |
| Company photo / project images | `about.html`, cards site-wide (`.art-frame` blocks) | Replace the SVG placeholder illustrations with real photography once available |
| `og:image` URL | `index.html` `<head>` | Upload a real social-share image to `assets/images/` and update the path |

Because you already have real content on hand from previous projects, it's
worth double-checking the tone matches what you want — everything here was
written to avoid inventing stats, reviews or history for the new company, per
the brief.

---

## 4. Deploying — since you're new to hosting

You bought the domain `solarsuryaghar.co.in` already, so you just need
somewhere to host these files and then point the domain at it. Two solid,
free options:

### Option A — Firebase Hosting (Google's static hosting product)
This is the most direct "host it on Google" route.

1. Install Node.js if you don't have it, then install the Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
2. Sign in with your Google account:
   ```bash
   firebase login
   ```
3. From inside the `solarsuryaghar/` folder:
   ```bash
   firebase init hosting
   ```
   - Choose "Create a new project" (or use an existing Firebase/Google Cloud project).
   - When asked for your public directory, enter `.` (this folder).
   - Answer "No" to "configure as a single-page app."
   - Answer "No" to overwriting `index.html`.
4. Deploy:
   ```bash
   firebase deploy
   ```
   Firebase gives you a live `*.web.app` URL immediately.
5. In the Firebase console → Hosting → **Add custom domain**, enter
   `solarsuryaghar.co.in`, and follow the DNS instructions it gives you
   (you'll add a couple of records at your domain registrar).

### Option B — GitHub Pages
Since you've hosted projects on GitHub Pages before:
1. Create a new GitHub repo and push this folder to it.
2. Repo → Settings → Pages → set the source to the `main` branch, root folder.
3. Repo → Settings → Pages → **Custom domain** → enter `solarsuryaghar.co.in`.
4. At your domain registrar, add the DNS records GitHub Pages shows you
   (typically A records to GitHub's IPs, plus a CNAME for `www`).

Either option works well for a static site like this one; Firebase is the
more direct "Google" answer, GitHub Pages is what you already know.

---

## 5. Connecting the enquiry forms to a real Flask backend

Right now, submitting a form shows an honest message that no backend is
connected yet — it does **not** pretend to send data. To make it real:

1. Build a Flask API with an endpoint like:
   ```python
   @app.route("/api/enquiries", methods=["POST"])
   def create_enquiry():
       data = request.get_json()
       # validate, save to DB, send email/WhatsApp notification, etc.
       return {"status": "ok"}, 201
   ```
2. Enable CORS on that Flask app for `https://solarsuryaghar.co.in`.
3. In `js/config.js`, set:
   ```js
   API_BASE_URL: "https://api.solarsuryaghar.co.in"
   ```
4. That's it — `js/forms.js` will start POSTing real submissions to
   `POST /api/enquiries` in JSON.

Suggested endpoints for later: `POST /api/enquiries`, `POST /api/quote`,
`POST /api/contact`, `GET /api/blog`, `GET /api/projects`.
Suggested tables: `customers`, `enquiries`, `quotes`, `projects`,
`blog_posts`, `reviews`, `users`.

---

## 6. Adding Google Analytics

1. Create a GA4 property at [analytics.google.com](https://analytics.google.com)
   and copy your Measurement ID (looks like `G-XXXXXXXXXX`).
2. Open `js/config.js` and set `GA_MEASUREMENT_ID: "G-XXXXXXXXXX"`.
3. Add this snippet just before `</head>` in every page (or wrap it in a
   shared partial once you introduce a build step), replacing the ID:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX');
   </script>
   ```

## 7. Submitting to Google Search Console

1. Go to [search.google.com/search-console](https://search.google.com/search-console).
2. Add `solarsuryaghar.co.in` as a **Domain property** (verifies via a DNS
   TXT record at your registrar) — this is the simplest method and also
   covers `www` automatically.
3. Once verified, go to **Sitemaps** in the left menu and submit:
   ```
   https://solarsuryaghar.co.in/sitemap.xml
   ```
4. Use **URL Inspection** to request indexing for the homepage once it's live.

---

## 8. Notes on integrity of content

Per the project brief, this build deliberately avoids inventing:
customers, reviews, completed projects, revenue, certifications, awards,
years of experience, government approval, partnerships or statistics.
The Projects and Reviews sections are honest "coming soon" states —
replace them with real content as it becomes available rather than
filling them with placeholder testimonials.
