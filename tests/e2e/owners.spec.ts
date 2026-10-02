import { expect, test } from "@playwright/test";
import { createOwnerData, existingOwners } from "../../test-data/owner-data";
import { PageManager } from "../../pages/page-manager";

test.describe("Owners tests", () => {
  test("Home page opens correctly", async ({ page }) => {
    const pm = new PageManager(page)

    await pm.homePage.goto()
    await expect(page).toHaveURL("/petclinic/");

    await expect(pm.homePage.welcomeMessage).toBeVisible();

    await expect(
      pm.navBar.homeButton,
    ).toBeVisible();
    await expect(
      pm.navBar.ownersButton,
    ).toBeVisible();
    await expect(
      pm.navBar.veterinariansButton,
    ).toBeVisible();
    await expect(
      pm.navBar.petTypesButton,
    ).toBeVisible();
    await expect(
      pm.navBar.specialtiesButton,
    ).toBeVisible();
  });

  test("Searches for an existing owner by last name", async ({
    page,
  }) => {
    const pm = new PageManager(page)
    
    await pm.homePage.goto()

    await pm.navBar.clickOwnerSearchButton()
    
    await expect(pm.ownersPage.ownersText).toBeVisible();

    const owner = existingOwners.georgeFranklin

    await pm.ownersPage.searchOwner(owner.lastName)

    await expect(pm.ownersPage.ownerRowByLastName(owner.lastName)).toBeVisible();
  });

  test("Creates a new owner successfully", async ({ page }) => {
    const pm = new PageManager(page)

    await pm.ownersPage.goto()

    await pm.ownersPage.openAddOwnerPage()

    const owner = createOwnerData()

    await pm.addOwnerPage.addOwner(owner.firstName, owner.lastName, owner.address, owner.city, owner.telephone)

    const ownerRow = pm.ownersPage.ownerRowByFirstNameAndLastName(owner.firstName, owner.lastName)

    await expect(ownerRow).toBeVisible()
    await expect(ownerRow).toContainText(owner.address);
    await expect(ownerRow).toContainText(owner.city);
    await expect(ownerRow).toContainText(owner.telephone);



  });
});


