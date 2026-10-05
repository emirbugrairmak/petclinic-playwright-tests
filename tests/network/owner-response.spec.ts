import { expect, test } from "../../fixtures/test-fixtures";
import { createOwnerData } from "../../test-data/owner-data";


test('Analyse wait for response', {tag: ["@network"]} ,async ({ pm, page, ownerApi }) => {

    const owner = createOwnerData()
    let ownerId: number | undefined
    
    await pm.homePage.goto()
    await pm.homePage.navBar.clickAddNewButton()

    const responsePromise = page.waitForResponse(
      response =>
        response.url().includes('/api/owners') &&
        response.request().method() === 'POST'
    );
    
    try{
        await pm.addOwnerPage.addOwner(owner)
        
        const response = await responsePromise;
        const responseBody = await response.json();
        ownerId = responseBody.id
        expect(ownerId).toEqual(expect.any(Number));

        expect(response.status()).toBe(201)
        expect(responseBody.firstName).toEqual(owner.firstName)
        expect(responseBody.lastName).toEqual(owner.lastName)
        expect(responseBody.address).toEqual(owner.address)
        expect(responseBody.city).toEqual(owner.city)
        expect(responseBody.telephone).toEqual(owner.telephone)
        
        await expect(pm.ownersPage.ownerRowByFirstNameAndLastName(owner.firstName, owner.lastName)).toBeVisible()
        await expect(pm.ownersPage.ownerAddressCell(owner.address, owner.firstName, owner.lastName)).toBeVisible()
        await expect(pm.ownersPage.ownerCityCell(owner.city, owner.firstName, owner.lastName)).toBeVisible()
        await expect(pm.ownersPage.ownerTelephoneCell(owner.telephone, owner.firstName, owner.lastName)).toBeVisible()
    } finally{
        if (ownerId !== undefined) {
            const deleteOwnerResponse = await ownerApi.deleteOwner(ownerId)
            expect(deleteOwnerResponse.status()).toBe(204)
        }
    }
        
    
    

});






