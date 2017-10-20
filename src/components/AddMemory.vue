<template>
  <div>
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
</template>

<script>
import firebase from '../services/firebase'
import GeoFire from 'geofire'
const locationsRef = firebase.database.ref('/locations');
const memoriesRef = firebase.database.ref('/memories');
var geoFire = new GeoFire(locationsRef);
export default {
  data () {
    return {
      'title': '',
      'memory': ''
    }
  },
  methods: {
    postMemory () {
      memoriesRef.push(
        {
          'title': this.title,
          'memory': this.memory,
          'createdAt': -1 * new Date().getTime()
        })
        .then((res)=>{
          // create grofire entery with current position
          // and new id as .key
          console.log(res);
          if (navigator.geolocation) {
            // geolocation is available
            navigator.geolocation.getCurrentPosition((position)=>{
              geoFire.set(res.key, [position.coords.latitude, position.coords.longitude]).then(function() {
                console.log("Provided key has been added to GeoFire");
              }, function(error) {
                console.log("Error: " + error);
              });
            })
          } else {
            // geolocation is not supported
          }
          this.$router.push('/')
        })
    }
  }
}
</script>
  
