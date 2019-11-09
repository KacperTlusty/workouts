declare namespace Express {
  export interface User {
    id: string;
    email: string;
    privilage: Privilage;
  }

  enum Privilage {
    User = 'User',
    Admin = 'Admin'
  }
}
