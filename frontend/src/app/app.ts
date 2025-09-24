import { AfterViewInit, Component, OnInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { RouterModule, RouterOutlet } from "@angular/router";
import { initFlowbite, Modal } from "flowbite";
import { AuthService } from "./auth/auth.service";
import { MENU_SECTIONS, MenuSection } from "./core/menu.config";
import { User } from "./models/user.model";
import { UserCardComponent } from "./shared/components/userCard/userCard.component";
import { LoaderComponent } from "./shared/loader/loader.component";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, UserCardComponent, RouterModule, LoaderComponent],
  templateUrl: "./app.html",
  styleUrl: "./app.css",
})
export class App implements OnInit, AfterViewInit {
  protected title = "frontend";
  menuSections: MenuSection[];
  userPermissions: any;
  currentMenuLabel: string = "";

  constructor(
    private authService: AuthService,
    private sanitizer: DomSanitizer,
  ) {
    this.menuSections = [];
    this.menuSections = MENU_SECTIONS.map((section) => ({
      ...section,
      items: section.items.map((item) => ({
        ...item,
        safeIconSvgPath: this.sanitizer.bypassSecurityTrustHtml(
          item.iconSvgPath,
        ),
      })),
    }));
  }

  userInfo: any = null;
  user: User = {
    id: "",
    login: "Unknown User",
  };
  userCardModal: any;

  ngOnInit(): void {
    initFlowbite();
  }

  ngAfterViewInit(): void {
    this.userCardModal = new Modal(document.getElementById("userCardModal"));
  }

  isAuth(): boolean {
    if (this.authService.isAuthenticated()) {
      this.authService.getUserInfoFromLocalStorage().subscribe({
        next: (user) => {
          this.user = user;
        },
        error: (err) => {
          console.error("Ошибка при получении пользователя", err);
        },
      });
      return true;
    }
    return false;
  }

  logout(): void {
    this.authService.logout();
  }
}
