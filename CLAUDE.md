# CLAUDE.md - Essential Commands and Guidelines

## Project Commands
- **Supabase Local**: 
  - `supabase start` - Start local Supabase instance
  - `supabase stop` - Stop local Supabase instance
  - `./supabase/seed.sh` - Initialize database schema and policies

- **Development**:
  - Root project: `pnpm dev` - Run Next.js development server (port 3000)
  - Metadata parser: `cd companion/metadata-parser && pnpm dev` - Run metadata parser (port 7123)
  - PDF Export: `cd companion/pdf-export && python main.py` - Run PDF export service (port 6123)

- **Production**:
  - Root project: `pnpm build` - Build for production
  - Root project: `pnpm start` - Start production server
  - Root project: `pnpm lint` - Run ESLint

## Development Environment Setup
1. Start Supabase: `supabase start`
2. Configure environment:
   - Update `.env.local` with Supabase credentials and OpenAI API key
   - Set NEXT_PUBLIC_EXTERNAL_IP to your machine's local IP address
   - Add RESEND_API_KEY (can be dummy for local dev)
3. Run services (in separate terminals):
   - Next.js app: `pnpm dev`
   - Metadata parser: `cd companion/metadata-parser && pnpm dev`
   - PDF Export: `cd companion/pdf-export && python main.py`

## Required API Keys
- OpenAI API key - For metadata parsing functionality
- Resend API key - For email functionality (can use dummy for local dev)

## Coding Style Guidelines
- **TypeScript**: Use strict mode with explicit type annotations
- **Imports**: Group imports by source (React, components, utils, types)
- **Naming**: PascalCase for components/types, camelCase for variables/functions
- **Components**: Use functional components with React hooks
- **Error Handling**: Use try/catch with proper error logging
- **State Management**: Use React Query for async state, React context where appropriate
- **Formatting**: 2-space indentation, no trailing commas
- **File Structure**: Group related functionality in directories
- **CSS**: Use Tailwind utility classes with shadcn/ui component system

## Tech Stack
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Microservices**: Express.js (metadata parser), Flask (PDF export)
- **API Integration**: OpenAI for metadata parsing
- **State Management**: React Query, Zustand
- **UI Components**: Radix UI primitives via shadcn/ui