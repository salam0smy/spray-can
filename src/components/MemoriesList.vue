<template>
  <v-list two-line>
    <template v-for="item in items">
      <v-subheader v-if="item.header" v-text="item.header"></v-subheader>
      <v-divider v-else-if="item.divider" v-bind:inset="item.inset"></v-divider>
      <v-list-tile avatar v-else v-bind:key="item.title" @click="">
        <v-list-tile-avatar>
          <img v-bind:src="item.avatar">
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title v-html="item.title"></v-list-tile-title>
          <v-list-tile-sub-title v-html="item.subtitle"></v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
    </template>
  </v-list>
</template>

<script>
var noteIcon = '/static/img/icons/noteIcon.png'
import fireApp from '../services/firebase'
import MemoriesService from '../services/MemoriesService'
import firebase from 'firebase'
const memoriesListRef = fireApp.database.ref('/memoriesList');
const memoriesRef = fireApp.database.ref('/memories')

export default {
  data() {
    return {
      items: [
        //{ header: 'Today' }
      ],
      MemoriesService: null,
      memories: null
    }
  },
  mounted() {
    var currentUser = firebase.auth().currentUser
    if (currentUser) {
      var userUid = currentUser.uid
      this.MemoriesService = new MemoriesService(userUid)
      this.MemoriesService.loadMemories(userUid).then((memories) => {
        this.memories = memories
        this.formatMemories(this.memories)
      }, console.log)
    }
  },
  methods: {
    formatMemories(memories){
      var divider = { divider: true, inset: true }
      var items = this.items
      memories.forEach((memory)=>{
        var item = {
          title: memory.title,
          subtitle: memory.memory,
          avatar: noteIcon
        }
        items.push(item)
        items.push(divider)
      })
      items.pop()
    }
  }
}
</script>
