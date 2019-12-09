<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <header>
      <h1>Game Time X</h1>
    </header>
  </div>
</template>

<style lang="scss" scoped>
  h1 {
    font-family: raleway-regular, Verdana, serif;
    text-transform: uppercase;

    &:before {
      content: ' ';
    }
  }
</style>

<script>
export default {
  name: 'home'
};
</script>
