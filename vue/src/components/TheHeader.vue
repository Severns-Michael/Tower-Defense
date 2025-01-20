<template>
  <div id="container">
    <img src="https://res.cloudinary.com/drr6cwmiz/image/upload/v1732292241/hflogo_m5k1xj.png" alt="Haunted Forest">
    <div id="nav">
      <router-link v-bind:to="{ name: 'home' }">Home</router-link>
      <router-link v-bind:to="{ name: 'searchItem' }">Item Search</router-link>
      <router-link v-bind:to="{ name: 'addItem' }">Add Item</router-link>
      <router-link v-bind:to="{ name: 'weather' }">Today's Weather</router-link>
      <router-link v-bind:to="{ name: 'pic' }">POD</router-link>
      <router-link v-bind:to="{ name: 'logout' }" v-if="$store.state.token != ''">Logout</router-link>
      <router-link v-bind:to="{ name: 'login' }" v-if="$store.state.token == ''">Login</router-link>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>

#container {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
}

 img {
    width:20%;
    height: auto;
 }

 #nav a {
    margin: 5px;
    padding: 13px 25px;
    background-color: aqua;
    color: black;
    border-radius: 4px;
 }
</style>