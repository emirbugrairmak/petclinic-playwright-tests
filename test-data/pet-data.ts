import { randomUUID } from "node:crypto";
import { faker } from "@faker-js/faker";

export type PetData = {
    name: string,
    birthDate: string,
    type: { id: number; name: string }
}


export function createPetData(): PetData{
    const uniqueId = randomUUID().slice(0, 8);
    const birthDate = new Date();
    birthDate.setFullYear(birthDate.getFullYear() - 1);
    const formattedBirthDate = `${birthDate.getFullYear()}-${String(birthDate.getMonth() + 1).padStart(2, "0")}-${String(birthDate.getDate()).padStart(2, "0")}`;

    return {
        name: `${faker.person.firstName()} ${uniqueId}`,
        birthDate: formattedBirthDate,
        type: { id: 6, name: "hamster" }
    }
}

export function createUpdatedPetData(originalPet: PetData): PetData {
    const updatedBirthDate = new Date(`${originalPet.birthDate}T00:00:00Z`);
    updatedBirthDate.setUTCDate(updatedBirthDate.getUTCDate() + 1);

    return {
        name: `${originalPet.name} Updated`,
        birthDate: updatedBirthDate.toISOString().slice(0, 10),
        type: originalPet.type,
    };
}
