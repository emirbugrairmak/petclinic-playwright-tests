import { Locator, Page } from '@playwright/test';

export class NavbarComponent {
  private readonly navigation: Locator
  readonly homeLink: Locator
  readonly ownersButton: Locator
  readonly veterinariansButton: Locator
  readonly petTypesLink: Locator
  readonly specialtiesLink: Locator
  private readonly ownerSearchLink: Locator
  private readonly addNewOwnerLink: Locator

  constructor(page: Page) {
    this.navigation = page.getByRole("navigation")
    this.homeLink = this.navigation.getByRole("link", { name: "Home", exact: true })
    this.ownersButton = this.navigation.getByRole("button", { name: "Owners", exact: true })
    this.veterinariansButton = this.navigation.getByRole("button", { name: "Veterinarians", exact: true })
    this.petTypesLink = this.navigation.getByRole("link", { name: "Pet Types", exact: true })
    this.specialtiesLink = this.navigation.getByRole("link", { name: "Specialties", exact: true })
    this.ownerSearchLink = this.navigation.getByRole("link", {name: "Search",exact: true,})
    this.addNewOwnerLink = this.navigation.getByRole("link", {name: "Add New",exact: true,})
  }


  async clickOwnerSearchButton(){
    await this.ownersButton.click()
    await this.ownerSearchLink.click()
  }

  async clickAddNewButton(){
    await this.ownersButton.click()
    await this.addNewOwnerLink.click()
  }

  
}
