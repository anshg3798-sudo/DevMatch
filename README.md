# DevMatch

## Run locally

Use Node.js 22.12+ and MongoDB. From the project root, install dependencies:

```sh
npm ci
npm ci --prefix server
npm ci --prefix client
```

Copy `server/.env.example` to `server/.env` and `client/.env.example` to `client/.env`. Configure `MONGO_URI` and set `JWT_SECRET` to a private random value. If you are updating an existing installation, keep its MongoDB connection and JWT secret and add the new settings to its server environment.

Run `npm run dev --prefix server` and `npm run dev --prefix client` in separate terminals. Open `http://localhost:5173`.

## Enable Google and GitHub sign-in

| Provider | Local callback URL | Server environment variables |
| --- | --- | --- |
| [Google OAuth web application](https://developers.google.com/identity/protocols/oauth2/web-server) | `http://localhost:5000/api/auth/oauth/google/callback` | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` |
| [GitHub OAuth App](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app) | `http://localhost:5000/api/auth/oauth/github/callback` | `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` |

Add the callback URLs in the provider consoles. If the Google app is in testing mode, add your testers in the Google console. Choose Candidate or Recruiter when creating an account through social sign-in. Returning users keep their account role and go to their dashboard. DevMatch links existing accounts using a matching verified Gmail or Google Workspace address, or a matching verified primary GitHub email. Use Forgot Password to confirm mailbox access for an existing account with a third-party Google email. GitHub controls the authorization screen and normally skips it after the user grants the requested permissions.

## Verify student GitHub contributions

Students can connect GitHub under the developer profiles section of their student profile. Select **Connect another GitHub account** to add an account, then choose which linked account to check before selecting **Verify Project**. Linked GitHub accounts can also sign into the same DevMatch account. The connection uses the existing GitHub OAuth callback. Optionally set `GITHUB_TOKEN` on the backend to authenticate public repository API requests.

On Applicant Review, recruiters see the linked account, examples of attributed commits or merged pull requests, and project evidence separately. Public repository checks are tied to the default branch commit recorded at verification time. Forks use merged pull requests for attribution because the default branch can contain inherited commits. Re-run older checks to populate the new evidence.

## Enable password reset emails

Set `RESEND_API_KEY` and either `PASSWORD_RESET_EMAIL_FROM` or `SELECTION_EMAIL_FROM` on the server. Use an address on a verified Resend domain. Set `CLIENT_URL` to the frontend origin so links open the correct app. Password reset links expire after 30 minutes and can be used once. A successful reset expires existing DevMatch sessions for that account.

## Enable application decision emails

Verify a sender domain in [Resend](https://resend.com/docs/dashboard/domains/introduction). Set `RESEND_API_KEY` and `SELECTION_EMAIL_FROM` in the server environment. Use an address on the verified domain, such as `DevMatch <notifications@example.com>`.

When a recruiter accepts or rejects an application, the server queues a decision email. It retries failed deliveries for up to 23 hours from the first attempt. While an email is still queued, a newer decision replaces it. Queued messages wait if email credentials are absent. Existing application decisions appear in the student notification bell without triggering an email backfill. Read status is saved in the student's current browser.

## Deploy

Set `CLIENT_URL` to the frontend origin, `PUBLIC_API_URL` to the backend origin, and `VITE_API_URL` to the backend origin followed by `/api`. Use HTTPS and register both OAuth callback URLs with the production backend origin. Serve the client build with an SPA fallback to `index.html` for routes such as `/login`. Run the API as a persistent Node process so it can deliver queued email.
