import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, inject, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { LoginComponent } from '../login/login.component';
import { User } from '../models/auth.models';
import { AuthenticationService } from '../services/authentication.service';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private _themeService = inject(ThemeService);
  private _authService = inject(AuthenticationService);
  private observer = inject(BreakpointObserver);

  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  isMobile = true;
  isCollapsed = false;

  currentComponent: string = 'home';
  
  public user: User | null = null;
  readonly dialog = inject(MatDialog);
  public currentUser = this._authService.currentUser$.subscribe(user => {
    this.user = user;
  });

  

  ngOnInit() {
    this.observer.observe(['(max-width: 800px)']).subscribe((screenSize) => {
      if(screenSize.matches){
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });
  }

  toggleMenu() {
    if(this.isMobile){
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

  openDialog() {
    const dialogRef = this.dialog.open(LoginComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }
}
