import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, inject, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { LoginComponent } from '../login/login.component';
import { User } from '../models/auth.models';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private _authService = inject(AuthenticationService);
  private observer = inject(BreakpointObserver);

  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  isMobile = true;
  isCollapsed = false;

  currentComponent: string = 'home';

  public isAdmin: boolean = true; // TODO: change to false.

  public user: User | null = null;
  readonly dialog = inject(MatDialog);
  public currentUser = this._authService.currentUser$.subscribe((user) => {
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
    }
  });

  ngOnInit() {
    this.observer.observe(['(max-width: 800px)']).subscribe((screenSize) => {
      if (screenSize.matches) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });
  }

  ngOnDestroy() {
    this.currentUser?.unsubscribe();
  }

  toggleMenu() {
    if (this.isMobile) {
      this.sidenav.toggle();
      this.isCollapsed = false;
    } else {
      this.sidenav.open();
      this.isCollapsed = !this.isCollapsed;
    }
  }

  showComponent(currentComponent: string) {
    this.currentComponent = currentComponent;
  }

  login() {
    const dialogRef = this.dialog.open(LoginComponent);
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
    });
  }

  logout() {
    this._authService.logout().subscribe(() => {
      this.user = null;
      this.isAdmin = false;
      this.currentComponent = 'home';
    });
  }
}
