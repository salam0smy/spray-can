<template>
  <v-flex xs12>
    <v-card :color="getRandomColour()" class="white--text">
      <v-container fluid grid-list-lg>
        <v-layout row>
          <v-flex xs12>
            <div>
              <div class="headline">{{memory.title}}</div>
              <div>{{memory.memory}}</div>
            </div>
          </v-flex>
        </v-layout>
      </v-container>
      <!-- <v-card-title primary-title>
        <div class="headline">{{memory.title}}</div>
        <span>{{memory.memory}}</span>
      </v-card-title> -->
    </v-card>
  </v-flex>
</template>

<script>
export default {
  name: 'memory-card-item',
  props: ['memory', 'index'],
  methods: {
    getRandomColour(){
      var colours = ['blue darken-2', 'cyan darken-2', 'green darken-2', 'amber darken-2', 'blue-grey darken-2']
      var randIndex = Math.floor(Math.random() * colours.length);
      return colours[randIndex]
    }
  }
}
</script>

<style>
.memory-card-wide.mdl-card {
  width: 512px;
  margin: 5px;
  min-height: 100px;
}

.demo-card-wide>.mdl-card__menu {
  color: #fff;
}
</style>
