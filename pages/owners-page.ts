import { Locator, Page } from "@playwright/test";

export class OwnersPage {
  private readonly page: Page;
  readonly ownersHeading: Locator;
  readonly lastNameInput: Locator;
  readonly findOwnerButton: Locator;
  private readonly addOwnerButton: Locator;
  readonly ownersTable: Locator;

  constructor(page: Page) {
    this.page = page;
    this.ownersHeading = page.getByRole("heading", { name: "Owners" });
    this.lastNameInput = page.locator("#lastName");
    this.findOwnerButton = page.getByRole("button", { name: "Find Owner" });
    this.addOwnerButton = page.getByRole("button", { name: "Add Owner" });
    this.ownersTable = page.getByRole("table");
  }

  async searchOwner(lastName: string): Promise<void> {
    if (!lastName.trim()) {
      throw new Error("searchOwner requires a non-empty last name");
    }

    await this.lastNameInput.fill(lastName);

    const [response] = await Promise.all([
      this.page.waitForResponse((response) => {
        const url = new URL(response.url());

        return (
          response.request().method() === "GET" &&
          url.pathname.endsWith("/api/owners") &&
          url.searchParams.get("lastName") === lastName
        );
      }),
      this.findOwnerButton.click(),
    ]);

    if (!response.ok()) {
      throw new Error(`Owner search failed: HTTP ${response.status()}`);
    }
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

  addressCellForOwner(
    firstName: string,
    lastName: string,
    address: string,
  ): Locator {
    return this.ownerRowByFirstNameAndLastName(firstName, lastName).getByRole(
      "cell",
      { name: address, exact: true },
    );
  }

  cityCellForOwner(firstName: string, lastName: string, city: string): Locator {
    return this.ownerRowByFirstNameAndLastName(firstName, lastName).getByRole(
      "cell",
      { name: city, exact: true },
    );
  }

  telephoneCellForOwner(
    firstName: string,
    lastName: string,
    telephone: string,
  ): Locator {
    return this.ownerRowByFirstNameAndLastName(firstName, lastName).getByRole(
      "cell",
      { name: telephone, exact: true },
    );
  }
}
