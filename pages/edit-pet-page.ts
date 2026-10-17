import { Locator, Page } from '@playwright/test';
import { PetData } from '../test-data/pet-data';

export class EditPetPage {
  readonly ownerInput: Locator;
  readonly petNameInput: Locator;
  readonly birthDateInput: Locator;
  readonly currentPetTypeInput: Locator;
  readonly petTypeSelect: Locator;
  private updatePetButton: Locator

  constructor(page: Page) {
    this.ownerInput = page.locator('#owner_name');
    this.petNameInput = page.getByRole('textbox', { name: 'Name' });
    this.birthDateInput = page.locator('input[name="birthDate"]');
    this.currentPetTypeInput = page.locator('#type1');
    this.petTypeSelect = page.getByRole('combobox', { name: 'Type' });
    this.updatePetButton = page.getByRole('button', {name: "Update Pet"})
  }

  async updatePet(pet: PetData){
    await this.petNameInput.fill(pet.name)
    await this.birthDateInput.fill(pet.birthDate)
    await this.petTypeSelect.selectOption({ label: pet.type.name })
    await this.updatePetButton.click()
  }



}
