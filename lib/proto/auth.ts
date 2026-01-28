/* eslint-disable @typescript-eslint/no-unused-vars */
import z from "zod";

const LoginSchema = z.object({
  email: z.string(),
  phone: z.string(),
  password: z.string(),
});

const RegisterSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
});
const RefreshTokenSchema = z.object({
  token: z.any(),
});

const RefreshTokenResponse = z.object({
  message: z.string(),
  data: z.object({
    token: z.string(),
  }),
});
const SessionResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    user_id: z.string(),
    token: z.string(),
    refresh_token: z.string(),
    access_expires_in: z.number(),
    refresh_expires_in: z.number(),
  }),
});

const UserResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    id: z.number(),
    avatar_url: z.string(),
    name: z.string(),
    firstname: z.string(),
    lastname: z.string(),
    email: z.string(),
    date_of_birth: z.string(),
    nin: z.string(),
    passport: z.string(),
    department: z.string(),
    position: z.string(),
    salary: z.string(),
    created_at: z.string(),
    leave_status: z.string(),
  }),
});

export type SessionResponseSchema = z.infer<typeof SessionResponseSchema>;
export type RefreshTokenResponseSchema = z.infer<typeof RefreshTokenResponse>;
export type LoginSchema = z.infer<typeof LoginSchema>;
export type RegisterSchema = z.infer<typeof RegisterSchema>;
export type RefreshTokenSchema = z.infer<typeof RefreshTokenSchema>;
export type UserResponseSchema = z.infer<typeof UserResponseSchema>;
