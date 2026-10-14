import { faker } from "@faker-js/faker";

export type OwnerData = {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  telephone: string;
};

function createAlphabeticId(length = 8): string {
  const letters = "abcdefghijklmnopqrstuvwxyz";

  return Array.from(
    { length },
    () => letters[Math.floor(Math.random() * letters.length)],
  ).join("");
}

export function createOwnerData(): OwnerData {
  const uniqueId = createAlphabeticId();

  return {
    firstName: faker.person.firstName(),
    lastName: `${faker.person.lastName()} ${uniqueId}`,
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    telephone: "5551234567",
  };
}

export const existingOwners = {
  georgeFranklin: {
    firstName: "George",
    lastName: "Franklin",
    address: "110 W. Liberty St.",
    city: "Madison",
    telephone: "6085551023",
  },
} as const;
