[English](./README.en.md)

<!-- codex-github-rules:bilingual-summary -->
> **中文简介**：基于 Three.js 的高性能场景截图导出工具，支持超高分辨率、水印和多种格式
>
> **English summary**: A high-performance Three.js scene screenshot exporter with ultra-high resolution, watermarks, and multiple formats

---
# Three.js 工业级高清截图导出工具

<div align="center">

一个基于 Three.js 的高性能场景截图导出工具,支持超高分辨率渲染、自定义水印和多种图片格式。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Three.js](https://img.shields.io/badge/Three.js-0.164.1-blue.svg)](https://threejs.org/)
[![Vue](https://img.shields.io/badge/Vue-3.4.0-green.svg)](https://vuejs.org/)
[![Deploy to GitHub Pages](https://github.com/CHENJIAMIAN/threejs-screenshot-exporter/actions/workflows/deploy.yml/badge.svg)](https://github.com/CHENJIAMIAN/threejs-screenshot-exporter/actions/workflows/deploy.yml)

[🚀 在线演示](https://chenjiamian.github.io/threejs-screenshot-exporter/) | [功能特性](#功能特性) | [快速开始](#快速开始) | [📖 部署指南](DEPLOY.md)

</div>

---

## ✨ 功能特性

### 🎯 核心功能
- **🖼️ 超高分辨率导出**: 支持最高 8K (7680×4320) 分辨率,甚至更高的自定义尺寸
- **🧩 分块渲染技术**: 突破 GPU 显存限制,自动将大图分块渲染后无缝拼接
- **⚡ 异步处理**: 防止 UI 卡死,提供流畅的用户体验
- **📊 实时进度反馈**: 导出过程中显示实时进度

### 🎨 高级特性
- **💧 增强水印系统**: 
  - **文字水印**: 自定义内容、9种位置选项、字体样式、颜色、透明度
  - **图片水印**: 支持 Logo 等，支持缩放、透明度、旋转角度
  - **平铺模式**: 全屏平铺水印，支持自定义间距
  - **动态适配**: 根据分辨率自动调整水印尺寸
- **🎭 多格式导出**: 
  - PNG (无损压缩)
  - JPEG (高压缩比)
  - WebP (现代高效格式)
- **🎛️ 灵活分辨率**: 
  - 预设分辨率: 1080p (1920×1080)、4K (3840×2160)、8K (7680×4320)
  - 自定义尺寸 (最高 16384×16384)
  - 智能分块渲染，突破 GPU 显存限制

### 🛠️ 技术亮点
- **🚀 稳定分块渲染**: 智能限制单块最大尺寸(2048px),确保GPU稳定性
- **🎯 精确视口控制**: 使用 `setViewOffset` 实现像素级精确的分块渲染
- **🔄 完整状态管理**: 导出前后自动保存/恢复所有渲染状态
- **⚡ 异步非阻塞**: 分块处理+线程让出,保证UI流畅性
- **🛡️ 错误恢复机制**: 完善的异常处理和资源清理
- **📊 实时进度反馈**: 支持进度回调,提供导出进度可视化

---

## 🚀 快速开始

### 📦 安装依赖

```bash
npm install
```

### 🏃 运行开发服务器

```bash
npm run dev
```

访问 `http://localhost:5173` 查看演示。

### 🔨 构建生产版本

```bash
npm run build
```

### 🌐 部署到 GitHub Pages

项目已配置自动部署,只需推送到 main 分支:

```bash
git add .
git commit -m "更新内容"
git push origin main
```

部署完成后访问: https://chenjiamian.github.io/threejs-screenshot-exporter/

详细部署说明请查看 [DEPLOY.md](DEPLOY.md)

---

## 📖 使用方法

### 基础用法

```javascript
import { ScreenshotManager } from './ScreenshotManager.js';

const screenshotManager = new ScreenshotManager();

// 捕获场景
const blob = await screenshotManager.capture(renderer, scene, camera, {
  width: 3840,
  height: 2160,
  format: 'image/png',
  quality: 0.95
});

// 下载图片
const url = URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = url;
link.download = 'screenshot.png';
link.click();
```

### 高级水印功能

#### 1. 文字水印
```javascript
const blob = await screenshotManager.capture(renderer, scene, camera, {
  width: 3840,
  height: 2160,
  format: 'image/png',
  watermark: {
    textWatermark: {
      enabled: true,
      text: '我的作品',
      fontSize: 48,
      color: 'rgba(255, 255, 255, 0.8)',
      position: 'bottom-right', // 支持9种位置
      angle: 15, // 旋转角度
      opacity: 0.8 // 透明度
    }
  }
});
```

#### 2. 图片水印
```javascript
const blob = await screenshotManager.capture(renderer, scene, camera, {
  width: 3840,
  height: 2160,
  format: 'image/png',
  watermark: {
    imageWatermark: {
      enabled: true,
      image: logoImage,
      position: 'top-left',
      zoom: 1.2, // 缩放倍数
      opacity: 0.7,
      angle: -10 // 逆时针旋转
    }
  }
});
```

#### 3. 平铺水印（背景水印）
```javascript
const blob = await screenshotManager.capture(renderer, scene, camera, {
  width: 3840,
  height: 2160,
  format: 'image/png',
  watermark: {
    textWatermark: {
      enabled: true,
      text: '© 2025 版权保护',
      repetition: true, // 开启平铺模式
      spacing: 300, // 水印间距
      fontSize: 36,
      color: 'rgba(255, 255, 255, 0.3)',
      angle: 45
    }
  }
});
```

#### 4. 混合水印
```javascript
const blob = await screenshotManager.capture(renderer, scene, camera, {
  width: 7680,
  height: 4320,
  format: 'image/png',
  watermark: {
    // 背景平铺文字水印
    textWatermark: {
      enabled: true,
      text: 'CONFIDENTIAL',
      repetition: true,
      spacing: 400,
      fontSize: 48,
      color: 'rgba(255, 0, 0, 0.2)',
      angle: 30
    },
    // 右下角Logo
    imageWatermark: {
      enabled: true,
      image: companyLogo,
      position: 'bottom-right',
      zoom: 0.8,
      opacity: 0.9
    }
  }
});
```

### 进度回调

```javascript
const blob = await screenshotManager.capture(renderer, scene, camera, {
  width: 7680,
  height: 4320,
  onProgress: (progress) => {
    console.log(`导出进度: ${Math.round(progress * 100)}%`);
  }
});
```

---

## 🏗️ 项目结构

```
.
├── main.js                    # Three.js 场景初始化
├── ScreenshotManager.js       # 核心截图引擎
├── ExportImageDialog.vue      # 导出设置 UI 组件
├── App.vue                    # Vue 根组件
├── main-ui.js                 # Vue 应用入口
├── index.html                 # HTML 入口
├── vite.config.js             # Vite 配置
└── package.json               # 项目依赖
```

---

## 🔧 技术栈

- **Three.js** `^0.164.1` - 3D 渲染引擎
- **Vue 3** `^3.4.0` - 渐进式前端框架
- **Element Plus** `^2.8.0` - Vue 3 UI 组件库
- **Vite** `^5.0.0` - 下一代前端构建工具

---

## 📸 截图示例

> 待添加:项目运行截图和导出效果示例

---

## 🎯 核心原理

### 分块渲染 (Tiled Rendering)

当导出分辨率超过 GPU 纹理尺寸限制时,使用分块渲染技术:

1. **计算分块**: 根据 `maxTextureSize` 将目标图片分成多个小块
2. **相机偏移**: 使用 `camera.setViewOffset()` 渲染每个分块
3. **Canvas 拼接**: 将各分块绘制到最终 Canvas 上
4. **状态恢复**: 导出完成后恢复原始渲染状态

```javascript
// 核心代码片段
camera.setViewOffset(
  fullWidth,      // 完整图片宽度
  fullHeight,     // 完整图片高度
  offsetX,        // 当前块 X 偏移
  offsetY,        // 当前块 Y 偏移
  tileWidth,      // 当前块宽度
  tileHeight      // 当前块高度
);
```

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request!

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 📝 更新日志

### v1.0.1 (2025-12-02)
- 💡 增强水印系统：新增9种定位选项、平铺模式、旋转角度支持
- 🛡️ 稳定性提升：优化分块尺寸限制，提升GPU兼容性
- ⚡ 性能优化：改进错误处理和资源清理机制
- 📝 文档完善：更新README，添加详细的水印使用示例

### v1.0.0 (2025-11-26)
- ✨ 初始版本发布
- 🎯 支持超高分辨率导出
- 💧 支持文字和图片水印
- 🎨 优雅的 UI 交互界面

---

## 📄 许可证

本项目采用 [MIT](LICENSE) 许可证。

---

## 👨‍💻 作者

**CHENJIAMIAN**

如有问题或建议,欢迎通过 Issue 联系!

---

## 🙏 致谢

- [Three.js](https://threejs.org/) - 强大的 3D 渲染库
- [Element Plus](https://element-plus.org/) - 优秀的 Vue 3 组件库
- 所有为开源社区做出贡献的开发者们

---

<div align="center">

**如果这个项目对你有帮助,请给一个 ⭐ Star!**

Made with ❤️ by CHENJIAMIAN

</div>
