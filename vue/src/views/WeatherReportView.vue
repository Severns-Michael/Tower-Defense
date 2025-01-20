<template>
  <div>
      <h2>Haunted Forest Weather Report</h2>
      <p>{{ weather }}</p>
  </div>
</template>

<script>
export default {

    data() {
        return {
            weather: {}
        }
    },
    created() {
        const url = 'https://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=2f7bdcc26bc9669ab55f8341c4521509'
        fetch(url).then( response => {
            if (response.status == 200) {
                console.log("we got a response");
              
                response.json().then( data => {
                    this.weather = data;
                })
            }

        }).catch(error => {
          console.log('Fetch error: ' + error);
        })
    }

}
</script>

<style scoped>

</style>