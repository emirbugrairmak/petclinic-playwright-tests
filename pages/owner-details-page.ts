import { Locator, Page } from "@playwright/test";

export class OwnerDetailsPage {
  private readonly page: Page;
  readonly ownerInformationText: Locator;
  readonly ownerInformationTable: Locator;
  private readonly ownerNameRow: Locator;
  readonly nameCell: Locator;
  readonly addNewPetButton: Locator
  readonly petsAndVisitsTable: Locator

  constructor(page: Page) {
    this.page = page;
    this.ownerInformationText = page.getByRole("heading", {
      name: "Owner Information",
    });
    this.ownerInformationTable = page
      .getByRole("table")
      .filter({ hasText: "Address" });
    this.ownerNameRow = this.ownerInformationTable.getByRole("row", {
      name: "Name",
    });
    this.nameCell = this.ownerNameRow.getByRole("cell");
    this.addNewPetButton = page.getByRole('button', { name: 'Add New Pet' });
    this.petsAndVisitsTable = page.getByRole("table").filter({ hasText: "Birth Date" });

  }


  async openAddPetPage(){
    await this.addNewPetButton.click()
  }

  petDetails(petName: string): Locator{
    return this.petsAndVisitsTable.locator("app-pet-list").filter({has: this.page.getByText(petName, { exact: true }),})
  }


}
