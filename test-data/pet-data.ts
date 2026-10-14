import { randomUUID } from "node:crypto";
import { faker } from "@faker-js/faker";

export type PetData = {
    name: string,
    birthDate: string,
    type: string
}


export function createPetData(): PetData{
    const uniqueId = randomUUID().slice(0, 8);
    return {
        name: `${faker.person.firstName()} ${uniqueId}`,
        birthDate: "2020-09-16",
        type: "hamster"
    }
}
