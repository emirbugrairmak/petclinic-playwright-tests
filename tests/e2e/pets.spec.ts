import { existingOwners } from "../../test-data/owner-data";
import { createPetData } from "../../test-data/pet-data";
import { test, expect } from "../../fixtures/test-fixtures";

test.describe("pet tests", {tag: ["@e2e", "@smoke"]},() => {
  test("Owner detail page should be visited correctly.", {tag: ["@owner"]},async ({ pm }) => {
    await pm.homePage.goto()

    await pm.navBar.clickOwnerSearchButton()

    const owner = existingOwners.georgeFranklin

    await pm.ownersPage.searchOwner(owner.lastName)

    await pm.ownersPage.openOwner(owner.firstName, owner.lastName);

    await expect(pm.ownerDetailsPage.ownerInformationText).toBeVisible();
    await expect(pm.ownerDetailsPage.nameCell).toHaveText(`${owner.firstName} ${owner.lastName}`)
  });

  test("Adds a pet to a newly created owner", {tag: ["@pet"]},async ({
    pm, owner, page, request
  }) => {
    
    // owners sayfasına geliyor

    await pm.ownersPage.goto()

    await pm.ownersPage.openOwner(owner.firstName, owner.lastName)

    // detail sayfasına geldik

    await pm.ownerDetailsPage.openAddPetPage()

    // add pet page sayfasına geldik

    const pet = createPetData()
    let petId: number | undefined

    try{
      const responsePromise = page.waitForResponse(
      response =>
        response.url().includes(`/api/owners/${owner.id}/pets`) &&
        response.request().method() === 'POST'
    );
    
    await pm.addPetPage.addPet(pet.name, pet.birthDate, pet.type)
    
    const response = await responsePromise;
    const responseBody = await response.json();
    petId = responseBody.id
    expect(petId).toEqual(expect.any(Number))
    expect(response.status()).toBe(201)

    // owner details sayfasına geri dönüyor

    const createdPet = pm.ownerDetailsPage.petDetails(pet.name);

    await expect(createdPet).toBeVisible()
    await expect(createdPet).toContainText(pet.birthDate);
    await expect(createdPet).toContainText(pet.type);
    } finally{
      if (petId !== undefined) {
        const petDeleteResponse = await request.delete(`${process.env.API_URL}/pets/${petId}`)
        expect.soft(petDeleteResponse.status()).toBe(204)
        const getPetResponse = await request.get(`${process.env.API_URL}/pets/${petId}`)
        expect(getPetResponse.status()).toBe(404); 
      }

      
    }

    

    


  });
});

