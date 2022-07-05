<template>
  <div class="login-container">
    <div class="login-box">
      <h3>Регистрация</h3>
      <div>
        <b-alert v-model="showAlert" variant="danger" dismissible>
          {{ errorMessage }}
        </b-alert>
        <b-form @submit="onSubmit">
          <b-form-group id="input-group" label-for="input">
            <label> Име: </label>
            <b-form-input
              id="name-input"
              v-model="form.name"
              type="text"
              placeholder="Въведи име"
            />
            <label> Аватар: </label>
            <b-form-input
              id="avatar-input"
              v-model="form.avatar"
              type="url"
              placeholder="Въведи аватар"
            />
            <label> Email: </label>
            <b-form-input
              id="email-input"
              v-model="form.email"
              type="email"
              placeholder="Enter email"
              required
            />
            <label> Password: </label>
            <b-form-input
              id="password-input"
              v-model="form.password"
              type="password"
              placeholder="Enter password"
              required
            />
          </b-form-group>
          <b-button type="submit" variant="primary">Създай</b-button>
          <nuxt-link to="/login"><b-button>Имаш акаунт?</b-button></nuxt-link>
        </b-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import Cookies from 'js-cookie';
import { RegisterInfo } from '~/client/types/login.types';

@Component({})
export default class Register extends Vue {
  form: RegisterInfo = {
    email: '',
    name: '',
    avatar: '',
    password: ''
  };

  errorMessage: string = '';
  showAlert: boolean = false;

  writeUserData(user: any) {
    this.$fire.firestore.collection('users').doc(user.uid).set(user);
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.$fire.auth
      .createUserWithEmailAndPassword(this.form.email, this.form.password)
      .then((userCred) => {
        if (userCred.user?.uid) Cookies.set('user', userCred.user?.uid);
        this.$router.push('/profile');
        const user = {
          name: this.form.name,
          avatar: this.form.avatar,
          uid: userCred.user?.uid,
          email: userCred.user?.email
        };
        this.writeUserData(user);
      })
      .catch((error) => {
        switch (error.code) {
          case 'auth/invalid-email':
            this.errorMessage = 'Невалиден е-майл';
            break;
          default:
            this.errorMessage = 'Непозната грешка';
            break;
        }
        this.showAlert = true;
      });
  }
}
</script>

<style scoped lang="css">
.login-container {
  height: 100%;
}
</style>
