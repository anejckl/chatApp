// auth0-user.model.ts
export interface User {
    given_name: string;
    family_name: string;
    nickname: string;
    name: string;
    picture: string;
    updated_at: string;
    email: string;
    email_verified: boolean;
    sub: string;
  }
  