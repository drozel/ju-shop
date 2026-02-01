# Ju Shop - Virtual Cash Desk Emulator for Kids

A fun, interactive virtual cash register application designed for children. Features barcode scanner support and an intuitive interface for learning about shopping and money.

## Quick Start

### Using Docker (Recommended)

```bash
docker-compose up --build
```

The app will be available at `http://localhost:8087`

### Manual Setup

1. **Build Frontend:**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Run Backend:**
   ```bash
   pip install -r requirements.txt
   python main.py -f frontend/build
   ```

## Features

- 🛒 **Barcode Scanner Support** - Works with USB HID barcode scanners
- ⌨️ **On-Screen Keyboard** - Manual price entry
- 📋 **Order List** - Track multiple items
- 🏪 **Shop Logo Rotation** - Customize logos in `frontend/static/logos/`
- 💰 **Price Display** - Large, easy-to-read currency display

## Usage

1. **Scan Items**: Connect a USB barcode scanner and scan barcodes. Each scan generates a random price and adds it to the order list.
2. **Manual Entry**: Use the on-screen keyboard to enter prices manually.
3. **Add Orders**: Press Enter to add the displayed price to the order list.
4. **Change Logo**: Click the shop icon in the sidebar to cycle through available logos.

## Customization

- **Add Logos**: Place image files (PNG, JPG, etc.) in `frontend/static/logos/`
- **Port**: Change the port mapping in `compose.yml` (default: 8087)
- **Base Path**: Set `BASE_PATH` environment variable for subpath deployment

## Requirements

- Docker & Docker Compose (for containerized setup)
- Node.js 18+ and Python 3.12+ (for manual setup)
