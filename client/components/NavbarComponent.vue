<template>
  <b-navbar
    class="nav-container"
    toggleable="lg"
    type="dark"
    variant="secondary"
  >
    <b-navbar-brand href="#">Доодлер</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <router-link v-slot="{ navigate }" to="/" class="nav-item" custom>
          <b-nav-item role="link" @click="navigate" @keypress.enter="navigate">
            У дома
          </b-nav-item>
        </router-link>
        <router-link v-slot="{ navigate }" to="/wordle" class="nav-item" custom>
          <b-nav-item role="link" @click="navigate" @keypress.enter="navigate">
            Думите
          </b-nav-item>
        </router-link>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown right>
          <!-- Using 'button-content' slot -->
          <template #button-content>
            <em>User</em>
          </template>
          <b-dropdown-item href="#">Profile</b-dropdown-item>
          <b-dropdown-item href="#">Sign Out</b-dropdown-item>
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
  color: white;
}
</style>
