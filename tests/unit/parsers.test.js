import { describe, expect, it } from "vitest";

import { parseProxyLink } from "../../src/domain/parsers/index.js";

describe("协议解析器", () => {
  const cases = [
    [
      "ss",
      "ss://YWVzLTI1Ni1nY206cGFzc0BleGFtcGxlLmNvbTo4NDQz#SS",
      "ss"
    ],
    [
      "ssr",
      "ssr://ZXhhbXBsZS5jb206ODM4ODphdXRoX2FlczEyOF9tZDU6YWVzLTI1Ni1nY206cGxhaW46Y0dGemN3Lz9yZW1hcmtzPVUxTlM",
      "ssr"
    ],
    [
      "vmess",
      "vmess://eyJ2IjoiMiIsInBzIjoiVk1lc3MiLCJhZGQiOiJleGFtcGxlLmNvbSIsInBvcnQiOiI0NDMiLCJpZCI6IjEyMzQ1Njc4LTEyMzQtMTIzNC0xMjM0LTEyMzQ1Njc4OTBhYiIsImFpZCI6IjAiLCJzY3kiOiJhdXRvIiwibmV0Ijoid3MiLCJ0eXBlIjoiIiwiaG9zdCI6ImV4YW1wbGUuY29tIiwicGF0aCI6Ii93cyIsInRscyI6InRscyJ9",
      "vmess"
    ],
    [
      "vless",
      "vless://12345678-1234-1234-1234-1234567890ab@example.com:443?type=ws&security=tls&host=example.com&path=%2Fws#VLESS",
      "vless"
    ],
    [
      "trojan",
      "trojan://secret@example.com:443?type=ws&host=example.com&path=%2Ftrojan#Trojan",
      "trojan"
    ],
    [
      "hysteria",
      "hysteria://example.com:443?upmbps=20&downmbps=100&obfs=salamander#Hysteria",
      "hysteria"
    ],
    [
      "hysteria2",
      "hysteria2://password@example.com:443?sni=example.com#Hysteria2",
      "hysteria2"
    ],
    [
      "socks5",
      "socks5://user:pass@example.com:1080#Socks",
      "socks5"
    ],
    [
      "anytls",
      "anytls://password@example.com:443?sni=example.com#AnyTLS",
      "anytls"
    ]
  ];

  it.each(cases)("可以解析 %s 分享链接", (_, source, expectedType) => {
    const proxy = parseProxyLink(source, { useUDP: true });
    expect(proxy.type).toBe(expectedType);
    expect(proxy.name).not.toBe("");
  });
});
