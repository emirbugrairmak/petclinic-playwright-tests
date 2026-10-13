import { test, expect } from "../../fixtures/test-fixtures";


test('matches the new owner form screenshot', {tag: ["@visual"]}, async ({ pm }) => {
    await pm.homePage.goto()
    await pm.navBar.clickAddNewButton()

    await expect(pm.addOwnerPage.ownerForm).toBeVisible()

    // Temporary Change
    // await page.addStyleTag({
    //     content: `
    //         input {
    //             background-color: #ff00ff !important;
    //         }
    //     `
    // });
    
    await expect(pm.addOwnerPage.ownerForm).toHaveScreenshot("formscreenshot.png")

});
