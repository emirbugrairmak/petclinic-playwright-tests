import { APIRequestContext, APIResponse } from '@playwright/test';
import { OwnerData } from '../test-data/owner-data';

export class OwnerApi {
    private readonly request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async createOwner(owner: OwnerData): Promise<APIResponse>{
      const createOwnerResponse = await this.request.post(`${process.env.API_URL}/owners`,
      {
        data: owner,
      },
      )

      return createOwnerResponse
    }

    async deleteOwner(ownerId: number): Promise<APIResponse>{
      const deleteOwnerResponse = await this.request.delete(
        `${process.env.API_URL}/owners/${ownerId}`,
      );

      return deleteOwnerResponse
    }

    async getOwner(ownerId: number): Promise<APIResponse>{
      const getOwnerResponse = await this.request.get(
      `${process.env.API_URL}/owners/${ownerId}`,
    );

    return getOwnerResponse

    }

    async updateOwner(ownerId: number, updatedOwner: OwnerData): Promise<APIResponse>{
      const updateOwnerResponse = await this.request.put(
      `${process.env.API_URL}/owners/${ownerId}`,
      {
        data: updatedOwner,
      },
      );

      return updateOwnerResponse

    }


    
}