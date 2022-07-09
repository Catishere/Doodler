<template>
  <div class="login-container">
    <div class="login-box">
      <h3 class="register-title">Регистрация</h3>
      <div>
        <b-alert v-model="showAlert" variant="danger" dismissible>
          {{ errorMessage }}
        </b-alert>
        <b-form class="form-text-control" @submit="onSubmit">
          <b-form-group id="input-group" label-for="input">
            <label> Име: </label>
            <b-form-input
              id="name-input"
              v-model="form.displayName"
              class="sm-responsive"
              :state="nameValidation()"
              type="text"
              placeholder="Въведи име"
              trim
            />
            <label> Аватар: </label>
            <b-form-input
              id="photourl-input"
              v-model="form.photoURL"
              class="sm-responsive"
              type="url"
              placeholder="Въведи аватар"
              trim
            />
            <label> Е-майл: </label>
            <b-form-input
              id="email-input"
              v-model="form.email"
              class="sm-responsive"
              type="email"
              placeholder="Въведи е-майл"
              trim
              required
            />
            <label> Парола: </label>
            <b-form-input
              id="password-input"
              v-model="form.password"
              class="sm-responsive"
              type="password"
              placeholder="Въведи парола"
              required
            />
            <b-form-invalid-feedback id="name-input-live-feedback">
              Името трябва да е поне 3 символа
            </b-form-invalid-feedback>
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
    displayName: '',
    photoURL: '',
    password: ''
  };

  errorMessage: string = '';
  showAlert: boolean = false;
  showFieldStatus: boolean = false;

  writeUserData(user: any) {
    this.$fire.firestore.collection('users').doc(user.uid).set(user);
  }

  nameValidation() {
    return !this.showFieldStatus || this.form.displayName.length >= 3
      ? null
      : false;
  }

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.form.displayName.length < 3) {
      this.showFieldStatus = true;
      setTimeout(() => (this.showFieldStatus = false), 2000);
      return;
    }
    this.$fire.auth
      .createUserWithEmailAndPassword(this.form.email, this.form.password)
      .then((userCred) => {
        if (userCred.user?.uid) Cookies.set('user', userCred.user?.uid);
        this.$router.push('/profile');
        const user = {
          displayName: this.form.displayName,
          photoURL: this.form.photoURL,
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
  width: 320px;
  overflow-y: auto;
}

@media screen and (max-width: 400px) {
  .login-container {
    width: 80%;
  }
}

.register-title {
  margin-top: 20px;
}

label {
  margin-top: 5px;
}

@media screen and (max-height: 480px) {
  .form-text-control {
    font-size: 0.8rem;
  }
  .sm-responsive {
    height: 28px;
  }
}
</style>
