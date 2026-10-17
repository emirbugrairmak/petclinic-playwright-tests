import { test as base, expect } from "@playwright/test";
import { PageManager } from "../pages/page-manager";
import { OwnerApi } from "../api/owner-api";
import { createOwnerData, OwnerData } from "../test-data/owner-data";
import { createPetData, PetData } from "../test-data/pet-data";

type FixtureTypes = {
  pm: PageManager;
  ownerApi: OwnerApi;
  owner: OwnerData & { id: number };
  pet: PetData & { id: number };
};

export const test = base.extend<FixtureTypes>({
  pm: async ({ page }, use) => {
    const pageManager = new PageManager(page);
    await use(pageManager);
  },

  ownerApi: async ({ request }, use) => {
    const ownerApi = new OwnerApi(request);
    await use(ownerApi);
  },

  owner: async ({ ownerApi }, use) => {
    const owner = createOwnerData();

    const createOwnerResponse = await ownerApi.createOwner(owner);
    const createOwnerBody = await createOwnerResponse.json();
    const ownerId: unknown = createOwnerBody.id;

    if (typeof ownerId !== "number") {
      throw new Error("Created owner ID is not a number");
    }

    try {
      expect(createOwnerResponse.status()).toBe(201);

      await use({...owner,id: ownerId,});
    } finally {
      const deleteOwnerResponse = await ownerApi.deleteOwner(ownerId);
      expect.soft(deleteOwnerResponse.status()).toBe(204);
      const getOwnerResponse = await ownerApi.getOwner(ownerId)
      expect(getOwnerResponse.status()).toBe(404);
    }
  },

  pet: async ({ owner, request }, use) => {
    const pet = createPetData();

    const createPetResponse = await request.post(
      `${process.env.API_URL}/owners/${owner.id}/pets`,
      { data: pet },
    );
    const createPetBody = await createPetResponse.json();
    const petId: unknown = createPetBody.id;

    if (typeof petId !== "number") {
      throw new Error("Created pet ID is not a number");
    }

    try {
      expect(createPetResponse.status()).toBe(201);

      await use({ ...pet, id: petId });
    } finally {
      const deletePetResponse = await request.delete(
        `${process.env.API_URL}/pets/${petId}`,
      );
      expect.soft(deletePetResponse.status()).toBe(204);
      const getPetResponse = await request.get(
        `${process.env.API_URL}/pets/${petId}`,
      );
      expect(getPetResponse.status()).toBe(404);
    }
  },
});

export { expect } from "@playwright/test";
