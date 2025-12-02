import * as THREE from 'three';
import { drawWatermark } from './WatermarkUtils.js';

/**
 * 工业级截图管理器
 * 支持：
 * 1. 超高分辨率分块渲染 (Tiled Rendering)，突破显存限制
 * 2. 异步处理，防止 UI 卡死
 * 3. 进度回调
 * 4. 水印合成 (图片/文字)
 * 5. 自动处理 ShadowMap 更新
 */
export class ScreenshotManager {
    constructor(renderer) {
        this.renderer = renderer;
    }

    /**
     * 捕获场景
     * @param {THREE.Scene} scene 
     * @param {THREE.Camera} camera 
     * @param {Object} options 配置项
     * @returns {Promise<Blob>}
     */
    async capture(renderer, scene, camera, options = {}) {
        this.renderer = renderer;
        this.maxTextureSize = renderer.capabilities.maxTextureSize || 4096;
        // 限制单块最大尺寸，留出显存余量，防止崩溃
        this.tileSize = Math.min(this.maxTextureSize, 2048);
        const {
            width = 1920,
            height = 1080,
            format = 'image/png',
            quality = 0.9,
            watermark = null, // Now expects { textWatermark: {...}, imageWatermark: {...} }
            onProgress = null // (progress: number) => void
        } = options;

        console.log(`[截图] 开始导出: ${width}x${height}`);

        // 1. 保存原始状态
        const originalSize = new THREE.Vector2();
        this.renderer.getSize(originalSize);
        const originalPixelRatio = this.renderer.getPixelRatio();
        const originalAspect = camera.aspect;
        const originalShadowMapType = this.renderer.shadowMap.type;

        // 保存相机视口偏移状态
        const originalViewOffset = {
            enabled: camera.view !== null,
            fullWidth: camera.view ? camera.view.fullWidth : 1,
            fullHeight: camera.view ? camera.view.fullHeight : 1,
            offsetX: camera.view ? camera.view.offsetX : 0,
            offsetY: camera.view ? camera.view.offsetY : 0,
            width: camera.view ? camera.view.width : 1,
            height: camera.view ? camera.view.height : 1
        };

        // 2. 准备合成画布
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // 3. 计算分块
        const tilesX = Math.ceil(width / this.tileSize);
        const tilesY = Math.ceil(height / this.tileSize);
        const totalTiles = tilesX * tilesY;

        console.log(`[截图] 分块策略: ${tilesX}x${tilesY}, 单块尺寸限制: ${this.tileSize}`);

        try {
            // 锁定渲染器设置
            this.renderer.setPixelRatio(1); // 导出时强制 1:1 物理像素

            // 优化：临时提升阴影质量 (可选，视需求开启)
            // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; 

            let processedTiles = 0;

            for (let y = 0; y < tilesY; y++) {
                for (let x = 0; x < tilesX; x++) {
                    // 计算当前块的实际尺寸
                    // 最后一个块可能小于 tileSize
                    const currentTileWidth = Math.min(this.tileSize, width - x * this.tileSize);
                    const currentTileHeight = Math.min(this.tileSize, height - y * this.tileSize);

                    // 设置渲染器大小
                    this.renderer.setSize(currentTileWidth, currentTileHeight, false); // false = 不更新 canvas style

                    // 设置相机偏移 (核心逻辑)
                    // setViewOffset(fullWidth, fullHeight, x, y, width, height)
                    camera.setViewOffset(
                        width,
                        height,
                        x * this.tileSize,
                        y * this.tileSize,
                        currentTileWidth,
                        currentTileHeight
                    );

                    // 渲染
                    this.renderer.render(scene, camera);

                    // 将 WebGL 画布内容绘制到 2D 上下文
                    // 注意：drawImage 坐标系原点在左上角
                    ctx.drawImage(
                        this.renderer.domElement,
                        x * this.tileSize,
                        y * this.tileSize
                    );

                    processedTiles++;
                    if (onProgress) {
                        onProgress(processedTiles / totalTiles);
                    }

                    // 关键：让出主线程，防止 UI 假死
                    await new Promise(resolve => setTimeout(resolve, 10));
                }
            }

            // 4. 绘制水印
            if (watermark) {
                console.log('[DEBUG] ScreenshotManager 开始绘制水印, watermark配置:', watermark)
                console.log('[DEBUG] 图片水印详细状态:', watermark.imageWatermark)
                await this._drawWatermark(ctx, width, height, watermark);
            }

            // 5. 生成 Blob
            return new Promise((resolve, reject) => {
                canvas.toBlob((blob) => {
                    if (blob) {
                        console.log(`[截图] 导出成功, 大小: ${(blob.size / 1024 / 1024).toFixed(2)}MB`);
                        resolve(blob);
                    } else {
                        reject(new Error("Canvas toBlob failed"));
                    }
                }, format, quality);
            });

        } catch (error) {
            console.error("[截图] 导出过程中出错:", error);
            throw error;
        } finally {
            // 6. 恢复原始状态
            this.renderer.setPixelRatio(originalPixelRatio);
            this.renderer.setSize(originalSize.x, originalSize.y, true);

            if (originalViewOffset.enabled) {
                camera.setViewOffset(
                    originalViewOffset.fullWidth,
                    originalViewOffset.fullHeight,
                    originalViewOffset.offsetX,
                    originalViewOffset.offsetY,
                    originalViewOffset.width,
                    originalViewOffset.height
                );
            } else {
                camera.clearViewOffset();
            }

            camera.updateProjectionMatrix();

            // 重新渲染一帧，避免屏幕闪烁或黑屏
            this.renderer.render(scene, camera);

            // 清理临时 Canvas (虽然 JS 有 GC，但手动置空是个好习惯)
            // canvas = null; 
        }
    }

    /**
     * 内部方法：绘制水印
     */
    async _drawWatermark(ctx, width, height, config) {
        await drawWatermark(ctx, width, height, config);
    }
}
