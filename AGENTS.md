# AGENTS.md

本文件面向前来本仓库工作的 AI Agent，沉淀项目约定与历史踩坑经验。**动手前请先读一遍。**

## 项目概览

- 纯前端项目：**Vue 3 + Vite 5 + Tailwind CSS 3**，用于在线生成火车票样式图片。
- **单页无路由**：`main.js` 直接挂载 `views/TrainTicketGengrate.vue`，`vue-router` / `App.vue` 已移除，请勿再引入。
- 共享常量（卧铺类型、优惠映射）统一放在 `src/constants.js`，供组件与 `defineProps` 的 validator 引用。
- 无后端、无 Electron 桌面端（桌面端已于 `cb977df` 移除，请勿再引入 `main.js`、`icon.icns`、`icon.ico` 等残留）。
- 通过 GitHub Actions 自动部署到 GitHub Pages，push 到 `main` 即上线。

## 常用命令

```bash
npm install        # 安装依赖
npm run dev        # 开发模式，http://localhost:3000/train-ticket-maker/
npm run build      # 构建，产物输出到 dist/
npm run preview    # 预览构建结果，http://localhost:4173/train-ticket-maker/
```

> 本地开发/预览地址都带 `/train-ticket-maker/` 子路径，这是 `vite.config.js` 中 `base` 决定的，属正常现象。

## 环境约定

### Python

- **优先调用 Anaconda 的 Python**：先激活对应 conda 环境，或直接使用其绝对路径可执行文件。
- 避免与系统 Python 混用，防止依赖与解释器错位导致脚本行为不一致。

### 网络与代理

- 直连不畅（拉依赖、推送、下载超时等）时，**尝试走 `7890` 端口的本地代理**（常见于 Clash 等工具）。
- **用完务必清理代理状态**，避免残留配置污染后续命令与 Git：
  - 临时环境变量：取消 `HTTP_PROXY` / `HTTPS_PROXY` / `ALL_PROXY`（PowerShell 中 `Remove-Item Env:HTTP_PROXY` 等）。
  - 若写入过 Git：`git config --global --unset http.proxy`、`git config --global --unset https.proxy`。
  - 清理后建议 `git config --global --get-regexp proxy` 确认为空。

## 经验教训（均来自真实提交）

### 1. `defineProps` 会被提升，validator 里不能用后声明的局部常量

`defineProps` 编译后提升到 `<script setup>` 顶部，因此其 `validator` **不能引用 `<script setup>` 内部的局部变量**（如 `validTypes`），会抛提升错误。

- 解法：把常量放到**模块作用域**，例如 `src/constants.js` 导出后 `import` 引用（推荐，本项目已采用）；也可把常量**内联进 validator**。
- 注意：仅在 `<script setup>` 内部"提前声明"并不保险，`defineProps` 的选项对象会被编译器整体搬出 `setup()`。
- 参考提交：`e276b4e`。

### 2. `defineExpose` 暴露的 ref 会自动解包，父组件访问时不要加 `.value`

子组件 `defineExpose({ wrapper, exporting })` 后，父组件通过模板 ref 拿到的是**已解包的值**：

```js
// 正确
ticketRef.exporting = true
const node = ticketRef.wrapper || ticketRef.$el

// 错误（会写入到错误目标，导出失败）
ticketRef.exporting.value = true
```

- 参考提交：`0d64009`（该错误此前的修复本身就是误改，后被 revert 纠正）。

### 3. GitHub Pages 部署的关键点

- `vite.config.js` 的 `base` 必须是 `'/train-ticket-maker/'`，否则线上资源 404。改用自定义域名或 `<user>.github.io` 根站点时需改回 `'/'`。
- 项目为单页应用，**已移除 `vue-router`**：`main.js` 直接挂载 `views/TrainTicketGengrate.vue`，访问路径就是 `base` 本身，不再需要 hash 模式规避刷新 404。
- 保留 `public/.nojekyll`，关闭 Jekyll，防止下划线开头的文件被忽略。
- `actions/configure-pages@v5` 需带 `enablement: true`；若该步骤因权限失败，手动到 **Settings → Pages** 把 Source 设为 **GitHub Actions** 后重跑。
- **构建产物不入库**：`dist/`、`release/` 已在 `.gitignore` 中忽略，产物统一交给 CI 生成，不要本地提交。

### 4. 大幅改造要同步到底

`cb977df` 一次性移除 Electron 桌面端，涉及 `build.yml`、`main.js`、`icon.*`、`package.json`、`package-lock.json`、`README.md`、`vite.config.js` 等多处同步更新。做此类改动时，务必让**构建配置、CI、依赖清单、文档**保持一致，避免留下死引用。

### 5. 文档排版规范

- 中文与英文、数字之间**留一个空格**（如 `Vue 3`、`GitHub Pages`、`Vibe Coding`、`13 种类型`）。

### 6. 仓库体积维护

- 仓库体量主要为二进制图片（`public/redbg.png` 约 527 KB、`bluebg.png` 约 171 KB 等），**Git 压缩收益有限**。
- 常规维护用 `git gc --aggressive --prune=now`；需要更激进时用 `git repack -a -d --depth=250 --window=250`。体量已接近最优时体积基本不再下降，属正常。
- `.codebuddy/`（AI 助手本地数据）已加入 `.gitignore`，不入库。

## 提交与协作约定

- 提交信息遵循 **Conventional Commits** 前缀：`feat:` / `fix:` / `ci:` / `chore:` / `docs:`。
- **push 到 `main` 会自动触发 GitHub Pages 部署**，推送前确认改动已自测通过。
- 工作环境：**Windows + PowerShell**，路径使用绝对路径更稳妥。
