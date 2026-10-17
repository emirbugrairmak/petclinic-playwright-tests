import { faker } from "@faker-js/faker";

export type VisitData = {
  date: string;
  description: string;
};

export function createVisitData(): VisitData {
  return {
    date: "2024/06/15",
    description: faker.lorem.sentence(),
  };
}
