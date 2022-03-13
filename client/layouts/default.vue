<template>
  <div class="app">
    <Nuxt />
  </div>
</template>

<style>
:root {
  --green: #6aaa64;
  --darkendGreen: #538d4e;
  --yellow: #c9b458;
  --darkendYellow: #b59f3b;
  --orange: #f5793a;
  --blue: #85c0f9;
  --color-present: var(--darkendYellow);
  --color-correct: var(--green);
  --color-tone-1: #ffffff;
  --color-tone-2: #818384;
  --color-tone-3: #565758;
  --color-tone-4: #3a3a3c;
  --color-tone-5: #272729;
  --color-tone-6: #1a1a1b;
}

.app {
  text-align: center;
  color: #919191;
  background: #121212;
  width: 100vw;
  height: 100vh;
  display: flex;
  overflow: hidden;
  justify-content: center;
  touch-action: manipulation;
}

body {
  position: fixed;
  overflow: hidden;
}

.custom-control-input:checked ~ .custom-control-label::before {
  color: #fff;
  border-color: var(--color-correct);
  background-color: var(--color-correct);
}

.custom-control-input ~ .custom-control-label::before {
  color: #fff;
  border-color: var(--color-tone-7);
  background-color: var(--color-tone-7);
}

html {
  overflow: hidden;
  font-family: 'Gotham', 'Arial', 'Helvetica Neue', Helvetica, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>
