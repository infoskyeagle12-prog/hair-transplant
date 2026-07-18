# HT Aesthetiq Hair Transplant & Aesthetics Website

Production-ready, multi-page HTML/CSS/JS website for **HT Aesthetiq** — a hair transplant and aesthetics clinic based in DHA, Lahore, Pakistan. Crafted with medical prestige, high performance, mobile responsive grids, fluid typography, and premium design inspired by hairclub.com.pk.

---

## 📂 Project Structure

```text
htaesthetiq/
├── index.html                      ← Home Page (DHA, Lahore main clinic)
├── hair-transplant-lahore.html     ← SEO landing page: Lahore
├── hair-transplant-karachi.html    ← SEO landing page: Karachi
├── hair-transplant-islamabad.html  ← SEO landing page: Islamabad
├── hair-transplant-rawalpindi.html ← SEO landing page: Rawalpindi
├── hair-transplant-faisalabad.html ← SEO landing page: Faisalabad
├── about.html                      ← Doctor profile, clinic photos, & awards
├── services.html                   ← In-depth detail on our 7 premium treatments + comparison pricing table
├── book-appointment.html           ← Responsive 3-step interactive booking form with validation
├── contact.html                    ← Contact form + embedded Lahore DHA map & WhatsApp integration
├── css/
│   └── style.css                   ← Universal unified stylesheet (fluid layout, animations, breakpoints)
├── js/
│   └── main.js                     ← Universal logic (sticky headers, custom Before/After sliders, carousels)
└── assets/
    └── (Zero-byte high quality placeholder assets ensuring 100% correct file resolution)
```

---

## 🎨 Visual Identity & Colors

The design leverages a luxury medical clinic color scheme with clean, fluid typography:

*   **Primary Dark (Navy):** `#0A1628` — Trust, medical authority.
*   **Accent Gold:** `#C9A84C` — High premium prestige & confidence.
*   **Accent Light:** `#E8D5A3` — Fine luxury gradients and soft borders.
*   **White & Off-White:** `#FFFFFF` / `#F8F6F1` — Clinical hygiene, readable contrast.
*   **Text colors:** `#1A1A2E` (Dark Text) and `#6B7280` (Gray details).
*   **Typography:** Google Fonts loaded with optimized settings (`Playfair Display` for Headings, `Inter` for body paragraphs, and `Cormorant Garamond` for medical taglines).

---

## ✨ Features & Micro-Interactions

1.  **Fully Custom Before/After Sliders:** Powered by vanilla JS. Zero dependencies or external widgets. Prevents image squishing and horizontal distortion. Responsive on touch devices (drag-to-reveal).
2.  **Interactive Multi-Step Form:** Multi-step wizard under `book-appointment.html` validating text, email, and radio selection inputs on-the-fly. Complete with simulated loading spinner and confirmation card.
3.  **Sticky Dynamic Header:** Smooth transparent-to-navy-solid transitions upon scrolling. Fully responsive hamburger drawer overlay featuring dedicated mobile consultation buttons.
4.  **Auto-playing Testimonial Slider:** Manual dot navigation alongside active touch-friendly horizontal layout.
5.  **SEO Schema Optimized:** Includes robust `MedicalClinic` JSON-LD schema on all pages. Features distinct meta tags, geo-targeting regions, canonical links, and unique keywords.

---

## 🚀 Deployment & Local Execution

Since this is a client-side static solution without complex compilations or external build dependencies, running it locally is simple.

### Option A: Local Python Server (Recommended)
Launch a fast development web server using Python:
```bash
# From the project root, navigate to htaesthetiq/ and run:
python -m http.server 8000
```
Then, open your browser and navigate to `http://localhost:8000`.

### Option B: Node.js (http-server / live-server)
If you have node installed:
```bash
npm install -g live-server
live-server htaesthetiq
```

### Option C: Manual Launch
Simply open `index.html` directly in any web browser of your choice.

---

## 📝 Performance & Web Accessibility
*   Lazy-loading images via native `loading="lazy"` on image tags.
*   Responsive layouts powered by flexbox, absolute coordinates, and grid layouts collapsing gracefully to single-column modes on screens under `768px`.
*   Accessible touch targets sizing at a minimum of `44x44px` for optimal usability on mobile.
*   `prefers-reduced-motion` responsive support to respect client animation settings.
