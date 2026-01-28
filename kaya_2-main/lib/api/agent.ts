import {
  LoginSchema,
  RefreshTokenResponseSchema,
  RefreshTokenSchema,
  RegisterSchema,
  SessionResponseSchema,
} from "../proto/auth";
import { auth, client } from "./client";
import { handler } from "./handler";

async function sessionAgent(
  req: LoginSchema | RegisterSchema
): Promise<SessionResponseSchema> {
  return await handler<SessionResponseSchema>("/auth/login", req, "post", auth);
}

async function refreshTokenAgent(
  req: RefreshTokenSchema
): Promise<RefreshTokenResponseSchema> {
  return await handler<SessionResponseSchema>(
    "/auth/refresh",
    req,
    "post",
    auth
  );
}
async function logoutAgent(): Promise<{ message: string }> {
  return await handler<{ message: string }>(
    "/sessions/invalidate",
    null,
    "post",
    client
  );
}

export { sessionAgent, refreshTokenAgent, logoutAgent };
