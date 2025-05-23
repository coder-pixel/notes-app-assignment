# 📝 Offline-First Markdown Notes App (React + TypeScript + Tailwind)

A lightweight offline-first markdown note-taking app built with React, TypeScript, and TailwindCSS. Notes are stored locally using IndexedDB and can be synced to a mock backend (json-server) when you're back online.

---

## ⚙️ Setup Instructions

> This app is split into two simple parts:
> - `Frontend` (React + Vite + Tailwind)
> - `Backend` (Mock server using json-server)

---

### 🚀 Frontend Setup

1. Clone the frontend repo and go inside it:
   ```bash
   git clone https://github.com/coder-pixel/notes-app-assignment.git
   cd offline-notes-app


1. Install dependencies:   
    ```bash
    npm install

3. Start the dev server:
    ```bash
    npm run dev

---

### 🔧 Backend Setup (Mock API)
You can set this up in a separate folder or repo

1. Create a simple db.json file:
    ```bash
    {
        "notes": []
    }


2. Install json-server globally if not already:
    ```bash
    npm install -g json-server
    
3. Start the server:
    ```bash
    json-server --watch db.json --port 5000

4. Your mock API is now live at: http://localhost:5000/notes
