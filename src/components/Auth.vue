<template>
  <div id="firebaseui-auth-container">
  </div>
</template>

<script>
import firebase from 'firebase'
import firebaseui from 'firebaseui'
import { config } from '../services/firebase'
var ui;
export default {
  name: 'auth',
  mounted() {
    console.log('staring firebaseui')
    var uiConfig = {
      signInSuccessUrl: '/',
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ]
    };
    console.log(firebaseui.auth);
    ui = firebaseui.auth.AuthUI.getInstance()
    if (ui) {
      ui.reset()
      ui.start('#firebaseui-auth-container', uiConfig)
    }
    else {
      ui = new firebaseui.auth.AuthUI(firebase.auth());
      ui.start('#firebaseui-auth-container', uiConfig);
    }

  }
}
</script>