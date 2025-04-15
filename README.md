[![version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/Nellak2017/plan-weave/)
# 🧵 Plan Weave
[Plan Weave](https://www.planweave.com) is a modern, time-based task management app designed for clarity, simplicity, and control. Think of it as your central source of truth for task tracking—whether you're planning projects, managing personal goals, or just trying to stay on track day-to-day.

> 🚀 v1.0.0 is the first stable release! Advanced views (like Gantt, Calendar, and Graphs) are on the roadmap but not included yet. See the [release notes](https://github.com/Nellak2017/plan-weave/releases/tag/v1.0.0) for full details.

## Current Features

### 🔧 Core Task Editor
- Create, Edit, and Delete Tasks
- Drag and Drop Reordering
- Simple or Full Task Views
- Task Searching and Sorting
- Pagination for large task sets

### ⏱️ Time & Efficiency Tools
- Real-time Task Efficiency % display
- Real-time Task Waste tracking
- Set Start Time, End Time, and Due Date
- Overnight task support
- Show time remaining in your day
- ETA, TTC, and other derived metrics

### 🧠 Smart Features
- Complete / Incomplete toggle
- Task dependencies and threading
- Lightweight, fast UI with light/dark mode toggle
- Refresh and recycle old tasks into today's flow

## 🛠 Tech Stack
- __Frontend__: Next.js, MUI, Redux
- __Backend__: Firebase (v1) → migrating to Go + PostgreSQL (v2)
- __Tooling__: Jest, Storybook, fast-check
- __Deployment__: Vercel

## 🗺 Roadmap

### 🔜 Next release: v2.0.0 — October 15th, 2025

- Backend overhaul (Go + PostgreSQL)
- Google OAuth
- Verified Email Auth
- Better query capabilities and security

### Future Features
- Task Efficiency over time view
- Gantt View / Calendar View / Graph View
- Recurring Tasks & Scheduled Alerts
- Settings page and Theme control
- Dependency graph and thread editors

### Long-Term Wishlist
- Tutorials and onboarding
- Reminder system (email / push)
- Team and multi-user support
- Feedback / bug report integration

## Usage

Visit __https://www.planweave.com__ to use the live demonstration of the application. For Local development, follow the above
installation instructions and navigate to `http://localhost:3000` in your browser.

## Installation and starting in Development Mode

```bash
git init
git clone https://github.com/Nellak2017/plan-weave/
cd plan-weave
npm install
npm start
```

## Contributing

Contributions are welcome! Follow these steps to contribute:

1. Fork the repository.
2. Create a new branch: git checkout -b feature/your-feature.
3. Make changes and commit: git commit -m 'Add your feature'.
4. Push to the branch: git push origin feature/your-feature.
5. Submit a pull request.
