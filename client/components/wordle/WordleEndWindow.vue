<template>
  <div class="window-container">
    <button class="close-button" @click="close()">
      <i class="fas fa-times"> X </i>
    </button>
  </div>
</template>
<script>
export default {
  name: 'WordleEndWindow',
  data() {
    return {};
  },
  methods: {
    close() {
      this.$destroy();
      this.$el.parentNode.removeChild(this.$el);
    }
  }
};
</script>

<style scoped>
.window-container {
  position: absolute;
  width: 50%;
  height: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
