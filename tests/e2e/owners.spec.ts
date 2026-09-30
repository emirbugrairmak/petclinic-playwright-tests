import { expect, test } from "@playwright/test";
import { HomePage } from "../../pages/home-page";
import { OwnersPage } from "../../pages/owners-page";
import { AddOwnerPage } from "../../pages/add-owner-page";
import { owners } from "../../test-data/owner-data";

test.describe("Owners tests", () => {
  test("Home page opens correctly", async ({ page }) => {
    const homePage = new HomePage(page)

    await homePage.goto()
    await expect(page).toHaveURL("/petclinic/");

    await expect(homePage.welcomeMessage).toBeVisible();

    await expect(
      homePage.navBar.homeButton,
    ).toBeVisible();
    await expect(
      homePage.navBar.ownersButton,
    ).toBeVisible();
    await expect(
      homePage.navBar.veterinariansButton,
    ).toBeVisible();
    await expect(
      homePage.navBar.petTypesButton,
    ).toBeVisible();
    await expect(
      homePage.navBar.specialtiesButton,
    ).toBeVisible();
  });

  test("Searches for an existing owner by last name", async ({
    page,
  }) => {
    const homePage = new HomePage(page)
    const ownersPage = new OwnersPage(page)
    
    await homePage.goto()

    await homePage.navBar.clickOwnerSearchButton()
    
    await expect(ownersPage.ownersText).toBeVisible();

    const lastName = "Franklin"
    await ownersPage.searchOwner(lastName)

    await expect(ownersPage.ownerRowByLastName(lastName)).toBeVisible();
  });

  test("Creates a new owner successfully", async ({ page }) => {
    const ownersPage = new OwnersPage(page)
    const addOwnerPage = new AddOwnerPage(page)

    await ownersPage.goto()

    await ownersPage.openAddOwnerPage()

    const owner = owners.validOwners[0]

    await addOwnerPage.addOwner(owner.firstName, owner.lastName, owner.address, owner.city, owner.telephone)

    const ownerRow = ownersPage.ownerRowByFirstNameAndLastName(owner.firstName, owner.lastName)

    await expect(ownerRow).toBeVisible()
    await expect(ownerRow).toContainText(owner.address);
    await expect(ownerRow).toContainText(owner.city);
    await expect(ownerRow).toContainText(owner.telephone);



  });
});
