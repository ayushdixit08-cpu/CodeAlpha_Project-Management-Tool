# Flowboard

A collaborative project-management workspace built for Task 3. It includes:

- Project switching and workspace navigation
- Kanban board, list view, search, task priorities and assignees
- Task creation, status/assignee editing, and comments
- Express API for users, projects, tasks and comments
- Server-sent events for live task updates and a notification popover

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. The API runs at `http://localhost:4000`.

The API uses in-memory seed data so the demo runs without a database. Authentication UI is represented by the signed-in workspace profile; a production deployment should replace the seed identity with session/JWT middleware and persist data in a database.
