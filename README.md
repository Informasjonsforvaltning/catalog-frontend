# Catalog Frontend

Monorepo powering the web frontend for all [registration solutions](https://catalog-portal.fellesdatakatalog.digdir.no/). Built with [NX](https://nx.dev/), it includes Next.js web applications (catalogs, portal and admin), reusable React UI components and other related libraries.

For a broader understanding of the system's context, refer to the [architecture documentation](https://github.com/Informasjonsforvaltning/architecture-documentation) wiki. For more specific
context on this application, see the [Registration](https://github.com/Informasjonsforvaltning/architecture-documentation/wiki/Architecture-documentation#registration) subsystem section.

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) >=20.11.1
- [yarn](https://yarnpkg.com/getting-started/install) >=1.22.19
- [Nx](https://nx.dev/getting-started/installation) >=15.10.0

### Running locally

Clone the repository:

```bash
git clone https://github.com/Informasjonsforvaltning/catalog-frontend.git --recurse-submodules
cd catalog-frontend
```

Create .env.local from .env.local.example

```bash
cp .env.local.example .env.local
```

Install dependencies:

```bash
corepack enable
yarn
```

Start the development server for concept-catalog app:

```bash
yarn start concept-catalog
```

Go to http://localhost:4200

> ⚠️ **Note:**
> Every catalog app requires a catalog id in the url path. When no catalog id is defined the user is redirected to
> the catalog portal app (https://catalog-portal.staging.fellesdatakatalog.digdir.no). Select your catalog and replace the domain
> with http://localhost:4200.

### Running E2E tests

We take dataset catalog as an example.

Make sure you have these variables in you .env.local:

```bash
E2E_KEYCLOAK_ID_DATASET_CATALOG_FRONTEND=xxxxx
E2E_KEYCLOAK_SECRET_DATASET_CATALOG_FRONTEND=xxxxx
E2E_NEXTAUTH_SECRET=xxxxx
```

Run the e2e tests:

```bash
yarn nx e2e dataset-catalog-e2e
```

Use the options `--ui` and `--debug` during test development.

## AI Agent Instructions

This repository includes instruction files for AI coding assistants:

- **CLAUDE.md** - Instructions for Claude Code (claude.ai/code)
- **AGENTS.md** - Instructions for other AI agents (Copilot, Cursor, etc.)

These files contain project structure, commands, architecture patterns, and coding conventions. Keep them updated when the project evolves.
