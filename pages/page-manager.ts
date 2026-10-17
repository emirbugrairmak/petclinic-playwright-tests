import { Page } from "@playwright/test";
import { NavbarComponent } from "../components/NavbarComponent";
import { AddOwnerPage } from "./add-owner-page";
import { AddPetPage } from "./add-pet-page";
import { AddVisitPage } from "./add-visit-page";
import { HomePage } from "./home-page";
import { OwnerDetailsPage } from "./owner-details-page";
import { OwnersPage } from "./owners-page";
import { EditPetPage } from "./edit-pet-page";

export class PageManager {
  readonly navBar: NavbarComponent;
  readonly homePage: HomePage;
  readonly ownersPage: OwnersPage;
  readonly addOwnerPage: AddOwnerPage;
  readonly ownerDetailsPage: OwnerDetailsPage;
  readonly addPetPage: AddPetPage;
  readonly addVisitPage: AddVisitPage;
  readonly editPetPage: EditPetPage

  constructor(page: Page) {
    this.navBar = new NavbarComponent(page);
    this.homePage = new HomePage(page);
    this.ownersPage = new OwnersPage(page);
    this.addOwnerPage = new AddOwnerPage(page);
    this.ownerDetailsPage = new OwnerDetailsPage(page);
    this.addPetPage = new AddPetPage(page);
    this.addVisitPage = new AddVisitPage(page);
    this.editPetPage = new EditPetPage(page)
  }
}
