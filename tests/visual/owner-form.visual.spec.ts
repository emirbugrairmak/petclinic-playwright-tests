import { test, expect } from "../../fixtures/test-fixtures";


test('Add Owner Form Screenshot Validation', async ({ page, pm }) => {
    await pm.homePage.goto()
    await pm.navBar.clickAddNewButton()

    await expect(pm.addOwnerPage.form).toBeVisible()
    
    await expect(pm.addOwnerPage.form).toHaveScreenshot("formscreenshot.png")

});
