[![version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/Nellak2017/plan-weave/)
# 🧵 Plan Weave
[Plan Weave](https://www.planweave.com) is a modern, time-based task management app designed for clarity, simplicity, and control. Think of it as your central source of truth for task tracking whether you're planning projects, managing personal goals, or just trying to stay on track day-to-day.

> 🚀 v2.0.0 is the Go backend release! Plan Weave now has updated Stopwatch Tasks and does not use Firebase. Advanced views (like Gantt, Calendar, and Graphs) are on the roadmap but not included yet. See the [release notes](https://github.com/Nellak2017/plan-weave/releases/tag/v2.0.0) for full details.

## Current Features

### 🔧 Core Task Editor
- Create, Edit, and Delete Tasks
- Drag and Drop Reordering
- Simple or Full Task Views
- Task Searching and Sorting
- Pagination for large task sets
- Play or Pause tasks to have accurate Task Times

### ⏱️ Time & Efficiency Tools
- Real-time Task Efficiency % display
- Real-time Task Waste tracking
- Set Start Time, End Time, and Due Date
- Overnight task support
- Show time remaining in your day
- ETA based on current Task only and not on dependencies

### 🧠 Smart Features
- Complete / Incomplete toggle
- Play / Pause toggle
- Task dependencies and threading
- Lightweight, fast UI with light/dark mode toggle
- Refresh all old tasks into today's flow
- Refresh some old tasks into today's flow

## 🛠 Tech Stack
- __Frontend__: Next.js, MUI, Redux
- __Backend__: Go + PostgreSQL + SQLc (v2)
- __Tooling__: Jest, Storybook, fast-check
- __Deployment__: Vercel, Fly.io, Supabase

## 🗺 Roadmap

### 🔜 Next minor release: v2.1.0 — September 15th, 2025

- Mobile Friendly UI and UX
- Google OAuth
- Updated Auth Page to have more modern MUI components
- Better Forgot Password Email Template
- Simplified Task Control (without start time)
- Graph related features
  - Graph View 
  - Highlighting Inconsistent or Waiting Tasks
  - Dependency Aware Task ETA calculations (Sync and Async Task ETA calculations)
- Updated react-beautiful-dnd to new library
- Server Logging
- Improved API endpoints and more RLS
- User Settings Page
  - Display Name
  - Task Editor settings
    - Sync and Async mode
    - Custom Default Tasks
    - ...more
  - ...more 

### Future Features
- Task Efficiency over time view
- Gantt View / Calendar View 
- Recurring Tasks & Scheduled Alerts
- Theme control
- Thread editors
- Hierarchical tasks
- Routine templates
- Calendar integrations
- Social features
- AI Task prediction

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
