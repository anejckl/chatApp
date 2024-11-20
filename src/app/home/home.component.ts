import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService, User } from '@auth0/auth0-angular';
import { Role } from '../models/admin.model';
import { Auth0Service } from '../services/auth0.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private readonly observer = inject(BreakpointObserver);
  private readonly _authService = inject(AuthService);
  private readonly _auth0Service = inject(Auth0Service);

  @ViewChild(MatSidenav) sidenav!: MatSidenav;

  public isMobile = true;
  public isCollapsed = false;
  public currentComponent: string = 'home';

  public isAuthenticated$ = this._authService.isAuthenticated$;
  public userProfile: User | undefined | null;
  public isAdmin: boolean = false;

  ngOnInit(): void {
    this.observer.observe(['(max-width: 800px)']).subscribe(screenSize => {
      this.isMobile = screenSize.matches;
    });

    this._authService.user$.subscribe((user: User | undefined | null) => {
      this.userProfile = user;
      if (this.userProfile?.sub) {
        this.checkUserRole(this.userProfile.sub);
      }
      console.log(this.userProfile);
    });
  }

  toggleMenu(): void {
    if (this.isMobile) {
      this.sidenav.toggle();
    } else {
      this.isCollapsed = !this.isCollapsed;
    }
  }

  showComponent(currentComponent: string): void {
    this.currentComponent = currentComponent;
  }

  login(): void {
    this._authService.loginWithRedirect();
  }

  logout(): void {
    this._authService.logout().subscribe();
  }

  checkUserRole(userId: string): void {
    const encodedId = encodeURIComponent(userId);
    this._auth0Service.getUserRoles(encodedId).subscribe((response: Role[]) => {
      this.isAdmin = response.some((role: Role) => role.name === 'admin');
    });
  }
}