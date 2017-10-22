<template>
    <div id="firebaseui-auth-container"></div>
</template>

<script>
import firebase from 'firebase'
window.firebase = firebase
import firebaseui from 'firebaseui'
import {config} from '../services/firebase'
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
    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start('#firebaseui-auth-container', uiConfig);
    }
}
</script>