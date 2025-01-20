<template>
  <div>
    <h2>Picture of the day</h2>
    <button v-on:click="getData">Click Me To Win A Prize!!!</button>

    <h3>{{info.title}}</h3>
    <img v-bind:src="info.hdurl" v-bind:alt="info.title">
    <p>{{ info.explanation }}</p>

  </div>
</template>

<script>

import NasaService from '../services/NasaService.js';

export default {



    data() {
        return {
            info: {}
        }
    },
    methods: {
        getData() {
            NasaService.getPictureOfTheDay().then( response => {
                if (response.status == 200) {
                    this.info = response.data;
                }
            }).catch(error => {
                console.log('Ooops');
            });
        }
    }


}
</script>

<style scoped>

</style>