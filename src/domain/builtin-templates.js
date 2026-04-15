import { notFound } from "../utils/errors.js";

export const BUILTIN_TEMPLATES = [
  {
    id: "clash-default",
    name: "Clash 默认模板",
    target: "clash",
    builtin: true,
    assetPath: "/templates/clash-default.yaml"
  },
  {
    id: "meta-default",
    name: "Clash.Meta 默认模板",
    target: "meta",
    builtin: true,
    assetPath: "/templates/meta-default.yaml"
  }
];

export function listBuiltinTemplates() {
  return BUILTIN_TEMPLATES.map((template) => ({
    id: template.id,
    name: template.name,
    target: template.target,
    builtin: true
  }));
}

export async function loadBuiltinTemplate(env, request, id) {
  const template = BUILTIN_TEMPLATES.find((item) => item.id === id);
  if (!template) {
    throw notFound("内置模板不存在");
  }

  const response = await env.ASSETS.fetch(new Request(new URL(template.assetPath, request.url)));
  if (!response.ok) {
    throw notFound("内置模板资源不存在");
  }
  return {
    ...template,
    content: await response.text()
  };
}
