import { Locator, Page } from "@playwright/test";

export class OwnersPage {
  private readonly page: Page;
  readonly ownersText: Locator;
  private readonly lastNameInputField: Locator;
  private readonly findOwnerButton: Locator;
  private readonly addOwnerButton: Locator;
  private readonly ownersTable: Locator;

  constructor(page: Page) {
    this.page = page;
    this.ownersText = page.getByRole("heading", { name: "Owners" });
    this.lastNameInputField = page.locator("#lastName");
    this.findOwnerButton = page.getByRole("button", { name: "Find Owner" });
    this.addOwnerButton = page.getByRole("button", { name: "Add Owner" });
    this.ownersTable = page.getByRole("table");
  }

  async searchOwner(lastName: string) {
    await this.lastNameInputField.fill(lastName);
    await this.findOwnerButton.click();
  }

  ownerRowByLastName(lastName: string): Locator {
    return this.ownersTable
      .getByRole("row")
      .filter({ has: this.page.getByRole("link", { name: lastName }) });
  }

  ownerLinkByLastName(lastName: string): Locator {
    return this.ownerRowByLastName(lastName).getByRole("link");
  }

  async goto() {
    await this.page.goto("/owners");
  }

  async openAddOwnerPage() {
    await this.addOwnerButton.click();
  }

  ownerRowByFirstNameAndLastName(firstName: string, lastName: string): Locator {
    return this.ownersTable.getByRole("row").filter({
      has: this.page.getByRole("link", {
        name: `${firstName} ${lastName}`,
        exact: true,
      }),
    });
  }

  async openOwner(firstName: string, lastName: string) {
    await this.ownerRowByFirstNameAndLastName(firstName, lastName)
      .getByRole("link")
      .click();
  }

  ownerAddressCell(
    address: string,
    firstName: string,
    lastName: string,
  ): Locator {
    return this.ownerRowByFirstNameAndLastName(firstName, lastName).getByRole(
      "cell",
      { name: address },
    );
  }

  ownerCityCell(city: string, firstName: string, lastName: string): Locator {
    return this.ownerRowByFirstNameAndLastName(firstName, lastName).getByRole(
      "cell",
      { name: city },
    );
  }

  ownerTelephoneCell(
    telephone: string,
    firstName: string,
    lastName: string,
  ): Locator {
    return this.ownerRowByFirstNameAndLastName(firstName, lastName).getByRole(
      "cell",
      { name: telephone },
    );
  }
}
