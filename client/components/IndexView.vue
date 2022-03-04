<!-- Please remove this file from your project -->
<template>
  <div>
    {{ data }}
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

@Component
export default class IndexView extends Vue {
  data: string = '';

  mounted() {
    const clientW = document.documentElement.clientWidth;
    const clientH = document.documentElement.clientHeight;
    const innerW = window.innerWidth;
    const innerH = window.innerWidth;
    const scrollW = document.documentElement.scrollWidth;
    const scrollH = document.documentElement.scrollHeight;
    const outerW = window.outerWidth;
    const outerH = window.outerHeight;
    const screenW = window.screen.width;
    const screenH = window.screen.height;
    const availW = window.screen.availWidth;
    const availH = window.screen.availHeight;

    const vw = Math.max(
      document.documentElement.clientWidth || 0,
      window.innerWidth || 0
    );

    const vh = Math.max(
      document.documentElement.clientHeight || 0,
      window.innerHeight || 0
    );
    this.data = `Width: ${vw}\n
     Height: ${vh}\n
      ClientWidth: ${clientW}\n
       ClientHeight: ${clientH}\n
        InnerWidth: ${innerW}\n
         InnerHeight: ${innerH}\n 
         ScrollWidth: ${scrollW}\n
          ScrollHeight: ${scrollH}\n
           OuterWidth: ${outerW}\n
            OuterHeight: ${outerH}\n
             ScreenWidth: ${screenW}\n
              ScreenHeight: ${screenH}\n
               AvailWidth: ${availW}\n
                AvailHeight: ${availH}`;
  }
}
</script>

<style scoped>
.index-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
