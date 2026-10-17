# Petclinic Playwright Tests

A Playwright and TypeScript test framework for the [Spring Petclinic Angular frontend](https://github.com/bondar-artem/petclinic-angular) and its REST backend. It combines browser and API checks with focused network, mobile, and visual coverage. The application is started separately and is not included in this repository.

## Tech Stack

Playwright Test · TypeScript · Node.js · Faker · Docker · GitHub Actions

## What This Project Covers

| Area | Coverage |
| --- | --- |
| UI and hybrid flows | Owner search, creation, and details; pet creation and editing; visit creation. Owner and pet preconditions are created through the API where the UI action under test does not require their creation. |
| API | Owner create, read, update, and delete operations. |
| Network | Mocked owner responses, modification of a real API response, and `waitForResponse` checks for UI-triggered requests. |
| Browsers and mobile | Chromium, Firefox, WebKit, and a Pixel 7 mobile emulation project. |
| Visual | Screenshot comparison of the owner form in Chromium. |

## Framework Structure

```text
api/          Owner REST helper
components/   Shared navigation component
fixtures/     PageManager and API-backed owner/pet lifecycle
pages/        Focused page objects and PageManager
test-data/    Generated data, known backend fixtures, and mock responses
tests/        API, E2E, network, mobile, and visual specs
```

## Key Framework Features

- Page objects handle screen-specific actions; a shared navbar component and `PageManager` keep navigation and page access consistent.
- Custom fixtures create owner and pet preconditions through the API. Teardown deletes pets before owners; the visit scenario deletes its visit first.
- Data factories keep Faker out of test cases and combine generated names with unique suffixes. Known seeded owners remain separate from generated data.
- UI create/update flows verify backend responses as well as rendered state. Network tests also exercise isolated mocks and modified real responses.

## Running Locally

Use Node.js 24 (the CI version), npm, Git, and Docker. The commands below start the frontend and backend at the versions pinned in [GitHub Actions](.github/workflows/playwright.yml). Run them from the repository root:

```bash
npm ci
npx playwright install
cp .env.example .env

FRONTEND_COMMIT=6e70caf78572f4a9dc74c8ba2cb119f237e14980
BACKEND_IMAGE=springcommunity/spring-petclinic-rest@sha256:d092779e874fd680357763a6f219d97afb419dca13f6a750ccfb8ac63c610986
FRONTEND_NODE_IMAGE=node:18@sha256:c6ae79e38498325db67193d391e6ec1d224d96c693a8a4d943498556716d3783

git clone --depth 1 https://github.com/bondar-artem/petclinic-angular.git ../petclinic-angular
git -C ../petclinic-angular fetch --depth 1 origin "$FRONTEND_COMMIT"
git -C ../petclinic-angular checkout --detach FETCH_HEAD

docker run -d --name petclinic-backend -p 9966:9966 "$BACKEND_IMAGE"
docker run --rm -v "$PWD/../petclinic-angular:/app" -w /app "$FRONTEND_NODE_IMAGE" npm ci
docker run -d --name petclinic-frontend -p 4200:4200 -v "$PWD/../petclinic-angular:/app" -w /app -e NG_CLI_ANALYTICS=false "$FRONTEND_NODE_IMAGE" npm start -- --host 0.0.0.0 --port 4200 --live-reload=false
```

Set the copied `.env` file to:

```dotenv
BASE_URL=http://localhost:4200
API_URL=http://localhost:9966/petclinic/api
```

Once both services respond, run `npm run typecheck` and `npm test`. On Linux, install browser system dependencies with `npx playwright install --with-deps` if needed. Stop the local containers with `docker rm -f petclinic-frontend petclinic-backend`.

## Useful Commands

| Command | Purpose |
| --- | --- |
| `npm run typecheck` | Check TypeScript without generating JavaScript. |
| `npm test` | Run all configured projects. |
| `npm run test:smoke` | Run scenarios tagged `@smoke`. |
| `npm run test:e2e` | Run tagged UI workflows. |
| `npm run test:api` | Run the API project. |
| `npm run test:network` | Run network tests. |
| `npm run test:mobile` | Run Pixel 7 emulation tests. |
| `npm run test:visual` | Run the Chromium visual test. |
| `npm run test:report` | Open the HTML report. |

Tags such as `@owner`, `@pet`, and `@visit` also have targeted npm scripts.

## CI and Reporting

[GitHub Actions](.github/workflows/playwright.yml) runs on pushes and pull requests to `main`. The functional job installs dependencies, typechecks, starts the backend and frontend with Docker, and runs non-visual tests across the configured desktop, mobile, and API projects. CI uses one worker, two retries, and rejects `test.only`.

The separate visual job starts the application with Docker, then typechecks and runs the Chromium visual test in a pinned Linux Playwright image. The repository includes a Linux Chromium screenshot baseline for that environment. Both jobs upload HTML reports and `test-results/` artifacts; failures retain traces and videos, capture screenshots, and include visual comparison images when applicable.
