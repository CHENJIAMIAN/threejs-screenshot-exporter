<template>
  <div class="ui-container">
    <!-- 悬浮导出按钮 -->
    <div class="floating-btn" @click="openDialog">
      <el-button type="primary" circle size="large" :icon="Download" class="export-btn-trigger" />
    </div>

    <!-- 导出弹窗组件 -->
    <ExportImageDialog ref="exportDialogRef" @export="handleExport" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Download } from '@element-plus/icons-vue'
import ExportImageDialog from './ExportImageDialog.vue'
import { captureScene } from './main.js'

const exportDialogRef = ref(null)

const openDialog = () => {
  if (exportDialogRef.value) {
    exportDialogRef.value.open()
  }
}

// 处理导出事件
const handleExport = async (exportData, callbacks) => {
  try {
    // 调用 main.js 的导出函数
    const blob = await captureScene({
      ...exportData,
      onProgress: callbacks.onProgress
    })
    
    // 下载文件
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const ext = exportData.format.split('/')[1]
    link.href = url
    link.download = `screenshot_${exportData.width}x${exportData.height}_${Date.now()}.${ext}`
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    
    // 调用成功回调
    callbacks.onSuccess()
  } catch (error) {
    // 调用失败回调
    callbacks.onError(error)
  }
}

</script>

<style scoped>
.ui-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* 让鼠标事件穿透到 canvas */
}

.floating-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  pointer-events: auto;
  z-index: 100;
}

.export-btn-trigger {
  width: 50px;
  height: 50px;
  font-size: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}
</style>
