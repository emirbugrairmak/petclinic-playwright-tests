import { Locator, Page } from '@playwright/test';

export class AddOwnerPage {
  private readonly page: Page;
  private readonly firstNameInputField: Locator
  private readonly lastNameInputField: Locator
  private readonly addressInputField: Locator
  private readonly cityInputField: Locator
  private readonly telephoneInputField: Locator
  private readonly addOwnerButton: Locator

  constructor(page: Page) {
    this.page = page;
    this.firstNameInputField = page.getByRole("textbox", {name: "First Name",})
    this.lastNameInputField = page.getByRole("textbox", {name: "Last Name",})
    this.addressInputField = page.getByRole("textbox", {name: "Address",})
    this.cityInputField = page.getByRole("textbox", {name: "City",})
    this.telephoneInputField = page.getByRole("textbox", {name: "Telephone",})
    this.addOwnerButton = page.getByRole("button", { name: "Add Owner" }) 
  }

  async addOwner(firstName: string, lastName: string, address: string, city: string, telephone: string){
    await this.firstNameInputField.fill(firstName);
    await this.lastNameInputField.fill(lastName);
    await this.addressInputField.fill(address);
    await this.cityInputField.fill(city);
    await this.telephoneInputField.fill(telephone);
    await this.addOwnerButton.click()
  }

  



}