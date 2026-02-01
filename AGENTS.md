# AGENTS.md - Development Guide for AI Assistants

This document provides context and guidelines for AI agents working on the Ju Shop project.

## Project Overview

Ju Shop is a virtual cash desk emulator for children, built with React frontend and Flask backend. It supports HID barcode scanners and provides an educational shopping experience.

## Architecture

### Backend (`main.py`)
- **Framework**: Flask
- **Key Components**:
  - `LogoRotator` class: Manages logo rotation from `/static/logos/` directory
  - API endpoints:
    - `/api/next-logo` - Returns next logo image in rotation
    - `/api/upload` - Photo upload endpoint
    - `/api/random-photo` - Returns random photo from uploads
  - Serves React frontend build as static files
  - Supports dynamic base path via `BASE_PATH` environment variable

### Frontend (`frontend/`)
- **Framework**: React 18 with Material-UI
- **Build Tool**: Webpack
- **Key Components**:
  - `App.js` - Main application component
  - `CashControl.jsx` - Cash register interface (keyboard, order list, price display)
  - `Barcode.jsx` - HID barcode scanner integration using `react-barcode-reader`
  - `Keyboard.jsx` - On-screen numeric keyboard
  - `OrderList.jsx` - Displays list of orders
  - `ConfigSidebar.jsx` - Sidebar with configuration options

### Barcode Scanner
- Uses `react-barcode-reader` library for HID interface support
- Scanned barcodes are hashed to generate deterministic prices from a predefined array
- Shows confirmation dialog with price before adding to order

### Logo System
- Logos stored in `frontend/static/logos/`
- Backend `LogoRotator` class automatically discovers and rotates through all image files
- Frontend uses `/api/next-logo` endpoint to fetch logos
- Logo button in sidebar cycles through available logos

## Development Guidelines

### Code Style
- **Python**: Follow PEP 8, use type hints where helpful
- **JavaScript**: Use modern ES6+ syntax, functional components preferred
- **Components**: Keep components focused and reusable

### Key Patterns
- **State Management**: React hooks (useState, useEffect, useRef)
- **API Communication**: Direct fetch calls (no separate API client layer)
- **Styling**: Material-UI `sx` prop for component styling
- **Thread Safety**: Backend uses `threading.Lock` for logo rotation

### File Structure
```
jushop/
├── main.py                 # Flask backend server
├── requirements.txt        # Python dependencies
├── Dockerfile             # Multi-stage build (Node + Python)
├── compose.yml            # Docker Compose configuration
├── docker_entrypoint.sh   # Container entrypoint script
├── barcode_gen.py         # Utility to generate barcode sheets
└── frontend/
    ├── src/
    │   ├── App.js         # Main app component
    │   └── components/    # React components
    ├── static/
    │   └── logos/         # Shop logo images
    ├── package.json       # Node dependencies
    └── webpack.config.js  # Webpack configuration
```

### Important Notes

1. **Static Files**: Frontend build is served from Flask's static folder. Additional static files (like logos) are copied separately in Dockerfile.

2. **Base Path**: The app supports deployment under a subpath (e.g., `/shop`) via `BASE_PATH` environment variable. All routes and API endpoints respect this.

3. **Barcode Scanner**: Works with standard USB HID barcode scanners. The library captures keyboard input events from the scanner.

4. **Price Generation**: Barcode values are hashed to select from a predefined price array. This ensures consistent pricing for the same barcode.

5. **Logo Rotation**: Thread-safe rotation ensures concurrent requests don't cause race conditions.

6. **Development vs Production**: 
   - Development: Webpack dev server runs on port 3000, proxies API calls to Flask on port 80
   - Production: Single Flask server serves built React app

### Common Tasks

**Adding a new API endpoint:**
- Add route in `init_app()` function in `main.py`
- Ensure it respects `base_path` parameter
- Update frontend to call the endpoint if needed

**Modifying UI components:**
- Components are in `frontend/src/components/`
- Use Material-UI components and `sx` prop for styling
- State should be lifted to `App.js` if shared across components

**Adding logos:**
- Place image files in `frontend/static/logos/`
- Supported formats: PNG, JPG, JPEG, GIF, SVG, WEBP
- Logos are automatically discovered and rotated

**Testing barcode scanner:**
- Connect USB HID barcode scanner
- Ensure browser has focus (scanner acts as keyboard input)
- Scan barcodes to see price generation and order addition

### Environment Variables

- `BASE_PATH`: Optional base path for deployment (e.g., `/shop`). Defaults to `/` if not set.

### Dependencies

**Backend:**
- Flask 3.1.0
- Pillow (for image handling)
- python-barcode (for barcode generation utility)

**Frontend:**
- React 18.3.1
- Material-UI 6.x
- react-barcode-reader (HID scanner support)
- Webpack 5 for bundling

### CI/CD

**GitHub Actions Workflow** (`.github/workflows/docker-build.yml`):
- Automatically builds Docker image on push to main/master
- Publishes to GitHub Container Registry (ghcr.io)
- Uses Docker layer caching for faster builds
- Tags images with branch names, SHA, and semantic versions
- **Free Tier**: ✅ Available with 2,000 minutes/month for private repos, unlimited for public

**Package Visibility**: By default, packages are private. To make them public:
1. Go to repository → Packages
2. Click on the package
3. Package settings → Change visibility → Public

**Using the published image**:
```bash
docker pull ghcr.io/OWNER/REPO:latest
```
