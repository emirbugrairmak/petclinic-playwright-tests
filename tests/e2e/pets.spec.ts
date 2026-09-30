import { expect, test } from "@playwright/test";
import { HomePage } from "../../pages/home-page";
import { OwnersPage } from "../../pages/owners-page";
import { OwnerDetailsPage } from "../../pages/owner-details-page";
import { AddOwnerPage } from "../../pages/add-owner-page";
import { owners } from "../../test-data/owner-data";
import { AddPetPage } from "../../pages/add-pet-page";

test.describe("pet tests", () => {
  test("Owner detail page should be visited correctly.", async ({ page }) => {
    const homePage = new HomePage(page)
    const ownersPage = new OwnersPage(page)
    const ownerDetailsPage = new OwnerDetailsPage(page)

    await homePage.goto()

    await homePage.navBar.clickOwnerSearchButton()

    const owner = owners.validOwners[2]

    await ownersPage.searchOwner(owner.lastName)

    await ownersPage.openOwner(owner.firstName, owner.lastName);

    await expect(ownerDetailsPage.ownerInformationText).toBeVisible();
    await expect(ownerDetailsPage.nameCell).toHaveText(`${owner.firstName} ${owner.lastName}`)
  });

  test("Adds a pet to a newly created owner", async ({
    page,
  }) => {
    const homePage = new HomePage(page)
    const ownersPage = new OwnersPage(page)
    const ownerDetailsPage = new OwnerDetailsPage(page)
    const addOwnerPage = new AddOwnerPage(page)
    const addPetPage = new AddPetPage(page)

    await homePage.goto()

    await homePage.navBar.clickAddNewButton()

    await expect(addOwnerPage.newOwnerText).toBeVisible();

    const owner = owners.validOwners[1]

    await addOwnerPage.addOwner(owner.firstName, owner.lastName, owner.address, owner.city, owner.telephone)

    // owners sayfasına geliyor

    await ownersPage.openOwner(owner.firstName, owner.lastName)

    // detail sayfasına geldik

    await ownerDetailsPage.openAddPetPage()

    // add pet page sayfasına geldik

    const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const pet = {
      name: `Buddy-${uniqueId}`,
      birthDate: "2020-09-16",
      type: "bird",
    };

    await addPetPage.addPet(pet.name, pet.birthDate, pet.type)

    // owner details sayfasına geri dönüyor

    const createdPet = ownerDetailsPage.petDetails(pet.name);

    await expect(createdPet).toBeVisible()
    await expect(createdPet).toContainText(pet.birthDate);
    await expect(createdPet).toContainText(pet.type);


  });
});
