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


---

### 🔄 Syncing Logic (Offline + Online)

- Notes are saved locally in the browser using **IndexedDB**.
- When the app detects you're online, it syncs with the backend.
- `mergeRemoteNotes()` compares notes:
  - ✅ If remote note is **newer** → replaces local.
  - ✅ If local note is **newer** → keeps local.
  - ✅ If note **doesn't exist locally** → adds it.
- Manual syncing logic — no external syncing libraries used (done to learn and control the process).

---

### 🧠 Design Decisions & Tradeoffs

- ❌ No Redux or Zustand — local state management is enough for this scope.
- ✅ Used pure browser APIs (IndexedDB) — minimal dependencies.
- ✅ Optimized for **offline-first** experience.
- ❌ No authentication or user-specific data (yet).
- ❌ Conflict resolution is basic — based purely on `updatedAt` timestamp.

---

### ⚠️ Assumptions / Limitations

- `id` field is a UUID (auto-generated).
- Notes are user-agnostic — no login or user separation.
- `updatedAt` determines the "newer" note in sync logic.
- One-way sync **remote → local** is implemented during initial load.

---

### 📁 Folder Structure (Frontend)

```plaintext
src/
├── components/       // All UI components (NoteCard, Editor etc.)
├── hooks/            // Custom hooks (if any)
├── services/
│   ├── db.ts         // IndexedDB wrapper
│   └── api.ts        // Remote API methods (fetch, sync)
├── types/            // TypeScript interfaces
└── App.tsx           // Main app entry
```

---

### 🧪 How to Test the App

- ✅ Create/edit/delete notes **offline** → data stays in IndexedDB.
- 🔁 Come online with backend running → **sync happens**.
- 🧭 Try same app in **two different browsers** → see if remote notes merge correctly.
- 🔄 Edit note in one browser → sync → open in other browser → check for consistency.

---

### 🌐 Deployment

#### 🔼 Frontend on Vercel

1. Push your frontend repo to GitHub.
2. Go to [vercel.com](https://vercel.com) → Import your repo.
3. Use:
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Update your fetch URLs if needed to point to your backend hosted on Render.

#### 🔁 Backend on Render

1. Push your backend (`db.json`) to GitHub.
2. Go to [render.com](https://render.com) → New → Web Service.
3. Set:
   - **Start command**: `json-server --host 0.0.0.0 --watch db.json --port 10000`
   - **Build command**: (leave blank)
   - **Environment variable**: `PORT=10000`
4. Once deployed, get the live URL (e.g., `https://your-backend.onrender.com`).
5. If you hit a port scan timeout error: bind `json-server` to `0.0.0.0` manually if needed.

---

### 🛠 Local Development Tips

- Debug using browser **DevTools → Application → IndexedDB** panel.
- Use `localStorage` or `console.log()` to debug network/sync state.
- Detect connection using `navigator.onLine`.
- Use Chrome DevTools’ device simulator to test mobile responsiveness and offline behavior.

---

### 💡 Future Improvements

- 🔐 Add user authentication (e.g., Firebase, Auth0).
- 🔁 Creating a full scaled PWA.
- 🧠 Smart conflict resolution (e.g., show UI diff).
- ☁️ Cloud storage support (Firebase, Supabase, etc.).
- 🧪 Add automated tests (unit + integration).

---

### 📬 Feedback / Ideas

Feel free to open issues or contribute if you'd like to extend the project! 😊

