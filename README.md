# PetStay

PetStay is a responsive, owner-first pet care marketplace prototype. The current slice is dependency-free so it can be opened directly in a browser.

## Run locally

Open `index.html` in a browser, or serve the folder with any static file server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Docker deployment

The repository includes a production NGINX container for static hosting:

```bash
docker build -t petstay .
docker run --rm -p 8080:80 petstay
```

Then visit `http://localhost:8080`. Deployment providers that build from a `Dockerfile` can use the repository root directly; the container listens on port `80`.

## Current slice

- Owner dashboard with upcoming stays, appointments, and pet profiles
- Stay discovery cards with location search and saved-place interactions
- Booking review modal with dynamic stay totals
- Add-pet modal and lightweight toast notifications
- Responsive sidebar navigation for desktop and mobile
- Pet Digital ID workspace with QR privacy settings, medical records, and care rules

The production boundary and implementation sequence are documented in [docs/architecture.md](docs/architecture.md). The reserved Django service boundary is described in [backend/README.md](backend/README.md).