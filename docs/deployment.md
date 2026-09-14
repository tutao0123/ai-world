# AI World 部署记录

首次上线：2026-09-14。当前应用版本 0.3.0，课程底稿 v1.0.4。

- 正式地址：https://world.tao55s.com
- Vercel 默认地址：https://ai-world-dun.vercel.app
- 控制台：https://vercel.com/tutao0123s-projects/ai-world
- 团队：tutao0123s-projects
- 项目：ai-world
- 首次正式部署：状态 READY
- 框架：Vite；安装 `npm ci`，构建 `npm run build`，发布 `dist/`

## 发布方式

当前通过官方 Vercel CLI 59.16.0 从本机上传源码并在 Vercel 构建。源码已推送至 [GitHub 私有仓库](https://github.com/tutao0123/ai-world)，尚未连接 Vercel Git 自动部署；保存文件或推送 GitHub 不会自动更新线上站点。

在已登录的本机执行：

```powershell
cd ai-world
npm test
npm run build
npx --yes vercel@59.16.0 deploy --prod --yes --scope tutao0123s-projects
```

`.vercel/project.json` 保存本机项目关联并已加入 Git 忽略。认证由 CLI 管理；`.env*` 及 `.vercel/` 不提交到仓库，不复制到交付文档。

`vercel.json` 固定框架和构建输出。`.vercelignore` 排除原文提取、协调文件、测试记录、环境文件等；线上仅提供构建产物。应用使用根路径 query/hash 路由，无需额外 rewrite。

## 域名

`tao55s.com` 的 DNS 继续由 Cloudflare 管理。通过 Vercel Domain Connect 一次性添加了 `world` CNAME 和 `_vercel` 所需验证 TXT，未更改根域名或 nameserver。

`world` 的 CNAME 目标为 `594e359465569561.vercel-dns-017.com`，DNS only，TTL 10 分钟。Vercel 域名校验返回 `configured_correctly`，域名归属与项目关联已验证。

## 首次上线检查

- 12 项本地单元/内容检查通过，TypeScript 和生产构建通过。
- Vercel 正式部署 READY。
- 正式域名通过系统默认 TLS 证书校验；无登录访问首页返回 200，JS、CSS、favicon 和小淘 PNG 全部返回 200。
- 浏览器确认正式域名渲染四区域、13 章、101 个知识点，并实测打开第一章阅读窗口成功。
- 默认域名上的实验入口和章节根请求返回 200；原文 JSON、TXT 与来源 Markdown 路径返回 404。
- 首次部署后的 Vercel error 日志查询返回无日志。本站是静态应用，未新增日志转发或后台监控服务。

上述验证只代表首次发布时点的状态，后续内容或部署更新应重新检查。

## 0.3.0 双语发布 · 2026-09-14

- 四区域、13 章、101 个知识点、测验和五站实验均支持中英文；语言切换保留章节、搜索、弹窗、路线、实验参数与探索进度。
- 修复触屏浏览器不生成 SVG 兼容 click 时的地标点选，拖动与点选仍分开处理。
- 19 项内容与计算检查通过，TypeScript/生产构建通过，最终整套 21 项桌面与手机回归一次通过（44.5 秒）。
- 仅包含 Git 文件的干净目录完成 npm ci、单元检查和构建，不依赖本机 Word 原文、缓存或凭据。
- 构建先使用 --prod --skip-domain，回归通过后 promote 到现有域名。部署状态 READY，正式域名已确认英文地图和课程阅读器正常渲染。
- 英文入口：[world.tao55s.com/?lang=en](https://world.tao55s.com/?lang=en)；中文入口：[world.tao55s.com/?lang=zh](https://world.tao55s.com/?lang=zh)。
