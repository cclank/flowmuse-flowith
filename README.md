# FlowMuse

FlowMuse — 美学流程画板（Flowith 风格演示）

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cclank/flowmuse-flowith)

## Overview

FlowMuse is a highly polished, visual-first flowchart/node canvas web application, inspired by Flowith (this project is a tribute/clone for appearance and interaction purposes — not an official product). It is built on the Cloudflare Workers + Durable Object template to deliver a stunning, interactive frontend prototype rapidly.

The core focus is on visual excellence and intuitive user interactions, with modules including:
- Global layout and theme (top header, left Boards list sidebar, central canvas, right node inspector)
- Boards management (listing, creating, deleting boards)
- Board editor (draggable nodes, connections, selection, zoom, and canvas interactions)
- Lightweight persistence API (using DO entity pattern: BoardEntity as an alternative to ChatBoardEntity)
- Refined UI component library (based on shadcn/ui + Tailwind + Framer Motion + React Flow + Lucide)

**Disclaimer**: This is a non-official tribute to Flowith, focused on aesthetic and functional homage. For the original Flowith, visit their official site.

## Key Features

- **Visual Design Foundation**: Breathtaking UI with warm orange primary color (#F38020), purple accents (#764BA2), and deep gray text (#0F1724). Responsive layouts, smooth animations, and micro-interactions.
- **Boards Management**: Grid-based listing of user boards with search, create, and quick-open functionality.
- **Board Editor**: Interactive canvas using React Flow for node dragging, connecting, selection, and zooming. Left toolbar for node library, right panel for properties, top bar for actions (export, undo, zoom, share).
- **Node Inspector**: Side or modal panel for editing node properties, colors, descriptions, and actions.
- **User Journey**: Start from home with clear CTA, navigate to boards, edit in canvas, save/export (JSON/PNG in later phases).
- **Persistence**: Initial mock data, evolving to real backend with BoardEntity for boards and nodes storage via Durable Objects.
- **Responsive & Accessible**: Mobile-first design with touch-friendly controls, flawless across devices.
- **Phased Development**: Phase 1 delivers static/visual prototype; subsequent phases add editing, persistence, and collaboration.

The application is designed for rapid iteration, with each phase deployable and demoable.

## Technology Stack

- **Frontend**: React 18, React Router 6, TypeScript, Tailwind CSS v3, shadcn/ui (component library), Framer Motion (animations), React Flow (canvas interactions), Lucide React (icons), Zustand (state management), @tanstack/react-query (API caching), Sonner (toasts)
- **Backend**: Hono (routing), Cloudflare Workers, Durable Objects (via custom entity library for persistence)
- **Utilities**: @dnd-kit (drag-and-drop), Recharts (charts if needed), Immer (immutable updates), Zod (validation)
- **Build Tools**: Vite (bundler), Bun (package manager), Wrangler (Cloudflare deployment)
- **Styling**: Tailwind CSS with custom themes, CSS variables for light/dark modes

All dependencies are pre-configured; no additional installations needed beyond setup.

## Quick Start

### Prerequisites

- Bun (Node.js alternative; install from [bun.sh](https://bun.sh))
- Cloudflare account (for deployment; optional for local dev)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd flowmuse
   ```

2. Install dependencies using Bun:
   ```
   bun install
   ```

3. (Optional) Generate TypeScript types for Cloudflare bindings:
   ```
   bun run cf-typegen
   ```

### Local Development

1. Start the development server:
   ```
   bun run dev
   ```
   The app will be available at `http://localhost:3000` (or the port specified in `$PORT`).

2. In a separate terminal, start the Cloudflare Worker (for API testing):
   ```
   bun run dev --env worker
   ```
   Or use `wrangler dev` if Wrangler is installed globally.

3. Open `http://localhost:3000` in your browser. The app includes hot-reloading for frontend changes.

### Usage Examples

- **Home Page**: Landing page with branding, description, "Create Board" CTA, and disclaimer.
- **Boards List**: Navigate to `/boards` to view, search, create, or delete boards (initially mock data).
- **Board Editor**: Open a board at `/boards/:id` for canvas interaction (Phase 1: read-only/view mode).
- **API Interactions**: Frontend calls `/api/boards` for listing/creating; backend uses Durable Objects for persistence.

Example API call (from frontend via `api-client.ts`):
```tsx
import { api } from '@/lib/api-client';

const boards = await api<{ items: Board[]; next: string | null }>('/api/boards');
```

For full user flow: Home → Boards → Editor → Node Inspector (via selection) → Save/Export.

## Development Guide

### Project Structure

- **Frontend (`src/`)**:
  - `pages/`: Main views (HomePage.tsx, Boards.tsx, BoardEditor.tsx)
  - `components/`: UI components (ui/ for shadcn, custom for app-specific)
  - `hooks/`: Custom hooks (e.g., useTheme.ts)
  - `lib/`: Utilities (api-client.ts, utils.ts)

- **Backend (`worker/`)**:
  - `user-routes.ts`: Add API routes here (e.g., `/api/boards`)
  - `entities.ts`: Define entities like `BoardEntity` extending `IndexedEntity`
  - Do not modify `index.ts` or `core-utils.ts`

- **Shared (`shared/`)**: Types (`types.ts`) and mock data (`mock-data.ts`)

### Adding Features

1. **New Routes (Backend)**: Extend `user-routes.ts` using entity helpers:
   ```ts
   app.post('/api/boards', async (c) => {
     const { title } = await c.req.json();
     return ok(c, await BoardEntity.create(c.env, { id: crypto.randomUUID(), title, nodes: [] }));
   });
   ```

2. **New Pages (Frontend)**: Add to `main.tsx` router:
   ```tsx
   { path: "/boards", element: <BoardsPage />, errorElement: <RouteErrorBoundary /> }
   ```

3. **State Management**: Use Zustand with primitive selectors (see guidelines in codebase).
4. **UI Components**: Leverage shadcn/ui; import from `@/components/ui/*`.
5. **Testing**: Run `bun run lint` for checks; use browser dev tools for React debugging.
6. **Phased Implementation**: Follow blueprint roadmap—Phase 1: Visual prototype; Phase 2: Persistence; Phase 3: Advanced features.

### Common Commands

- Lint: `bun run lint`
- Build: `bun run build`
- Preview: `bun run preview`
- Type generation: `bun run cf-typegen`

## Deployment

Deploy to Cloudflare Workers for global edge distribution with Durable Objects for stateful persistence.

1. Ensure Wrangler is installed: `bun add -g wrangler`
2. Login: `wrangler login`
3. Build the project: `bun run build`
4. Deploy:
   ```
   bun run deploy
   ```
   Or use `wrangler deploy` directly.

The frontend assets are served via Cloudflare Pages/Pages integration, while the Worker handles API routes. Bindings are pre-configured in `wrangler.jsonc` (do not modify).

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cclank/flowmuse-flowith)

After deployment, access your app at the provided Cloudflare URL. For custom domains, configure via Wrangler or dashboard.

## Contributing

Contributions are welcome! Fork the repo, create a feature branch, and submit a PR. Focus on visual polish, performance, and adherence to the blueprint.

- Report issues: Use GitHub Issues
- Style guide: Follow Tailwind/shadcn conventions
- Commit message: Use conventional commits (e.g., `feat: add board creation`)

## License

MIT License. See [LICENSE](LICENSE) for details.

## Support

For questions, open an issue or join Cloudflare Workers community forums. This project is a demo/tribute—commercial use should respect Flowith's trademarks.