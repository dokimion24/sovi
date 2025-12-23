# sovi

> Tiny fetch client with a simple API.

[![npm version](https://img.shields.io/npm/v/sovi.svg)](https://www.npmjs.com/package/sovi)

## Features

- 🪶 **Lightweight** - Zero dependencies, ~1KB gzipped
- 🔗 **Chainable API** - Fluent interface for building requests
- 📝 **TypeScript first** - Full type safety with path parameter inference
- 🔄 **Immutable** - Each method returns a new instance
- 🎯 **Simple** - No complex configuration needed

## Installation

```bash
npm install sovi
```

```bash
pnpm add sovi
```

```bash
yarn add sovi
```

## Quick Start

```typescript
import { sovi } from "sovi";

// Create a client
const api = sovi({ baseUrl: "https://api.example.com" });

// GET request
const users = await api.url("/users").get().json();

// POST request
const newUser = await api
  .url("/users")
  .post({ name: "Kim", email: "kim@example.com" })
  .json();

// With path parameters
const user = await api.url("/users/:id", { id: 1 }).get().json();

// With query parameters
const filtered = await api
  .url("/users")
  .query({ page: 1, limit: 10 })
  .get()
  .json();
```

## Usage

### Creating a Client

```typescript
import { sovi } from "sovi";

const api = sovi({
  baseUrl: "https://api.example.com",
  headers: {
    Authorization: "Bearer token",
  },
});
```

### HTTP Methods

```typescript
// GET
api.url("/users").get();

// POST
api.url("/users").post({ name: "Kim" });

// PUT
api.url("/users/:id", { id: 1 }).put({ name: "Lee" });

// PATCH
api.url("/users/:id", { id: 1 }).patch({ name: "Park" });

// DELETE
api.url("/users/:id", { id: 1 }).delete();
```

### Path Parameters

Path parameters are automatically inferred from the URL pattern:

```typescript
// TypeScript will require { id: string | number }
api.url("/users/:id", { id: 1 }).get();

// Multiple parameters
api.url("/users/:userId/posts/:postId", { userId: 1, postId: 42 }).get();
```

### Query Parameters

```typescript
api.url("/users").query({ page: 1, limit: 10 }).get();
// GET /users?page=1&limit=10
```

### Headers

```typescript
api.url("/protected").headers({ Authorization: "Bearer new-token" }).get();
```

### Response Handling

```typescript
// JSON (with type inference)
const data = await api.url<User[]>("/users").get().json();

// Text
const text = await api.url("/text").get().text();

// Blob
const blob = await api.url("/image").get().blob();

// Raw Response
const response = await api.url("/users").get().res();
```

### Error Handling

```typescript
import { sovi, SoviError } from "sovi";

try {
  const data = await api.url("/users").get().json();
} catch (error) {
  if (error instanceof SoviError) {
    console.log(error.status); // 404
    console.log(error.statusText); // "Not Found"
    console.log(error.response); // Response object
  }
}
```

### Direct Method Calls

When using only `baseUrl`, you can call HTTP methods directly:

```typescript
const usersApi = sovi({ baseUrl: "https://api.example.com/users" });

// These are equivalent:
usersApi.get();
usersApi.url("").get();

// With query
usersApi.query({ page: 1 }).get();
```

## API Reference

### `sovi(config?)`

Creates a new Sovi client instance.

| Option    | Type                     | Description               |
| --------- | ------------------------ | ------------------------- |
| `baseUrl` | `string`                 | Base URL for all requests |
| `headers` | `Record<string, string>` | Default headers           |

### Instance Methods

| Method                | Description                           |
| --------------------- | ------------------------------------- |
| `.url(path, params?)` | Set URL with optional path parameters |
| `.query(params)`      | Add query parameters                  |
| `.headers(headers)`   | Add headers                           |
| `.get()`              | Send GET request                      |
| `.post(body?)`        | Send POST request                     |
| `.put(body?)`         | Send PUT request                      |
| `.patch(body?)`       | Send PATCH request                    |
| `.delete()`           | Send DELETE request                   |

### Response Methods

| Method           | Return Type            | Description                   |
| ---------------- | ---------------------- | ----------------------------- |
| `.json()`        | `Promise<T>`           | Parse response as JSON        |
| `.text()`        | `Promise<string>`      | Parse response as text        |
| `.blob()`        | `Promise<Blob>`        | Parse response as Blob        |
| `.arrayBuffer()` | `Promise<ArrayBuffer>` | Parse response as ArrayBuffer |
| `.formData()`    | `Promise<FormData>`    | Parse response as FormData    |
| `.res()`         | `Promise<Response>`    | Get raw Response object       |
