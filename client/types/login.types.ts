export interface LoginInfo {
  email: string;
  password: string;
}

export interface UserInfo {
  email: string;
  displayName: string;
  photoURL: string;
}

export interface RegisterInfo extends LoginInfo, UserInfo {}
