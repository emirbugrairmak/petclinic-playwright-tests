import { createOwnerData, existingOwners } from "../../test-data/owner-data";
import { test, expect } from "../../fixtures/test-fixtures";

test.describe("Owners tests", {tag: ["@e2e"]}, () => {
  test("Home page opens correctly", {tag: ["@smoke", "@home"]}, async ({ pm, page }) => {
    await pm.homePage.goto();
    await expect(page).toHaveURL("/petclinic/");

    await expect(pm.homePage.welcomeMessage).toBeVisible();

    await expect(pm.navBar.homeButton).toBeVisible();
    await expect(pm.navBar.ownersButton).toBeVisible();
    await expect(pm.navBar.veterinariansButton).toBeVisible();
    await expect(pm.navBar.petTypesButton).toBeVisible();
    await expect(pm.navBar.specialtiesButton).toBeVisible();
  });

  test("Searches for an existing owner by last name", {tag: ["@smoke", "@owner"]}, async ({ pm }) => {
    await pm.homePage.goto();

    await pm.navBar.clickOwnerSearchButton();

    await expect(pm.ownersPage.ownersText).toBeVisible();

    const owner = existingOwners.georgeFranklin;

    await pm.ownersPage.searchOwner(owner.lastName);

    await expect(
      pm.ownersPage.ownerRowByLastName(owner.lastName),
    ).toBeVisible();
  });

  test("Creates a new owner successfully", {tag: ["@smoke", "@owner"]}, async ({ pm }) => {
    await pm.ownersPage.goto();

    await pm.ownersPage.openAddOwnerPage();

    const owner = createOwnerData();

    await pm.addOwnerPage.addOwner(owner);

    const ownerRow = pm.ownersPage.ownerRowByFirstNameAndLastName(
      owner.firstName,
      owner.lastName,
    );

    await expect(ownerRow).toBeVisible();
    await expect(ownerRow).toContainText(owner.address);
    await expect(ownerRow).toContainText(owner.city);
    await expect(ownerRow).toContainText(owner.telephone);
  });

  test("Displays API-created owner correctly in UI", {tag: ["@api", "@owner"]}, async ({
    pm,
    owner,
  }) => {
    await pm.ownersPage.goto();

    await pm.ownersPage.searchOwner(owner.lastName);

    await pm.ownersPage.openOwner(owner.firstName, owner.lastName);

    await expect(pm.ownerDetailsPage.nameCell).toHaveText(
      `${owner.firstName} ${owner.lastName}`,
    );
    await expect(pm.ownerDetailsPage.addressCell).toHaveText(owner.address);
    await expect(pm.ownerDetailsPage.telephoneCell).toHaveText(owner.telephone);
    await expect(pm.ownerDetailsPage.cityCell).toHaveText(owner.city);

  });
});
