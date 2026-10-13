import { existingOwners } from "../../test-data/owner-data";
import { createPetData } from "../../test-data/pet-data";
import { test, expect } from "../../fixtures/test-fixtures";

test.describe("Owner and pet UI", { tag: ["@e2e", "@smoke"] }, () => {
  test(
    "opens owner details from search results",
    { tag: ["@owner"] },
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
    { tag: ["@pet"] },
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
        await expect(createdPet).toContainText(pet.type);
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
});
