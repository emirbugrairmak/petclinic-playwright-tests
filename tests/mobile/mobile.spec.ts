import { test, expect } from "../../fixtures/test-fixtures";
import { existingOwners } from '../../test-data/owner-data';


test('TC-M01 - Mobile Navigation', async ({ pm }) => {
    await pm.homePage.goto()
    await pm.navBar.clickOwnerSearchButton()

    await expect(pm.ownersPage.lastNameInputField).toBeInViewport()
    await expect(pm.ownersPage.findOwnerButton).toBeVisible()
    await expect(pm.ownersPage.ownersTable).toBeVisible()

    const owner = existingOwners.georgeFranklin

    await pm.ownersPage.searchOwner(owner.lastName)

    await expect(pm.ownersPage.ownerRowByFirstNameAndLastName(owner.firstName, owner.lastName)).toBeVisible()

    await pm.ownersPage.openOwner(owner.firstName, owner.lastName)

    await expect(pm.ownerDetailsPage.nameCell).toHaveText(`${owner.firstName} ${owner.lastName}`)

});
