# Validation Checks

Run checks from `english_pronunciation_app/frontend` unless stated otherwise.

## Standard Frontend Checks

```powershell
npx.cmd prisma validate
npx.cmd prisma generate
npx.cmd tsc --noEmit --pretty false
npm run build
```

Use the full set when Prisma schema, API routes, or shared types changed. For small UI-only edits, a focused typecheck may be enough if build is expensive.

## Database Sync

```powershell
npx.cmd prisma db push
```

Use only when intentionally syncing the local database after schema changes. Prefer migrations when the project moves toward production/deployment discipline.

## Stale Next.js Generated Types

If typecheck references deleted or moved routes under `.next/types`, clear generated types:

```powershell
Remove-Item -Recurse -Force .next\types -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .next\dev\types -ErrorAction SilentlyContinue
```

Then rerun typecheck.

## Backend Checks

Run from `english_pronunciation_app/backend` when FastAPI files changed:

```powershell
python -m compileall app
```

Add backend tests later when the backend has meaningful endpoints beyond health/config.

## Official References

- Next.js CLI and build docs: https://nextjs.org/docs/app/api-reference/cli/next
- Next.js TypeScript docs: https://nextjs.org/docs/app/api-reference/config/typescript
- Prisma CLI reference: https://www.prisma.io/docs/orm/reference/prisma-cli-reference
- TypeScript TSConfig reference: https://www.typescriptlang.org/tsconfig/
- OWASP Application Security Verification Standard: https://owasp.org/www-project-application-security-verification-standard/
- W3C Web Content Accessibility Guidelines: https://www.w3.org/TR/WCAG22/
