<script lang="ts">
import Cookies from 'js-cookie';
import { BLink } from 'bootstrap-vue';
import { Component, Vue } from 'nuxt-property-decorator';
import { getUsersModule } from '../store';
import { UserInfo } from '../types/login.types';

@Component({ components: { BLink } })
export default class NavbarComponent extends Vue {
  async logout() {
    await this.$fire.auth.signOut();
    Cookies.remove('user');
    localStorage.removeItem('currentUser');
  }

  setUserData(user: UserInfo): void {
    getUsersModule(this.$store).setUserData(user);
  }

  setLogged(logged: boolean): void {
    getUsersModule(this.$store).setLogged(logged);
  }

  isLogged(): boolean {
    return getUsersModule(this.$store).logged;
  }

  getUserData(): UserInfo {
    return getUsersModule(this.$store).userData;
  }

  beforeMount() {
    if (Cookies.get('user')) {
      const currentUser = JSON.parse(
        localStorage.getItem('currentUser') || '{}'
      );
      if (currentUser) {
        this.setUserData(currentUser);
      }
    }
  }

  mounted() {
    const uid = Cookies.get('user');
    if (uid && uid !== '') {
      this.setLogged(true);
    }
  }
}
</script>

<template>
  <b-navbar
    class="nav-container"
    toggleable="lg"
    type="dark"
    variant="secondary"
  >
    <b-navbar-brand to="/" nuxt>Доодлер</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item to="/" nuxt> У дома </b-nav-item>
        <b-nav-item to="/wordle" nuxt> Думите </b-nav-item>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown right>
          <!-- Using 'button-content' slot -->
          <template #button-content>
            <img
              v-if="isLogged()"
              :src="getUserData().photoURL"
              class="avatar"
            />
            <em>{{ isLogged() ? getUserData().displayName : 'Анонимен' }}</em>
          </template>
          <b-dropdown-item v-if="isLogged()" to="/profile" nuxt>
            Профил
          </b-dropdown-item>
          <b-dropdown-item v-if="!isLogged()" to="/login" nuxt>
            Влез
          </b-dropdown-item>
          <b-dropdown-item v-if="isLogged()" href="/" @click="logout()">
            Излез
          </b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<style scoped>
.nav-container {
  width: 100%;
  display: flex;
}
.nav-item {
  text-decoration: none;
  color: rgb(0, 0, 0);
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
</style>
