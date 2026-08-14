# 🌿 GrowApp Cannabis Guide

> **Founder @ Loyal9 LLC | Scaling 2,800+ Strain DB with GrowApp | Architecting Social Blockchain w/ Mission Mischief | AWS Serverless & Open-Source — We Pass Them Left, Then Watch the Industry Blink.**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-growappcannabis.guide-green?style=for-the-badge)](https://growappcannabis.guide)
[![App Store](https://img.shields.io/badge/📱_iOS-App_Store-blue?style=for-the-badge)](https://apps.apple.com/us/app/growapp-cannabis-guide/id6471381461)
[![Google Play](https://img.shields.io/badge/🤖_Android-Google_Play-green?style=for-the-badge)](https://play.google.com/store/apps/details?id=com.growappcannabiscannabis.guide)
[![License](https://img.shields.io/badge/📄_License-MIT-yellow?style=for-the-badge)](LICENSE.md)
[![AI Pair Programmer](https://img.shields.io/badge/🤖_Pair_Programmer-Amazon_Q-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)](https://aws.amazon.com/q/)

---

## 🚀 What We Built

GrowApp is a **data-driven cannabis cultivation platform** that transforms how home growers approach their grows. Built with vanilla JavaScript, powered by a 2,800+ strain database, and architected around IndexedDB for fully offline-capable, personalized grow tracking.

---

## 🗂 Site Structure

```
growappcannabis.guide/
├── index.html                  ← Homepage hub with category nav + tool grid
├── grow-space/
│   └── grow-space.html         ← Tent kits & grow space gear
├── lighting/
│   └── lighting.html           ← 132 LED lights, cost calculator, DLI tool
├── medium-feeding/             ← Core grow app (see below)
├── mydiary/                    ← Legacy diary (standalone)
├── mytask/                     ← Legacy task (standalone)
├── assets/
│   ├── js/hamburger.js         ← Global nav
│   ├── css/style.css
│   └── policies/               ← Privacy, Terms, EULA, Disclosure
├── server.py                   ← Local dev server (serves from repo root, port 8000)
├── CNAME                       ← growappcannabis.guide
├── robots.txt
└── sitemap.xml
```

---

## 🌱 medium-feeding — The Grow App

The core product. A single-origin multi-page app where users build a personalized grow, then track it day by day.

### Page Flow

```
medium-feeding.html  (3-step builder)
  └── schedule-viewer.html  (schedule + card view)
        ├── mytask.html     (daily check-in)
        └── mydiary.html    (photo diary)
```

### Pages

| Page | Purpose |
|---|---|
| `medium-feeding.html` | 3-step grow builder: Strain → Nutrients → Start Date → generates schedule |
| `schedule-viewer.html` | Full schedule viewer with card view (mobile default) and table view (desktop default) |
| `mytask.html` | Daily check-in: log actuals for environment, water, nutrients, light, inspection |
| `mydiary.html` | Camera + column selector + data overlay photo diary |

### Schedule Viewer — View Modes

Accessed via the **⚙ Options** dropdown in the toolbar:

| Mode | Description |
|---|---|
| Cards | Collapsible day cards — default on mobile. Date · Day · Week in header, sections for Environment / Water & pH / Nutrients / Visual Inspection |
| Table | Full horizontal-scroll data table — default on desktop. Sticky header + toolbar + column headers |
| My Notes | Cards or table with all editable "My" fields visible: environment, light/air, nutrients (dynamic), inspection notes |

My Notes fields match exactly what MyTask saves — data entered in either place is shared via IndexedDB.

### Plant Size Filter

| Size | Veg Weeks Shown |
|---|---|
| Small | 4 |
| Medium | 6 |
| Large | All |
| Auto | All (optional days-to-harvest trim) |

---

## 🛠 Tech Stack

```javascript
const techStack = {
  frontend:   ['Vanilla JavaScript', 'CSS3', 'HTML5'],
  data:       ['JSON', 'IndexedDB (MyGrowDB v8)', 'localStorage'],
  deployment: ['GitHub Pages', 'CDN'],
  mobile:     ['PWA', 'iOS App Store', 'Google Play', 'Amazon Appstore'],
  analytics:  ['Google Analytics (G-KWP9QD7GPL)'],
  devServer:  ['Python server.py — serves repo root on port 8000']
};
```

---

## 🧪 Key Features

### 📊 Strain Intelligence
- 2,800+ strains with THC/CBD, genetics, flowering time
- Strain search with image previews
- Auto vs photoperiod detection → adjusts veg weeks

### 📅 Smart Schedule Generation
- 126-row base schedule (seedling → veg → flower → harvest)
- Dynamic nutrient columns per selected brand/product
- Personalized start date → day-by-day calendar dates
- Saved to IndexedDB, fully offline

### 📋 Schedule Viewer
- Card view (mobile-first, collapsible per day)
- Table view (power user, all columns, sticky headers)
- My Notes mode — edit actuals inline on cards or in table cells
- Options dropdown — view mode + plant size + navigation in one tap
- Size filter hides excess veg weeks per plant type

### ✅ MyTask — Daily Check-In
- Hero plant photo upload (compressed to 800px JPEG)
- Today's schedule row auto-matched by date
- Expandable cards: Environmental, Water & Nutrients, Light & Air, Visual Inspection
- Color-coded inputs: green = on target, red = over, blue = under
- Auto-saves actuals to IDB on blur + manual Log button
- Progress bar: Day X of Y

### 📓 MyDiary
- Camera capture or file upload
- Column selector — overlay any schedule field on photo
- Dark theme, back to schedule viewer

---

## 🏗 Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  Strain DB      │    │ Schedule Engine  │    │  Schedule Viewer │
│  (2,800+)       │───▶│ (126 base rows + │───▶│  Cards / Table   │
│  data.js        │    │  nutrient cols)  │    │  My Notes        │
└─────────────────┘    └──────────────────┘    └──────────────────┘
         │                      │                        │
         ▼                      ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ Nutrient Data   │    │  IndexedDB       │    │ MyTask / MyDiary │
│ (6 Brands)      │    │  MyGrowDB v8     │    │ (actuals logged) │
└─────────────────┘    └──────────────────┘    └──────────────────┘
```

### IndexedDB — MyGrowDB v8

| Store | Key | Value |
|---|---|---|
| `tables` | `growId` | grow metadata (name, strain, logo) |
| `tables` | `${growId}_schedule` | full schedule array |
| `selectedNutrients` | `growId` | selected nutrient IDs array |
| `nutrients` | `nutrientName` | custom nutrient objects |

Singleton instance exported as `{ IndexedDBService }` from `indexedDBService.js`. All methods are instance methods. `dbPromise` cached to prevent multiple connections.

---

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/yourusername/growappcannabis.guide.git
cd growappcannabis.guide

# Serve from repo root (required for absolute fetch paths)
python server.py
# → http://localhost:8000
```

> Fetch paths in `schedule-generator.js` use `/medium-feeding/assets/data/` — must be served from repo root.

---

## 📱 Get the Apps

[![iOS App Store](https://img.shields.io/badge/Download_on_the-App_Store-black?style=for-the-badge&logo=apple&logoColor=white)](https://apps.apple.com/us/app/growapp-cannabis-guide/id6471381461)
[![Google Play](https://img.shields.io/badge/Get_it_on-Google_Play-green?style=for-the-badge&logo=google-play&logoColor=white)](https://play.google.com/store/apps/details?id=com.growappcannabiscannabis.guide)
[![Amazon Appstore](https://img.shields.io/badge/Available_at-Amazon_Appstore-orange?style=for-the-badge&logo=amazon&logoColor=white)](https://www.amazon.com/gp/product/B0CFG7HGQK)

---

## 🌐 Connect

[![Website](https://img.shields.io/badge/🌐_Website-growappcannabis.guide-green?style=for-the-badge)](https://growappcannabis.guide)
[![Twitter](https://img.shields.io/badge/Twitter-@Loyal9GrowApp-blue?style=for-the-badge&logo=twitter)](https://twitter.com/Loyal9GrowApp)
[![Facebook](https://img.shields.io/badge/Facebook-Loyal9GrowApp-blue?style=for-the-badge&logo=facebook)](https://www.facebook.com/Loyal9GrowApp/)
[![Instagram](https://img.shields.io/badge/Instagram-@loyal9growapp-purple?style=for-the-badge&logo=instagram)](https://www.instagram.com/loyal9growapp/)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Areas We Need Help
- 🌱 Strain data expansion (terpene profiles, genetics)
- 🧪 Nutrient brand integration (new feeding schedules)
- 🔬 Plant diagnostic accuracy (symptom identification)
- 📱 Mobile PWA enhancements
- 🌐 Internationalization

---

## 📄 License

MIT License — see [LICENSE.md](LICENSE.md)

---

<div align="center">

**"Grow what you can't."** 🌿

*Shannon passed it left. Amazon Q caught it, refactored it, fixed the sticky headers, rewrote the legal docs, and passed it back greener than it started.* 🍃

*Built with ❤️ by [Loyal9 LLC](https://loyal9.com) · Pair programmed with [Amazon Q](https://aws.amazon.com/q/)*

</div>
