import { expect, test } from "../../fixtures/test-fixtures";
import { mockOwners } from "../../test-data/mock-owner-data";

test.describe("Owner network", {tag: ["@network"]}, () => {
  test("displays an owner from a mocked response", {tag: ["@mock"]} ,async ({ page, pm }) => {
    const mockOwner = mockOwners[0];

    await page.route("**/api/owners", async (route) => {
      await route.fulfill({
        status: 200,
        json: mockOwners,
      });
    });

    await pm.ownersPage.goto();

    await expect(
      pm.ownersPage.ownerRowByFirstNameAndLastName(
        mockOwner.firstName,
        mockOwner.lastName,
      ),
    ).toBeVisible();
    await expect(
      pm.ownersPage.addressCellForOwner(
        mockOwner.firstName,
        mockOwner.lastName,
        mockOwner.address,
      ),
    ).toBeVisible();
    await expect(
      pm.ownersPage.cityCellForOwner(
        mockOwner.firstName,
        mockOwner.lastName,
        mockOwner.city,
      ),
    ).toBeVisible();
    await expect(
      pm.ownersPage.telephoneCellForOwner(
        mockOwner.firstName,
        mockOwner.lastName,
        mockOwner.telephone,
      ),
    ).toBeVisible();
  });

  test("displays an owner injected into the API response", {tag: ["@interception"]} ,async ({
    page,
    pm,
    owner,
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

    await expect(
      pm.ownersPage.ownerRowByFirstNameAndLastName(
        owner.firstName,
        owner.lastName,
      ),
    ).toBeVisible();
  });
});
