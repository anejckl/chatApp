import { Component, inject, OnInit } from '@angular/core';
import { AuthService, User } from '@auth0/auth0-angular';
import { UserProfileField } from '../models/user-profile.models';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss'],
})
export class PersonComponent implements OnInit {
  public userProfile!: User;
  public userProfileFields: UserProfileField[] = [];
  
  private _authService = inject(AuthService);

  public userInfoFields: { label: string; value: string; condition: boolean }[] = [];

  ngOnInit(): void {
    this._authService.user$.subscribe((user) => {
      if (user) {
        this.userProfile = user;

        this.userProfileFields = [
          { labelKey: 'PERSON-NAME', value: user.name },
          { labelKey: 'PERSON-NICKNAME', value: user.nickname },
          { labelKey: 'PERSON-GENDER', value: user.gender },
          { labelKey: 'PERSON-BIRTHDATE', value: user.birthdate },
          { labelKey: 'PERSON-PHONE', value: user.phone_number },
          { labelKey: 'PERSON-ADDRESS', value: user.address },
          { labelKey: 'PERSON-UPDATE', value: user.updated_at, isDate: true },
        ];
      }
    });
  }
}
