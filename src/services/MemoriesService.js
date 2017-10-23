import fireApp from './firebase'
import firebase from 'firebase'

export default class MemoriesService {
  memoriesListRef = fireApp.database.ref('/memoriesList')
  memoriesRef = fireApp.database.ref('/memories')

  constructor(uid) {
    this.uid = uid
  }

  loadMemories (uid) {
    return new Promise((resolve, reject) => {
      this.loadMemoriesKeys(uid).then((memoriesKeys) => {
        var keys = Object.keys(memoriesKeys)
        this.loadMemoriesForKeys(keys).then((memories) => {
          resolve(memories)
        }, reject)
      }, reject)
    })
  }

  loadMemoriesKeys (uid) {
    return new Promise((resolve, reject) => {
      this.memoriesListRef.child(uid).once('value').then((snap) => {
        resolve(snap.val())
      }, (error) => {
        reject(`Could not get memories list for key ${uid}`)
      })
    })
  }

  loadMemoriesForKeys (keys) {
    var promises = []
    keys.forEach((key) => {
      promises.push(this.loadMemoryForKey(key))
    })
    return Promise.all(promises)
  }

  loadMemoryForKey (key) {
    return new Promise((resolve, reject) => {
      this.memoriesRef.child(key).once('value').then((snap) => {
        resolve(snap.val())
      }, (error) => {
        reject(`Error fetching memory for key ${key}`)
      })
    })
  }
}