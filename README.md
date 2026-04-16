<div align="center">
<h1>Sub2Clash on Workers</h1>

一个基于 Cloudflare Workers 的私有订阅聚合与转换工具，支持将多个订阅和单节点聚合统一收口成一份可复用的 Clash / Clash.Meta 配置
</div>
<div align="right">
本项目基于 <a href="https://github.com/bestnite/sub2clash" target="_blank">bestnite/sub2clash</a>
</div>

## 核心功能

- 把多个订阅、零散节点和自定义规则收口到一个统一入口
- 需要一个工具维护模板、规则和短链接，而不是手写 YAML
- 无需服务器，部署简单无需维护

## 协议支持

输入侧当前支持以下分享协议：

- Clash：`ss`、`ssr`、`vmess`、`trojan`、`socks5`
- Clash.Meta：`ss`、`ssr`、`vmess`、`vless`、`trojan`、`hysteria`、`hysteria2`、`socks5`、`anytls`

远程订阅内容支持两类格式：

- 已经是 Clash YAML，且顶层包含 `proxies`
- Base64 或纯文本的节点分享链接列表

## 架构概览

### 后端

- `src/index.js`：Worker 入口，组装公开订阅接口、API 路由与静态资源回退
- `src/routes`：API 路由与鉴权接线
- `src/auth`：密码校验、Cookie 会话签名、鉴权中间件
- `src/data`：KV 读写仓库与远程订阅缓存
- `src/domain`：配置校验、订阅解析、模板合并、YAML 输出

### 前端

- `frontend/src/pages`：登录页、Dashboard、模板页
- `frontend/src/components/dashboard`：配置器领域组件
- `frontend/src/components/ui`：`shadcn/ui` 基础交互层
- `frontend/src/styles.css`：暖纸张、陶土色、编辑部层级的主题 token

### 存储模型

- `settings`
  - 全局默认值
  - 自建模板数组
- `link:{id}`
  - 短链接配置与时间戳
- `cache:sub:{hash}`
  - 远程订阅内容短 TTL 缓存

## 技术栈

- Runtime：Bun
- Backend：JavaScript、Cloudflare Workers、Hono
- Frontend：React 19、React Router 7、Tailwind CSS v4、shadcn/ui
- Test：Vitest、Testing Library、Cloudflare Workers Vitest Pool

## 快速开始

### 前置条件

- Bun
- Cloudflare 账号
- 一个 KV Namespace

### 安装依赖

```bash
bun install
```

### 本地开发

1. 准备本地密钥文件 `.dev.vars`

```dotenv
APP_PASSWORD=your-local-password
SESSION_SECRET=replace-with-a-random-secret
SESSION_TTL_SECONDS=2592000
SUB_CACHE_TTL_SECONDS=300
MAX_REMOTE_FILE_SIZE=1048576
```

2. 启动统一开发入口

```bash
bun run dev
```

默认会在 `http://127.0.0.1:8787` 启动，由 Vite 提供前端 HMR，并通过 `@cloudflare/vite-plugin` 挂接 Worker 运行时。

如果你只想单独调试 Worker，可以使用：

```bash
bun run dev:worker
```

## 环境变量与 Secret

### 必需

- `APP_PASSWORD`
  - 管理台登录密码
- `SESSION_SECRET`
  - 会话签名密钥

### 可选

- `SESSION_TTL_SECONDS`
  - Cookie 会话有效期，默认 `2592000` 秒
- `SUB_CACHE_TTL_SECONDS`
  - 远程订阅缓存 TTL，默认 `300` 秒
- `MAX_REMOTE_FILE_SIZE`
  - 单次远程订阅拉取大小上限，默认 `1048576` 字节

## 配置模型

长链接 `/sub/:payload` 本质上是下面这份 JSON 的 base64url 编码：

```json
{
  "target": "meta",
  "sources": {
    "subscriptions": [
      {
        "url": "https://example.com/sub",
        "prefix": "机场 A"
      }
    ],
    "nodes": [
      "vmess://...",
      "ss://..."
    ]
  },
  "template": {
    "mode": "builtin",
    "value": "meta-default"
  },
  "routing": {
    "ruleProviders": [],
    "rules": []
  },
  "transforms": {
    "filterRegex": "",
    "replacements": []
  },
  "options": {
    "refresh": false,
    "autoTest": false,
    "lazy": false,
    "sort": "nameasc",
    "nodeList": false,
    "ignoreCountryGroup": false,
    "userAgent": "sub2clash-workers/1.0",
    "useUDP": false
  }
}
```

关键说明：

- `target` 仅支持 `clash` 或 `meta`
- `template.mode` 仅支持 `builtin` 或 `custom`
- `sources.subscriptions` 与 `sources.nodes` 不能同时为空
- `nodeList=true` 时只输出节点列表，不合并模板

## API 与访问入口

### 公开接口

- `GET /sub/:payload`
  - 根据长链接即时渲染 YAML
- `GET /s/:id`
  - 根据短链接 ID 渲染 YAML

### 管理接口

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/session`
- `POST /api/render`
- `GET /api/templates`
- `POST /api/templates`
- `PUT /api/templates/:id`
- `DELETE /api/templates/:id`
- `GET /api/links`
- `POST /api/links`
- `GET /api/links/:id`
- `PUT /api/links/:id`
- `DELETE /api/links/:id`

更详细的接口说明见：

- [.docs/api.md](/root/Workspace/sub2clash-workers/.docs/api.md)

## 测试

```bash
bun run test
```

可拆分执行：

```bash
bun run test:worker
bun run test:frontend
```

## 部署

### 1. 创建 KV Namespace

创建一个用于 `CACHE` 绑定的 KV Namespace，并把 ID 填入 [wrangler.jsonc](/root/Workspace/sub2clash-workers/wrangler.jsonc)。

### 2. 设置生产 Secret

```bash
wrangler secret put APP_PASSWORD
wrangler secret put SESSION_SECRET
```

### 3. 构建前端静态资源

如果你只想验证构建产物是否能用于发布：

```bash
bun run build:deploy
```

这个脚本会先清理旧的 `public/index.html` 和 `public/assets/*`，再重新构建前端，保留 `public/templates/`。

### 4. 预演部署

```bash
bun run deploy:dry-run
```

### 5. 发布 Worker

```bash
bun run deploy
```

发布完成后：

- Worker 负责 `/api/*`、`/sub/:payload`、`/s/:id`
- `public/` 下的前端静态资源由 Workers Assets 托管

如果你希望保留 Cloudflare Dashboard 中已设置的非 secret 变量，可以使用：

```bash
bun run deploy:keep-vars
```

## 相关文档

- [DESIGN.md](/root/Workspace/sub2clash-workers/DESIGN.md)
- [.docs/architecture.md](/root/Workspace/sub2clash-workers/.docs/architecture.md)
- [.docs/api.md](/root/Workspace/sub2clash-workers/.docs/api.md)
- [.docs/regression.md](/root/Workspace/sub2clash-workers/.docs/regression.md)
- [.tasks/roadmap.md](/root/Workspace/sub2clash-workers/.tasks/roadmap.md)

## 鸣谢

鸣谢：<a href="https://github.com/bestnite/sub2clash" target="_blank">bestnite/sub2clash</a>
