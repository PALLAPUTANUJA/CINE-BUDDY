# Movie Recommendation System using Machine Learning (Full-Stack)

A highly polished, Netflix-inspired full-stack Movie Recommendation System built using **Node.js/Express**, **React (TypeScript)**, **Tailwind CSS**, and **Gemini AI**.

Designed as a modern, modular, and production-ready intelligent web application combining content-based filtering, collaborative filtering, bento dashboard analytics, and conversational vector suggestions.

---

## 🚀 Key Features

### 1. Unified Blockbuster Movie Catalog (`Module 5`)
- Curated high-fidelity database of 22 global blockbusters (Interstellar, Inception, Your Name, Your Name, etc.).
- Complete metadata details: genres, keywords, cast, creative directors, runtimes, release years, and YouTube embedded trailers.

### 2. Intelligent Content-Based Similarity (`Module 2`)
- **Combined Tags**: Unified feature sets matching movie genres, keywords, overview descriptions, director, and cast.
- **Mathematical Cosine Similarity**: Node-side real-time calculation representing text vectors to score and recommend top 10 similar titles instantly.

### 3. Pearson Neighborhood Collaborative Filtering (`Module 3`)
- Matrix-based neighborhood profiles modeling collaborative user behavior.
- Calculates rating predictions iteratively:
  $$\hat{P}(u, m) = \bar{R}_u + \frac{\sum_{v \in U_m} Sim(u, v) \cdot (R(v, m) - \bar{R}_v)}{\sum_{v \in U_m} |Sim(u, v)|}$$
  where $Sim(u,v)$ uses the Pearson Product-Moment Correlation on co-rated blockbusters.

### 4. Interactive Bento Dashboard Analytics (`Module 9`)
- Real-time bento metrics detailing total catalogs, user reviews, and active sessions.
- **ML Performance KPIs**: Calculating live evaluations of **RMSE**, **MAE**, **Precision @ 5**, and **Recall @ 5** to map model validation accurately.
- Fully responsive custom SVG charts mapping genre frequencies and top-rated film comparison curves.

### 5. Conversational AI Search Assistant (`Bonus`)
- Server-side **Gemini-3.5-flash** conversational critic integration.
- Direct grounding matching matching user instructions to return grounded catalog tags, rendering interactive click-to-preview suggestion cards in the chat flow.

### 6. Session & Watchlist Integrity (`Module 6 & 7`)
- Clean account authorization (Sign In, Registration, or zero-friction Guest Access).
- Stateful Watchlist additions/removals and interactive 5-star rating updates.

---

## 📁 Project Folder Structure

```
Movie-Recommendation-System/
│
├── data/
│   └── database.json          # Light, self-contained JSON DB
│
├── src/
│   ├── components/            # Dedicated UI components
│   │   ├── AuthPage.tsx       # Sign In / Register viewport
│   │   ├── Sidebar.tsx        # Responsive navigation rail
│   │   ├── MovieCard.tsx      # Hover scalable movie card
│   │   ├── MovieDetailsModal.tsx # YouTube embeds / metrics explainer
│   │   ├── Chatbot.tsx        # Gemini conversational AI
│   │   └── DashboardAnalytics.tsx # Responsive custom SVG charts
│   │
│   ├── types.ts               # Firm TypeScript type definitions
│   ├── App.tsx                # Client main orchestrator
│   └── index.css              # Typography and Global CSS
│
├── server.ts                  # express API with mathematical ML math engines
├── tsconfig.json              # TypeScript compiler configurations
├── vite.config.ts             # Vite/Tailwind configuration rules
└── README.md                  # Detailed deployment guide
```

---

## 🔗 REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Create a new critic account |
| `POST` | `/api/auth/login` | Login existing user |
| `GET` | `/api/movies` | Get movies list with fuzzy filters |
| `GET` | `/api/movies/:id` | Retrieve detailed metadata for a film |
| `POST` | `/api/ratings` | Updates movie rating (calculates averages) |
| `GET` | `/api/recommendations/content` | Content Similarity vector recommendation list |
| `GET` | `/api/recommendations/collaborative/:userId` | Pearson-SVD predicted recommendations |
| `GET` | `/api/dashboard/analytics/:userId` | Metrics calculations, genre stats, RMSE & MAE |
| `POST` | `/api/chat` | AI Critic conversational suggestion grounding |

---

## 🛠️ Deploying and Running the Application

### 1. Prerequisites
- **Node.js** (v18.0 or newer)
- **NPM** package manager

### 2. Initial Setup
Clone the project repository and install dependency nodes:
```bash
npm install
```

### 3. Environment Variables
Add your Gemini Key inside your local `.env` setup:
```env
# REQUIRED: For conversational suggestions
GEMINI_API_KEY="YOUR_GOOGLE_GEMINI_KEY"
```

### 4. Running Development Mode
To boot up the high-speed dev mode (Express server and Vite bundler running full stack):
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) on your local web browser.

### 5. Production Compilation
To build and bundle the client-side files and compile the Express server into standard CommonJS format:
```bash
npm run build
```
Launch the compiled container service instantly:
```bash
npm start
```

---

## 🔬 Machine Learning Evaluation Formulas

The ML Dashboard evaluates collaborative predictions dynamically on live reviews database:

- **RMSE (Root Mean Square Error)**:
  $$\text{RMSE} = \sqrt{\frac{1}{N} \sum_{i=1}^N (R_i - \hat{R}_i)^2}$$
- **MAE (Mean Absolute Error)**:
  $$\text{MAE} = \frac{1}{N} \sum_{i=1}^N |R_i - \hat{R}_i|$$
- **Precision @ 5**:
  $$\text{Precision} = \frac{\text{Recommended & Liked Items in Top 5}}{5}$$
- **Recall @ 5**:
  $$\text{Recall} = \frac{\text{Recommended & Liked Items in Top 5}}{\text{Total Liked Items}}$$
