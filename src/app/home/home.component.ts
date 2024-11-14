import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService, User } from '@auth0/auth0-angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private readonly observer = inject(BreakpointObserver);
  private readonly _authService = inject(AuthService);

  @ViewChild(MatSidenav) sidenav!: MatSidenav;

  public isMobile = true;
  public isCollapsed = false;
  public currentComponent: string = 'home';

  public isAuthenticated$ = this._authService.isAuthenticated$;
  public userProfile: User | null | undefined = null;
  public isAdmin: boolean = false;


  ngOnInit(): void {
    this.observer.observe(['(max-width: 800px)']).subscribe((screenSize) => {
      this.isMobile = screenSize.matches;
    });

    this._authService.user$.subscribe((user: User | null | undefined) => {
      this.userProfile = user;
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
}