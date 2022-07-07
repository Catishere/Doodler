<template>
  <div class="login-container">
    <div class="login-box">
      <h3>Вход</h3>
      <div>
        <b-alert v-model="showAlert" variant="danger" dismissible>
          {{ errorMessage }}
        </b-alert>
        <b-form @submit="onSubmit">
          <b-form-group
            id="input-group"
            label-for="input"
            class="form-container"
          >
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
          <b-button-group role="group" class="mt-3 form-container">
            <b-button type="submit" variant="primary">Влез</b-button>
            <b-button to="/register" nuxt> Регистрирай се </b-button>
          </b-button-group>
          <b-button-group role="group" class="mt-1 form-container">
            <button
              type="button"
              class="btn btn-light"
              @click="loginWithGoogle()"
            >
              <b-icon-google /> <b> Влез с Google </b>
            </button>
          </b-button-group>
        </b-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import Cookies from 'js-cookie';
import { BIconGoogle } from 'bootstrap-vue';
import { googleProvider } from '../../providers/google-auth-provider';
import { getUsersModule } from '../../store';
import { LoginInfo } from '~/client/types/login.types';

@Component({ components: { BIconGoogle } })
export default class Login extends Vue {
  form: LoginInfo = {
    email: '',
    password: ''
  };

  errorMessage: string = '';
  showAlert: boolean = false;

  loginWithGoogle() {
    this.$fire.auth
      .signInWithPopup(googleProvider)
      .then((result) => {
        this.$fire.firestore.collection('users').doc(result.user?.uid).set({
          displayName: result.user?.displayName,
          email: result.user?.email,
          photoURL: result.user?.photoURL,
          uid: result.user?.uid
        });
        if (result.user?.uid) Cookies.set('user', result.user?.uid);
        getUsersModule(this.$store).setLogged(true);
        this.$router.push('/profile');
      })
      .catch((error) => {
        console.log(error.code);
      });
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.$fire.auth
      .signInWithEmailAndPassword(this.form.email, this.form.password)
      .then((userCred) => {
        if (userCred.user?.uid) Cookies.set('user', userCred.user?.uid);
        getUsersModule(this.$store).setLogged(true);
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

.form-container {
  width: 90%;
  margin: 0 auto;
}
</style>
