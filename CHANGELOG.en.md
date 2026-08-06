# Changelog

> [中文](CHANGELOG.md)

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)
and version numbers follow [Semantic Versioning](https://semver.org/lang/zh-CN/).

## [1.0.0] - 2025-11-26

### ✨ Features
- 🎯 Supports ultra-high-resolution screenshot export (up to 8K and beyond).
- 🧩 Implements tiled rendering to overcome GPU-memory limits.
- ⚡ Provides asynchronous processing to prevent UI freezing.
- 📊 Provides real-time progress feedback.
- 💧 Supports text and image watermarks.
- 🎨 Supports PNG, JPEG, and WebP export formats.
- 🎛️ Provides preset resolution options (1080p/4K/8K).
- 🔧 Supports custom resolutions (up to 16384×16384).
- 🎨 Provides an elegant Vue 3 + Element Plus UI.
- 🛠️ Restores shadow and camera state intelligently.

### 🔧 Implementation
- Uses Three.js to render 3D scenes.
- Uses the Vue 3 Composition API to build the UI.
- Uses Vite as the build tool.
- Implements camera viewport offset (`setViewOffset`) for tiled rendering.
- Uses the Canvas 2D context to stitch images and compose watermarks.

### 📝 Documentation
- Added a complete README.md.
- Added an MIT license.
- Added this changelog.

---

## [1.0.1] - 2025-12-02

### 🔧 Improvements
- 💡 **Enhanced watermark system**: added nine positioning options, tiled mode, and rotation support.
- 🛡️ **Stability improvements**: optimized tile-size limits (2048px) for better GPU compatibility.
- ⚡ **Performance optimization**: improved error handling and resource cleanup.
- 📝 **Documentation**: updated the README and added detailed watermark examples.

### 🐛 Fixes
- Fixed memory overflow during ultra-high-resolution export.
- Improved watermark rendering performance and visual quality.

---

## [1.0.2] - 2025-12-02

### 🔧 Improvements
- 📦 **Release**: created the first formal release.

### 🚀 Coming soon
- [ ] Support batch export.
- [ ] Support animation-frame export.
- [ ] Support more watermark-position options.
- [ ] Add export preview.
- [ ] Support saving/loading export configuration.
- [ ] Add more preset resolution options.

### 💡 Under consideration
- [ ] Support HDR export.
- [ ] Support transparent-background export.
- [ ] Add post-processing effects such as blur and sharpening.
- [ ] Support PDF export.
- [ ] Add a command-line tool.

---

**Legend**:
- `Added` means a new feature.
- `Changed` means a change to existing functionality.
- `Deprecated` means functionality scheduled for removal.
- `Removed` means removed functionality.
- `Fixed` means a bug fix.
- `Security` means a security-related fix.
