# Contributing Guide

> [中文](CONTRIBUTING.md)

Thank you for considering a contribution to this project! 🎉

## 🤝 How to contribute

### Report a bug

If you find a bug, report it through
[GitHub Issues](https://github.com/CHENJIAMIAN/threejs-screenshot-exporter/issues)
and include:

- **Description**: a clear, concise description of the issue.
- **Steps to reproduce**: detailed reproduction steps.
- **Expected behavior**: what you expected to happen.
- **Actual behavior**: what actually happened.
- **Environment**:
  - Browser version
  - Operating system
  - Node.js version
  - Project version
- **Screenshots**: add screenshots when useful to explain the issue.
- **Additional information**: any other relevant details.

### Request a feature

When you have an idea for a new feature:

1. Check [Issues](https://github.com/CHENJIAMIAN/threejs-screenshot-exporter/issues)
   first to see whether it is already discussed.
2. Create a new Issue with a title beginning with `[Feature Request]`.
3. Describe in detail:
   - The feature's use cases
   - The expected implementation
   - Possible alternatives
   - Its impact on existing features

### Submit code

#### Development workflow

1. **Fork the repository**
   ```bash
   # 在 GitHub 上 Fork 本仓库
   ```

2. **Clone locally**
   ```bash
   git clone https://github.com/你的用户名/threejs-screenshot-exporter.git
   cd threejs-screenshot-exporter
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   # 或
   git checkout -b fix/bug-description
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Develop and test**
   ```bash
   npm run dev
   ```

6. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: 添加某某功能"
   ```

7. **Push to GitHub**
   ```bash
   git push origin feature/amazing-feature
   ```

8. **Create a Pull Request**
   - Create a Pull Request on GitHub.
   - Complete the PR template and clearly describe your changes.
   - Wait for code review.

#### Commit-message conventions

Use semantic commit messages:

- `feat`: new feature
- `fix`: bug fix
- `docs`: documentation update
- `style`: code formatting change with no functional impact
- `refactor`: refactoring that is neither a new feature nor a bug fix
- `perf`: performance optimization
- `test`: add tests
- `chore`: build-process or tooling changes

Examples:
```
feat: 添加批量导出功能
fix: 修复 8K 分辨率下的内存溢出问题
docs: 更新 README 中的使用示例
```

#### Code conventions

- **Comments**: use Chinese comments.
- **Logs**: use Chinese log messages.
- **Naming**:
  - Use camelCase for variables and functions.
  - Use UPPER_SNAKE_CASE for constants.
  - Use PascalCase for class names.
- **Formatting**: keep code style consistent.
- **Files**: retain one blank line at the end of every file.

#### Pull Request checklist

Before submitting a PR, confirm that:

- [ ] Code follows the project conventions.
- [ ] Necessary Chinese comments are added.
- [ ] Relevant documentation is updated.
- [ ] Tests pass and no new bugs are introduced.
- [ ] Commit messages are clear.
- [ ] CHANGELOG.md is updated for a new feature.

## 📝 Development guidance

### Understand the project structure

- `main.js`: Three.js scene initialization and demo.
- `ScreenshotManager.js`: core screenshot engine, including tiled-rendering logic.
- `ExportImageDialog.vue`: export-settings UI component.
- `App.vue`: Vue application root component.
- `main-ui.js`: Vue application entry point.

### Key technical points

1. **Tiled rendering**: implemented with `camera.setViewOffset()`.
2. **Asynchronous processing**: uses `setTimeout` to yield the main thread.
3. **State management**: save state before export and restore it afterward.
4. **Watermark composition**: uses the Canvas 2D API.

### Test guidance

- Test different resolutions (1080p, 4K, 8K).
- Test different formats (PNG, JPEG, WebP).
- Test watermark functionality.
- Test browser compatibility.
- Test edge cases such as ultra-high resolutions and low-spec devices.

## 🎯 Priority work

The areas currently needing the most help are:

1. **Performance optimization**: improve high-resolution export speed.
2. **Browser compatibility**: test and fix issues across browsers.
3. **Documentation**: add more examples and tutorials.
4. **Test cases**: add automated tests.
5. **New features**: implement planned features listed in the changelog.

## 💬 Discussion

- **Issues**: bug reports and feature requests.
- **Discussions**: general discussion and Q&A.

## 📜 Code of conduct

- Respect every contributor.
- Be friendly and professional.
- Accept constructive criticism.
- Focus on what benefits the community most.

## 🙏 Thanks

Thank you to every contributor. Your work makes this project better. ❤️

---

Contact the project maintainers at any time with questions.
