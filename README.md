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
| `FIREBASE_PROJECT_ID` | Yes for Firebase sign-in | Firebase project ID |
| `FIREBASE_SERVICE_ACCOUNT` | Yes for Firebase sign-in | Path to the private service-account JSON; defaults to `firebase-service-account.json` |

The backend only enables these local browser origins by default: `http://localhost:5173`, `http://127.0.0.1:5173`, and the corresponding port 3000 origins. A deployed frontend will need its exact origin added to the backend CORS configuration.

Generate a JWT secret in PowerShell with:

```powershell
$bytes = [byte[]]::new(32)
[System.Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
$env:JWT_SECRET = [Convert]::ToBase64String($bytes)
```

For local work, copy `droplet-ai-backend/.env.example` to `droplet-ai-backend/.env` and fill in the PostgreSQL password and JWT secret. The backend loads that ignored `.env` file when you run it from `droplet-ai-backend`. Put the Firebase Admin service-account key at `droplet-ai-backend/firebase-service-account.json`; that filename is ignored by Git. Never commit service-account keys, real credentials, or JWT secrets. The backend listens on port 8080 by default.

## Configure Firebase sign-in

Copy `.env.example` to `.env.local` and fill in the Firebase web app values. The Firebase web API key is public client configuration; the service-account JSON is private server configuration and must stay in the backend folder.

In Firebase Console, enable Email/Password and Google under Authentication → Sign-in method, and keep `localhost` in Authentication → Settings → Authorized domains. This project uses Firebase for email/password and Google authentication, then exchanges the Firebase ID token for a DropletAI API session. The backend verifies the ID token with Firebase Admin before issuing its own JWT. Existing DropletAI accounts are matched by verified email and retain their existing organisation and role.

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

- New Firebase sign-ups create an organisation owner immediately. If a Firebase email/password account matches an existing DropletAI account, the app asks the user to verify that email before linking it.
- Adding a team member works only for an account that has already registered; the backend has no invitation flow.
- Analytics screens still use sample frontend data because there are no analytics endpoints in the backend.
- Brand guideline fields are saved together as content in the backend's generic guideline record. Per-finding accept/reject actions are not supported by its review API.
- The backend accepts uploaded documents and uses them as audit context. It does not expose OCR processing as a separate endpoint.
