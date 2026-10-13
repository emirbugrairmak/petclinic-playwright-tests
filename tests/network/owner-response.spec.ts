import { expect, test } from "../../fixtures/test-fixtures";
import { createOwnerData } from "../../test-data/owner-data";


test('captures the owner creation response and displays the owner', {tag: ["@network"]} ,async ({ pm, page, ownerApi }) => {

    const owner = createOwnerData()
    let ownerId: number | undefined
    
    await pm.homePage.goto()
    await pm.navBar.clickAddNewButton()

    const responsePromise = page.waitForResponse(
      response =>
        response.url().includes('/api/owners') &&
        response.request().method() === 'POST'
    );
    
    try{
        await pm.addOwnerPage.addOwner(owner)
        
        const response = await responsePromise;
        const responseBody = await response.json();
        const createdOwnerId: unknown = responseBody.id
        if (typeof createdOwnerId !== "number") {
            throw new Error("Created owner ID is not a number")
        }
        ownerId = createdOwnerId

        expect(response.status()).toBe(201)
        expect(responseBody.firstName).toEqual(owner.firstName)
        expect(responseBody.lastName).toEqual(owner.lastName)
        expect(responseBody.address).toEqual(owner.address)
        expect(responseBody.city).toEqual(owner.city)
        expect(responseBody.telephone).toEqual(owner.telephone)
        
        await expect(pm.ownersPage.ownerRowByFirstNameAndLastName(owner.firstName, owner.lastName)).toBeVisible()
        await expect(pm.ownersPage.addressCellForOwner(owner.firstName, owner.lastName, owner.address)).toBeVisible()
        await expect(pm.ownersPage.cityCellForOwner(owner.firstName, owner.lastName, owner.city)).toBeVisible()
        await expect(pm.ownersPage.telephoneCellForOwner(owner.firstName, owner.lastName, owner.telephone)).toBeVisible()
    } finally{
        if (ownerId !== undefined) {
            const deleteOwnerResponse = await ownerApi.deleteOwner(ownerId)
            expect(deleteOwnerResponse.status()).toBe(204)
        }
    }
        
    
    

});



