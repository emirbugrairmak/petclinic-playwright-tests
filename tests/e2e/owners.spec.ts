import { createOwnerData, existingOwners } from "../../test-data/owner-data";
import { test, expect } from "../../fixtures/test-fixtures";

test.describe("Home and owner UI", { tag: ["@e2e"] }, () => {
  test(
    "displays the welcome heading and navigation",
    { tag: ["@smoke", "@home"] },
    async ({ pm, page }) => {
      await pm.homePage.goto();
      await expect(page).toHaveURL("/petclinic/");

      await expect(pm.homePage.welcomeHeading).toBeVisible();

      await expect(pm.navBar.homeLink).toBeVisible();
      await expect(pm.navBar.ownersButton).toBeVisible();
      await expect(pm.navBar.veterinariansButton).toBeVisible();
      await expect(pm.navBar.petTypesLink).toBeVisible();
      await expect(pm.navBar.specialtiesLink).toBeVisible();
    },
  );

  test(
    "filters owners by last name",
    { tag: ["@smoke", "@owner"] },
    async ({ pm }) => {
      await pm.homePage.goto();

      await pm.navBar.clickOwnerSearchButton();

      await expect(pm.ownersPage.ownersHeading).toBeVisible();

      const owner = existingOwners.georgeFranklin;
      const bettyDavis = { firstName: "Betty", lastName: "Davis" };

      await pm.ownersPage.searchOwner(bettyDavis.lastName);
      await expect(
        pm.ownersPage.ownerRowByFirstNameAndLastName(
          bettyDavis.firstName,
          bettyDavis.lastName,
        ),
      ).toBeVisible();

      await pm.ownersPage.searchOwner(owner.lastName);

      await expect(
        pm.ownersPage.ownerRowByFirstNameAndLastName(owner.firstName, owner.lastName),
      ).toBeVisible();

      await expect(
        pm.ownersPage.ownerRowByFirstNameAndLastName(
          bettyDavis.firstName,
          bettyDavis.lastName,
        ),
      ).toHaveCount(0);

    },
  );

  test(
    "creates an owner and displays it in the list",
    { tag: ["@smoke", "@owner"] },
    async ({ pm, page, ownerApi }) => {
      await pm.ownersPage.goto();

      await pm.ownersPage.openAddOwnerPage();

      const owner = createOwnerData();
      let ownerId: number | undefined;

      try {
        const responsePromise = page.waitForResponse(
          (response) =>
            response.url().includes("/api/owners") &&
            response.request().method() === "POST",
        );

        await pm.addOwnerPage.addOwner(owner);

        const response = await responsePromise;
        const responseBody = await response.json();
        const createdOwnerId: unknown = responseBody.id;
        if (typeof createdOwnerId !== "number") {
          throw new Error("Created owner ID is not a number");
        }
        ownerId = createdOwnerId;
        expect(response.status()).toBe(201)

        const ownerRow = pm.ownersPage.ownerRowByFirstNameAndLastName(
          owner.firstName,
          owner.lastName,
        );

        await expect(ownerRow).toBeVisible();
        await expect(ownerRow).toContainText(owner.address);
        await expect(ownerRow).toContainText(owner.city);
        await expect(ownerRow).toContainText(owner.telephone);
      } finally {
        if (ownerId !== undefined) {
          const deleteOwnerResponse = await ownerApi.deleteOwner(ownerId);
          expect.soft(deleteOwnerResponse.status()).toBe(204);
          const getOwnerResponse = await ownerApi.getOwner(ownerId)
          expect(getOwnerResponse.status()).toBe(404);
        }
      }
    },
  );

  test(
    "displays an API-created owner's details",
    { tag: ["@owner"] },
    async ({ pm, owner }) => {
      await pm.ownersPage.goto();

      await pm.ownersPage.searchOwner(owner.lastName);

      await pm.ownersPage.openOwner(owner.firstName, owner.lastName);

      await expect(pm.ownerDetailsPage.ownerNameCell).toHaveText(
        `${owner.firstName} ${owner.lastName}`,
      );
      await expect(pm.ownerDetailsPage.ownerAddressCell).toHaveText(owner.address);
      await expect(pm.ownerDetailsPage.ownerCityCell).toHaveText(owner.city);
      await expect(pm.ownerDetailsPage.ownerTelephoneCell).toHaveText(
        owner.telephone,
      );
    },
  );
});
