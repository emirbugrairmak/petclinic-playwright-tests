import { Locator, Page } from '@playwright/test';

export class NavbarComponent {
  private readonly page: Page;
  private readonly navBar: Locator
  readonly homeButton: Locator
  readonly ownersButton: Locator
  readonly veterinariansButton: Locator
  readonly petTypesButton: Locator
  readonly specialtiesButton: Locator
  private readonly ownerSearchButton: Locator
  private readonly addNewOwnerButton: Locator

  constructor(page: Page) {
    this.page = page;
    this.navBar = page.getByRole("navigation")
    this.homeButton = this.navBar.getByRole("link", { name: "Home", exact: true })
    this.ownersButton = this.navBar.getByRole("button", { name: "Owners", exact: true })
    this.veterinariansButton = this.navBar.getByRole("button", { name: "Veterinarians", exact: true })
    this.petTypesButton = this.navBar.getByRole("link", { name: "Pet Types", exact: true })
    this.specialtiesButton = this.navBar.getByRole("link", { name: "Specialties", exact: true })
    this.ownerSearchButton = this.navBar.getByRole("link", {name: "Search",exact: true,})   
    this.addNewOwnerButton = this.navBar.getByRole("link", {name: "Add New",exact: true,})
  }


  async clickOwnerSearchButton(){
    await this.ownersButton.click()
    await this.ownerSearchButton.click()
  }

  async clickAddNewButton(){
    await this.ownersButton.click()
    await this.addNewOwnerButton.click()
  }

  
}
