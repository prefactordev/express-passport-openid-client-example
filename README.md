# Prefactor express/passport/openid-client sample

A short example using Express, Passport and `openid-client`.

## Prerequisites

- [Mise](https://mise.jdx.dev/) for tool version management
- Your Prefactor issuer URL, client ID and client secret
- Your authentication redirect URI (in this example `http://localhost:3000/callback`) and 
  logout redirect URI (`http://localhost:3000/`) will need to be added to the Prefactor client application
  otherwise the calls won't succeed.
  
## Setup

1. Install Mise (if not already installed):
   ```bash
   curl https://mise.jdx.dev/install.sh | sh
   ```

2. Install project dependencies and setup tools:
   ```bash
   mise install
   ```

3. Create a `.mise.local.toml` file in the project root with the following (replace things as appropriate):
   ```
   [env]
   SESSION_SECRET = "<GENERATE A LONG SESSION SECRET TO PUT HERE>"
   OPENID_ISSUER = "<YOUR PREFACTOR ISSUER URL>"
   OPENID_CLIENT_ID = "<YOUR PREFACTOR CLIENT ID>"
   OPENID_CLIENT_SECRET = "<YOUR PREFACTOR CLIENT SECRET>"
   BASE_URL = "http://localhost:3000"
   ```

5. Build the TypeScript code:
   ```bash
   pnpm build
   ```

6. Start the server:
   ```bash
   pnpm start
   ```

7. Visit `http://localhost:3000` in your browser

## Development

- The source code is in the `src` directory
- Compiled JavaScript will be in the `dist` directory
- Use `pnpm watch` to automatically recompile on file changes

## Features

- Simple login/logout flow using OpenID Connect
- Session-based authentication
- Clean, minimal UI
- No database required (user data stored in session)
- Written in TypeScript with type safety
- Tool versions managed by Mise

## Notes

- This is a basic example and should not be used in production without proper security measures
