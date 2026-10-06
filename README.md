# AskNow API example

A separate React + Vite app consuming `asknow-react`. Choose the Figma input bar
or floating chatbot; both use the suggestions and search APIs.

## Run

```sh
cd ../asknow_extension
npm install
cd ../asknow-example
npm install
npm run dev
```

Enter your current **Access token** and **User ID**, set the API endpoint, and click **Apply API settings**. Credentials stay in memory and reset
on reload. Applying new settings resets the current conversation.

- Suggestions: POST `external/utils/query_suggestions` with `query`, `use_case`, `limit`.
- Search: POST `external/chat/search` with `query`, `session_id`, `mode`, `user_id`, `department_id`.
- Every request sends `x-user-id`. The local proxy converts the token header into
  the upstream `access-token` cookie, matching the supplied curl authentication.
- Default use case is `khoj`, limit is `3`, department is `root`, mode is `null`,
  and session ID is generated as `chat_<uuid>`. These defaults are managed by the library; override them through optional widget props.
- Suggestions load after 300 ms for queries of at least two characters. Clicking
  one fills the input; press Enter or send to search. Superseded suggestion
  requests are cancelled. Search requests time out after 90 seconds.

`asknow_extension/src/api/AskNowApi.ts` defines the library API class, request
configuration, response validation, cancellation, and HTTP/authentication errors.
The example contains no API client or response handling code. Import `AskNowApi`
from `asknow-react` for direct use, or use `AskNowWidget` for the complete integration.
Use the class's
`querySuggestions(query, signal?)` and `search(query, signal?)` methods from any UI.
The Figma input shows answer content and source references. The chatbot shows
answer content in its conversation. Voice input is not connected.

## UAT proxy configuration

Copy `.env.example` to `.env.local` if you need to adjust server settings.
Restart Vite after editing it. `ASKNOW_SESSION_COOKIES` may contain additional
`SESSION` / gateway cookies from your current UAT session if required. Do not
include `access-token`; it comes from the form. These variables have no `VITE_`
prefix and are only read by the server config.

TLS verification is enabled by default. `ASKNOW_ALLOW_INSECURE_TLS=true` is an
explicit UAT-only equivalent of the supplied curl's `--insecure` option.

The Vite development and preview servers proxy `/asknow-api` to the UAT origin.
A deployed static app needs an equivalent backend proxy for those routes; Vite's
proxy is not included in `dist`. The proxy allows only these two API paths and
removes upstream Set-Cookie headers. Live UAT authentication must be checked with
your current credentials; integration was verified against a local mock API.

```sh
npm run build
npm run preview
```

## Minimal library usage

```tsx
import { AskNowWidget } from 'asknow-react';
import 'asknow-react/style.css';

<AskNowWidget
  endpoint="/asknow-api"
  accessToken={accessToken}
  userId={userId}
  variant="input" // or "chatbot"
/>
```

User ID is required by the supplied API contract. Session ID, department, use case,
suggestion limit, mode, suggestions, answers, and errors are handled by the library.
The endpoint is the API base path, without `/chat/search` or `/utils/query_suggestions`.

The example Vite config imports `createAskNowProxy` from `asknow-react/vite`;
the proxy implementation also lives in the library. Import that entry only in
server configuration. Browser code uses the normal `asknow-react` entry.

`npm run dev` and `npm run build` rebuild the local library automatically before
starting Vite, so its JavaScript, types, styles, and server proxy exports are current.
The app lives in `src/App.tsx`; `src/main.tsx` only mounts it, allowing React Fast Refresh
to update the app without creating a second root.
