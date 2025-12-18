---
layout: center
highlighter: shiki
css: unocss
colorSchema: dark
transition: fade-out
mdc: true
glowSeed: 4
title: 从 next-auth 到 better-auth
---

# 从 next-auth 到 better-auth

<div class="mt-4 opacity-50">
面包（Alex Yang）
</div>

---
layout: intro
class: pl-30
glowSeed: 14
---

# 关于我

<div class="[&>*]:important-leading-10 opacity-80">
Better Auth Founding Engineer<br>
Node.js Member, Ex-TC39 Member<br>
Jotai, Waku Core Maintainer<br>
</div>

<div my-10 w-min flex="~ gap-1" items-center justify-center>
  <div i-ri-github-line op50 ma text-xl ml4/>
  <div><a href="https://github.com/himself65" target="_blank" class="border-none! font-300">himself65</a></div>
  <div i-ri-twitter-x-line op50 ma text-xl ml4/>
  <div><a href="https://twitter.com/himself65" target="_blank" class="border-none! font-300">himseif65</a></div>
</div>

<img src="https://avatars.githubusercontent.com/u/14026360" class="w-32 h-32 rounded-full absolute top-40 right-15" />

---
layout: center
class: text-center
---

<div class="flex gap-1 items-center">
  X Spaces <div inline-block i-ri-twitter-line op50 ma text-xl/>
  <a href="https://x.com/i/spaces/1yoKMoAANnwJQ/peek">x.com/i/spaces/1yoKMoAANnwJQ/peek</a>
</div>

<img src="/space.png" class="w-72 mt-10">
---

# Starting from Next Auth

```typescript
import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    })
  ],
}

export default NextAuth(authOptions)
```

---

# Next Auth

- 解决了用户会话（user session）
- 简单方便对接到next.js
- 数据库无关
- 支持多种OAuth（Google、GitHub、Twitter）

---

# Why not Next Auth？

- Next.js 强绑定，Auth.js 至今鸽了
- 看不懂的文档
- 繁琐的定制化
- 没有类型

---

# Better Auth

- 提供多种的登陆方式

````md magic-move
```typescript
export const auth = betterAuth({
  database: new Pool({
    connectionString: DATABASE_URL,
  }),
  emailAndPassword: {
    enabled: true,
  },
});
```

```typescript
import { betterAuth } from "better-auth";
export const auth = betterAuth({
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
});
```

```typescript
import { betterAuth } from "better-auth"
import { emailOTP } from "better-auth/plugins"

export const auth = betterAuth({
    plugins: [
        emailOTP({ 
            async sendVerificationOTP({ email, otp, type }) { 
                if (type === "sign-in") { 
                    // Send the OTP for sign in
                } else if (type === "email-verification") { 
                    // Send the OTP for email verification
                } else { 
                    // Send the OTP for password reset
                } 
            }, 
        }) 
    ]
})
```
````

---

# Better Auth

- 自定义Schema，with TypeScript support

```typescript
import { betterAuth } from "better-auth";
import Database from "better-sqlite3";
export const auth = betterAuth({
  database: new Database("database.db"),
  user: {
    additionalFields: {
      role: {
        type: "string",
        input: false,
      },
    },
  },
});

type Session = typeof auth.$Infer.Session;
```

```shell
npx @better-auth/cli@latest generate
npx @better-auth/cli@latest migrate
```

---

# Better Auth

- 插件系统

```typescript
import { betterAuth } from "better-auth";
import { organization } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [organization()],
});
```

---

# Better Auth

- Framework Agnostic
- Built-In Rate Limiter

---
# 文档

Context 7

![context7.png](/context7.png)

---

# 文档

Chat with AI

---

# 文档

MCP Plugin

---

# AI?

MCP plugin

https://modelcontextprotocol.io/specification/draft/basic/authorization

---

# Better Call (tiny web framework)

- create endpoint
- built-in middlewares
- schema validation

```typescript
import { createEndpoint } from "better-call"
import { z } from "zod"

export const createItem = createEndpoint("/item", {
    method: "POST",
    body: z.object({
        id: z.string()
    })
}, async (ctx) => {
    return {
        item: {
            id: ctx.body.id
        }
    }
})

// Now you can call the endpoint just as a normal function.
const item = await createItem({
    body: {
        id: "123"
    }
})

console.log(item); // { item: { id: '123' } }
```

---

# Better Fetch

- Universal Fetch Client
- Hooks
- Schema Validation

```typescript
import { z } from 'zod'; // or your preferred Standard Schema compliant library
 
const { data: todos, error: todoError } = await betterFetch("https://jsonplaceholder.typicode.com/todos/1", {
    output: z.object({
        userId: z.string(),
        id: z.number(),
        title: z.string(),
        completed: z.boolean(),
    })  
});
```

---

# Roadmap

- Better Client SDK
- `npx auth init`
- UI components
- More plugins
  - electron support
  - OAuth 2.1 server support
  - ...
- Better Auth Enterprise
  - AI
  - Cloud 
  - Dashboard

---

# Infra

![infra.png](/infra.png)

---
layout: center
class: text-center pb-5
---

# Thank You!

<div flex-col flex="~ gap-1" items-center justify-center>
<div class="flex gap-1 items-center">
  Official Website <div inline-block i-ri-global-line op50 ma text-xl/>
  <a href="https://better-auth.com">better-auth.com</a>
</div>
<div class="flex gap-1 items-center">
  GitHub <div inline-block i-ri-github-line op50 ma text-xl/>
  <a href="https://github.com/better-auth/better-auth">better-auth/better-auth</a>
</div>
<div class="flex gap-1 items-center">
  Twitter <div inline-block i-ri-twitter-line op50 ma text-xl/>
  <a href="https://x.com/better_auth">x.com/better_auth</a>
</div>
</div>
<div class="mt-6 flex flex-col items-center">
  <div class="mb-2">微信</div>
  <img src="/wechat.jpg" class="w-45"/>
</div>
