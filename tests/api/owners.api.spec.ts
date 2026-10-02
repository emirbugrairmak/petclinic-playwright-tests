import { expect, test } from "@playwright/test";
import { createOwnerData } from "../../test-data/owner-data";
import { OwnerApi } from "../../api/owner-api";

test("owner CRUD API flow", async ({ request }) => {
  const owner = createOwnerData();
  let ownerId: number | undefined;
  const ownerApi = new OwnerApi(request)

  try{
    const createOwnerResponse = await ownerApi.createOwner(owner)

    const createOwnerBody = await createOwnerResponse.json();
    ownerId = createOwnerBody.id;
    if (typeof ownerId !== "number") {
      throw new Error("Created owner ID is not a number");
    }
    expect(createOwnerBody.id).toEqual(expect.any(Number));
    expect(createOwnerResponse.status()).toBe(201);
    expect(createOwnerBody).toMatchObject({
      firstName: owner.firstName,
      lastName: owner.lastName,
      address: owner.address,
      city: owner.city,
      telephone: owner.telephone,
    });

    const getOwnerResponse = await ownerApi.getOwner(ownerId)

    const getOwnerBody = await getOwnerResponse.json();

    expect(getOwnerResponse.status()).toBe(200);

    expect(getOwnerBody).toMatchObject({
      id: ownerId,
      firstName: owner.firstName,
      lastName: owner.lastName,
      address: owner.address,
      city: owner.city,
      telephone: owner.telephone,
    });

    const updatedOwner = {
      ...owner,
      city: "Updated Test City",
    };

    const updateOwnerResponse = await ownerApi.updateOwner(ownerId, updatedOwner)

    expect([200, 204]).toContain(updateOwnerResponse.status());

    const getUpdatedOwnerResponse = await ownerApi.getOwner(ownerId)

    const getUpdatedOwnerBody = await getUpdatedOwnerResponse.json();

    expect(getUpdatedOwnerResponse.status()).toBe(200);

    expect(getUpdatedOwnerBody).toMatchObject({
      ...updatedOwner,
      id: ownerId,
    });
  } finally {
    if (ownerId !== undefined) {
      const deleteOwnerResponse = await ownerApi.deleteOwner(ownerId)
      expect.soft(deleteOwnerResponse.status()).toBe(204);
    }
  }
});
