import { Locator, Page } from '@playwright/test';
import type { OwnerData } from "../test-data/owner-data";

export class AddOwnerPage {
  private readonly firstNameInput: Locator
  private readonly lastNameInput: Locator
  private readonly addressInput: Locator
  private readonly cityInput: Locator
  private readonly telephoneInput: Locator
  private readonly addOwnerButton: Locator
  readonly ownerForm: Locator

  constructor(page: Page) {
    this.firstNameInput = page.getByRole("textbox", {name: "First Name",})
    this.lastNameInput = page.getByRole("textbox", {name: "Last Name",})
    this.addressInput = page.getByRole("textbox", {name: "Address",})
    this.cityInput = page.getByRole("textbox", {name: "City",})
    this.telephoneInput = page.getByRole("textbox", {name: "Telephone",})
    this.addOwnerButton = page.getByRole("button", { name: "Add Owner" }) 
    this.ownerForm = page.locator('form').filter({has: page.getByRole('button', {name: 'Add Owner',exact: true,}),});
  }

  async addOwner(owner: OwnerData){
    await this.firstNameInput.fill(owner.firstName);
    await this.lastNameInput.fill(owner.lastName);
    await this.addressInput.fill(owner.address);
    await this.cityInput.fill(owner.city);
    await this.telephoneInput.fill(owner.telephone);
    await this.addOwnerButton.click()
  }

  

}
