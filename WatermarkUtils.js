/**
 * 绘制水印的通用工具函数
 * @param {CanvasRenderingContext2D} ctx 
 * @param {number} width 
 * @param {number} height 
 * @param {Object} config 
 */
export async function drawWatermark(ctx, width, height, config) {
    const padding = Math.max(20, width * 0.02); // 动态边距

    // 保存当前状态
    ctx.save();

    const drawSingleWatermark = (x, y) => {
        ctx.save();
        ctx.translate(x, y);
        if (config.angle) {
            ctx.rotate((config.angle * Math.PI) / 180);
        }
        ctx.globalAlpha = config.opacity || 1;

        // 1. 图片水印
        if (config.image) {
            try {
                const img = config.image;
                // 基础大小为宽度的 15%，然后应用用户的缩放倍数
                const baseW = width * 0.15;
                const w = baseW * (config.scale || 1);
                const h = w * (img.naturalHeight / img.naturalWidth);
                // 居中绘制以便旋转
                ctx.drawImage(img, -w / 2, -h / 2, w, h);
            } catch (e) {
                console.warn("[截图] 水印图片绘制失败:", e);
            }
        }

        // 2. 文字水印
        if (config.text) {
            // 使用 config.fontSize 如果存在，否则使用默认计算
            const fontSize = config.fontSize || Math.floor(width * 0.03);
            ctx.font = config.font || `bold ${fontSize}px "Microsoft YaHei", Arial, sans-serif`;
            ctx.fillStyle = config.color || 'rgba(255, 255, 255, 0.6)';
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            ctx.fillText(config.text, 0, 0);
        }
        ctx.restore();
    };

    if (config.repetition) {
        // 平铺模式：基于spacing动态计算网格，确保全屏覆盖且间距可调
        const spacing = config.spacing || (width / 3); // 默认匹配原3x3效果
        const cols = Math.max(2, Math.floor((width - 2 * padding) / spacing) + 1);
        const rows = Math.max(2, Math.floor((height - 2 * padding) / spacing) + 1);
        const stepX = cols > 1 ? (width - 2 * padding) / (cols - 1) : width / 2;
        const stepY = rows > 1 ? (height - 2 * padding) / (rows - 1) : height / 2;

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                const x = padding + i * stepX;
                const y = padding + j * stepY;
                drawSingleWatermark(x, y);
            }
        }
    } else {
        // 单个模式 - 使用固定的百分比位置，确保预览和导出时位置一致
        const margin = 0.05; // 使用5%的边距
        let x, y;

        // 支持9个位置的水印定位（基于百分比，不依赖水印尺寸）
        if (config.position === 'top-left') {
            x = width * margin;
            y = height * margin;
        }
        else if (config.position === 'top-center') {
            x = width * 0.5;
            y = height * margin;
        }
        else if (config.position === 'top-right') {
            x = width * (1 - margin);
            y = height * margin;
        }
        else if (config.position === 'center-left') {
            x = width * margin;
            y = height * 0.5;
        }
        else if (config.position === 'center') {
            x = width * 0.5;
            y = height * 0.5;
        }
        else if (config.position === 'center-right') {
            x = width * (1 - margin);
            y = height * 0.5;
        }
        else if (config.position === 'bottom-left') {
            x = width * margin;
            y = height * (1 - margin);
        }
        else if (config.position === 'bottom-center') {
            x = width * 0.5;
            y = height * (1 - margin);
        }
        else { // 'bottom-right' 或默认
            x = width * (1 - margin);
            y = height * (1 - margin);
        }

        drawSingleWatermark(x, y);
    }

    ctx.restore();
}
