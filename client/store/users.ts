import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import { UserInfo } from '../types/login.types';

@Module({
  name: 'users',
  stateFactory: true,
  namespaced: true
})
export default class UsersModule extends VuexModule {
  displayName_: string = '';
  photoURL_: string = '';
  email_: string = '';
  logged_: boolean = false;
  initials_: string = '';

  get displayName() {
    return this.displayName_;
  }

  get photoURL() {
    return this.photoURL_;
  }

  get email() {
    return this.email_;
  }

  get logged() {
    return this.logged_;
  }

  get initials() {
    return this.initials_;
  }

  get userData() {
    return {
      displayName: this.displayName,
      photoURL: this.photoURL,
      email: this.email
    };
  }

  @Mutation
  setDisplayName(displayName: string): void {
    this.displayName_ = displayName;
  }

  @Mutation
  setPhotoURL(photoURL: string): void {
    this.photoURL_ = photoURL;
  }

  @Mutation
  setInitials(initials: string): void {
    this.initials_ = initials;
  }

  @Mutation
  setEmail(email: string): void {
    this.email_ = email;
  }

  @Mutation
  setLogged(logged: boolean): void {
    this.logged_ = logged;
  }

  @Action({ rawError: true })
  setUserData(data: UserInfo) {
    const { displayName, photoURL, email } = data;
    this.context.commit('setDisplayName', displayName);
    this.context.commit('setPhotoURL', photoURL);
    this.context.commit('setEmail', email);
    try {
      this.context.commit(
        'setInitials',
        this.displayName
          .split(' ')
          .map((name) => name[0])
          .join('')
      );
    } catch (e) {
      this.context.commit('setInitials', '');
    }
  }
}
