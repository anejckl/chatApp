import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { Subscription } from 'rxjs';
import { LoginComponent } from '../login/login.component';
import { User } from '../models/auth.models';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly _authService = inject(AuthenticationService);
  private readonly observer = inject(BreakpointObserver);
  private currentUserSubscription!: Subscription;

  @ViewChild(MatSidenav) sidenav!: MatSidenav;

  public isMobile = true;
  public isCollapsed = false;
  public currentComponent: string = 'home';
  public isAdmin: boolean = false;
  public user: User | null = null;

  private readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.observer.observe(['(max-width: 800px)']).subscribe((screenSize) => {
      this.isMobile = screenSize.matches;
    });

    this.currentUserSubscription = this._authService.currentUser$.subscribe(
      (user) => {
        this.handleUserAuthentication(user);
      }
    );

    this._authService.checkAuthentication().subscribe((response) => {
      if (response.isAuthenticated) {
        this.user != response.user;
        this.isAdmin = this.user?.role_level === 2;
      } else {
        this.user = null;
        this.isAdmin = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.currentUserSubscription) {
      this.currentUserSubscription.unsubscribe();
    }
  }

  toggleMenu(): void {
    this.sidenav.toggle();
    this.isCollapsed = this.isMobile ? false : !this.isCollapsed;
  }

  showComponent(currentComponent: string): void {
    this.currentComponent = currentComponent;
  }

  login(): void {
    const dialogRef = this.dialog.open(LoginComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Login result:', result);
      }
    });
  }

  logout(): void {
    this._authService.logout().subscribe(() => {
      this.user = null;
      this.isAdmin = false;
      this.currentComponent = 'home';
    });
  }

  private handleUserAuthentication(user: User | null): void {
    if (user) {
      this.user = {
        ...user,
        username:
          user.username.charAt(0).toUpperCase() +
          user.username.slice(1).toLowerCase(),
      };
      this.isAdmin = user.role_level === 2;
    } else {
      this.user = null;
      this.isAdmin = false;
    }
  }
}
