import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import { UserInfo } from '../types/login.types';

@Module({
  name: 'users',
  stateFactory: true,
  namespaced: true
})
export default class UsersModule extends VuexModule {
  name_: string = '';
  avatar_: string = '';
  email_: string = '';
  logged_: boolean = false;

  get name() {
    return this.name_;
  }

  get avatar() {
    return this.avatar_;
  }

  get email() {
    return this.email_;
  }

  get logged() {
    return this.logged_;
  }

  get userData() {
    return {
      name: this.name,
      avatar: this.avatar,
      email: this.email
    };
  }

  @Mutation
  setName(name: string): void {
    this.name_ = name;
  }

  @Mutation
  setAvatar(name: string): void {
    this.name_ = name;
  }

  @Mutation
  setEmail(name: string): void {
    this.name_ = name;
  }

  @Mutation
  setLogged(logged: boolean): void {
    this.logged_ = logged;
  }

  @Action({ rawError: true })
  setUserData(data: UserInfo) {
    const { name, avatar, email } = data;
    this.context.commit('setName', name);
    this.context.commit('setAvatar', avatar);
    this.context.commit('setEmail', email);
  }

  @Action({ rawError: true })
  getUserData(data: UserInfo) {
    const { name, avatar, email } = data;
    this.context.commit('setName', name);
    this.context.commit('setAvatar', avatar);
    this.context.commit('setEmail', email);
  }
}
