import { createOwnerData } from "../../test-data/owner-data";
import { test, expect } from "../../fixtures/test-fixtures"

test("creates, retrieves, updates, and deletes an owner",{tag: ["@api", "@owner", "@smoke"]} , async ({ ownerApi }) => {
  const owner = createOwnerData();
  let ownerId: number | undefined;

  try{
    const createOwnerResponse = await ownerApi.createOwner(owner)

    const createOwnerBody = await createOwnerResponse.json();
    ownerId = createOwnerBody.id;
    if (typeof ownerId !== "number") {
      throw new Error("Created owner ID is not a number");
    }

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

    const updatedOwnerResponse = await ownerApi.updateOwner(ownerId, updatedOwner)

    expect(updatedOwnerResponse.status()).toBe(204);

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

      const getDeletedOwnerResponse = await ownerApi.getOwner(ownerId)
      expect(getDeletedOwnerResponse.status()).toBe(404)
    }
  }
});
