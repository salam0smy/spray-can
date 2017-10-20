<template>
  <div style="height: 100%;">
    <gmap-map :center="center" :zoom="7" style="width: 100%; height: 85%; position: fixed;">
      <gmap-marker :key="index" v-for="(m, index) in markers" :position="m.position" :clickable="true" :draggable="true" @click="center=m.position"></gmap-marker>
    </gmap-map>
    <div class="mdl-grid results-view">
      <div class="demo-card-wide mdl-card mdl-shadow--4dp" v-for="(memory, index) in memoriesMap" :key="index">
        <div class="mdl-card__title">
          <h2 class="mdl-card__title-text">{{memory.title}}</h2>
        </div>
        <div class="mdl-card__supporting-text">
          {{memory.memory}}
        </div>
        <div class="mdl-card__menu">
          <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
            <i class="material-icons mdl-js-ripple-effect">share</i>
          </button>
        </div>
      </div>
    </div>
    <!-- No results -->
    </div>
</template>
 
<script>
//
// New in 0.4.0
// import * as VueGoogleMaps from 'vue2-google-maps';
import Vue from 'vue'
import firebase from '../services/firebase'
import GeoFire from 'geofire'
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

export default {
  data () {
    return {
      center: { lat: 10.0, lng: 10.0 },
      markers: [{
        position: { lat: 10.0, lng: 10.0 }
      }, {
        position: { lat: 11.0, lng: 11.0 }
      }],
      memoriesMap: {}
    }
  },
  watch: {
    '$route' (to, from) {
      // Call resizePreserveCenter() on all maps
      Vue.$gmapDefaultResizeBus.$emit('resize')
    }
  },
  mounted () {
    if (navigator.geolocation) {
      // geolocation is available
      navigator.geolocation.watchPosition(this.updateLocation)
    } else {
      // geolocation is not supported
    }
  },
  methods: {
    getWindowSize () {
      return document.documentElement.clientHeight
    },
    updateLocation (position) {
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
        console.log(position)
        var geoQuery = geoFire.query({
          center: [position.coords.latitude, position.coords.longitude],
          radius: 1.609 //kilometers
        });

        geoQuery.on("key_entered", (key, location, distance) =>{
          console.log("Memory " + key + " found at " + location + " (" + distance + " km away)");
          memoriesRef.child(key).once('value').then((snapshot)=>{
            console.log(snapshot)
            if(this.memoriesMap[key]){
              // do nothing
            }
            else {
              //this.memoriesMap[key] = snapshot.val()
              Vue.set(this.memoriesMap, key, snapshot.val())
              console.log('added', this.memoriesMap)
            }
          })
        });
    }
  }
}
</script>

<!-- Wide card with share menu button -->
<style>
.demo-card-wide.mdl-card {
  width: 512px;
  margin: 5px;
  min-height: 100px;
}
.demo-card-wide > .mdl-card__title {
  /* color: #fff; */
  /* height: 176px; */
  /* background: url('../assets/demos/welcome_card.jpg') center / cover; */
}
.demo-card-wide > .mdl-card__menu {
  color: #fff;
}
.results-view {
  position: relative;
  background: #fff;
  padding-top: 15px;
  top: 80%;
}
</style>