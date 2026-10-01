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
    firstName: "Test First Name",
    lastName: `Owner ${uniqueId}`,
    address: "Test Address",
    city: "Test City",
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
