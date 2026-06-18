# Campus Resource Booking System (CRBS)

Full-stack web application for MMU campus resource booking. Frontend and API are served from a single Express server on port 5000.

## Prerequisites

- Node.js 22+ (via [nvm](https://github.com/nvm-sh/nvm))
- MySQL 8+

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your MySQL credentials (DB_PASS) and a random JWT secret

# 3. Create database and tables
npm run db:setup

# 4. Start server (dev mode with auto-restart)
npm run dev
```

Open **http://localhost:5000** — both the frontend and API are served from one port.

## Start / Stop

| Command | Action |
|---------|--------|
| `npm run dev` | Dev mode (auto-restart on changes, non-daemon) |
| `npm start` | Plain start (non-daemon) |
| `npm run pm2:start` | Daemon start (survives terminal close) |
| `npm run pm2:stop` | Stop daemon |
| `npm run pm2:restart` | Restart daemon |
| `npm run pm2:status` | Check daemon status |
| `npm run pm2:logs` | View daemon logs |

## Database Access

### Terminal (CLI)

```bash
# Connect to MySQL
mysql -u root -proot

# Inside the prompt:
USE crbs;
SHOW TABLES;
SELECT * FROM users;
DESCRIBE users;

# Or run a query directly:
mysql -u root -proot -e "USE crbs; SELECT userID, name, email, role, campusId FROM users;"
```

### GUI Tools

- **MySQL Workbench** — connect to `localhost:3306`, user `root`, password `root`, database `crbs`

## API Docs

Swagger UI: http://localhost:5000/api/docs

### Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login |
| POST | `/api/auth/logout` | Yes | Logout (revokes token) |
| GET | `/api/users/profile` | Yes | Get own profile |
| PUT | `/api/users/profile` | Yes | Update own profile |
| GET | `/api/admin/users` | Admin | List all users |
| GET | `/api/admin/users/:id` | Admin | Get user by ID |
| PUT | `/api/admin/users/:id` | Admin | Update user |
| DELETE | `/api/admin/users/:id` | Admin | Soft-delete user |

## Seeded Admin

- Email: `admin@mmu.edu.my`
- Password: `Admin123!`

## Note

On WSL, initial startup takes ~60-90s because the project is on the Windows filesystem (`/mnt/c/`). Use PM2 (`npm run pm2:start`) to keep the server running continuously so the cost is paid only once.
