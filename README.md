# 🛒 Carty
Scotland's meal planner + price comparison app. Built for busy families who want to eat well without overspending.

CM3141 Pirate Studies — Group Project 2025/26


What it does

Generate a weekly meal plan based on your budget and household
Compare grocery prices across Asda, Tesco and Morrisons
Save, edit and delete your meal plans
See a shopping list with the best price for each item


Tech Stack(MERN)

Frontend — React (Vite) + Tailwind CSS
Backend — Node.js + Express
Database — MongoDB (Atlas)
Auth — JWT


Folder Structure
carty-app/
├── client/          # React frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── hooks/
│       └── services/
├── server/          # Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── seeds/
└── README.md

Branching
We use a simple GitFlow setup:
Always branch off dev, never off main as this will only be used when finished 
bashgit checkout dev
git pull origin dev
git checkout -b feature/your-feature
Open a PR into dev when your feature is ready. Don't merge your own PRs if you can help it — get a teammate to have a quick look first.

Environment Variables
Neither .env file is committed to the repo.

The Team
Favour - Backend developer
Dawn - Frontend/UI developer
Stephen - Frontend developer

Deadline
17 April 2026 — Presentation 9am, submission by 1pm.
