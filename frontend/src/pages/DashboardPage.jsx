import { useEffect, useMemo, useState } from "react";

import { Input, Select, Textarea, Toggle } from "../components/Fields.jsx";
import { apiFetch } from "../lib/api.js";
import { createEmptyConfig, decodeConfigPayload, encodeConfigPayload } from "../lib/config.js";

const LONG_LINK_SOFT_LIMIT = 15_500;

const primaryButtonClass = "btn btn-primary";
const secondaryButtonClass = "btn btn-secondary";
const dangerButtonClass = "btn btn-danger";
const subtleButtonClass = "btn btn-subtle";

function cleanSubscriptions(items) {
  return items.filter((item) => item.url.trim());
}

function normalizeNodes(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mb-5">
      {eyebrow ? (
        <p className="mb-2 text-[0.72rem] uppercase tracking-[0.18em] text-[var(--stone)]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-display text-[1.55rem] leading-[1.08] md:text-[1.9rem]">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted)]">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function EditorSection({ eyebrow, title, description, children }) {
  return (
    <section className="panel-section">
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        description={description}
      />
      {children}
    </section>
  );
}

function TableTextInput({ value, onChange, placeholder, ariaLabel }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      aria-label={ariaLabel}
      className="field-input"
    />
  );
}

function EditorTable({ columnsClassName, minWidthClassName, headers, children }) {
  return (
    <div className="editor-table overflow-x-auto">
      <div className={minWidthClassName}>
        <div className={`editor-table-head ${columnsClassName}`}>
          {headers.map((header) => (
            <p
              key={header}
              className={
                header === "操作"
                  ? "text-right"
                  : header === "前置"
                    ? "text-center"
                    : ""
              }
            >
              {header}
            </p>
          ))}
        </div>
        {children}
      </div>
    </div>
  );
}

function EditorTableRow({ columnsClassName, children }) {
  return <div className={`editor-table-row ${columnsClassName}`}>{children}</div>;
}

function ReplacementEditor({ replacements, onChange }) {
  const columnsClassName =
    "grid grid-cols-[minmax(16rem,1fr)_minmax(16rem,1fr)_5.5rem] gap-3";

  return (
    <div>
      <EditorTable
        headers={["匹配正则", "替换文本", "操作"]}
        columnsClassName={columnsClassName}
        minWidthClassName="min-w-[38rem]"
      >
        {replacements.map((item, index) => (
          <EditorTableRow
            key={`${item.pattern}-${index}`}
            columnsClassName={columnsClassName}
          >
            <TableTextInput
              value={item.pattern}
              ariaLabel="匹配正则"
              placeholder="例如：香港|HK"
              onChange={(value) => {
                const next = [...replacements];
                next[index] = { ...next[index], pattern: value };
                onChange(next);
              }}
            />
            <TableTextInput
              value={item.replacement}
              ariaLabel="替换文本"
              placeholder="例如：Hong Kong"
              onChange={(value) => {
                const next = [...replacements];
                next[index] = { ...next[index], replacement: value };
                onChange(next);
              }}
            />
            <div className="flex justify-end">
              <button
                type="button"
                className={subtleButtonClass}
                onClick={() =>
                  onChange(replacements.filter((_, itemIndex) => itemIndex !== index))
                }
              >
                删除
              </button>
            </div>
          </EditorTableRow>
        ))}
      </EditorTable>

      <div className="mt-3 flex justify-end">
        <button
          type="button"
          className={secondaryButtonClass}
          onClick={() => onChange([...replacements, { pattern: "", replacement: "" }])}
        >
          新增替换规则
        </button>
      </div>
    </div>
  );
}

function RuleProviderEditor({ providers, onChange }) {
  const columnsClassName =
    "grid grid-cols-[10rem_10rem_7rem_minmax(18rem,1fr)_6.5rem_5.5rem] gap-3";

  return (
    <div>
      <EditorTable
        headers={["名称", "策略组", "行为", "URL", "前置", "操作"]}
        columnsClassName={columnsClassName}
        minWidthClassName="min-w-[52rem]"
      >
        {providers.map((item, index) => (
          <EditorTableRow
            key={`${item.name}-${index}`}
            columnsClassName={columnsClassName}
          >
            <TableTextInput
              value={item.name}
              ariaLabel="名称"
              placeholder="例如：direct"
              onChange={(value) => {
                const next = [...providers];
                next[index] = { ...next[index], name: value };
                onChange(next);
              }}
            />
            <TableTextInput
              value={item.group}
              ariaLabel="策略组"
              placeholder="例如：节点选择"
              onChange={(value) => {
                const next = [...providers];
                next[index] = { ...next[index], group: value };
                onChange(next);
              }}
            />
            <TableTextInput
              value={item.behavior}
              ariaLabel="行为"
              placeholder="例如：domain"
              onChange={(value) => {
                const next = [...providers];
                next[index] = { ...next[index], behavior: value };
                onChange(next);
              }}
            />
            <TableTextInput
              value={item.url}
              ariaLabel="URL"
              placeholder="https://example.com/provider.yaml"
              onChange={(value) => {
                const next = [...providers];
                next[index] = { ...next[index], url: value };
                onChange(next);
              }}
            />
            <div className="flex min-h-[2.875rem] items-center justify-center">
              <Toggle
                label="插入到规则前部"
                checked={Boolean(item.prepend)}
                compact
                onChange={(value) => {
                  const next = [...providers];
                  next[index] = { ...next[index], prepend: value };
                  onChange(next);
                }}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className={subtleButtonClass}
                onClick={() => onChange(providers.filter((_, itemIndex) => itemIndex !== index))}
              >
                删除
              </button>
            </div>
          </EditorTableRow>
        ))}
      </EditorTable>

      <div className="mt-3 flex justify-end">
        <button
          type="button"
          className={secondaryButtonClass}
          onClick={() =>
            onChange([
              ...providers,
              { name: "", group: "节点选择", behavior: "domain", url: "", prepend: false }
            ])
          }
        >
          新增 Rule Provider
        </button>
      </div>
    </div>
  );
}

function RulesEditor({ rules, onChange }) {
  const columnsClassName = "grid grid-cols-[minmax(24rem,1fr)_6.5rem_5.5rem] gap-3";

  return (
    <div>
      <EditorTable
        headers={["规则", "前置", "操作"]}
        columnsClassName={columnsClassName}
        minWidthClassName="min-w-[38rem]"
      >
        {rules.map((item, index) => (
          <EditorTableRow
            key={`${item.value}-${index}`}
            columnsClassName={columnsClassName}
          >
            <TableTextInput
              value={item.value}
              ariaLabel="规则"
              placeholder="例如：DOMAIN-SUFFIX,openai.com,DIRECT"
              onChange={(value) => {
                const next = [...rules];
                next[index] = { ...next[index], value };
                onChange(next);
              }}
            />
            <div className="flex min-h-[2.875rem] items-center justify-center">
              <Toggle
                label="前置"
                checked={Boolean(item.prepend)}
                compact
                onChange={(value) => {
                  const next = [...rules];
                  next[index] = { ...next[index], prepend: value };
                  onChange(next);
                }}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className={subtleButtonClass}
                onClick={() => onChange(rules.filter((_, itemIndex) => itemIndex !== index))}
              >
                删除
              </button>
            </div>
          </EditorTableRow>
        ))}
      </EditorTable>

      <div className="mt-3 flex justify-end">
        <button
          type="button"
          className={secondaryButtonClass}
          onClick={() => onChange([...rules, { value: "", prepend: false }])}
        >
          新增规则
        </button>
      </div>
    </div>
  );
}

function SubscriptionEditor({ subscriptions, onChange }) {
  const columnsClassName = "grid grid-cols-[minmax(24rem,1fr)_12rem_5.5rem] gap-3";

  return (
    <div>
      <EditorTable
        headers={["订阅地址", "节点前缀", "操作"]}
        columnsClassName={columnsClassName}
        minWidthClassName="min-w-[42rem]"
      >
        {subscriptions.map((item, index) => (
          <EditorTableRow
            key={`${item.url}-${index}`}
            columnsClassName={columnsClassName}
          >
            <TableTextInput
              value={item.url}
              ariaLabel="订阅地址"
              placeholder="https://example.com/subscription"
              onChange={(value) => {
                const next = [...subscriptions];
                next[index] = { ...next[index], url: value };
                onChange(next);
              }}
            />
            <TableTextInput
              value={item.prefix}
              ariaLabel="节点前缀"
              placeholder="例如：机场 A"
              onChange={(value) => {
                const next = [...subscriptions];
                next[index] = { ...next[index], prefix: value };
                onChange(next);
              }}
            />
            <div className="flex justify-end">
              <button
                type="button"
                className={subtleButtonClass}
                onClick={() => onChange(subscriptions.filter((_, itemIndex) => itemIndex !== index))}
              >
                删除
              </button>
            </div>
          </EditorTableRow>
        ))}
      </EditorTable>

      <div className="mt-3 flex justify-end">
        <button
          type="button"
          className={secondaryButtonClass}
          onClick={() => onChange([...subscriptions, { url: "", prefix: "" }])}
        >
          新增订阅
        </button>
      </div>
    </div>
  );
}

function PreviewPanel({ preview, stats, warnings, renderError, subscriptionInfo }) {
  return (
    <aside className="surface-panel-dark overflow-hidden lg:sticky lg:top-[5.3rem] lg:h-[calc(100vh-6.8rem)]">
      <div className="flex h-full flex-col p-5 md:p-6">
        <SectionHeading
          eyebrow="Preview"
          title="实时输出"
          description="渲染结果直接来自 Worker API，不依赖浏览器本地拼装。"
        />

        {stats ? (
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["节点", stats.proxyCount],
              ["国家组", stats.countryGroupCount],
              ["模板", stats.templateId]
            ].map(([label, value]) => (
              <div
                key={label}
                className="metric-chip-dark"
              >
                <p className="text-[0.68rem] uppercase tracking-[0.16em] text-[var(--silver)]">
                  {label}
                </p>
                <p className="mt-2 font-display text-[1.45rem] leading-none text-[var(--ivory)]">
                  {value}
                </p>
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-4 space-y-3">
          {subscriptionInfo ? (
            <p className="notice-panel-dark text-xs text-[var(--silver)]">
              subscription-userinfo: {subscriptionInfo}
            </p>
          ) : null}
          {warnings.length ? (
            <ul className="notice-panel-dark text-sm text-[var(--silver)]">
              {warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          ) : null}
          {renderError ? (
            <p className="rounded-[0.72rem] bg-[rgba(201,100,66,0.18)] px-4 py-3 text-sm text-[#ffe9e1]">
              {renderError}
            </p>
          ) : null}
        </div>

        <pre className="mt-4 min-h-[18rem] flex-1 overflow-auto rounded-[0.78rem] border border-[var(--dark-border)] bg-[rgba(0,0,0,0.16)] p-4 text-xs leading-6 text-[var(--ivory)]">
          {preview || "等待渲染结果..."}
        </pre>
      </div>
    </aside>
  );
}

export default function DashboardPage({ templates }) {
  const [config, setConfig] = useState(createEmptyConfig());
  const [nodesText, setNodesText] = useState("");
  const [preview, setPreview] = useState("");
  const [stats, setStats] = useState(null);
  const [warnings, setWarnings] = useState([]);
  const [renderError, setRenderError] = useState("");
  const [linkInput, setLinkInput] = useState("");
  const [shortLinkId, setShortLinkId] = useState("");
  const [customShortId, setCustomShortId] = useState("");
  const [subscriptionInfo, setSubscriptionInfo] = useState("");

  const templateOptions = useMemo(() => {
    const builtin = templates.builtin.map((item) => ({
      value: `builtin:${item.id}`,
      label: `${item.name} / ${item.target}`
    }));
    const custom = templates.custom.map((item) => ({
      value: `custom:${item.id}`,
      label: `${item.name} / ${item.target}`
    }));
    return [...builtin, ...custom];
  }, [templates]);

  const effectiveConfig = useMemo(
    () => ({
      ...config,
      sources: {
        ...config.sources,
        subscriptions: cleanSubscriptions(config.sources.subscriptions),
        nodes: normalizeNodes(nodesText)
      }
    }),
    [config, nodesText]
  );

  const longLink = useMemo(
    () => `${window.location.origin}/sub/${encodeConfigPayload(effectiveConfig)}`,
    [effectiveConfig]
  );

  const canCopyLongLink = longLink.length < LONG_LINK_SOFT_LIMIT;

  async function renderCurrentConfig() {
    try {
      const data = await apiFetch("/api/render", {
        method: "POST",
        body: JSON.stringify(effectiveConfig)
      });
      setPreview(data.yaml);
      setStats(data.stats);
      setWarnings(data.warnings || []);
      setRenderError("");
      setSubscriptionInfo(data.subscriptionUserinfo || "");
    } catch (error) {
      setRenderError(error.message);
      setPreview("");
      setStats(null);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      renderCurrentConfig();
    }, 350);
    return () => clearTimeout(timer);
  }, [effectiveConfig]);

  useEffect(() => {
    if (!templateOptions.length) {
      return;
    }
    const available = templateOptions.some(
      (option) => option.value === `${config.template.mode}:${config.template.value}`
    );
    if (!available) {
      const fallback = templateOptions[0].value.split(":");
      setConfig((current) => ({
        ...current,
        template: {
          mode: fallback[0],
          value: fallback[1]
        }
      }));
    }
  }, [templateOptions]);

  function updateTemplate(value) {
    const [mode, templateId] = value.split(":");
    setConfig((current) => ({
      ...current,
      template: {
        mode,
        value: templateId
      }
    }));
  }

  async function copyLongLink() {
    if (!canCopyLongLink) {
      return;
    }
    await navigator.clipboard.writeText(longLink);
  }

  async function importLink() {
    try {
      const url = new URL(linkInput.trim());
      if (url.pathname.startsWith("/sub/")) {
        const payload = url.pathname.split("/").pop();
        const nextConfig = decodeConfigPayload(payload);
        setConfig(nextConfig);
        setNodesText((nextConfig.sources?.nodes || []).join("\n"));
        setRenderError("");
        return;
      }
      if (url.pathname.startsWith("/s/")) {
        const id = url.pathname.split("/").pop();
        const data = await apiFetch(`/api/links/${id}`);
        setConfig(data.config);
        setNodesText((data.config.sources?.nodes || []).join("\n"));
        setShortLinkId(data.id);
        setRenderError("");
        return;
      }
      setRenderError("暂不支持该链接格式");
    } catch (error) {
      setRenderError(error.message || "导入失败");
    }
  }

  async function createShortLink() {
    const data = await apiFetch("/api/links", {
      method: "POST",
      body: JSON.stringify({
        config: effectiveConfig,
        customId: customShortId || undefined
      })
    });
    setShortLinkId(data.id);
  }

  async function updateShortLink() {
    if (!shortLinkId) {
      return;
    }
    await apiFetch(`/api/links/${shortLinkId}`, {
      method: "PUT",
      body: JSON.stringify({ config: effectiveConfig })
    });
  }

  async function removeShortLink() {
    if (!shortLinkId) {
      return;
    }
    await apiFetch(`/api/links/${shortLinkId}`, {
      method: "DELETE",
      body: JSON.stringify({})
    });
    setShortLinkId("");
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
      <div className="surface-panel p-5 md:p-6 lg:min-h-[calc(100vh-6.8rem)]">
        <div className="space-y-6">
          <section>
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div className="min-w-0">
                <label className="field">
                  <span className="field-label">导入长链接 / 短链接</span>
                  <input
                    type="text"
                    value={linkInput}
                    onChange={(event) => setLinkInput(event.target.value)}
                    placeholder="粘贴 /sub/... 或 /s/... 链接"
                    className="field-input"
                  />
                </label>
              </div>
              <button
                type="button"
                onClick={importLink}
                className={`${primaryButtonClass} lg:min-w-[7rem]`}
              >
                解析
              </button>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                ["目标格式", config.target === "meta" ? "Clash.Meta" : "Clash"],
                ["当前模板", `${config.template.mode}:${config.template.value}`],
                ["长链接长度", `${longLink.length} 字符`]
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="metric-chip"
                >
                  <p className="text-[0.68rem] uppercase tracking-[0.16em] text-[var(--stone)]">
                    {label}
                  </p>
                  <p className="mt-2 font-display text-[1.35rem] leading-none">{value}</p>
                </div>
              ))}
            </div>
          </section>

          <EditorSection
            eyebrow="Inputs"
            title="订阅聚合"
            description="支持多个订阅地址与单节点混合输入。订阅前缀会附加到该订阅的每个节点名上。"
          >
            <SubscriptionEditor
              subscriptions={config.sources.subscriptions}
              onChange={(subscriptions) =>
                setConfig((current) => ({
                  ...current,
                  sources: {
                    ...current.sources,
                    subscriptions
                  }
                }))
              }
            />

            <Textarea
              className="mt-5"
              label="单节点输入"
              value={nodesText}
              onChange={setNodesText}
              rows={7}
              placeholder={"每行一个节点分享链接，例如：\nvmess://...\nss://..."}
            />
          </EditorSection>

          <EditorSection
            eyebrow="Template"
            title="模板与目标类型"
            description="模板来源仅支持内置模板与后台自建模板。"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Select
                label="目标"
                value={config.target}
                onChange={(value) => setConfig((current) => ({ ...current, target: value }))}
                options={[
                  { value: "meta", label: "Clash.Meta" },
                  { value: "clash", label: "Clash" }
                ]}
              />
              <Select
                label="模板"
                value={`${config.template.mode}:${config.template.value}`}
                onChange={updateTemplate}
                options={templateOptions}
              />
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <Toggle
                label="强制刷新订阅缓存"
                checked={Boolean(config.options.refresh)}
                onChange={(value) =>
                  setConfig((current) => ({
                    ...current,
                    options: { ...current.options, refresh: value }
                  }))
                }
              />
              <Toggle
                label="国家组测速"
                checked={Boolean(config.options.autoTest)}
                onChange={(value) =>
                  setConfig((current) => ({
                    ...current,
                    options: { ...current.options, autoTest: value }
                  }))
                }
              />
              <Toggle
                label="lazy url-test"
                checked={Boolean(config.options.lazy)}
                onChange={(value) =>
                  setConfig((current) => ({
                    ...current,
                    options: { ...current.options, lazy: value }
                  }))
                }
              />
              <Toggle
                label="仅输出节点列表"
                checked={Boolean(config.options.nodeList)}
                onChange={(value) =>
                  setConfig((current) => ({
                    ...current,
                    options: { ...current.options, nodeList: value }
                  }))
                }
              />
              <Toggle
                label="忽略国家分组"
                checked={Boolean(config.options.ignoreCountryGroup)}
                onChange={(value) =>
                  setConfig((current) => ({
                    ...current,
                    options: { ...current.options, ignoreCountryGroup: value }
                  }))
                }
              />
              <Toggle
                label="启用 UDP"
                checked={Boolean(config.options.useUDP)}
                onChange={(value) =>
                  setConfig((current) => ({
                    ...current,
                    options: { ...current.options, useUDP: value }
                  }))
                }
              />
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Select
                label="国家组排序"
                value={config.options.sort}
                onChange={(value) =>
                  setConfig((current) => ({
                    ...current,
                    options: { ...current.options, sort: value }
                  }))
                }
                options={[
                  { value: "nameasc", label: "名称升序" },
                  { value: "namedesc", label: "名称降序" },
                  { value: "sizeasc", label: "数量升序" },
                  { value: "sizedesc", label: "数量降序" }
                ]}
              />
              <Input
                label="User-Agent"
                value={config.options.userAgent}
                onChange={(value) =>
                  setConfig((current) => ({
                    ...current,
                    options: { ...current.options, userAgent: value }
                  }))
                }
              />
            </div>
          </EditorSection>

          <EditorSection
            eyebrow="Routing"
            title="规则"
            description="在模板之外继续扩展规则和 Rule Provider，支持前置插入。"
          >
            <div>
              <p className="mb-3 text-[0.72rem] uppercase tracking-[0.16em] text-[var(--stone)]">
                Rule Provider
              </p>
              <RuleProviderEditor
                providers={config.routing.ruleProviders}
                onChange={(ruleProviders) =>
                  setConfig((current) => ({
                    ...current,
                    routing: {
                      ...current.routing,
                      ruleProviders
                    }
                  }))
                }
              />
            </div>
            <div className="mt-6">
              <p className="mb-3 text-[0.72rem] uppercase tracking-[0.16em] text-[var(--stone)]">
                规则列表
              </p>
              <RulesEditor
                rules={config.routing.rules}
                onChange={(rules) =>
                  setConfig((current) => ({
                    ...current,
                    routing: {
                      ...current.routing,
                      rules
                    }
                  }))
                }
              />
            </div>
          </EditorSection>

          <EditorSection
            eyebrow="Transforms"
            title="过滤与替换"
            description="`filterRegex` 会删除命中的节点；`replacements` 按顺序执行名称替换。"
          >
            <Input
              label="过滤正则"
              value={config.transforms.filterRegex}
              onChange={(value) =>
                setConfig((current) => ({
                  ...current,
                  transforms: {
                    ...current.transforms,
                    filterRegex: value
                  }
                }))
              }
              placeholder="例如：(过期|测试)"
            />
            <div className="mt-6">
              <ReplacementEditor
                replacements={config.transforms.replacements}
                onChange={(replacements) =>
                  setConfig((current) => ({
                    ...current,
                    transforms: {
                      ...current.transforms,
                      replacements
                    }
                  }))
                }
              />
            </div>
          </EditorSection>

          <EditorSection
            eyebrow="Share"
            title="长链接与短链接"
            description="长链接会直接携带整个配置；超过软限制时，建议改用短链接。"
          >
            <Textarea
              label="长链接"
              value={longLink}
              onChange={null}
              rows={5}
            />
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                className={primaryButtonClass}
                onClick={copyLongLink}
                disabled={!canCopyLongLink}
              >
                复制长链接
              </button>
              {!canCopyLongLink ? (
                <p className="text-sm text-[var(--error)]">
                  长链接接近 Workers URL 限制，建议生成短链接。
                </p>
              ) : null}
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
              <Input
                label="自定义短链 ID"
                value={customShortId}
                onChange={setCustomShortId}
                placeholder="可选，留空则随机生成"
              />
              <button
                type="button"
                onClick={createShortLink}
                className={`${secondaryButtonClass} self-end`}
              >
                生成短链接
              </button>
            </div>

            {shortLinkId ? (
              <div className="mt-5 border-t border-[var(--border)] pt-5">
                <label className="field">
                  <span className="field-label">当前短链</span>
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/s/${shortLinkId}`}
                    className="field-input"
                  />
                </label>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={updateShortLink}
                    className={secondaryButtonClass}
                  >
                    用当前配置更新
                  </button>
                  <button
                    type="button"
                    onClick={removeShortLink}
                    className={dangerButtonClass}
                  >
                    删除短链
                  </button>
                </div>
              </div>
            ) : null}
          </EditorSection>
        </div>
      </div>

      <PreviewPanel
        preview={preview}
        stats={stats}
        warnings={warnings}
        renderError={renderError}
        subscriptionInfo={subscriptionInfo}
      />
    </div>
  );
}
