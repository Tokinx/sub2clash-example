import { constantTimeEqualStrings } from "../utils/crypto.js";
import { unauthorized } from "../utils/errors.js";

export async function verifyPassword(inputPassword, env) {
  if (!env.APP_PASSWORD) {
    throw unauthorized("服务端未配置 APP_PASSWORD");
  }
  const matched = await constantTimeEqualStrings(inputPassword || "", env.APP_PASSWORD);
  if (!matched) {
    throw unauthorized("密码错误");
  }
  return true;
}
