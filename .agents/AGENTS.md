# Workspace Rules

- Do NOT automatically run `git commit` or `git push`. You MUST ask the user for explicit confirmation before executing any git commit or git push commands under any circumstances.
- Before committing or pushing changes to the repository, ALWAYS run type-checks and production builds for BOTH `frontend` and `backend` (e.g. `npm run build` or `npx tsc --noEmit`) to verify that all unused variables, invalid imports, and TypeScript compilation errors are removed so that Vercel / production deployments succeed cleanly.
