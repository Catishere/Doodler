<template>
  <div class="timer">{{ prettyTime }}</div>
</template>

<script lang="ts">
import {
  Component,
  Emit,
  Prop,
  VModel,
  Vue,
  Watch
} from 'nuxt-property-decorator';

@Component({})
export default class Timer extends Vue {
  @VModel({ default: 90 })
  time!: number;

  @Prop({ default: false })
  isRunning!: boolean;

  interval: any;
  prettyTime: string = '';

  mounted() {
    this.prettyTime = this.prettify(this.time);
  }

  @Emit()
  timeout() {
    return true;
  }

  @Watch('isRunning')
  onRunningChange() {
    if (this.isRunning) {
      this.prettyTime = this.prettify(this.time);
      this.interval = setInterval(() => {
        this.time -= 1;
        if (this.time <= 0) {
          clearInterval(this.interval);
          this.timeout();
        }
        this.prettyTime = this.prettify(this.time);
      }, 1000);
    } else {
      clearInterval(this.interval);
    }
  }

  prettify(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? '0' + minutes : minutes}:${
      seconds < 10 ? '0' + seconds : seconds
    }`;
  }
}
</script>

<style scoped></style>
