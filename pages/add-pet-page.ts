import { Locator, Page } from '@playwright/test';

export class AddPetPage {
  private readonly page: Page;
  private readonly petNameInputField: Locator
  private readonly birthDateInputField: Locator
  private readonly typeDropdown: Locator
  private readonly savePetButton: Locator

  constructor(page: Page) {
    this.page = page;
    this.petNameInputField = page.getByRole('textbox', { name: 'Name' })
    this.birthDateInputField = page.getByRole('textbox', { name: 'Birth Date' })
    this.typeDropdown = page.getByRole('combobox', {name: "Type"})
    this.savePetButton = page.getByRole('button', { name: 'Save Pet' })
  }

  async addPet(petName: string, birthDate: string, option: string){
    await this.petNameInputField.fill(petName)
    await this.birthDateInputField.fill(birthDate)
    await this.typeDropdown.selectOption(option)
    await this.savePetButton.click()
  }



}
