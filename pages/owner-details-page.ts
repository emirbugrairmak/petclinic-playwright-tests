import { Locator, Page } from "@playwright/test";
import { expect } from "@playwright/test";

export class OwnerDetailsPage {
  private readonly page: Page;
  readonly ownerInformationText: Locator;
  readonly ownerInformationTable: Locator;
  private readonly ownerNameRow: Locator;
  private readonly ownerAddressRow: Locator;
  private readonly ownerCityRow: Locator;
  private readonly ownerTelephoneRow: Locator;
  readonly nameCell: Locator;
  readonly addressCell: Locator;
  readonly cityCell: Locator;
  readonly telephoneCell: Locator;
  readonly addNewPetButton: Locator;
  readonly petsAndVisitsTable: Locator;

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
    this.ownerAddressRow = this.ownerInformationTable.getByRole("row", {
      name: "Address",
    });
    this.ownerCityRow = this.ownerInformationTable.getByRole("row", {
      name: "City",
    });
    this.ownerTelephoneRow = this.ownerInformationTable.getByRole("row", {
      name: "Telephone",
    });
    this.nameCell = this.ownerNameRow.getByRole("cell");
    this.addressCell = this.ownerAddressRow.getByRole("cell");
    this.cityCell = this.ownerCityRow.getByRole("cell");
    this.telephoneCell = this.ownerTelephoneRow.getByRole("cell");
    this.addNewPetButton = page.getByRole("button", { name: "Add New Pet" });
    this.petsAndVisitsTable = page
      .getByRole("table")
      .filter({ hasText: "Birth Date" });
  }

  async openAddPetPage() {
    await this.addNewPetButton.click();

    await expect(
      this.page.getByRole("textbox", { name: "Name", exact: true }),
    ).toBeVisible();
  }

  petDetails(petName: string): Locator {
    return this.petsAndVisitsTable
      .locator("app-pet-list")
      .filter({ has: this.page.getByText(petName, { exact: true }) });
  }
}
