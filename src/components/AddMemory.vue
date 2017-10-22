<template>
  <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
    <header class="mdl-layout__header">

      <div class="mdl-layout__header-row">
        <div class="mdl-layout__drawer-button" @click="goBack">
          <i class="material-icons">arrow_back</i>
        </div>
        <span class="mdl-layout-title">Add Memory</span>
        <div class="mdl-layout-spacer"></div>
      </div>
    </header>
    <main class="mdl-layout__content">
      <div class="page-content">
          <form action="#">
            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
              <input class="mdl-textfield__input" v-model="title" type="text" id="title">
              <label class="mdl-textfield__label" for="sample3">Title...</label>
            </div>
            <div class="mdl-textfield mdl-js-textfield">
              <textarea class="mdl-textfield__input" v-model="memory" type="text" rows="3" id="desc"></textarea>
              <label class="mdl-textfield__label" for="sample5">Story...</label>
            </div>
            <div class="actions">
              <a @click.prevent="postMemory" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">
                <span>Post Memory</span>
              </a>
            </div>
          </form>
      </div>
    </main>
  </div>
</template>

<script>
import fireApp from '../services/firebase'
import firebase from 'firebase'
import GeoFire from 'geofire'
const locationsRef = fireApp.database.ref('/locations');
const memoriesRef = fireApp.database.ref('/memories');
const memoriesListRef = fireApp.database.ref('/memoriesList');
var geoFire = new GeoFire(locationsRef);
export default {
  data() {
    return {
      'title': '',
      'memory': ''
    }
  },
  methods: {
    goBack(){
      this.$router.push('/')
    },
    postToUserList(memoryId) {
      return new Promise((resolve, reject) => {
        var userUid = firebase.auth().currentUser.uid
        memoriesListRef.child(userUid).child(memoryId).set(true).then((res) => {
          console.log('saved to user')
          resolve()
        }, reject)
      })
    },
    getMemoryObject() {
      var promise = new Promise((resolse, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            var memory = {
              'position': {
                'lat': position.coords.latitude,
                'lng': position.coords.longitude
              },
              'title': this.title,
              'memory': this.memory,
              'createdAt': firebase.database.ServerValue.TIMESTAMP
            }
            resolse(memory)
          }, reject)
        } else {
          reject('Location not avaliable')
        }
      })
      return promise
    },
    setGeofireKey(key, lat, lng) {
      var promise = new Promise((resolve, reject) => {
        geoFire.set(key, [lat, lng]).then(() => {
          console.log("Provided key has been added to GeoFire");
          resolve()
        }, reject)
      })
      return promise
    },
    postMemory() {
      this.getMemoryObject().then((memory) => {
        memoriesRef.push(memory).then((res) => {
          var geofirePromise = this.setGeofireKey(res.key, memory.position.lat, memory.position.lng)
          var memoriesListPromise = this.postToUserList(res.key)
          Promise.all([geofirePromise, memoriesListPromise]).then(() => {
            this.$router.push('/')
          }, (error) => {
            console.log("Error: " + error);
          })

        })
      })
    }
  }
}
</script>
  
