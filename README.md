# MetaKYC SDK Demo Application

A reference application that demonstrates the [`@asseteragmbh/metakyc`](../metakyc-sdk/README.md) SDK
end to end. It renders a configuration **sidebar** (connection, session, form, and identity-provider
options) and, once you initialize, mounts the full `<MetaKYC>` workflow against a live MetaKYC API.

Use it to try out credentials, workflow keys, session tokens, and identity providers (Sumsub, SardinAI)
without writing any integration code of your own.

> This project uses **pnpm** (not npm). It also installs the SDK from a **private npm scope**, so an
> `NPM_TOKEN` is required before installing — see [Prerequisites](#prerequisites).

---

## What this demo shows

- Initializing the SDK via `MetaKYCProvider` + `<MetaKYC>` (the unified workflow component).
- Minting a server session token with `MetaKYCSession.createToken` (API key + secret key → access token,
  encryption key, and applicant id).
- Tenant-based **or** client-id-based authentication.
- Both endpoint patterns (`host-controller` and `application-service`).
- Passing `initialValues` (read-only pre-filled fields) and `hiddenValues` (submitted but not shown).
- Identity-provider configuration for **Sumsub** (customization name + theme) and **SardinAI**
  (client id + environment).
- Locale switching, field-label modes, config versioning, the SDK version badge, and debug mode.

All settings are editable live in the sidebar and persisted to `localStorage`, and most can also be
seeded from environment variables or URL query parameters (see below).

---

## Prerequisites

- **Node.js 18+**
- **pnpm** — `npm install -g pnpm` if you don't have it.
- An **`NPM_TOKEN`** with read access to the `@asseteragmbh` npm scope. The `.npmrc` in this folder reads
  it from the environment:

  ```
  registry=https://registry.npmjs.org/
  //registry.npmjs.org/:_authToken=${NPM_TOKEN}
  ```

  Export it before installing (or put it in your shell profile / CI secrets):

  ```bash
  export NPM_TOKEN=<your-npm-token>
  ```

  Without this, `pnpm install` cannot resolve `@asseteragmbh/metakyc` and will fail.
- A reachable **MetaKYC API** (defaults to `http://localhost:44302`) plus a valid **API key**,
  **secret key**, and **workflow key** for that environment.

---

## Running tutorial

### 1. Install dependencies

```bash
export NPM_TOKEN=<your-npm-token>   # required for the private @asseteragmbh scope
pnpm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` with your credentials (see [Environment variables](#environment-variables) for the full list):

```env
VITE_METAKYC_API_KEY=your-api-key
VITE_METAKYC_SECRET_KEY=your-secret-key
VITE_TENANT_ID=12
VITE_METAKYC_BASE_URL=http://localhost:44302
VITE_ENDPOINT_PATTERN=host-controller

# Optional — SardinAI
VITE_SARDINAI_CLIENT_ID=your-sardinai-client-id
VITE_SARDINAI_ENVIRONMENT=sandbox
VITE_SARDINAI_REGION=us
```

These values only **pre-fill** the sidebar; you can override anything at runtime in the UI.

### 3. Start the dev server

```bash
pnpm dev
```

Open **http://localhost:3000** (the port is pinned in `vite.config.ts`).

### 4. Fill in the sidebar and initialize

In the left sidebar, the required fields (also shown in the footer hint) are:

- **API Key** — and, for session tokens, **Secret Key**.
- **Tenant ID** (numeric, default `12`) **or** switch the "Tenant Identifier" dropdown to **Client ID**.
- **External Ref ID** — your user identifier. Use the ↻ button to generate a random test id.
- **Workflow Key** — the due-diligence workflow to run.
- **Email**.

Then click **Create Token & Initialize**. If a secret key is present, the demo first calls
`MetaKYCSession.createToken(...)` to mint a session token (and create/return an applicant), then renders
the `<MetaKYC>` workflow in the main panel. The header shows the active SDK version, tenant/client,
applicant id, and a "Token active" indicator with its expiry.

### 5. Complete the workflow

The `<MetaKYC>` component drives the full flow (identity verification, questionnaires, document upload,
risk scoring, appropriateness test, overview, etc.) based on the workflow key. The demo logs lifecycle
events to the browser console:

- `onApplicantCreated(id)`
- `onComplete(result)`
- `onError(error)`

Click **Reset** / **Reset Everything** to clear all stored state (via `clearAllStorage()`) and start over
with a fresh External Ref ID.

### 6. Build for production (optional)

```bash
pnpm build      # tsc && vite build → outputs to dist/
pnpm preview     # serve the production build locally
```

---

## Environment variables

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `VITE_METAKYC_API_KEY` | Yes | — | API key for the MetaKYC backend. |
| `VITE_METAKYC_SECRET_KEY` | For session tokens | — | Secret key used by `MetaKYCSession.createToken`. |
| `VITE_TENANT_ID` | One of tenant/client | `12` | Numeric tenant id. |
| `VITE_CLIENT_ID` | One of tenant/client | — | String client id (use when auth mode is "Client ID"). |
| `VITE_METAKYC_BASE_URL` | Yes | `http://localhost:44302` | Base URL of the MetaKYC API. |
| `VITE_ENDPOINT_PATTERN` | No | `host-controller` | `host-controller` or `application-service`. |
| `VITE_SARDINAI_CLIENT_ID` | No | — | Enables SardinAI when set. |
| `VITE_SARDINAI_ENVIRONMENT` | No | `sandbox` | `sandbox` or `production`. |
| `VITE_SARDINAI_REGION` | No | `us` | SardinAI region. |

### URL query parameters

The sidebar can also be seeded from the URL, which is handy for sharing pre-configured links:

`apiKey`, `tenantId`, `clientId`, `apiBaseUrl`, `endpointPattern`, `workflowKey`, `externalRefId`,
`sardineClientId`, `sardineEnvironment`.

Example: `http://localhost:3000/?workflowKey=INDIVIDUAL_KYC&externalRefId=USER-123`

---

## API endpoint patterns

The SDK supports two endpoint conventions, selectable in the sidebar or via `VITE_ENDPOINT_PATTERN`:

1. **host-controller** (default) — `/api/[Controller]/[Action]`
2. **application-service** — `/services/app/[Service]/[Method]`

---

## Identity providers

- **Sumsub** — configured client-side here via a **customization name** (default `meta-sk`) and
  **theme** (light/dark). Passed through `identityProviders.sumsub`.
- **SardinAI** — set a **Client ID** + **Environment** (and `VITE_SARDINAI_REGION`) to enable. Passed
  through `identityProviders.sardinai`. The provider implementation lives in the SDK at
  `metakyc-sdk/src/identity/providers/sardin-ai.ts`.
- **Onfido** — configured entirely on the API side; no client configuration needed.

---

## Project structure

```
metakyc-sdk-demo/
├── .env.example                 # template for your .env
├── .npmrc                       # reads NPM_TOKEN for the private @asseteragmbh scope
├── vite.config.ts               # dev server pinned to port 3000; injects __SDK_VERSION__
├── index.html
└── src/
    ├── main.tsx                 # React entry
    ├── App.tsx                  # the entire demo (sidebar config + <MetaKYC> mount)
    ├── index.css
    ├── components/              # legacy example components (not used by App.tsx)
    └── config/
        └── form-fields.example.ts  # optional sample field sets (reference only)
```

> Note: `src/components/` and `src/config/form-fields.example.ts` are example/reference material and are
> **not** imported by the current `App.tsx`. The live demo logic is entirely in `App.tsx`.

---

## Troubleshooting

**`pnpm install` fails on `@asseteragmbh/metakyc`** — `NPM_TOKEN` is not set or lacks access to the
private scope. Export a valid token and reinstall.

**App not on the expected port** — it runs on **http://localhost:3000** (set in `vite.config.ts`),
not Vite's default 5173.

**"Create Token & Initialize" is disabled** — fill in all required fields: API Key, External Ref ID,
Workflow Key, Email, and a Tenant ID or Client ID.

**Token creation fails** — `MetaKYCSession.createToken` requires `externalRefId`, `workflowKey`, and
`email`, plus a valid API key **and secret key** for the target tenant/client and base URL. The error
message is shown under the Session section.

**API connection issues** — verify `VITE_METAKYC_BASE_URL`, that the API server is running, and that the
API key/tenant are correct. Open DevTools → Network to inspect the calls; enable **Debug mode** in the
sidebar for the DevToolbar + API trace.

**Identity verification / expired session** — reset via the **Reset** button; the SDK will request a new
session on re-initialize.

---

## Documentation

- SDK: [`../metakyc-sdk/README.md`](../metakyc-sdk/README.md)
- Form configuration: [`../metakyc-sdk/DYNAMIC_FORM_CONFIG.md`](../metakyc-sdk/DYNAMIC_FORM_CONFIG.md)
- Theming: [`../metakyc-sdk/THEMING_SYSTEM.md`](../metakyc-sdk/THEMING_SYSTEM.md)
- Workflow key management: [`../metakyc-sdk/WORKFLOW_KEY_MANAGEMENT.md`](../metakyc-sdk/WORKFLOW_KEY_MANAGEMENT.md)
- SardinAI integration: [`../metakyc-sdk/SARDINAI_INTEGRATION.md`](../metakyc-sdk/SARDINAI_INTEGRATION.md)
</content>
</invoke>
