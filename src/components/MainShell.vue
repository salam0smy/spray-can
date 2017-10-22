<template>
  <v-app>
    <v-navigation-drawer temporary v-model="drawer" light absolute>
      <v-toolbar flat>
        <v-list>
          <v-list-tile>
            <v-list-tile-title class="title">
              Spray Can
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-divider></v-divider>
      <v-list dense class="pt-0">
        <v-list-tile v-for="item in items" :key="item.title" @click="item.onclick">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app dark color="primary">
      <v-toolbar-side-icon v-show="!showBackArrow" @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-btn v-show="showBackArrow" icon @click="goBack">
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <v-toolbar-title class="white--text">Spray Can</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="goToAddMemory" v-show="!showBackArrow && isLoggedIn">
        <v-icon>add</v-icon>
      </v-btn>
      <v-btn @click="login" v-show="!isLoggedIn && !showBackArrow" flat dark>
        Login
      </v-btn>
    </v-toolbar>
    <main>
      <v-content>
        <v-container fluid class="content-container">
          <router-view></router-view>
        </v-container>
      </v-content>
    </main>
  </v-app>
</template>

<script>
import Vue from 'Vue'
import firebase from 'firebase'
export default {
  name: 'main-app',
  computed: {
    showBackArrow() {
      return this.$route.path !== '/'
    }
  },
  data() {
    return {
      //showBackArrow: false,
      isLoggedIn: false,
      drawer: false,
      items: [
        { title: 'Home', icon: 'home', onclick: this.goHome },
        { title: 'Logout', icon: 'sign-out', onclick: this.logout }
      ],
      right: null
    }
  },
  watch: {
    '$route'(to, from) {
      console.log('watch', to.path)
      //this.showBackArrow = to.path !== '/'
      //Vue.set(this.options, 'showBackArrow', showBackArrow)
    }
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    goHome() {
      this.$router.push('/')
      this.drawer = false
    },
    login(){
      this.$router.push('/auth')
    },
    logout() {
      firebase.auth().signOut().then(() => {
        console.log('Signed Out');
        this.isLoggedIn = false
      }, (error) => {
        console.error('Sign Out Error', error);
      });
      this.drawer = false
    },
    onItemClick(item) {
      console.log(item)
    },
    goToAddMemory() {
      this.$router.push('/addMemory')
    }
  },
  mounted() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log(user)
        this.isLoggedIn = true
      }
      else {
        console.log('not logged in')
        this.isLoggedIn = false
      }
    })
  }
}
</script>
<style>
body {
  margin: 0;
  height: 100%;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #1565C0;
}

main {
  text-align: center;
  /* margin-top: 40px; */
  height: 100%;
  position: relative;
  overflow-y: auto;
}

.page-content {
  height: 100%;
}

header {
  margin: 0;
  height: 56px;
  padding: 0 16px 0 24px;
  background-color: #0D47A1;
  color: #ffffff;
}

header span {
  display: block;
  position: relative;
  font-size: 20px;
  line-height: 1;
  letter-spacing: .02em;
  font-weight: 400;
  box-sizing: border-box;
  padding-top: 16px;
}

.content-container {
  padding: 0px;
}
</style>

