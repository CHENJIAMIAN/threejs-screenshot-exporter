/**
 * 绘制水印的通用工具函数
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} width
 * @param {number} height
 * @param {Object} config - Now contains textWatermark and imageWatermark objects
 */
export async function drawWatermark(ctx, width, height, config) {
    console.log("[DEBUG] drawWatermark 开始绘制水印")
    console.log("[DEBUG] 画布尺寸:", width, "x", height)
    console.log("[DEBUG] 配置:", config)
    
    const padding = Math.max(20, width * 0.02); // 动态边距

    // 公共位置计算函数，避免重复代码
    const calculatePosition = (position, width, height, margin = 0.05) => {
        let x, y;
        
        // 支持9个位置的水印定位（基于百分比，不依赖水印尺寸）
        if (position === 'top-left') {
            x = width * margin;
            y = height * margin;
        }
        else if (position === 'top-center') {
            x = width * 0.5;
            y = height * margin;
        }
        else if (position === 'top-right') {
            x = width * (1 - margin);
            y = height * margin;
        }
        else if (position === 'center-left') {
            x = width * margin;
            y = height * 0.5;
        }
        else if (position === 'center') {
            x = width * 0.5;
            y = height * 0.5;
        }
        else if (position === 'center-right') {
            x = width * (1 - margin);
            y = height * 0.5;
        }
        else if (position === 'bottom-left') {
            x = width * margin;
            y = height * (1 - margin);
        }
        else if (position === 'bottom-center') {
            x = width * 0.5;
            y = height * (1 - margin);
        }
        else { // 'bottom-right' 或默认
            x = width * (1 - margin);
            y = height * (1 - margin);
        }
        
        return { x, y };
    };

    // 保存当前状态
    ctx.save();

    const drawSingleWatermark = (x, y, watermarkConfig) => {
        ctx.save();
        ctx.translate(x, y);
        if (watermarkConfig.angle) {
            ctx.rotate((watermarkConfig.angle * Math.PI) / 180);
        }
        ctx.globalAlpha = watermarkConfig.opacity || 1;

        // 1. 图片水印
        if (watermarkConfig.image) {
            try {
                console.log("[DEBUG] 开始绘制图片水印:", watermarkConfig.image)
                const img = watermarkConfig.image;
                console.log("[DEBUG] 图片原始尺寸:", img.naturalWidth, "x", img.naturalHeight)
                
                // 检查图片是否加载成功
                if (!img.complete || img.naturalWidth === 0 || img.naturalHeight === 0) {
                    console.warn("[截图] 水印图片未加载完成，跳过绘制");
                    return;
                }
                
                // 基础大小为宽度的 15%，然后应用用户的缩放倍数
                const baseW = width * 0.15;
                const w = baseW * (watermarkConfig.scale || 1);
                const h = w * (img.naturalHeight / img.naturalWidth);
                console.log("[DEBUG] 计算后的绘制尺寸:", w, "x", h)
                
                // 居中绘制以便旋转
                ctx.drawImage(img, -w / 2, -h / 2, w, h);
                console.log("[DEBUG] 图片水印绘制完成")
            } catch (e) {
                console.error("[截图] 水印图片绘制失败:", e);
            }
        }

        // 2. 文字水印
        if (watermarkConfig.text) {
            // 使用 watermarkConfig.fontSize 如果存在，否则使用默认计算
            const fontSize = watermarkConfig.fontSize || Math.floor(width * 0.03);
            ctx.font = watermarkConfig.font || `bold ${fontSize}px "Microsoft YaHei", Arial, sans-serif`;
            ctx.fillStyle = watermarkConfig.color || 'rgba(255, 255, 255, 0.6)';
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            ctx.fillText(watermarkConfig.text, 0, 0);
        }
        ctx.restore();
    };

    // Handle text watermark if enabled
    if (config.textWatermark && config.textWatermark.enabled && config.textWatermark.text) {
        const textConfig = config.textWatermark;

        if (textConfig.repetition) {
            // 平铺模式：基于spacing动态计算网格，确保全屏覆盖且间距可调
            const spacing = textConfig.spacing || (width / 3); // 默认匹配原3x3效果
            const cols = Math.max(2, Math.floor((width - 2 * padding) / spacing) + 1);
            const rows = Math.max(2, Math.floor((height - 2 * padding) / spacing) + 1);
            const stepX = cols > 1 ? (width - 2 * padding) / (cols - 1) : width / 2;
            const stepY = rows > 1 ? (height - 2 * padding) / (rows - 1) : height / 2;

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const x = padding + i * stepX;
                    const y = padding + j * stepY;
                    drawSingleWatermark(x, y, textConfig);
                }
            }
        } else {
            // 单个模式 - 使用公共位置计算函数
            const { x, y } = calculatePosition(textConfig.position, width, height);
            drawSingleWatermark(x, y, textConfig);
        }
    }

    // Handle image watermark if enabled
    if (config.imageWatermark && config.imageWatermark.enabled && config.imageWatermark.image) {
        console.log("[DEBUG] 检测到图片水印配置:", config.imageWatermark)
        console.log("[DEBUG] 图片对象详细信息:")
        console.log("  - image对象:", config.imageWatermark.image)
        console.log("  - complete:", config.imageWatermark.image.complete)
        console.log("  - naturalWidth:", config.imageWatermark.image.naturalWidth)
        console.log("  - naturalHeight:", config.imageWatermark.image.naturalHeight)
        console.log("  - src:", config.imageWatermark.image.src)
        const imageConfig = config.imageWatermark;

        if (imageConfig.repetition) {
            // 平铺模式：基于spacing动态计算网格，确保全屏覆盖且间距可调
            const spacing = imageConfig.spacing || (width / 3); // 默认匹配原3x3效果
            const cols = Math.max(2, Math.floor((width - 2 * padding) / spacing) + 1);
            const rows = Math.max(2, Math.floor((height - 2 * padding) / spacing) + 1);
            const stepX = cols > 1 ? (width - 2 * padding) / (cols - 1) : width / 2;
            const stepY = rows > 1 ? (height - 2 * padding) / (rows - 1) : height / 2;

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const x = padding + i * stepX;
                    const y = padding + j * stepY;
                    drawSingleWatermark(x, y, imageConfig);
                }
            }
        } else {
            // 单个模式 - 使用公共位置计算函数
            const { x, y } = calculatePosition(imageConfig.position, width, height);
            drawSingleWatermark(x, y, imageConfig);
        }
    }

    ctx.restore();
    console.log("[DEBUG] drawWatermark 绘制完成")
}
