<template>
    <router-view></router-view>
</template>
<script>
// require('material-design-lite')
// import firebase from 'firebase'
// export default {
//   name: 'app',
//   computed: {
//     isHome: function() {
//       console.log(this.$route.path === '/')
//       return this.$route.path === '/'
//     }
//   },
//   data() {
//     return {
//       isLoggedIn: false
//     }
//   },
//   methods: {
//     hideMenu: function() {
//       document.getElementsByClassName('mdl-layout__drawer')[0].classList.remove('is-visible')
//       document.getElementsByClassName('mdl-layout__obfuscator')[0].classList.remove('is-visible')
//     },
//     logout() {
//       firebase.auth().signOut().then(() => {
//         console.log('Signed Out');
//         this.isLoggedIn = false
//       }, (error) => {
//         console.error('Sign Out Error', error);
//       });
//       this.hideMenu()
//     }
//   },
//   mounted() {
//     firebase.auth().onAuthStateChanged((user) => {
//       if (user) {
//         console.log(user)
//         this.isLoggedIn = true
//       }
//       else {
//         console.log('not logged in')
//         this.isLoggedIn = false
//       }
//     })
//   }
// }
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons');
@import url('https://code.getmdl.io/1.2.1/material.blue-red.min.css');
@import url('../node_modules/firebaseui/dist/firebaseui.css');
@import url('../node_modules/vuetify/dist/vuetify.min.css');
</style>
