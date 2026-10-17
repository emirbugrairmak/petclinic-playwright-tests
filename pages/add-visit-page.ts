import { Locator, Page } from "@playwright/test";
import type { VisitData } from "../test-data/visit-data";

export class AddVisitPage {
  private readonly dateInput: Locator;
  private readonly descriptionInput: Locator;
  private readonly addVisitButton: Locator;

  constructor(page: Page) {
    this.dateInput = page.locator('input[name="date"]');
    this.descriptionInput = page.locator('input[name="description"]');
    this.addVisitButton = page.getByRole("button", {
      name: "Add Visit",
      exact: true,
    });
  }

  async addVisit(visit: VisitData): Promise<void> {
    await this.dateInput.fill(visit.date);
    await this.descriptionInput.fill(visit.description);
    await this.addVisitButton.click();
  }
}
