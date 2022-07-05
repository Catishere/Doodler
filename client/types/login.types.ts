export interface LoginInfo {
  email: string;
  password: string;
}

export interface UserInfo {
  email: string;
  name: string;
  avatar: string;
}

export interface RegisterInfo extends LoginInfo, UserInfo {}
