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
git clone --depth 1 https://github.com/bondar-artem/petclinic-angular.git ../petclinic-angular
docker run -d --name petclinic-backend -p 9966:9966 springcommunity/spring-petclinic-rest
docker run --rm -v "$PWD/../petclinic-angular:/app" -w /app node:18 npm ci
docker run -d --name petclinic-frontend -p 4200:4200 -v "$PWD/../petclinic-angular:/app" -w /app -e NG_CLI_ANALYTICS=false node:18 npm start -- --host 0.0.0.0 --port 4200
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

## Status

Actively developed; framework review and final refinements are ongoing.
