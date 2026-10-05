import { expect, test } from "../../fixtures/test-fixtures";
import { mockOwners } from "../../test-data/mock-owner-data";

test.describe("Owners network tests", {tag: ["@network"]}, () => {
  test("TC-N01 displays mocked owners", {tag: ["@mock"]} ,async ({ page, pm }) => {
    const mockData = mockOwners;

    await page.route("**/api/owners", async (route) => {
      await route.fulfill({
        status: 200,
        json: mockData,
      });
    });

    await pm.ownersPage.goto();

    await expect(
      pm.ownersPage.ownerRowByFirstNameAndLastName(
        mockData[0].firstName,
        mockData[0].lastName,
      ),
    ).toBeVisible();
  });

  test("TC-N02 displays an injected owner from modified respons", {tag: ["@interception"]} ,async ({
    page,
    pm,
  }) => {
    await page.route("**/api/owners", async (route) => {
      const response = await route.fetch();
      const responseBody = await response.json();

      responseBody.push(mockOwners[0]);

      await route.fulfill({
        response: response,
        json: responseBody,
      });
    });

    await pm.ownersPage.goto();

    await expect(
      pm.ownersPage.ownerRowByFirstNameAndLastName(
        mockOwners[0].firstName,
        mockOwners[0].lastName,
      ),
    ).toBeVisible();
  });
});
