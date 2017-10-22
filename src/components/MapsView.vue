<template>
  <div style="height: 100%;">
    <gmap-map :zoom-control="false" :options="options" :center="center" :zoom="15" style="width: 100%; height: 85%; position: fixed;">
      <gmap-marker :key="index" v-for="(m, index) in markers" :position="m.position" :icon="m.icon" :clickable="true" @click="center=m.position"></gmap-marker>
    </gmap-map>
    <div class="mdl-grid results-view">
      <memory-card-item v-for="(memory, index) in memoriesMap" :key="index" :index="index" :memory="memory"></memory-card-item>
      <div v-if="!isResultsFound">
        <div class="no-memory-card mdl-card mdl-shadow--4dp">
          <div class="mdl-card__title">
            <h2 class="mdl-card__title-text">No memories around :(</h2>
          </div>
          <div class="mdl-card__supporting-text">
            Why don't you leve a memory here
          </div>
          <div class="mdl-card__menu">
            <!-- <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
                <i class="material-icons mdl-js-ripple-effect">share</i>
              </button> -->
          </div>
        </div>
      </div>
    </div>
    <!-- No results -->
  </div>
</template>
 
<script>
//
// New in 0.4.0
import * as VueGoogleMaps from 'vue2-google-maps';
import Vue from 'vue'
import firebase from '../services/firebase'
import GeoFire from 'geofire'
import MemoryCardItem from './MemoryCardItem'
var turtleIcon = '/static/img/icons/turtleIcon.png'
var noteIcon = '/static/img/icons/noteIcon.png'

const locationsRef = firebase.database.ref('/locations')
const memoriesRef = firebase.database.ref('/memories')
var geoFire = new GeoFire(locationsRef)

// Vue.use(VueGoogleMaps, {
//   load: {
//     key: 'YOUR_API_TOKEN',
//     v: 'OPTIONAL VERSION NUMBER',
//     // libraries: 'places', //// If you need to use place input
//   }
// });
console.log(VueGoogleMaps)

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
        console.log('added', this.memoriesMap)
      })
    },
    onCardMemoryClick(clickEvent) {

    },
    onMemoryIconClick(key) {

    },
    updateGeoquery(position) {
      this.geoQuery.updateCriteria({
        center: [position.coords.latitude, position.coords.longitude],
        radius: 0.609 //kilometers
      })
    },
    setupGeoquery(position) {
      this.geoQuery = geoFire.query({
        center: [position.coords.latitude, position.coords.longitude],
        radius: 0.609 //kilometers
      });

      this.geoQuery.on("key_entered", (key, location, distance) => {
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
      });

      this.geoQuery.on("key_exited", (key, location, distance) => {
        if (key in this.memoriesMap) {
          // do nothing
          Vue.delete(this.memoriesMap, key)
        }
        console.log(key + " exited query to " + location + " (" + distance + " km from center)");
      });
    },
    updateLocation(position) {
      /*
      position is an object containing various information about
      the acquired device location:
  
      position = {
          coords: {
              latitude - Geographical latitude in decimal degrees.
              longitude - Geographical longitude in decimal degrees.
              altitude - Height in meters relative to sea level.
              accuracy - Possible error margin for the coordinates in meters.
              altitudeAccuracy - Possible error margin for the altitude in meters.
              heading - The direction of the device in degrees relative to north.
              speed - The velocity of the device in meters per second.
          }
          timestamp - The time at which the location was retrieved.
      }
      */
      this.center.lat = position.coords.latitude
      this.center.lng = position.coords.longitude
      console.log('position', position)
      this.markers[0].position.lat = position.coords.latitude
      this.markers[0].position.lng = position.coords.longitude
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
.no-memory-card{
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