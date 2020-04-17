import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUser: string;
  currentUserID: string;
  private currentRole = "";
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;

  constructor(private authService: AuthService) {}

  get isAdmin() {
    return this.currentRole === "Admin";
  }

  get isDriver() {
    return this.currentRole === "Driver";
  }

  get isSponsor() {
    return this.currentRole === "Sponsor";
  }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
    this.currentUser = this.authService.getUsername();
    this.currentUserID = this.authService.getUserId();
    this.currentRole = this.authService.getUserRole();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
