# finsight

Next.js + TypeScript frontend for FinSight — an AI-powered personal finance assistant. Users upload financial documents (PDFs, CSVs) and ask natural language questions answered by a RAG backend.

Deployed on Replit. Connects to a Python backend on AWS.

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + SRCL terminal design system |
| Deploy | Replit Cloud Run |

## Local setup

**Prerequisites:** Node.js 22+, a running instance of [finsight-server](https://github.com/santiagodimeo/finsight-server).

```bash
git clone https://github.com/santiagodimeo/finsight.git
cd finsight

npm install

# Create a local env file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
# For the deployed backend, use the API Gateway URL instead
```

**Start the dev server:**

```bash
npm run dev
# → http://localhost:3000
```

**Type-check without building:**

```bash
npx tsc --noEmit
```

## Environment variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the finsight-server backend |

Set to `http://localhost:8000` for local development, or your API Gateway URL for production.

## How it works

`app/page.tsx` is the single state owner. It holds the uploaded files list and chat message history and passes them down as props to three components:

| Component | Role |
|---|---|
| `Chat` | Scrollable message history + input form. Sends `POST /query` on submit, shows a "Thinking…" placeholder while waiting. |
| `FileUpload` | Drag-and-drop + file picker (PDF, CSV). Fires `POST /upload` immediately on file selection. |
| `Dashboard` | Four stat cards. `documentCount` is live; spending/income cards are placeholders. |

## Deploying to Replit

1. Open the project in Replit
2. Go to **Secrets** (lock icon in the sidebar) and add:
   - `NEXT_PUBLIC_API_URL` = your API Gateway URL (e.g. `https://<id>.execute-api.us-east-1.amazonaws.com`)
3. Click **Deploy** — Replit runs `npm run build` then `npm run start`

The app is then live at your Replit deployment URL.

## Testing on production

Once deployed, test the full end-to-end flow:

1. Open the Replit deployment URL
2. Upload a PDF or CSV using the file picker or drag-and-drop
3. Wait for the upload to complete (the file appears in the list below)
4. Type a question in the chat — e.g. _"What is my largest expense?"_
5. Confirm you receive an AI-generated answer drawn from the document

If chat returns "Failed to reach the server", check that `NEXT_PUBLIC_API_URL` is set correctly in Replit Secrets and that the backend is deployed and responding at `/documents`.

## Parallel development with worktrees

```bash
bash scripts/worktree.sh feature-name
# Creates ../finsight-worktrees/feature-name with .env.local and .claude/ copied in
```
