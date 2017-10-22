<template>
  <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
    <header class="mdl-layout__header">

      <div class="mdl-layout__header-row">
        <span class="mdl-layout-title">Noteh</span>
        <div class="mdl-layout-spacer"></div>
        <div>
          <router-link class="" to="/addMemory" v-if="isLoggedIn">
            <button class="mdl-layout-icon mdl-button mdl-js-button mdl-button--icon">
              <i class="material-icons">add</i>
            </button>
          </router-link>
          <router-link class="mdl-js-ripple-effect" to="/auth" v-if="!isLoggedIn">
            <i class="">signin</i>
          </router-link>
        </div>
      </div>
    </header>
    <div class="mdl-layout__drawer">
      <span class="mdl-layout-title">Noteh</span>
      <nav class="mdl-navigation">
        <router-link class="mdl-navigation__link" to="/" @click.native="hideMenu">Home</router-link>
        <a v-if="isLoggedIn" class="mdl-navigation__link" @click="logout" @click.native="hideMenu">Logout</a>
      </nav>
    </div>
    <main class="mdl-layout__content">
      <div class="page-content">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>

<script>
require('material-design-lite')
export default {
  name: 'main-app',
  data() {
    return {
      isLoggedIn: false
    }
  },
  methods: {
    hideMenu: function() {
      document.getElementsByClassName('mdl-layout__drawer')[0].classList.remove('is-visible')
      document.getElementsByClassName('mdl-layout__obfuscator')[0].classList.remove('is-visible')
    },
    logout() {
      firebase.auth().signOut().then(() => {
        console.log('Signed Out');
        this.isLoggedIn = false
      }, (error) => {
        console.error('Sign Out Error', error);
      });
      this.hideMenu()
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
</style>

