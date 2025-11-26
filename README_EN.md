# Three.js Industrial Screenshot Exporter

<div align="center">

A high-performance screenshot export tool for Three.js scenes, supporting ultra-high resolution rendering, custom watermarks, and multiple image formats.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Three.js](https://img.shields.io/badge/Three.js-0.164.1-blue.svg)](https://threejs.org/)
[![Vue](https://img.shields.io/badge/Vue-3.4.0-green.svg)](https://vuejs.org/)

[Live Demo](#) | [Features](#-features) | [Quick Start](#-quick-start)

[中文文档](README.md)

</div>

---

## ✨ Features

### 🎯 Core Features
- **🖼️ Ultra-High Resolution Export**: Support up to 8K (7680×4320) and even higher custom resolutions
- **🧩 Tiled Rendering**: Break through GPU memory limitations with automatic tile-based rendering and seamless stitching
- **⚡ Async Processing**: Prevent UI freezing with smooth user experience
- **📊 Real-time Progress**: Display real-time progress during export

### 🎨 Advanced Features
- **💧 Watermark Support**: 
  - Text watermarks (custom content, position, style)
  - Image watermarks (support logos, etc.)
  - Dynamic size adaptation
- **🎭 Multiple Export Formats**: 
  - PNG (lossless)
  - JPEG (high compression)
  - WebP (modern efficient format)
- **🎛️ Preset Resolutions**: 
  - 1080p (1920×1080)
  - 4K (3840×2160)
  - 8K (7680×4320)
  - Custom size (up to 16384×16384)

### 🛠️ Technical Highlights
- **Smart Shadow Handling**: Automatic ShadowMap updates for export quality
- **Camera View Offset**: Precise tiled rendering using `setViewOffset`
- **State Recovery**: Automatic restoration of original render state after export
- **Memory Optimization**: Tiled processing + active thread yielding to avoid memory overflow

---

## 🚀 Quick Start

### 📦 Install Dependencies

```bash
npm install
```

### 🏃 Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to view the demo.

### 🔨 Build for Production

```bash
npm run build
```

---

## 📖 Usage

### Basic Usage

```javascript
import { ScreenshotManager } from './ScreenshotManager.js';

const screenshotManager = new ScreenshotManager(renderer);

// Capture scene
const blob = await screenshotManager.capture(scene, camera, {
  width: 3840,
  height: 2160,
  format: 'image/png',
  quality: 0.95
});

// Download image
const url = URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = url;
link.download = 'screenshot.png';
link.click();
```

### Adding Watermarks

```javascript
const blob = await screenshotManager.capture(scene, camera, {
  width: 3840,
  height: 2160,
  format: 'image/png',
  watermark: {
    text: 'My Work',
    fontSize: 48,
    color: 'rgba(255, 255, 255, 0.8)',
    position: 'bottom-right',
    // Optional: add image watermark
    image: logoImage,
    scale: 0.1
  }
});
```

### Progress Callback

```javascript
const blob = await screenshotManager.capture(scene, camera, {
  width: 7680,
  height: 4320,
  onProgress: (progress) => {
    console.log(`Export progress: ${Math.round(progress * 100)}%`);
  }
});
```

---

## 🏗️ Project Structure

```
.
├── main.js                    # Three.js scene initialization
├── ScreenshotManager.js       # Core screenshot engine
├── ExportImageDialog.vue      # Export settings UI component
├── App.vue                    # Vue root component
├── main-ui.js                 # Vue app entry
├── index.html                 # HTML entry
├── vite.config.js             # Vite configuration
└── package.json               # Project dependencies
```

---

## 🔧 Tech Stack

- **Three.js** `^0.164.1` - 3D rendering engine
- **Vue 3** `^3.4.0` - Progressive frontend framework
- **Element Plus** `^2.8.0` - Vue 3 UI component library
- **Vite** `^5.0.0` - Next generation frontend build tool

---

## 📸 Screenshots

> To be added: Project screenshots and export examples

---

## 🎯 Core Principles

### Tiled Rendering

When export resolution exceeds GPU texture size limits, tiled rendering is used:

1. **Calculate Tiles**: Divide target image into smaller tiles based on `maxTextureSize`
2. **Camera Offset**: Render each tile using `camera.setViewOffset()`
3. **Canvas Stitching**: Draw tiles onto final Canvas
4. **State Recovery**: Restore original render state after export

```javascript
// Core code snippet
camera.setViewOffset(
  fullWidth,      // Full image width
  fullHeight,     // Full image height
  offsetX,        // Current tile X offset
  offsetY,        // Current tile Y offset
  tileWidth,      // Current tile width
  tileHeight      // Current tile height
);
```

---

## 🤝 Contributing

Issues and Pull Requests are welcome!

1. Fork this repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

## 📝 Changelog

### v1.0.0 (2025-11-26)
- ✨ Initial release
- 🎯 Support ultra-high resolution export
- 💧 Support text and image watermarks
- 🎨 Elegant UI interface

See [CHANGELOG.md](CHANGELOG.md) for full history.

---

## 📄 License

This project is licensed under the [MIT](LICENSE) License.

---

## 👨‍💻 Author

**CHENJIAMIAN**

Feel free to contact via Issues for questions or suggestions!

---

## 🙏 Acknowledgments

- [Three.js](https://threejs.org/) - Powerful 3D rendering library
- [Element Plus](https://element-plus.org/) - Excellent Vue 3 component library
- All developers contributing to the open source community

---

<div align="center">

**If this project helps you, please give it a ⭐ Star!**

Made with ❤️ by CHENJIAMIAN

</div>
