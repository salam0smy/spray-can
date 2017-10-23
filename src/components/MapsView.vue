<template>
  <div style="height: 100%; position:absolute; width: 100%;overflow-y: auto;">
    <gmap-map :zoom-control="false" :options="options" :center="center" :zoom="15" style="width: 100%; height: 85%; position: fixed;">
      <gmap-marker :key="index" v-for="(m, index) in markers" :position="m.position" :icon="m.icon" :clickable="true" @click="center=m.position"></gmap-marker>
    </gmap-map>

    <div class="results-view secondary">
      <v-container fluid style="min-height: 0;" grid-list-lg>
        <v-layout row wrap>
          <v-flex xs12 v-show="!isLoggedIn">
            <v-card color="pink darken-1" class="white--text">
              <v-container fluid grid-list-lg>
                <v-layout row>
                  <v-flex xs12>
                    <div>
                      <div class="headline">Login and leave your memories</div>
                      <div>Use Spray Can to leave your mark in the street</div>
                    </div>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card>
          </v-flex>
          <v-flex xs12>
            <v-card color="pink darken-1" class="white--text" v-show="!isResultsFound">
              <v-container fluid grid-list-lg>
                <v-layout row>
                  <v-flex xs12>
                    <div>
                      <div class="headline">No memories found!</div>
                      <div>Keep exploring to find memories</div>
                    </div>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card>
          </v-flex>
          <memory-card-item v-for="(memory, index) in memoriesMap" :key="index" :index="index" :memory="memory"></memory-card-item>
        </v-layout>
      </v-container>
    </div>

    <!-- No results -->
  </div>
</template>
 
<script>
//
// New in 0.4.0
import * as VueGoogleMaps from 'vue2-google-maps';
import Vue from 'vue'
import firebaseDb from '../services/firebase'
import GeoFire from 'geofire'
import MemoryCardItem from './MemoryCardItem'
var turtleIcon = '/static/img/icons/turtleIcon.png'
var noteIcon = '/static/img/icons/noteIcon.png'
import firebase from 'firebase'

const locationsRef = firebaseDb.database.ref('/locations')
const memoriesRef = firebaseDb.database.ref('/memories')
var geoFire = new GeoFire(locationsRef)

export default {
  components: { 'MemoryCardItem': MemoryCardItem },
  computed: {
    isResultsFound: function() {
      for (var key in this.memoriesMap) {
        if (this.memoriesMap.hasOwnProperty(key)) {
          return true
        }
      }
      return false
    }
  },
  data() {
    return {
      isLoggedIn: false,
      radius: 0.609, //kilometers
      geoQuery: null,
      center: { lat: 10.0, lng: 10.0 },
      markers: [{
        position: { lat: 10.0, lng: 10.0 },
        icon: turtleIcon
      }],
      memoriesMap: {},
      options: {
        fullscreenControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        zoomControlOptions: {
          position: 5 // google.maps.ControlPosition.LEFT_TOP
        }
      }
    }
  },
  watch: {
    '$route'(to, from) {
      // Call resizePreserveCenter() on all maps
      console.log('resize')
      Vue.$gmapDefaultResizeBus.$emit('resize')
    }
  },
  mounted() {
    firebase.auth().onAuthStateChanged((user) => {
      this.isLoggedIn = user !== null
    })
    if (navigator.geolocation) {
      // geolocation is available
      var options = {
        enableHighAccuracy: true,
        maximumAge: 3000,
        timeout: 27000
      }
      navigator.geolocation.watchPosition(this.updateLocation, this.errorHandler, options)
    } else {
      // geolocation is not supported
    }
  },
  methods: {
    errorHandler(error) {
      console.error(error);
    },
    updateMemoryForKey(key) {
      memoriesRef.child(key).once('value').then((snapshot) => {
        //this.memoriesMap[key] = snapshot.val()
        Vue.set(this.memoriesMap, key, snapshot.val())
        //console.log('added', this.memoriesMap)
      })
    },
    onCardMemoryClick(clickEvent) {

    },
    onMemoryIconClick(key) {

    },
    updateGeoquery(position) {
      this.geoQuery.updateCriteria({
        center: [position.coords.latitude, position.coords.longitude],
        radius: this.radius //kilometers
      })
    },
    onGeoQueryKeyEntered(key, location, distance) {
      console.log("Memory " + key + " found at " + location + " (" + distance + " km away)");
      if (!(key in this.memoriesMap)) {
        this.updateMemoryForKey(key)
        var position = {
          lat: location[0],
          lng: location[1]
        }
        Vue.set(this.markers, this.markers.length, {
          position: position,
          icon: noteIcon,
          _key: key
        })
      }
    },
    onGeoQueryKeyExited(key, location, distance) {
      if (key in this.memoriesMap) {
        Vue.delete(this.memoriesMap, key)
      }
      console.log(key + " exited query to " + location + " (" + distance + " km from center)");
    },
    setupGeoquery(position) {
      this.geoQuery = geoFire.query({
        center: [position.coords.latitude, position.coords.longitude],
        radius: this.radius //kilometers
      });

      this.geoQuery.on("key_entered", this.onGeoQueryKeyEntered);
      this.geoQuery.on("key_exited", this.onGeoQueryKeyExited);
    },
    updateUserMarker(coords) {
      this.markers[0].position.lat = coords.latitude
      this.markers[0].position.lng = coords.longitude
    },
    updateCenter(coords) {
      this.center.lat = coords.latitude
      this.center.lng = coords.longitude
    },
    updateLocation(position) {
      // TODO: only update center when panning is on
      this.updateCenter(position.coords)
      this.updateUserMarker(position.coords)
      if (this.geoQuery === null) {
        this.setupGeoquery(position)
      }
      else {
        this.updateGeoquery(position)
      }

    }
  }
}
</script>

<!-- Wide card with share menu button -->
<style>
.no-memory-card {
  min-height: 100px;
}

.demo-card-wide.mdl-card {
  width: 512px;
  margin: 5px;
  min-height: 100px;
}

.demo-card-wide>.mdl-card__title {
  /* color: #fff; */
  /* height: 176px; */
  /* background: url('../assets/demos/welcome_card.jpg') center / cover; */
}

.demo-card-wide>.mdl-card__menu {
  color: #fff;
}

.results-view {
  position: relative;
  background: #fff;
  padding-top: 15px;
  top: 80%;
}
</style>