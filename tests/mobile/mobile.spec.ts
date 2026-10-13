import { test, expect } from "../../fixtures/test-fixtures";
import { existingOwners } from '../../test-data/owner-data';


test('searches for and opens an owner on mobile', async ({ pm }) => {
    await pm.homePage.goto()
    await pm.navBar.clickOwnerSearchButton()

    await expect(pm.ownersPage.lastNameInput).toBeInViewport()
    await expect(pm.ownersPage.findOwnerButton).toBeVisible()
    await expect(pm.ownersPage.ownersTable).toBeVisible()

    const owner = existingOwners.georgeFranklin

    await pm.ownersPage.searchOwner(owner.lastName)

    await expect(pm.ownersPage.ownerRowByFirstNameAndLastName(owner.firstName, owner.lastName)).toBeVisible()

    await pm.ownersPage.openOwner(owner.firstName, owner.lastName)

    await expect(pm.ownerDetailsPage.ownerNameCell).toHaveText(`${owner.firstName} ${owner.lastName}`)

});
