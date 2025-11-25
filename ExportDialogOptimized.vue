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
          <el-radio-group v-model="form.format" style="width: 100%; display: flex;">
            <el-radio-button label="image/png" style="flex: 1;">PNG (无损)</el-radio-button>
            <el-radio-button label="image/jpeg" style="flex: 1;">JPEG (压缩)</el-radio-button>
            <el-radio-button label="image/webp" style="flex: 1;">WebP (高效)</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-card>

      <!-- 分组2:水印选项 -->
      <el-card shadow="never" class="setting-card" style="margin-top: 16px;">
        <!-- UX优化:使用 Switch 开关代替复选框,头部整合在一行 -->
        <div class="switch-header-row">
          <span class="switch-label">启用添加水印</span>
          <el-switch v-model="form.hasWatermark" />
        </div>

        <el-collapse-transition>
          <div v-if="form.hasWatermark" style="margin-top: 16px;">
            <el-form-item label="水印内容文字" style="margin-bottom: 0;">
              <el-input
                v-model="form.watermarkText"
                placeholder="请输入将在画面中显示的水印文字"
                clearable
                :prefix-icon="EditPen"
              />
            </el-form-item>
          </div>
        </el-collapse-transition>
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
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
// 需要引入图标
import { CloseBold, EditPen, Download } from '@element-plus/icons-vue'

// 定义事件
const emit = defineEmits(['export'])

const visible = ref(false)
const exporting = ref(false)
const formRef = ref(null)

// 表单数据
const form = reactive({
  resolutionPreset: '3840x2160',
  customWidth: 1920,
  customHeight: 1080,
  format: 'image/png',
  hasWatermark: true, // Switch 默认状态
  watermarkText: 'Three.js Industrial Demo'
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

const open = () => { visible.value = true }
const handleClose = () => { visible.value = false }

const handleExport = async () => {
  // 简单的校验
  if (form.resolutionPreset === 'custom' && (!form.customWidth || !form.customHeight)) {
      ElMessage.warning('请输入有效的自定义尺寸');
      return;
  }
  if (form.hasWatermark && !form.watermarkText.trim()) {
      ElMessage.warning('请填写水印内容或关闭水印开关');
      return;
  }

  exporting.value = true
  
  const exportData = {
    width: finalResolution.value.width,
    height: finalResolution.value.height,
    format: form.format,
    watermark: form.hasWatermark ? form.watermarkText : null,
  }
  
  console.log('准备导出数据:', exportData)
  
  // 通过事件抛出给父组件处理
  emit('export', exportData, {
    // 导出完成的回调
    onSuccess: () => {
      exporting.value = false
      ElMessage.success('导出成功')
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

/* 调整 Radio Button 组的样式使其填满容器 */
:deep(.el-radio-group .el-radio-button__inner) {
    width: 100%;
    padding: 10px 0; /* 增加点击区域高度 */
}
</style>