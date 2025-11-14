# NFC Experience

An interactive NFC-activated product experience web application with 3D models, scroll animations, and campaign-based theming.

## Tech Stack

- **Build Tool**: Vite 5+
- **Framework**: React 18+ with TypeScript
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **3D**: React Three Fiber + Drei
- **Animation**: Framer Motion, GSAP
- **Database**: Supabase
- **Internationalization**: react-i18next (EN/FR)

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## GitHub Actions CI/CD

This project uses GitHub Actions for automatic builds on every push and pull request.

### Setup GitHub Secrets

To enable automatic builds, add the following secrets to your GitHub repository:

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

### Workflow

The CI/CD pipeline (`.github/workflows/ci.yml`) automatically:
- Installs dependencies
- Runs ESLint
- Builds the project
- Uploads build artifacts (retained for 7 days)

## Project Structure

```
/Requirements/        - Project documentation
/src/
  /components/       - React components
  /pages/            - Route pages
  /lib/              - Utilities and helpers
  /assets/           - Static assets
    /models/         - 3D models (GLTF/GLB)
  /locales/          - Translation files
```

## URL Structure

```
/:lang/product/:BRAND?type=:type&cc=:cc&prd=:prd&uid=:uid
```

Example: `/en/product/IQOS?type=d&cc=101&prd=1001&uid=789456`

- `lang`: Language (en, fr)
- `BRAND`: Brand name (IQOS, VEEV, ZYN)
- `type`: Product type (d=device, f=flavour, a=accessory)
- `cc`: Campaign code (controls theme/colors)
- `prd`: Product code
- `uid`: Unique unit identifier

## Documentation

See `/Requirements/prd.md` for full product requirements and `CLAUDE.md` for development guidelines.

## License

Private project
