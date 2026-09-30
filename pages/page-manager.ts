import { Page } from "@playwright/test";
import { NavbarComponent } from "../components/NavbarComponent";
import { AddOwnerPage } from "./add-owner-page";
import { AddPetPage } from "./add-pet-page";
import { HomePage } from "./home-page";
import { OwnerDetailsPage } from "./owner-details-page";
import { OwnersPage } from "./owners-page";

export class PageManager {
  readonly navBar: NavbarComponent;
  readonly homePage: HomePage;
  readonly ownersPage: OwnersPage;
  readonly addOwnerPage: AddOwnerPage;
  readonly ownerDetailsPage: OwnerDetailsPage;
  readonly addPetPage: AddPetPage;

  constructor(page: Page) {
    this.navBar = new NavbarComponent(page);
    this.homePage = new HomePage(page);
    this.ownersPage = new OwnersPage(page);
    this.addOwnerPage = new AddOwnerPage(page);
    this.ownerDetailsPage = new OwnerDetailsPage(page);
    this.addPetPage = new AddPetPage(page);
  }
}
