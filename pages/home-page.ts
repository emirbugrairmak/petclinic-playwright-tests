import { Locator, Page } from '@playwright/test';
import { NavbarComponent } from '../components/NavbarComponent';

export class HomePage {
  private readonly page: Page;
  readonly welcomeMessage: Locator
  readonly navBar: NavbarComponent

  constructor(page: Page) {
    this.page = page;
    this.welcomeMessage = page.getByRole("heading", {name: "Welcome to Petclinic",});
    this.navBar = new NavbarComponent(page)
  }

  async goto(){
    await this.page.goto("/")
  }


  
}