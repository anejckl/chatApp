import { Component, inject, OnInit } from '@angular/core';
import { AuthService, User } from '@auth0/auth0-angular';
import { translate } from '@jsverse/transloco';
import { Role } from '../models/admin.model';
import { UserProfileField } from '../models/user-profile.models';
import { Auth0Service } from '../services/auth0.service';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrl: './person.component.scss',
})
export class PersonComponent implements OnInit {
  public userProfile!: User;
  public userProfileFields: UserProfileField[] = [];
  public userRoles: Role[] = [];

  private _authService = inject(AuthService);
  private _auth0Service = inject(Auth0Service);

  ngOnInit(): void {
    this._authService.user$.subscribe((user) => {
      if (!user) return;

      this.userProfile = user;
      const userId = user.sub;
      if (!userId) { return; }

      this.fetchRoles(userId, user);
    });
  }

  objectKeys(obj: UserProfileField): string[] {
    return Object.keys(obj);
  }

  private fetchRoles(userId: string, user: User): void {
    this._auth0Service.getUserRoles(userId).subscribe((result) => {
      this.userRoles = result;
      const roles = result.map((role) => role.name).join(', ') || translate('PERSON-NO-ROLES');
      this.populateFields(user, roles);
    });
  }

  private populateFields(user: User, roles: string): void {
    this.userProfileFields = [
      { labelKey: 'PERSON-NAME', name: user.name },
      { labelKey: 'PERSON-NICKNAME', nickname: user.nickname },
      { labelKey: 'PERSON-ROLES', roles },
      { labelKey: 'PERSON-GENDER', gender: user.gender },
      { labelKey: 'PERSON-BIRTHDATE', birthdate: user.birthdate },
      { labelKey: 'PERSON-PHONE', phone: user.phone_number },
      { labelKey: 'PERSON-ADDRESS', address: user.address },
      { labelKey: 'PERSON-UPDATE', updatedAt: user.updated_at },
    ];
  }
}