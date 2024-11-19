import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService, User } from '@auth0/auth0-angular';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
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
  public userProfile: User | null | undefined = null;
  public isAdmin: boolean = false;
  private isAdminSubject = new BehaviorSubject<boolean>(false);

  ngOnInit(): void {
    this.observer.observe(['(max-width: 800px)']).subscribe((screenSize) => {
      this.isMobile = screenSize.matches;
    });
  
    this._authService.user$.subscribe((user: User | null | undefined) => {
      this.userProfile = user;
      if (this.userProfile?.sub) {
        this.checkUserRole(this.userProfile.sub).subscribe((isAdmin) => {
          this.isAdmin = isAdmin;
        });
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

  checkUserRole(userId: string): BehaviorSubject<boolean> {
    const encodedId = encodeURIComponent(userId);
    this._auth0Service.getUserRoles(encodedId).subscribe(response => {
      const isAdmin = response.some((role: any) => role.name === "admin");
      this.isAdminSubject.next(isAdmin);
    });
  
    return this.isAdminSubject;
  }
}