# Recipe App 

A monorepo workspace for the Recipe application using pnpm workspaces.

## Structure

```
recipe/
├── apps/
│   ├── api/          # Backend API server
│   └── mobile/       # React Native mobile app
├── packages/         # Shared packages/libraries
└── scripts/          # Build and utility scripts
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (v10.16.1+)

### Installation

```bash
# Install all dependencies across all workspaces
pnpm install

# Or use the alias
pnpm install:all
```

### Development Scripts

```bash
# Run development servers for all apps
pnpm dev

# Run specific app
pnpm api:dev      # Start API server
pnpm mobile:dev   # Start mobile app

# Build all apps
pnpm build

# Run tests across all workspaces
pnpm test

# Lint all code
pnpm lint

# Clean all build artifacts
pnpm clean
```

### Workspace Commands

```bash
# Add dependency to specific workspace
pnpm add <package> --filter api
pnpm add <package> --filter mobile

# Add dev dependency to root
pnpm add -D <package> -w

# Run command in specific workspace
pnpm --filter api <command>
pnpm --filter mobile <command>

# Run command in all workspaces
pnpm --recursive <command>
```

## Workspace Configuration

The workspace is configured via:

- `pnpm-workspace.yaml` - Defines workspace packages
- `package.json` - Root package with workspace scripts
- `.npmrc` - pnpm configuration with shamefully-hoist enabled
- Individual `package.json` files in each app/package

## Notes

- **All packages are installed in the root `node_modules`** via shamefully-hoist configuration
- Dependencies are fully hoisted and shared across all workspaces
- Individual workspace `node_modules` contain only symlinks to root packages
- Use `--filter` to target specific workspaces
- Use `-w` flag to add dependencies to the root workspace
- This setup provides better performance and reduces disk usage
