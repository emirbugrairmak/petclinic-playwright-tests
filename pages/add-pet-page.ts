import { Locator, Page } from '@playwright/test';
import type { PetData } from '../test-data/pet-data';

export class AddPetPage {
  private readonly petNameInput: Locator
  private readonly birthDateInput: Locator
  private readonly petTypeSelect: Locator
  private readonly savePetButton: Locator

  constructor(page: Page) {
    this.petNameInput = page.getByRole('textbox', { name: 'Name' })
    this.birthDateInput = page.locator('input[name="birthDate"]')
    this.petTypeSelect = page.getByRole('combobox', {name: "Type"})
    this.savePetButton = page.getByRole('button', { name: 'Save Pet' })
  }

  async waitUntilReady(): Promise<void> {
    await this.petNameInput.waitFor({ state: 'visible' })
  }

  async addPet(pet: PetData){
    await this.petNameInput.fill(pet.name)
    await this.birthDateInput.fill(pet.birthDate)
    await this.petTypeSelect.selectOption({ label: pet.type.name })
    await this.savePetButton.click()
  }



}
