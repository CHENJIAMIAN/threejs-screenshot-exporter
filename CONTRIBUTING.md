# 贡献指南

感谢你考虑为本项目做出贡献! 🎉

## 🤝 如何贡献

### 报告 Bug

如果你发现了 bug,请通过 [GitHub Issues](https://github.com/CHENJIAMIAN/threejs-screenshot-exporter/issues) 报告,并包含以下信息:

- **问题描述**: 清晰简洁地描述问题
- **复现步骤**: 详细的复现步骤
- **期望行为**: 你期望发生什么
- **实际行为**: 实际发生了什么
- **环境信息**: 
  - 浏览器版本
  - 操作系统
  - Node.js 版本
  - 项目版本
- **截图**: 如果适用,添加截图帮助解释问题
- **额外信息**: 任何其他相关信息

### 提出新功能

如果你有新功能的想法:

1. 先检查 [Issues](https://github.com/CHENJIAMIAN/threejs-screenshot-exporter/issues) 确认是否已有相关讨论
2. 创建一个新的 Issue,标题以 `[Feature Request]` 开头
3. 详细描述:
   - 功能的使用场景
   - 期望的实现方式
   - 可能的替代方案
   - 对现有功能的影响

### 提交代码

#### 开发流程

1. **Fork 仓库**
   ```bash
   # 在 GitHub 上 Fork 本仓库
   ```

2. **克隆到本地**
   ```bash
   git clone https://github.com/你的用户名/threejs-screenshot-exporter.git
   cd threejs-screenshot-exporter
   ```

3. **创建特性分支**
   ```bash
   git checkout -b feature/amazing-feature
   # 或
   git checkout -b fix/bug-description
   ```

4. **安装依赖**
   ```bash
   npm install
   ```

5. **开发和测试**
   ```bash
   npm run dev
   ```

6. **提交更改**
   ```bash
   git add .
   git commit -m "feat: 添加某某功能"
   ```

7. **推送到 GitHub**
   ```bash
   git push origin feature/amazing-feature
   ```

8. **创建 Pull Request**
   - 在 GitHub 上创建 Pull Request
   - 填写 PR 模板,清晰描述你的更改
   - 等待代码审查

#### 提交信息规范

使用语义化的提交信息:

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式调整(不影响功能)
- `refactor`: 重构(既不是新功能也不是 bug 修复)
- `perf`: 性能优化
- `test`: 添加测试
- `chore`: 构建过程或辅助工具的变动

示例:
```
feat: 添加批量导出功能
fix: 修复 8K 分辨率下的内存溢出问题
docs: 更新 README 中的使用示例
```

#### 代码规范

- **注释**: 使用中文注释
- **日志**: 使用中文日志信息
- **命名**: 
  - 变量和函数使用驼峰命名法
  - 常量使用大写下划线命名法
  - 类名使用帕斯卡命名法
- **格式**: 保持代码风格一致
- **文件**: 每个文件末尾保留一个空行

#### Pull Request 检查清单

提交 PR 前,请确认:

- [ ] 代码遵循项目的代码规范
- [ ] 添加了必要的注释(中文)
- [ ] 更新了相关文档
- [ ] 测试通过,没有引入新的 bug
- [ ] 提交信息清晰明确
- [ ] 如果是新功能,更新了 CHANGELOG.md

## 📝 开发建议

### 项目结构理解

- `main.js`: Three.js 场景初始化和演示
- `ScreenshotManager.js`: 核心截图引擎,包含分块渲染逻辑
- `ExportImageDialog.vue`: 导出设置 UI 组件
- `App.vue`: Vue 应用根组件
- `main-ui.js`: Vue 应用入口

### 关键技术点

1. **分块渲染**: 使用 `camera.setViewOffset()` 实现
2. **异步处理**: 使用 `setTimeout` 让出主线程
3. **状态管理**: 导出前保存,导出后恢复
4. **水印合成**: 使用 Canvas 2D API

### 测试建议

- 测试不同分辨率 (1080p, 4K, 8K)
- 测试不同格式 (PNG, JPEG, WebP)
- 测试水印功能
- 测试在不同浏览器中的兼容性
- 测试极限情况 (超大分辨率、低配置设备)

## 🎯 优先级任务

当前最需要帮助的领域:

1. **性能优化**: 提升大分辨率导出速度
2. **浏览器兼容性**: 测试和修复不同浏览器的问题
3. **文档完善**: 添加更多使用示例和教程
4. **测试用例**: 添加自动化测试
5. **新功能**: 实现 CHANGELOG 中提到的计划功能

## 💬 交流讨论

- **Issues**: 用于 bug 报告和功能请求
- **Discussions**: 用于一般性讨论和问答

## 📜 行为准则

- 尊重所有贡献者
- 保持友善和专业
- 接受建设性的批评
- 关注对社区最有利的事情

## 🙏 感谢

感谢每一位贡献者的付出! 你的贡献让这个项目变得更好! ❤️

---

如有任何问题,欢迎随时联系项目维护者。
