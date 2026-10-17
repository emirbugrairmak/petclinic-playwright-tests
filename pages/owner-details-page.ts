import { Locator, Page } from "@playwright/test";
import type { VisitData } from "../test-data/visit-data";

export class OwnerDetailsPage {
  private readonly page: Page;
  readonly ownerInformationHeading: Locator;
  readonly ownerInformationTable: Locator;
  private readonly ownerNameRow: Locator;
  private readonly ownerAddressRow: Locator;
  private readonly ownerCityRow: Locator;
  private readonly ownerTelephoneRow: Locator;
  readonly ownerNameCell: Locator;
  readonly ownerAddressCell: Locator;
  readonly ownerCityCell: Locator;
  readonly ownerTelephoneCell: Locator;
  readonly addNewPetButton: Locator;
  readonly petsAndVisitsTable: Locator;

  constructor(page: Page) {
    this.page = page;
    this.ownerInformationHeading = page.getByRole("heading", {
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
    this.ownerNameCell = this.ownerNameRow.getByRole("cell");
    this.ownerAddressCell = this.ownerAddressRow.getByRole("cell");
    this.ownerCityCell = this.ownerCityRow.getByRole("cell");
    this.ownerTelephoneCell = this.ownerTelephoneRow.getByRole("cell");
    this.addNewPetButton = page.getByRole("button", { name: "Add New Pet" });
    this.petsAndVisitsTable = page
      .getByRole("table")
      .filter({ hasText: "Birth Date" });
  }

  async openAddPetPage() {
    await this.addNewPetButton.click();
  }

  petDetailsByName(petName: string): Locator {
    return this.petsAndVisitsTable
      .locator("app-pet-list")
      .filter({ has: this.page.getByText(petName, { exact: true }) });
  }

  async openAddVisitPage(petName: string): Promise<void> {
    await this.petDetailsByName(petName)
      .getByRole("button", { name: "Add Visit", exact: true })
      .click();
  }

  visitRowForPet(petName: string, visit: VisitData): Locator {
    const displayedDate = visit.date.replace(/\//g, "-");

    return this.petDetailsByName(petName)
      .locator("app-visit-list")
      .getByRole("row")
      .filter({
        has: this.page.getByRole("cell", {
          name: displayedDate,
          exact: true,
        }),
      })
      .filter({
        has: this.page.getByRole("cell", {
          name: visit.description,
          exact: true,
        }),
      });
  }
}
