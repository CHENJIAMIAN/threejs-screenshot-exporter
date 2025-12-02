<template>
  <el-dialog
    v-model="visible"
    title="导出设置"
    width="480px"
    :close-on-click-modal="false"
    class="export-dialog-ux"
    destroy-on-close
    append-to-body
  >
    <el-form
      ref="formRef"
      :model="form"
      label-position="top"
      hide-required-asterisk
    >
      <!-- 分组1:基础图像设置 -->
      <el-card shadow="never" class="setting-card">
        <template #header>
          <div class="card-header">
            <span>基础图像设置</span>
          </div>
        </template>
        
        <el-row :gutter="20">
          <el-col :span="24">
             <el-form-item label="分辨率">
              <el-select v-model="form.resolutionPreset" placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="item in resolutionOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                  <span style="float: left">{{ item.label.split(' ')[0] }}</span>
                  <span style="float: right; color: var(--el-text-color-secondary); font-size: 13px;">
                    {{ item.label.split(' ')[1] ? item.label.split(' (')[1].replace(')', '') : '' }}
                  </span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 自定义分辨率输入,使用折叠动画过渡 -->
        <el-collapse-transition>
          <div v-if="form.resolutionPreset === 'custom'" class="custom-res-container">
             <el-form-item label="自定义尺寸 (像素)" style="margin-bottom: 0;">
              <div class="flex-row custom-inputs">
                <el-input-number
                  v-model="form.customWidth" :min="1" :max="16384"
                  controls-position="right" placeholder="宽度" style="flex: 1"
                />
                <el-icon class="separator-icon"><CloseBold /></el-icon>
                <el-input-number
                  v-model="form.customHeight" :min="1" :max="16384"
                  controls-position="right" placeholder="高度" style="flex: 1"
                />
              </div>
            </el-form-item>
          </div>
        </el-collapse-transition>
        
        <el-form-item label="目标格式" style="margin-top: 18px;">
          <!-- UX优化:使用按钮组代替下拉框,选项直接可见 -->
          <el-radio-group v-model="form.format" class="target-format-group" style="width: 100%; display: flex;">
            <el-radio-button label="image/png" style="flex: 1;">PNG (无损)</el-radio-button>
            <el-radio-button label="image/jpeg" style="flex: 1;">JPEG (压缩)</el-radio-button>
            <el-radio-button label="image/webp" style="flex: 1;">WebP (高效)</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-card>

      <!-- 分组2:水印选项 -->
      <el-card shadow="never" class="setting-card" style="margin-top: 16px;">
        <!-- 文字水印组 -->
          <!-- UX优化:使用 Switch 开关代替复选框,头部整合在一行 -->
        <div class="switch-header-row">
          <span class="switch-label">启用文字水印</span>
          <el-switch v-model="form.textWatermark.enabled" />
        </div>
        <el-collapse-transition>
          <div v-if="form.textWatermark.enabled" class="watermark-group" style="margin-top: 16px;">
            <el-form-item label="水印内容文字">
              <el-input
                v-model="form.textWatermark.text"
                placeholder="请输入将在画面中显示的水印文字"
                clearable
                :prefix-icon="EditPen"
              />
            </el-form-item>

            <el-row :gutter="20">
                <el-col :span="12">
                     <el-form-item label="水印颜色">
                        <el-color-picker v-model="form.textWatermark.color" show-alpha />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                     <el-form-item label="全屏平铺">
                        <el-switch v-model="form.textWatermark.repetition" />
                    </el-form-item>
                </el-col>
            </el-row>

            <!-- 新增：平铺间距控件，仅全屏平铺时显示 -->
            <el-collapse-transition>
              <div v-if="form.textWatermark.repetition">
                <el-form-item label="平铺间距 (像素)">
                  <el-slider 
                    v-model="form.textWatermark.spacing" 
                    :min="50" 
                    :max="2000" 
                    :step="10" 
                    show-input 
                  />
                </el-form-item>
              </div>
            </el-collapse-transition>



            <!-- 水印位置配置（仅在关闭全屏平铺时显示） -->
            <el-collapse-transition>
              <div v-if="!form.textWatermark.repetition">
                <el-form-item label="水印位置">
                  <el-radio-group v-model="form.textWatermark.position" style="width: 100%;">
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
                      <el-radio-button label="top-left">左上</el-radio-button>
                      <el-radio-button label="top-center">居中上</el-radio-button>
                      <el-radio-button label="top-right">右上</el-radio-button>
                      <el-radio-button label="center-left">左中</el-radio-button>
                      <el-radio-button label="center">正中</el-radio-button>
                      <el-radio-button label="center-right">右中</el-radio-button>
                      <el-radio-button label="bottom-left">左下</el-radio-button>
                      <el-radio-button label="bottom-center">居中下</el-radio-button>
                      <el-radio-button label="bottom-right">右下</el-radio-button>
                    </div>
                  </el-radio-group>
                </el-form-item>
              </div>
            </el-collapse-transition>

            <el-form-item label="旋转角度">
                <el-slider v-model="form.textWatermark.angle" :min="-180" :max="180" :marks="{0:'0°', 90:'90°', '-90':'-90°'}" />
            </el-form-item>

            <el-form-item label="字体大小">
                 <el-slider v-model="form.textWatermark.fontSize" :min="12" :max="200" show-input />
            </el-form-item>
          </div>
        </el-collapse-transition>

        <!-- 图片水印组 -->
          <!-- UX优化:使用 Switch 开关代替复选框,头部整合在一行 -->
        <div class="switch-header-row">
          <span class="switch-label">启用图片水印</span>
          <el-switch v-model="form.imageWatermark.enabled" />
        </div>
        <el-collapse-transition>
          <div v-if="form.imageWatermark.enabled" class="watermark-group" style="margin-top: 16px;">
            <el-form-item label="水印图片">
              <div class="watermark-upload-container">
                <el-upload
                  class="watermark-upload"
                  :auto-upload="false"
                  :show-file-list="false"
                  @change="handleImageUpload"
                  accept=".jpg,.jpeg,.png,.bmp"
                >
                  <el-button size="small" type="primary">
                    {{ form.imageWatermark.imageUrl ? '重新上传' : '上传图片' }}
                  </el-button>
                </el-upload>
                <el-button 
                  v-if="form.imageWatermark.imageUrl" 
                  size="small" 
                  type="danger" 
                  @click="handleDeleteImage"
                  style="margin-left: 8px;"
                >
                  删除图片
                </el-button>
              </div>
            </el-form-item>

            <!-- 单列布局：旋转角度 -->
            <el-form-item label="旋转角度">
                <el-slider v-model="form.imageWatermark.angle" :min="-180" :max="180" :marks="{0:'0°', 90:'90°', '-90':'-90°'}" />
            </el-form-item>

            <!-- 单列布局：缩放比例 -->
            <el-form-item label="缩放比例">
                <el-slider v-model="form.imageWatermark.zoom" :min="0.5" :max="5" :step="0.1" show-input />
            </el-form-item>

            <!-- 单列布局：透明度 -->
            <el-form-item label="透明度">
                <el-slider v-model="form.imageWatermark.opacity" :min="0" :max="1" :step="0.1" show-input />
            </el-form-item>

            <!-- 单列布局：平铺开关 -->
            <el-form-item label="平铺">
                <el-switch v-model="form.imageWatermark.repetition" />
            </el-form-item>

            <!-- 图片水印的平铺间距控件，仅全屏平铺时显示 -->
            <el-collapse-transition>
              <div v-if="form.imageWatermark.repetition">
                <el-form-item label="平铺间距 (像素)">
                  <el-slider 
                    v-model="form.imageWatermark.spacing" 
                    :min="50" 
                    :max="2000" 
                    :step="10" 
                    show-input 
                  />
                </el-form-item>
              </div>
            </el-collapse-transition>

            <!-- 水印位置配置（仅在关闭全屏平铺时显示） -->
            <el-collapse-transition>
              <div v-if="!form.imageWatermark.repetition">
                <el-form-item label="水印位置">
                  <el-radio-group v-model="form.imageWatermark.position" style="width: 100%;">
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
                      <el-radio-button label="top-left">左上</el-radio-button>
                      <el-radio-button label="top-center">居中上</el-radio-button>
                      <el-radio-button label="top-right">右上</el-radio-button>
                      <el-radio-button label="center-left">左中</el-radio-button>
                      <el-radio-button label="center">正中</el-radio-button>
                      <el-radio-button label="center-right">右中</el-radio-button>
                      <el-radio-button label="bottom-left">左下</el-radio-button>
                      <el-radio-button label="bottom-center">居中下</el-radio-button>
                      <el-radio-button label="bottom-right">右下</el-radio-button>
                    </div>
                  </el-radio-group>
                </el-form-item>
              </div>
            </el-collapse-transition>
          </div>
        </el-collapse-transition>

        <!-- 恢复水印预览功能 -->
        <div class="preview-container">
          <div class="preview-label">水印预览</div>
          <canvas ref="previewCanvasRef" class="preview-canvas"></canvas>
        </div>
      </el-card>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleExport" :loading="exporting" icon="Download">
          {{ exporting ? '正在导出...' : '开始导出' }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
// 需要引入图标
import { CloseBold, EditPen, Download } from '@element-plus/icons-vue'
import { drawWatermark } from './WatermarkUtils.js'

// 定义事件
const emit = defineEmits(['export'])

const visible = ref(false)
const exporting = ref(false)
const formRef = ref(null)
const previewCanvasRef = ref(null)

// 表单数据
const form = reactive({
  resolutionPreset: '3840x2160',
  customWidth: 1920,
  customHeight: 1080,
  format: 'image/png',
  textWatermark: {
    enabled: true,
    text: 'Three.js Industrial Demo',
    color: 'rgba(255, 255, 255, 0.6)',
    repetition: true,
    angle: 45,
    fontSize: 24,
    spacing: 1280,  // 新增：默认间距，匹配原3x3网格
    position: 'bottom-right', // 水印位置（仅在非平铺模式下使用）
  },
  imageWatermark: {
    enabled: true, // Switch 默认状态
    imageUrl: '',
    imageFile: null,
    angle: 0,
    position: 'bottom-right',
    zoom: 1,
    opacity: 1,
    repetition: false,
    image: null,
    spacing: 1280  // 新增：图片水印的平铺间距，与文字水印保持一致
  }
})

const resolutionOptions = [
  { label: '1080p (1920 x 1080)', value: '1920x1080' },
  { label: '4K (3840 x 2160)', value: '3840x2160' },
  { label: '8K (7680 x 4320)', value: '7680x4320' },
  { label: '自定义尺寸...', value: 'custom' }
]

const finalResolution = computed(() => {
  if (form.resolutionPreset === 'custom') {
    return { width: form.customWidth, height: form.customHeight }
  } else {
    const [w, h] = form.resolutionPreset.split('x').map(Number)
    return { width: w, height: h }
  }
})

const open = () => { 
    visible.value = true 
    nextTick(() => {
        updatePreview()
    })
}
const handleClose = () => {
  // 只关闭对话框，不清理图片资源
  // 这样用户第二次打开时可以看到之前上传的图片
  visible.value = false
}

const handleImageUpload = (file) => {
  // 清理旧资源，避免内存泄漏
  if (form.imageWatermark.imageUrl) {
    URL.revokeObjectURL(form.imageWatermark.imageUrl)
    form.imageWatermark.imageUrl = ''
  }
  form.imageWatermark.image = null
  form.imageWatermark.imageFile = null
  
  // 设置新资源
  form.imageWatermark.imageFile = file.raw
  form.imageWatermark.imageUrl = URL.createObjectURL(file.raw)
  form.imageWatermark.image = new Image()
  form.imageWatermark.image.src = form.imageWatermark.imageUrl
  
  form.imageWatermark.image.onload = () => {
    ElMessage.success('水印图片上传成功，已更新预览')
    nextTick(() => {
      updatePreview()
    })
  }
  
  form.imageWatermark.image.onerror = (error) => {
    ElMessage.error('无效的水印图片')
    // 清理无效资源
    if (form.imageWatermark.imageUrl) {
      URL.revokeObjectURL(form.imageWatermark.imageUrl)
      form.imageWatermark.imageUrl = ''
    }
    form.imageWatermark.image = null
    form.imageWatermark.imageFile = null
  }
  
  // 检查图片是否已经在浏览器缓存中
  if (form.imageWatermark.image.complete && form.imageWatermark.image.naturalWidth > 0) {
    nextTick(() => {
      updatePreview()
    })
  }
  
  // 阻止 el-upload 的自动上传行为
  return false
}

const handleDeleteImage = () => {
  // 清理图片资源
  if (form.imageWatermark.imageUrl) {
    URL.revokeObjectURL(form.imageWatermark.imageUrl)
  }
  
  // 重置相关状态
  form.imageWatermark.imageUrl = ''
  form.imageWatermark.image = null
  form.imageWatermark.imageFile = null
  
  // 保持开关状态不变，让用户可以继续配置其他属性
  // 如果需要禁用，可以取消下面这行的注释
  // form.imageWatermark.enabled = false
  
  ElMessage.success('图片水印已删除')
  
  // 更新预览
  nextTick(() => {
    updatePreview()
  })
}

const updatePreview = async () => {
  if (!previewCanvasRef.value) {
    return;
  }

  const canvas = previewCanvasRef.value
  const ctx = canvas.getContext('2d')

  const containerWidth = canvas.parentElement.clientWidth
  const actualRes = finalResolution.value
  const actualAspect = actualRes.width / actualRes.height

  // 计算预览尺寸，匹配实际宽高比，最大适应容器（宽≤容器宽，高≤200px）
  let previewWidth = Math.min(containerWidth, 400)
  let previewHeight = previewWidth / actualAspect
  if (previewHeight > 200) {
      previewHeight = 200
      previewWidth = previewHeight * actualAspect
  }

  canvas.width = previewWidth
  canvas.height = previewHeight

  // 绘制背景
  ctx.fillStyle = '#333'
  ctx.fillRect(0, 0, previewWidth, previewHeight)

  // 棋盘网格模拟透明背景，固定像素大小
  ctx.fillStyle = '#444'
  const gridSize = 10
  for(let i = 0; i < previewWidth; i += gridSize * 2) {
      for(let j = 0; j < previewHeight; j += gridSize * 2) {
          ctx.fillRect(i, j, gridSize, gridSize)
          ctx.fillRect(i + gridSize, j + gridSize, gridSize, gridSize)
      }
  }

  // 水印预览：scale模拟实际尺寸，确保相对位置/大小一致
  const hasTextWatermark = form.textWatermark.enabled && form.textWatermark.text.trim()
  const hasImageWatermark = form.imageWatermark.enabled && form.imageWatermark.image && form.imageWatermark.image.naturalWidth > 0

  if (hasTextWatermark || hasImageWatermark) {
      ctx.save()

      const scaleX = previewWidth / actualRes.width
      const scaleY = previewHeight / actualRes.height
      ctx.scale(scaleX, scaleY)

      // 创建与WatermarkUtils兼容的嵌套配置结构
      const previewConfig = {
        textWatermark: hasTextWatermark ? {
          enabled: form.textWatermark.enabled,
          text: form.textWatermark.text,
          color: form.textWatermark.color,
          fontSize: form.textWatermark.fontSize,
          repetition: form.textWatermark.repetition,
          angle: form.textWatermark.angle,
          position: form.textWatermark.position,
          spacing: form.textWatermark.spacing
        } : null,
        imageWatermark: hasImageWatermark ? {
          enabled: form.imageWatermark.enabled,
          image: form.imageWatermark.image,
          scale: form.imageWatermark.zoom,
          opacity: form.imageWatermark.opacity,
          repetition: form.imageWatermark.repetition,
          position: form.imageWatermark.position,
          angle: form.imageWatermark.angle,
          spacing: form.imageWatermark.spacing
        } : null
      }

      await drawWatermark(ctx, actualRes.width, actualRes.height, previewConfig)

      ctx.restore()
  }
}

const handleExport = async () => {
  // 简单的校验
  if (form.resolutionPreset === 'custom' && (!form.customWidth || !form.customHeight)) {
      ElMessage.warning('请输入有效的自定义尺寸')
      return
  }
  if (form.textWatermark.enabled && !form.textWatermark.text.trim()) {
      ElMessage.warning('请填写文字水印内容或关闭文字水印开关')
      return
  }
  if (form.imageWatermark.enabled && !form.imageWatermark.imageFile) {
      ElMessage.warning('请上传图片水印或关闭图片水印开关')
      return
  }

  exporting.value = true

  const exportData = {
    width: finalResolution.value.width,
    height: finalResolution.value.height,
    format: form.format,
    textWatermark: {
      enabled: form.textWatermark.enabled,
      text: form.textWatermark.text,
      color: form.textWatermark.color,
      repetition: form.textWatermark.repetition,
      angle: form.textWatermark.angle,
      position: form.textWatermark.position,
      fontSize: form.textWatermark.fontSize,
      spacing: form.textWatermark.spacing,
    },
    imageWatermark: {
      enabled: form.imageWatermark.enabled,
      imageUrl: form.imageWatermark.imageUrl,
      imageFile: form.imageWatermark.imageFile,
      // 【关键】确保图片对象也被传递
      image: form.imageWatermark.image,
      angle: form.imageWatermark.angle,
      position: form.imageWatermark.position,
      zoom: form.imageWatermark.zoom,
      opacity: form.imageWatermark.opacity,
      repetition: form.imageWatermark.repetition,
      spacing: form.imageWatermark.spacing
    }
  }

  // 通过事件抛出给父组件处理
  emit('export', exportData, {
    // 导出完成的回调
    onSuccess: () => {
      exporting.value = false
      ElMessage.success('导出成功')
      
      // 不清理图片资源，让用户下次还可以使用
      handleClose()
    },
    // 导出失败的回调
    onError: (error) => {
      exporting.value = false
      console.error(error)
      ElMessage.error('导出失败: ' + error.message)
    },
    // 进度回调
    onProgress: (progress) => {
      console.log(`导出进度: ${Math.round(progress * 100)}%`)
    }
  })
}

// 优化性能：合并所有水印相关的监听器为单个复合监听器
watch([
  () => form.resolutionPreset,
  () => form.customWidth,
  () => form.customHeight,
  // 文字水印相关
  () => form.textWatermark.enabled,
  () => form.textWatermark.text,
  () => form.textWatermark.color,
  () => form.textWatermark.repetition,
  () => form.textWatermark.angle,
  () => form.textWatermark.fontSize,
  () => form.textWatermark.spacing,
  () => form.textWatermark.position,
  // 图片水印相关
  () => form.imageWatermark.enabled,
  () => form.imageWatermark.angle,
  () => form.imageWatermark.zoom,
  () => form.imageWatermark.opacity,
  () => form.imageWatermark.repetition,
  () => form.imageWatermark.position,
  () => form.imageWatermark.spacing
], () => {
  nextTick(() => {
    updatePreview()
  })
})

// 组件卸载时清理资源
onUnmounted(() => {
  // 清理 Blob URL 避免内存泄漏
  if (form.imageWatermark.imageUrl) {
    URL.revokeObjectURL(form.imageWatermark.imageUrl)
  }
})

defineExpose({ open })
</script>

<style scoped>
/* 自定义弹窗样式微调 */
.export-dialog-ux :deep(.el-dialog__body) {
  padding: 20px;
  background-color: #f5f7fa; /* 给背景加一个非常淡的灰色,让卡片凸显 */
}

/* 设置卡片样式,使其看起来更轻量 */
.setting-card {
  border: 1px solid #e4e7ed;
  background-color: #fff;
}

.setting-card :deep(.el-card__header) {
  padding: 12px 20px;
  border-bottom: 1px solid #f0f2f5;
  font-weight: bold;
  font-size: 14px;
  color: #606266;
}

.setting-card :deep(.el-card__body) {
  padding: 20px;
}

/* 自定义分辨率区域 */
.custom-res-container {
  margin-top: 18px;
  padding: 16px;
  background-color: #fbfbfc;
  border-radius: 4px;
  border: 1px dashed #dcdfe6;
}

.flex-row {
  display: flex;
  align-items: center;
}

.separator-icon {
  margin: 0 12px;
  color: #909399;
  font-size: 14px;
}

/* 水印开关头部行 */
.switch-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.switch-label {
  font-weight: 500;
  color: #303133;
}

/* 调整 Radio Button 组的样式使其填满容器 - 只针对目标格式 */
:deep(.target-format-group .el-radio-button__inner) {
    width: 100%;
    padding: 10px 0; /* 增加点击区域高度 */
}

.preview-container {
    margin-top: 20px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    overflow: hidden;
}

.preview-label {
    background: #f5f7fa;
    padding: 8px 12px;
    font-size: 12px;
    color: #909399;
    border-bottom: 1px solid #ebeef5;
}

.preview-canvas {
    display: block;
    width: 100%;
    height: 200px;
}

.watermark-group {
  margin-top: 16px;
  background-color: #f5f7fa;
  border-radius: 4px;
  padding: 16px;
  border: 1px dashed #dcdfe6;
}

.watermark-upload-container {
  display: flex;
  align-items: center;
}

.watermark-upload-container .watermark-upload {
  display: inline-block;
}
</style>