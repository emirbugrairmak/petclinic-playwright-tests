import { expect, test } from "@playwright/test";
import { owners } from "../../test-data/owner-data";
import { PageManager } from "../../pages/page-manager";

test.describe("pet tests", () => {
  test("Owner detail page should be visited correctly.", async ({ page }) => {
    const pm = new PageManager(page)

    await pm.homePage.goto()

    await pm.navBar.clickOwnerSearchButton()

    const owner = owners.validOwners[2]

    await pm.ownersPage.searchOwner(owner.lastName)

    await pm.ownersPage.openOwner(owner.firstName, owner.lastName);

    await expect(pm.ownerDetailsPage.ownerInformationText).toBeVisible();
    await expect(pm.ownerDetailsPage.nameCell).toHaveText(`${owner.firstName} ${owner.lastName}`)
  });

  test("Adds a pet to a newly created owner", async ({
    page,
  }) => {
    const pm = new PageManager(page)

    await pm.homePage.goto()

    await pm.navBar.clickAddNewButton()

    await expect(pm.addOwnerPage.newOwnerText).toBeVisible();

    const owner = owners.validOwners[1]

    await pm.addOwnerPage.addOwner(owner.firstName, owner.lastName, owner.address, owner.city, owner.telephone)

    // owners sayfasına geliyor

    await pm.ownersPage.openOwner(owner.firstName, owner.lastName)

    // detail sayfasına geldik

    await pm.ownerDetailsPage.openAddPetPage()

    // add pet page sayfasına geldik

    const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const pet = {
      name: `Buddy-${uniqueId}`,
      birthDate: "2020-09-16",
      type: "bird",
    };

    await pm.addPetPage.addPet(pet.name, pet.birthDate, pet.type)

    // owner details sayfasına geri dönüyor

    const createdPet = pm.ownerDetailsPage.petDetails(pet.name);

    await expect(createdPet).toBeVisible()
    await expect(createdPet).toContainText(pet.birthDate);
    await expect(createdPet).toContainText(pet.type);


  });
});
