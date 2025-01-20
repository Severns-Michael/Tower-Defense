<template>
  <div id="capstone-app">
    <the-header />
    <router-view />
    <the-footer />
  </div>
</template>

<script>

import TheHeader from '../src/components/TheHeader.vue';
import TheFooter from '../src/components/TheFooter.vue';

export default {
  components: {
    TheHeader,
    TheFooter
  }

}
</script>

<style>

</style>
