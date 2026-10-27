# Restaurant Menu Manager

A beginner-friendly full-stack web application for managing restaurant menu items, prices, categories and availability.

## Features
- Dashboard statistics
- Create, read, update and delete menu items
- Category organization, search and filters
- Availability tracking
- Responsive interface
- Server-side validation and Supabase PostgreSQL persistence

## Technology
HTML5, CSS3, Vanilla JavaScript, Node.js, Express.js, Supabase PostgreSQL, Git and GitHub.

## Folder structure
- `frontend/`: HTML, CSS and browser JavaScript
- `backend/`: Express API, validation, and Supabase connection
- `database/schema.sql`: database schema
- `README.md`: setup guide

## Prerequisites
Install Node.js LTS (20 or later): https://nodejs.org/
Install VS Code: https://code.visualstudio.com/
Install Git: https://git-scm.com/
Create a Supabase account: https://supabase.com/

Verify in a terminal:
```bash
node --version
npm --version
git --version
```

## Setup
1. Create a Supabase project at https://supabase.com/.
2. Open its SQL Editor, paste the complete contents of `database/schema.sql`, and run it.
3. Verify `public.menu_items` exists in Table Editor.
4. Open a terminal in this project's root directory and run:
   ```bash
   cd backend
   npm install
   ```
5. Copy `.env.example` to `.env` in `backend/`. On Windows PowerShell:
   ```powershell
   Copy-Item .env.example .env
   ```
6. Edit `backend/.env` and enter your own Supabase project URL and server-side secret key.
7. Start the app from the `backend/` directory:
   ```bash
   npm run dev
   ```
8. Open http://localhost:3000. Health endpoint: http://localhost:3000/api/health

## Environment variables
- `PORT`: local HTTP port (default 3000)
- `NODE_ENV`: environment label
- `SUPABASE_URL`: URL shown in your Supabase project settings
- `SUPABASE_SECRET_KEY`: server-side secret key; never put it in browser files or GitHub

`.env.example` contains placeholders only. `.env` contains your private local configuration and must not be committed.

## API
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/menu` | List/search/filter items |
| GET | `/api/menu/:id` | Fetch one item |
| POST | `/api/menu` | Create item |
| PUT | `/api/menu/:id` | Update item |
| DELETE | `/api/menu/:id` | Delete item |

List query parameters: `q`, `category`, and `availability` (`available` or `unavailable`).

## Manual testing
1. Add a dish with a name, category, and non-negative price.
2. Confirm it appears in the table.
3. Refresh and check the dish persists.
4. Edit its details and confirm changes.
5. Test search, category and availability filters.
6. Delete the dish and confirm it disappears.
7. Try invalid values and verify the API rejects them.
8. Resize the browser to test mobile layout.

## Troubleshooting
- Missing environment variables: check `backend/.env` names and values.
- Database failure: check project URL/key and that the SQL schema was run.
- Website won't open: ensure `npm run dev` is running in `backend/`.
- Port occupied: set a different `PORT` in `backend/.env`.
- Table missing: rerun `database/schema.sql` in the Supabase SQL Editor.

## Security notes and limitations
This learning MVP has no login, multi-restaurant support, or per-user permissions. Do not expose it publicly as an unrestricted administrative API. Add authentication and authorization before public deployment. Keep privileged Supabase credentials only on the server. If a key is exposed, rotate it immediately.

## GitHub
Create an empty repository on https://github.com/, then run these commands from the project root:
```bash
git init
git status
git add .
git status
git commit -m "Build Restaurant Menu Manager"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```
Replace the URL with your repository URL. Check `git status` before committing; `.env`, `node_modules/`, and private data must not be uploaded. `.gitignore` does not remove secrets already committed.
# Restaurant Menu Manager

A full-stack web application for managing restaurant menu items.

## Live Demo
🌐 **Try the website:** https://restaurant-menu-manager-fft6.onrender.com

## Technologies Used
- HTML5
- CSS3
- JavaScript
- Node.js
- Express.js
- Supabase PostgreSQL

## Features
- View restaurant menu items
- Add menu items
- Organize items by category
- Store menu data in a database

## Project Repository
Explore the source code here: https://github.com/maddiakshaya06-design/Restaurant-Menu-Manager

## Developer
Akshaya — First-year CSE (AI & ML) student
