# Petclinic Playwright Tests

Playwright and TypeScript test framework for the [Spring Petclinic Angular frontend](https://github.com/bondar-artem/petclinic-angular) and its REST backend. It covers browser workflows, owner API CRUD, network behavior, mobile emulation, and visual regression. The application itself is not included in this repository.

**Stack:** Playwright Test, TypeScript, Node.js, Docker, GitHub Actions.

## Coverage and design

| Area | What is tested |
| --- | --- |
| UI and API | Owner and pet workflows, owner CRUD, and API-created data used in UI tests |
| Network | Mocked owners, modified real responses, and `waitForResponse` assertions |
| Browser and mobile | Chromium, Firefox, WebKit, and a Pixel 7 Chromium project |
| Visual | Owner form screenshot compared with a Chromium baseline |

Page objects and a shared `PageManager` keep UI interactions out of test cases. A navbar component models shared navigation; an API helper wraps owner requests. Custom fixtures provide these objects and create owner preconditions with teardown cleanup. Generated owner and pet data reduces collisions when tests run in parallel.

```text
api/          Owner API helper
components/   Shared navbar component
fixtures/     PageManager, API helper, and owner-data fixtures
pages/        Page objects and PageManager
test-data/    Generated and mocked test data
tests/        api/, e2e/, mobile/, network/, visual/
```

Tests use tags such as `@smoke`, `@e2e`, `@api`, `@network`, and `@visual` for targeted runs. Playwright runs tests in parallel locally; CI uses one worker, two retries, and rejects accidental `test.only` calls.

## Run locally

Requires Node.js, npm, Git, and Docker. The frontend must be cloned separately. From the root of this repository:

```bash
npm ci
npx playwright install
FRONTEND_COMMIT=6e70caf78572f4a9dc74c8ba2cb119f237e14980
BACKEND_IMAGE=springcommunity/spring-petclinic-rest@sha256:d092779e874fd680357763a6f219d97afb419dca13f6a750ccfb8ac63c610986
FRONTEND_NODE_IMAGE=node:18@sha256:c6ae79e38498325db67193d391e6ec1d224d96c693a8a4d943498556716d3783
git clone --depth 1 https://github.com/bondar-artem/petclinic-angular.git ../petclinic-angular
git -C ../petclinic-angular fetch --depth 1 origin "$FRONTEND_COMMIT"
git -C ../petclinic-angular checkout --detach FETCH_HEAD
docker run -d --name petclinic-backend -p 9966:9966 "$BACKEND_IMAGE"
docker run --rm -v "$PWD/../petclinic-angular:/app" -w /app "$FRONTEND_NODE_IMAGE" npm ci
docker run -d --name petclinic-frontend -p 4200:4200 -v "$PWD/../petclinic-angular:/app" -w /app -e NG_CLI_ANALYTICS=false "$FRONTEND_NODE_IMAGE" npm start -- --host 0.0.0.0 --port 4200 --live-reload=false
cp .env.example .env
```

If the frontend is already cloned next to this repository, skip the `git clone` command. Set these values in `.env`, then wait for `http://localhost:4200/` and `http://localhost:9966/petclinic/api/owners` to respond:

```dotenv
BASE_URL=http://localhost:4200
API_URL=http://localhost:9966/petclinic/api
```

| Command | Purpose |
| --- | --- |
| `npm test` | All configured projects and tests |
| `npm run typecheck` | Check TypeScript types without emitting files |
| `npm run test:smoke` | Smoke tests |
| `npm run test:e2e` | Tagged UI workflows |
| `npm run test:api` | API-tagged tests |
| `npm run test:network` | Network tests |
| `npm run test:chromium` | Chromium project |
| `npm run test:mobile` | Mobile Chromium project |
| `npm run test:visual` | Chromium visual comparison |
| `npm run test:visual:update` | Update the current platform's Chromium baseline |
| `npm run test:ui` | Playwright UI mode |
| `npm run test:report` | Open the HTML report |

The HTML report is written to `playwright-report/`. Failed tests retain traces and videos and capture screenshots in `test-results/`. Remove the local application containers with `docker rm -f petclinic-frontend petclinic-backend` when finished.

## Visual testing and CI

Screenshot rendering depends on the operating system. The committed `formscreenshot-chromium-linux.png` baseline was generated with `mcr.microsoft.com/playwright:v1.63.0-noble` on Linux/amd64; the visual CI job uses that same image and runs `@visual` only on Chromium. Review screenshot changes before updating a baseline. Running `test:visual:update` directly on macOS updates a macOS baseline, not the Linux CI baseline.

[GitHub Actions](.github/workflows/playwright.yml) runs on pushes and pull requests targeting `main`:

- **Functional job:** starts the backend and frontend, then runs non-visual tests across Chromium, Firefox, WebKit, and mobile Chromium.
- **Visual job:** starts the application independently and compares the Chromium screenshot in the pinned Playwright Linux container.

Both jobs upload their HTML reports and `test-results/` as separate artifacts, including failure traces and visual `expected`, `actual`, and `diff` images when produced.

CI runs `npm run typecheck` before tests. The frontend commit, backend image, frontend Node image, Playwright image, runner OS, Node version, and action revisions are pinned in the workflow. Direct npm dependencies use exact versions in `package.json`; `package-lock.json` locks the full dependency tree. To update the application versions, use `git ls-remote https://github.com/bondar-artem/petclinic-angular.git HEAD` for the frontend commit and `docker buildx imagetools inspect IMAGE:TAG` for an image digest. Update the workflow values and the local commands above; also update the frontend Node image in `playwright.config.ts`. Verify the new application versions with `npm run typecheck` and `npm test` before committing. The screenshot baseline may need review if the frontend or Playwright image changes.

## Status

Actively developed; framework review and final refinements are ongoing.
