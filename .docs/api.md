# API 设计

## 认证

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/session`

## 模板

- `GET /api/templates`
- `POST /api/templates`
- `PUT /api/templates/:id`
- `DELETE /api/templates/:id`

## 配置转换

- `POST /api/render`
- `GET /sub/:payload`
- `GET /s/:id`

## 短链

- `GET /api/links`
- `POST /api/links`
- `GET /api/links/:id`
- `PUT /api/links/:id`
- `DELETE /api/links/:id`

## 返回约定

- 认证失败：`401`
- 参数错误：`400`
- 不存在：`404`
- 远程加载或模板处理失败：`422`
- 服务内部错误：`500`
