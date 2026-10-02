import { expect, test } from "@playwright/test";
import { createOwnerData } from "../../test-data/owner-data";

test("owner CRUD API flow", async ({ request }) => {
  const owner = createOwnerData();

  let ownerId: number | undefined;

  try {
    const createOwnerResponse = await request.post(
      `${process.env.API_URL}/owners`,
      {
        data: {
          firstName: owner.firstName,
          lastName: owner.lastName,
          address: owner.address,
          city: owner.city,
          telephone: owner.telephone,
        },
      },
    );

    const createOwnerBody = await createOwnerResponse.json();
    ownerId = createOwnerBody.id;
    expect(createOwnerBody.id).toEqual(expect.any(Number));
    expect(createOwnerResponse.status()).toBe(201);
    expect(createOwnerBody).toMatchObject({
      firstName: owner.firstName,
      lastName: owner.lastName,
      address: owner.address,
      city: owner.city,
      telephone: owner.telephone,
    });

    const getOwnerResponse = await request.get(
      `${process.env.API_URL}/owners/${ownerId}`,
    );

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

    const updateOwnerResponse = await request.put(
      `${process.env.API_URL}/owners/${ownerId}`,
      {
        data: updatedOwner,
      },
    );

    expect([200, 204]).toContain(updateOwnerResponse.status());

    const getUpdatedOwnerResponse = await request.get(
      `${process.env.API_URL}/owners/${ownerId}`,
    );

    const getUpdatedOwnerBody = await getUpdatedOwnerResponse.json();

    expect(getUpdatedOwnerResponse.status()).toBe(200);

    expect(getUpdatedOwnerBody).toMatchObject({
      ...updatedOwner,
      id: ownerId,
    });
  } finally {
    if (ownerId !== undefined) {
      const deleteOwnerResponse = await request.delete(
        `${process.env.API_URL}/owners/${ownerId}`,
      );
      expect.soft(deleteOwnerResponse.status()).toBe(204);
    }
  }
});
