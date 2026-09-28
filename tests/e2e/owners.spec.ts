import { expect, test } from "@playwright/test";

test.describe("Owners tests", () => {
  test("Home page opens correctly", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL("/petclinic/");

    const welcomeMessage = page.getByRole("heading", {
      name: "Welcome to Petclinic",
    });
    await expect(welcomeMessage).toBeVisible();

    const navBar = page.getByRole("navigation");
    await expect(
      navBar.getByRole("link", { name: "Home", exact: true }),
    ).toBeVisible();
    await expect(
      navBar.getByRole("button", { name: "Owners", exact: true }),
    ).toBeVisible();
    await expect(
      navBar.getByRole("button", { name: "Veterinarians", exact: true }),
    ).toBeVisible();
    await expect(
      navBar.getByRole("link", { name: "Pet Types", exact: true }),
    ).toBeVisible();
    await expect(
      navBar.getByRole("link", { name: "Specialties", exact: true }),
    ).toBeVisible();
  });

  test("An existing owner can be search by their last name", async ({
    page,
  }) => {
    await page.goto("/");

    const navBar = page.getByRole("navigation");

    const ownersButton = navBar.getByRole("button", { name: "Owners" });
    await ownersButton.click();

    const ownerSearchButton = navBar.getByRole("link", {name: "Search",exact: true,});
    await ownerSearchButton.click();
    await expect(page.getByRole("heading", { name: "Owners" })).toBeVisible();

    const lastNameInputField = page.locator("#lastName");
    const findOwnerButton = page.getByRole("button", { name: "Find Owner" });
    await lastNameInputField.fill("Franklin");
    await findOwnerButton.click();
    await expect(
      page
        .getByRole("row")
        .filter({ has: page.getByRole("cell", { name: "Franklin" }) }),
    ).toBeVisible();
  });

  test("A new owner can be create", async ({ page }) => {
    await page.goto("/owners");

    const addOwnerButton = page.getByRole("button", { name: "Add Owner" });
    await addOwnerButton.click();

    const firstNameInputField = page.getByRole("textbox", {
      name: "First Name",
    });
    const lastNameInputField = page.getByRole("textbox", { name: "Last Name" });
    const addressInputField = page.getByRole("textbox", { name: "Address" });
    const cityInputField = page.getByRole("textbox", { name: "City" });
    const telephoneInputField = page.getByRole("textbox", {
      name: "Telephone",
    });

    await firstNameInputField.fill("Test First Name");
    await lastNameInputField.fill("Test Last Name");
    await addressInputField.fill("Test Adress");
    await cityInputField.fill("Test City");
    await telephoneInputField.fill("0123456789");

    await addOwnerButton.click();

    const ownerRow = page.getByRole("row").filter({has: page.getByRole("cell", {name: "Test First Name Test Last Name",exact: true}),})

    await expect(ownerRow).toBeVisible()
    await expect(ownerRow.getByRole('cell', { name: 'Test Adress', exact: true })).toBeVisible();
    await expect(ownerRow.getByRole('cell', { name: 'Test City', exact: true })).toBeVisible();
    await expect(ownerRow.getByRole('cell', { name: '0123456789', exact: true })).toBeVisible();



  });
});
