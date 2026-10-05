import { test as base, expect } from "@playwright/test";
import { PageManager } from "../pages/page-manager";
import { OwnerApi } from "../api/owner-api";
import { createOwnerData, OwnerData } from "../test-data/owner-data";

type FixtureTypes = {
  // Fixture adı: teste verilecek değerin tipi
  // Örnek: pom fixture'ı bir PageManager nesnesi verir.
  pm: PageManager;
  ownerApi: OwnerApi;
  owner: OwnerData & { id: number };
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
});

export { expect } from "@playwright/test";
