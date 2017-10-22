<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12>
        <v-text-field name="title" label="Title" v-model="title" id="title"></v-text-field>
      </v-flex>
      <v-flex xs12>
        <v-text-field name="memory" label="Memory" v-model="memory" id="memory" multi-line></v-text-field>
      </v-flex>
      <v-flex xs12>
        <v-btn color="primary" @click.prevent="postMemory">Submit</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
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
    goBack() {
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
            console.log('successfully added memory')
          }, (error) => {
            console.log("Error: " + error);
          })
          this.$router.push('/')
        })
      })
    }
  }
}
</script>
  
