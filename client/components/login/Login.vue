<template>
  <div class="login-container">
    <div class="login-box">
      <h3>Вход</h3>
      <div>
        <b-alert v-model="showAlert" variant="danger" dismissible>
          {{ errorMessage }}
        </b-alert>
        <b-form @submit="onSubmit">
          <b-form-group id="input-group" label-for="input">
            <label> Е-майл: </label>
            <b-form-input
              id="email-input"
              v-model="form.email"
              type="email"
              placeholder="Въведи е-майл"
              required
            />
            <label> Парола: </label>
            <b-form-input
              id="password-input"
              v-model="form.password"
              placeholder="Въведи парола"
              type="password"
              required
            />
          </b-form-group>
          <b-button type="submit" variant="primary">Влез</b-button>
          <nuxt-link to="/register">
            <b-button> Регистрирай се </b-button>
          </nuxt-link>
        </b-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import Cookies from 'js-cookie';
import { LoginInfo } from '~/client/types/login.types';

@Component({})
export default class Login extends Vue {
  form: LoginInfo = {
    email: '',
    password: ''
  };

  errorMessage: string = '';
  showAlert: boolean = false;

  onSubmit(event: Event) {
    event.preventDefault();
    this.$fire.auth
      .signInWithEmailAndPassword(this.form.email, this.form.password)
      .then((userCred) => {
        if (userCred.user?.uid) Cookies.set('user', userCred.user?.uid);
        this.$router.push('/profile');
      })
      .catch((error) => {
        switch (error.code) {
          case 'auth/user-not-found':
            this.errorMessage = 'Няма такъв потребител';
            break;
          case 'auth/wrong-password':
            this.errorMessage = 'Грешна парола';
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
