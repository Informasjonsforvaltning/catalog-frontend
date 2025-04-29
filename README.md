# Catalog Frontend

Monorepo powering the web frontend for all [registration solutions](https://catalog-portal.fellesdatakatalog.digdir.no/). Built with [NX](https://nx.dev/), it includes Next.js web applications (catalogs, portal and admin), resuable React UI components and other related libraries.

For a broader understanding of the system’s context, refer to the [architecture documentation](https://github.com/Informasjonsforvaltning/architecture-documentation) wiki. For more specific
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
