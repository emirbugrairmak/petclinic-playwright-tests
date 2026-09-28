import { expect, test } from "@playwright/test";

test.describe("pet tests", () => {
  test("Owner detail page should be visited correctly.", async ({ page }) => {
    await page.goto("/");

    const navBar = page.getByRole("navigation");
    const ownersButton = navBar.getByRole("button", { name: "Owners" });
    await ownersButton.click();
    const ownerSearchButton = navBar.getByRole("link", {
      name: "Search",
      exact: true,
    });
    await ownerSearchButton.click();

    const lastNameInputField = page.locator("#lastName");
    const findOwnerButton = page.getByRole("button", { name: "Find Owner" });
    await lastNameInputField.fill("Franklin");
    await findOwnerButton.click();

    const franklinOwner = page
      .locator("tbody")
      .getByRole("link", { name: "George Franklin", exact: true });
    await franklinOwner.click();

    const ownerInformationText = page.getByRole("heading", {
      name: "Owner Information",
    });
    await expect(ownerInformationText).toBeVisible();

    const ownerInformationTable = page
      .getByRole("table")
      .filter({ hasText: "Address" });
    const ownerNameRow = ownerInformationTable.getByRole("row", {
      name: "Name",
    });
    const nameCell = ownerNameRow.getByRole("cell");
    await expect(nameCell).toHaveText("George Franklin");
  });

  test("A new pet should be added correctly to the new owner", async ({
    page,
  }) => {
    await page.goto("/");

    const navBar = page.getByRole("navigation");
    const ownersButton = navBar.getByRole("button", { name: "Owners" });
    await ownersButton.click();

    const addNewOwnerButtonOnNavBar = navBar.getByRole("link", {
      name: "Add New",
      exact: true,
    });
    await addNewOwnerButtonOnNavBar.click();
    const newOwnerText = page.getByRole("heading", { name: "New Owner" });
    await expect(newOwnerText).toBeVisible();

    const firstNameInputField = page.getByRole("textbox", {
      name: "First Name",
    });
    const lastNameInputField = page.getByRole("textbox", { name: "Last Name" });
    const addressInputField = page.getByRole("textbox", { name: "Address" });
    const cityInputField = page.getByRole("textbox", { name: "City" });
    const telephoneInputField = page.getByRole("textbox", {
      name: "Telephone",
    });
    const addOwnerButton = page.getByRole("button", { name: "Add Owner" });

    
    const ownerLastName = "Petflowtrial";

    await firstNameInputField.fill("new");
    await lastNameInputField.fill(ownerLastName);
    await addressInputField.fill("new");
    await cityInputField.fill("new");
    await telephoneInputField.fill("1234567893");

    await addOwnerButton.click();

    const newOwner = page
      .locator("tbody")
      .getByRole("link", { name: `new ${ownerLastName}`, exact: true });
    await newOwner.click();

    const addNewPetButton = page.getByRole('button', { name: 'Add New Pet' })
    await addNewPetButton.click()

    const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const petName = `Buddy-${uniqueId}`;

    const petNameInputField = page.getByRole('textbox', { name: 'Name' })
    await petNameInputField.fill(petName)

    const calendarIcon = page.getByRole('button', { name: 'Open calendar' })
    await calendarIcon.click()

    const sep16Button = page.getByRole('button', { name: '/09/16' })
    await sep16Button.click()

    const typeDropdown = page.getByRole('combobox', {name: "Type"})
    await typeDropdown.selectOption('bird')

    const savePetButton = page.getByRole('button', { name: 'Save Pet' })
    await savePetButton.click()

    //

    const petsAndVisitsTable = page
      .getByRole("table")
      .filter({ hasText: "Birth Date" });

    const createdPet = petsAndVisitsTable.locator("app-pet-list").filter({has: page.getByText(petName, { exact: true }),});

    const petNameOnTable = createdPet.getByText(petName, {exact: true})
    await expect(petNameOnTable).toBeVisible()
    const petBirthDate = createdPet.getByText('2026-09-16')
    await expect(petBirthDate).toBeVisible()
    const petType = createdPet.getByText('bird', {exact: true})
    await expect(petType).toBeVisible()


  });
});
