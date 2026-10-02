import { expect, test } from "@playwright/test";
import { createOwnerData, existingOwners } from "../../test-data/owner-data";
import { PageManager } from "../../pages/page-manager";
import { OwnerApi } from "../../api/owner-api";

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

    await pm.addOwnerPage.addOwner(owner)

    const ownerRow = pm.ownersPage.ownerRowByFirstNameAndLastName(owner.firstName, owner.lastName)

    await expect(ownerRow).toBeVisible()
    await expect(ownerRow).toContainText(owner.address);
    await expect(ownerRow).toContainText(owner.city);
    await expect(ownerRow).toContainText(owner.telephone);



  });

  test('Displays API-created owner correctly in UI', async ({ page, request }) => {
    const pm = new PageManager(page)
    const owner = createOwnerData();
    let ownerId: number | undefined;
    const ownerApi = new OwnerApi(request)

    try{

      const createOwnerResponse = await ownerApi.createOwner(owner)

      const createOwnerBody = await createOwnerResponse.json();
      ownerId = createOwnerBody.id
      expect(createOwnerResponse.status()).toBe(201);

      await pm.ownersPage.goto()

      await pm.ownersPage.searchOwner(owner.lastName)

      await pm.ownersPage.openOwner(owner.firstName, owner.lastName)

      await expect(pm.ownerDetailsPage.nameCell).toHaveText(`${owner.firstName} ${owner.lastName}`)
      await expect(pm.ownerDetailsPage.addressCell).toHaveText(owner.address)
      await expect(pm.ownerDetailsPage.telephoneCell).toHaveText(owner.telephone)
      await expect(pm.ownerDetailsPage.cityCell).toHaveText(owner.city,);

    }finally{
      if(ownerId !== undefined){
        const deleteOwnerResponse = await ownerApi.deleteOwner(ownerId)
        expect.soft(deleteOwnerResponse.status()).toBe(204);
      }
    }


  });


});

