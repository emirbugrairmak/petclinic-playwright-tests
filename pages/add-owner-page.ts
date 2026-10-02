import { Locator, Page } from '@playwright/test';
import type { OwnerData } from "../test-data/owner-data";

export class AddOwnerPage {
  private readonly page: Page;
  private readonly firstNameInputField: Locator
  private readonly lastNameInputField: Locator
  private readonly addressInputField: Locator
  private readonly cityInputField: Locator
  private readonly telephoneInputField: Locator
  private readonly addOwnerButton: Locator
  readonly newOwnerText: Locator

  constructor(page: Page) {
    this.page = page;
    this.firstNameInputField = page.getByRole("textbox", {name: "First Name",})
    this.lastNameInputField = page.getByRole("textbox", {name: "Last Name",})
    this.addressInputField = page.getByRole("textbox", {name: "Address",})
    this.cityInputField = page.getByRole("textbox", {name: "City",})
    this.telephoneInputField = page.getByRole("textbox", {name: "Telephone",})
    this.addOwnerButton = page.getByRole("button", { name: "Add Owner" }) 
    this.newOwnerText = page.getByRole("heading", { name: "New Owner" })
  }

  async addOwner(owner: OwnerData){
    await this.firstNameInputField.fill(owner.firstName);
    await this.lastNameInputField.fill(owner.lastName);
    await this.addressInputField.fill(owner.address);
    await this.cityInputField.fill(owner.city);
    await this.telephoneInputField.fill(owner.telephone);
    await this.addOwnerButton.click()
  }

  



}