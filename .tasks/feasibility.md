# 可行性评估

## 结论

项目适合按 Cloudflare Workers 自用版落地。当前仓库为空白骨架，最优路径是一次性建立 Worker、前端、KV 存储、认证与测试体系。

## 关键判断

- 全局密码使用 Workers Secret，登录态使用签名 Cookie。
- KV 采用分键设计：`settings` 与 `link:{id}`。
- 模板来源仅保留内置模板和自建模板。
- `/sub/:payload` 与 `/s/:id` 公开，管理台与 `/api/*` 受保护。

## 风险

- KV 为 eventual consistency，短链更新在边缘传播上存在轻微延迟。
- 订阅协议解析覆盖面大，需要测试夹具保证回归。
- 前端输出目录与 Worker 静态资源目录共用，构建链路必须保持稳定。
