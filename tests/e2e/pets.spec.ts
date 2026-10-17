import { existingOwners } from "../../test-data/owner-data";
import { createPetData, createUpdatedPetData } from "../../test-data/pet-data";
import { test, expect } from "../../fixtures/test-fixtures";
import { createVisitData } from "../../test-data/visit-data";

test.describe("Owner and pet UI", { tag: ["@e2e"] }, () => {
  test(
    "opens owner details from search results",
    { tag: ["@owner", "@smoke"] },
    async ({ pm }) => {
      await pm.homePage.goto();

      await pm.navBar.clickOwnerSearchButton();

      const owner = existingOwners.georgeFranklin;

      await pm.ownersPage.searchOwner(owner.lastName);

      await pm.ownersPage.openOwner(owner.firstName, owner.lastName);

      await expect(pm.ownerDetailsPage.ownerInformationHeading).toBeVisible();
      await expect(pm.ownerDetailsPage.ownerNameCell).toHaveText(
        `${owner.firstName} ${owner.lastName}`,
      );
    },
  );

  test(
    "adds a pet to a new owner and displays it",
    { tag: ["@pet", "@smoke"] },
    async ({ pm, owner, page, request }) => {
      await pm.ownersPage.goto();

      await pm.ownersPage.openOwner(owner.firstName, owner.lastName);

      await pm.ownerDetailsPage.openAddPetPage();
      await pm.addPetPage.waitUntilReady();

      const pet = createPetData();
      let petId: number | undefined;

      try {
        const responsePromise = page.waitForResponse(
          (response) =>
            response.url().includes(`/api/owners/${owner.id}/pets`) &&
            response.request().method() === "POST",
        );

        await pm.addPetPage.addPet(pet);

        const response = await responsePromise;
        const responseBody = await response.json();
        const createdPetId: unknown = responseBody.id;
        if (typeof createdPetId !== "number") {
          throw new Error("Created pet ID is not a number");
        }
        petId = createdPetId;
        expect(response.status()).toBe(201);

        const createdPet = pm.ownerDetailsPage.petDetailsByName(pet.name);

        await expect(createdPet).toBeVisible();
        await expect(createdPet).toContainText(pet.birthDate);
        await expect(createdPet).toContainText(pet.type.name);
      } finally {
        if (petId !== undefined) {
          const petDeleteResponse = await request.delete(
            `${process.env.API_URL}/pets/${petId}`,
          );
          expect.soft(petDeleteResponse.status()).toBe(204);
          const getPetResponse = await request.get(
            `${process.env.API_URL}/pets/${petId}`,
          );
          expect(getPetResponse.status()).toBe(404);
        }
      }
    },
  );

  test('adds a visit to an existing pet and displays it on the owner details page', {tag: ["@pet","@owner","@visit"]}, async ({ owner, pet, pm, page, request }) => {
    await pm.ownersPage.goto()

    await pm.ownersPage.openOwner(owner.firstName, owner.lastName)

    await pm.ownerDetailsPage.openAddVisitPage(pet.name)

    const visit = createVisitData()
    let visitId: number | undefined;

    try {
      const responsePromise = page.waitForResponse(
        response =>
          response.url().includes(`/api/owners/${owner.id}/pets/${pet.id}/visits`) &&
          response.request().method() === 'POST'
      );

      await pm.addVisitPage.addVisit(visit)

      const response = await responsePromise;
      const responseBody = await response.json();
      const createdVisitId: unknown = responseBody.id;
      if (typeof createdVisitId !== "number") {
        throw new Error("Created visit ID is not a number");
      }
      visitId = createdVisitId;

      expect(response.status()).toBe(201)
      expect(responseBody.date).toBe(visit.date.replace(/\//g, "-"));
      expect(responseBody.description).toBe(visit.description)
      expect(responseBody.petId).toBe(pet.id)

      await expect(pm.ownerDetailsPage.visitRowForPet(pet.name, visit)).toBeVisible()
    } finally {
      if (visitId !== undefined) {
        const deleteVisitResponse = await request.delete(
          `${process.env.API_URL}/visits/${visitId}`,
        );
        expect.soft(deleteVisitResponse.status()).toBe(204);
        const getVisitResponse = await request.get(
          `${process.env.API_URL}/visits/${visitId}`,
        );
        expect(getVisitResponse.status()).toBe(404);
      }
    }

  });
  
  test('should edit an existing pet and display the updated details on the owner page', {tag: ["@pet", "@owner"]}, async ({ owner, pet, pm, page }) => {
    await pm.ownersPage.goto()
    await pm.ownersPage.openOwner(owner.firstName, owner.lastName)

    await pm.ownerDetailsPage.openEditPetPage(pet)
    await expect(pm.editPetPage.ownerInput).toHaveValue(`${owner.firstName} ${owner.lastName}`)
    await expect(pm.editPetPage.petNameInput).toHaveValue(pet.name)
    await expect(pm.editPetPage.birthDateInput).toHaveValue(pet.birthDate.replace(/-/g, "/"))
    await expect(pm.editPetPage.currentPetTypeInput).toHaveValue(pet.type.name)

    const updatedPet = createUpdatedPetData(pet)

    const responsePromise = page.waitForResponse(
      response =>
        response.url().includes(`/api/pets/${pet.id}`) &&
        response.request().method() === 'PUT'
    );
    
    await pm.editPetPage.updatePet(updatedPet)
    
    const response = await responsePromise;
    
    expect(response.status()).toBe(204)

    await expect(pm.ownerDetailsPage.petNameValue(updatedPet.name)).toBeVisible()
    await expect(pm.ownerDetailsPage.petBirthDateValue(updatedPet.name)).toHaveText(updatedPet.birthDate)
    await expect(pm.ownerDetailsPage.petTypeValue(updatedPet.name)).toHaveText(updatedPet.type.name)
  

  });
  


});
