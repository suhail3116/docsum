# ⚡ DocSum — Modern Document Intelligence & Workspace Dashboard

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?logo=three.js&logoColor=white)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)

**DocSum** is an enterprise-grade, high-performance React application designed for document ingestion, AI-driven summarization, and local audit trail management. Featuring an interactive 3D WebGL background powered by Three.js, fluid micro-animations by Framer Motion, and a glassmorphism dark mode UI.

---

## ✨ Features

- **🌐 Interactive 3D WebGL Background (`ThreeBackground.jsx`)**: Real-time rotating wireframe crystal, particle starfield, and point lights that dynamically track mouse cursor movements.
- **📁 Drag & Drop Dropzone (`FileUploadZone.jsx`)**: Supports multi-file staging with automatic extension detection (`PDF`, `DOCX`, `CSV`, `JSON`, `TXT`, `PNG/JPG`).
- **🤖 Automated AI Insights**: Instant generation of AI document summaries, confidence scores, extracted entity nodes, and key bullet highlights.
- **🔍 Audit History Log (`SubmissionHistory.jsx`)**: Real-time synced with browser `localStorage`, featuring live search filtering by name, size, or date.
- **📊 Real-time Workspace Metrics (`StatsOverview.jsx`)**: Live metric cards displaying total committed records, pending queue items, storage volume, and ingestion speed.
- **👁️ Deep-Dive Detail Viewer (`FileDetailModal.jsx`)**: Inspect executive overviews, key takeaways, and raw JSON record structures with one-click copy.
- **👤 Identity & Session Management (`AuthModal.jsx`)**: Seamlessly switch between Guest Mode and custom user/organization profiles.
- **🎉 Visual Feedback**: Integrated `canvas-confetti` celebrations upon committing records to storage.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **[React 18](https://reactjs.org/)** | Frontend UI Library & Component State Management |
| **[Vite 6](https://vitejs.dev/)** | Fast Next-Generation Frontend Tooling & Dev Server |
| **[Three.js](https://threejs.org/)** | 3D WebGL Canvas Animations & Lighting |
| **[Tailwind CSS v4](https://tailwindcss.com/)** | Utility-First Styling & Glassmorphism Design Token System |
| **[Framer Motion](https://www.framer.com/motion/)** | Declarative Micro-Animations & Page Transitions |
| **[Lucide React](https://lucide.dev/)** | Modern Crisp Iconography |
| **[Canvas Confetti](https://github.com/catdad/canvas-confetti)** | Celebration FX for Document Submission |

---

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js** (v18.0 or later) installed on your system.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/docsum.git
   cd docsum
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📁 Project Structure

```text
04 docsum/
├── public/                  # Static assets & favicons
├── src/
│   ├── components/
│   │   ├── AuthModal.jsx          # Profile & session switcher modal
│   │   ├── FileDetailModal.jsx    # Deep-dive AI insights & JSON viewer modal
│   │   ├── FileUploadZone.jsx     # Drag & drop file staging component
│   │   ├── Navbar.jsx             # Top navigation & header bar
│   │   ├── StatsOverview.jsx      # Workspace metric cards
│   │   ├── SubmissionHistory.jsx  # Audit log history with search
│   │   └── ThreeBackground.jsx    # WebGL 3D canvas background
│   ├── utils/
│   │   └── docUtils.js            # Storage sync & AI summary generator helpers
│   ├── App.jsx                    # Root application component
│   ├── index.css                  # Tailwind CSS imports & custom glass styles
│   └── main.jsx                   # React DOM entry point
├── index.html                 # HTML template with Google Fonts
├── vite.config.js             # Vite configuration with Tailwind plugin
└── package.json               # Project dependencies & scripts
```

---

## 💾 Local Storage Schema

DocSum persists records locally in browser storage under `docsum_records` with backwards compatibility for legacy `docsum_file_records`.

```json
{
  "id": "1723245678901",
  "name": "Q3_Financial_Audit.pdf",
  "size": "1.4 MB",
  "timestamp": "Aug 10, 2026, 05:18 AM",
  "summary": {
    "summaryText": "Document Q3_Financial_Audit.pdf successfully processed...",
    "bulletPoints": [
      "Extracted executive summary for financial auditing.",
      "Key topics identified: Quarterly commitments and operational milestones.",
      "Document risk score: Low (98.4% data confidence)."
    ],
    "entitiesCount": 16,
    "confidenceScore": "98.4%",
    "category": "PDF Document"
  }
}
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
