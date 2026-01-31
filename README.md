# 🧠 IdeaHeap

![Status](https://img.shields.io/badge/Status-Work_In_Progress-yellow)

**IdeaHeap** is a gamified project management tool designed for developers to handle ideas and technical workflows efficiently.

Inspired by dynamic memory allocation (heap), the project integrates a **Gamification System** containing **XP, Levels, and Ranks** to keep developers motivated and productive.

## 🛠 Tech Stack

This project uses a modern **Monorepo** architecture.

| Layer | Technologies |
| :--- | :--- |
| **Backend** | Python, FastAPI, SQLAlchemy, **PostgreSQL** |
| **Frontend** | React 18, Vite, **Tailwind CSS**, Lucide React |
| **Database & ORM** | PostgreSQL, Psycopg2, SQLAlchemy |
| **Security & Auth** | Bcrypt (Passlib), Dotenv |
| **Architecture** | RESTful API, Pydantic Models, MVC Pattern |

## ✨ Features

* **🚀 Project Management:** Track projects from the "Idea" phase to "Completion".
* **🎮 Gamification System:**
    * **Daily Streak:** Login bonuses to maintain consistency.
    * **XP & Rewards:** Earn XP by completing projects.
    * **Leveling Logic:** Difficulty scales quadratically (Harder to level up as you grow).
    * **Developer Ranks:** Progress from *Intern* to *Senior Developer*.
* **📝 Dev Logs:** Keep detailed technical logs for every project.
* **🎨 Modern UI:** A sleek interface designed with **Tailwind CSS** (Dark Mode focused).
* **🔒 Security:** Secure password hashing with **Bcrypt** and environment variable management.

