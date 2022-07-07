<template>
  <div class="profile-container">
    <b-skeleton-wrapper :loading="loading">
      <template #loading>
        <div class="profile-card">
          <b-skeleton
            class="profile-card__avatar"
            type="avatar"
            size="6rem"
          ></b-skeleton>
          <b-skeleton class="display-name" width="55%"></b-skeleton>
          <b-skeleton class="other-info" width="70%"></b-skeleton>
        </div>
      </template>

      <div class="profile-card">
        <b-avatar
          class="profile-card__avatar"
          :src="photoURL"
          size="6rem"
        ></b-avatar>
        <div class="display-name">{{ displayName }}</div>
        <div class="other-info">Е-майл: {{ email }}</div>
      </div>
    </b-skeleton-wrapper>
  </div>
</template>

<script lang="ts">
import Cookies from 'js-cookie';
import { Component, Vue } from 'nuxt-property-decorator';
import { getUsersModule } from '../../store';

@Component({})
export default class Profile extends Vue {
  email?: string | null = '';
  displayName?: string | null = '';
  photoURL?: string = '';
  loading: boolean = true;

  async beforeMount() {
    const uid = Cookies.get('user');
    if (!uid || uid === '') {
      this.$router.push('/');
      return;
    }
    const snap = await this.$fire.firestore.collection('users').doc(uid).get();
    const user = snap.data();
    this.email = user?.email;
    this.displayName = user?.displayName;
    this.photoURL = user?.photoURL;

    getUsersModule(this.$store).setUserData({
      email: user?.email,
      displayName: user?.displayName,
      photoURL: user?.photoURL
    });

    localStorage.setItem('currentUser', JSON.stringify(user));
    this.loading = false;
  }
}
</script>

<style scoped lang="css">
.profile-container {
  height: 100%;
  width: 600px;
}

.display-name {
  font-size: 1.5rem;
  font-weight: bold;
}

.other-info {
  font-size: 1.2rem;
}

.profile-card {
  color: rgb(37, 37, 37);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: top;
  padding: 20px;
  height: 600px;
  background-color: #818181;
  width: 100%;
  margin-top: 100px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
}

@media screen and (max-width: 600px) {
  .profile-container {
    width: 100% !important;
  }
}

@media screen and (max-height: 800px) {
  .profile-container {
    height: 50% !important;
  }
}

.profile-card__avatar {
  top: -50px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
}
</style>
