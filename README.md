# DropletAI

DropletAI is a React/Vite frontend with a Spring Boot API in `droplet-ai-backend`.

## Requirements

- Node.js 20.19+ or 22.12+
- Java 21
- PostgreSQL

## Configure the backend

Create a PostgreSQL database named `droplet_ai`, then set these environment variables before starting the API:

| Variable | Required | Purpose |
| --- | --- | --- |
| `DB_USERNAME` | Yes | PostgreSQL account with access to `droplet_ai` |
| `DB_PASSWORD` | Yes | Password for that PostgreSQL account |
| `JWT_SECRET` | Yes | Base64-encoded random value containing at least 32 bytes |
| `GEMINI_API_KEY` | No | Gemini API key; without it, the backend uses its fallback analysis |
| `GEMINI_MODEL` | No | Gemini model name; defaults to `gemini-1.5-flash` |

The backend only enables these local browser origins by default: `http://localhost:5173`, `http://127.0.0.1:5173`, and the corresponding port 3000 origins. A deployed frontend will need its exact origin added to the backend CORS configuration.

Generate a JWT secret in PowerShell with:

```powershell
$bytes = [byte[]]::new(32)
[System.Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
$env:JWT_SECRET = [Convert]::ToBase64String($bytes)
```

Set the database variables for your local PostgreSQL account. Never commit real credentials or JWT secrets. The backend listens on port 8080 by default.

Run backend tests:

```powershell
cd droplet-ai-backend
./mvnw.cmd test
```

Run the API after setting its environment variables:

```powershell
./mvnw.cmd spring-boot:run
```

## Run the frontend

```powershell
npm install
npm run dev
```

The frontend defaults to `http://localhost:8080` for the API. To use another address, set `VITE_API_BASE_URL` in a local `.env.local` file, for example:

```dotenv
VITE_API_BASE_URL=http://localhost:8080
```

## Integration notes

- Sign-up creates an organisation owner immediately. Email verification and Google sign-in are not provided by the current backend.
- Adding a team member works only for an account that has already registered; the backend has no invitation flow.
- Analytics screens still use sample frontend data because there are no analytics endpoints in the backend.
- Brand guideline fields are saved together as content in the backend's generic guideline record. Per-finding accept/reject actions are not supported by its review API.
- The backend accepts uploaded documents and uses them as audit context. It does not expose OCR processing as a separate endpoint.
