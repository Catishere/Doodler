<template>
  <div
    class="tile"
    :data-state="state"
    :data-animation="animation"
    @click="clicked()"
  >
    {{ letter }}
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'nuxt-property-decorator';

@Component({})
export default class Letter extends Vue {
  @Prop({ default: ' ' })
  letter!: string;

  @Prop({ default: ' ' })
  animation!: string;

  @Prop({ default: ' ' })
  state!: string;

  clicked() {
    if (this.state === 'empty') {
      this.$emit('clicked', this.letter);
    }
  }
}
</script>

<style scoped>
.tile {
  background-color: transparent;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  line-height: 2rem;
  font-weight: bold;
  vertical-align: middle;
  box-sizing: border-box;
  color: rgb(255, 255, 255);
  text-transform: uppercase;
  user-select: none;
}

@media screen and (max-width: 300px) {
  .tile {
    font-size: 1rem;
    line-height: 1rem;
  }
}
@media screen and (max-height: 600px) {
  .tile {
    font-size: 1rem;
    line-height: 1rem;
  }
}

.tile::before {
  content: '';
  display: inline-block;
  padding-bottom: 100%;
}

.tile[data-state='empty'] {
  border: 2px solid #3a3a3c;
}
.tile[data-state='tbd'] {
  background-color: var(--color-tone-7);
  border: 2px solid var(--color-tone-3);
  color: var(--color-tone-1);
}
.tile[data-state='correct'] {
  background-color: var(--color-correct);
}
.tile[data-state='present'] {
  background-color: var(--color-present);
}
.tile[data-state='absent'] {
  background-color: #3a3a3c;
}

.tile[data-animation='pop'] {
  animation-name: PopIn;
  animation-duration: 100ms;
}

@keyframes PopIn {
  from {
    transform: scale(0.8);
    opacity: 0;
  }

  40% {
    transform: scale(1.1);
    opacity: 1;
  }
}
.tile[data-animation='flip-in'] {
  animation-name: FlipIn;
  animation-duration: 150ms;
  animation-timing-function: ease-in;
}
@keyframes FlipIn {
  0% {
    transform: rotateX(0);
  }
  100% {
    transform: rotateX(-90deg);
  }
}
.tile[data-animation='flip-out'] {
  animation-name: FlipOut;
  animation-duration: 150ms;
  animation-timing-function: ease-in;
}
@keyframes FlipOut {
  0% {
    transform: rotateX(-90deg);
  }
  100% {
    transform: rotateX(0);
  }
}
</style>
