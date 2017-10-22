import firebase from 'firebase'

var config = {
  apiKey: 'AIzaSyBlnyhxc7qA524iMB8xdCyI_sCqXGarHqY',
  authDomain: 'incandescent-heat-3647.firebaseapp.com',
  databaseURL: 'https://incandescent-heat-3647.firebaseio.com',
  projectId: 'incandescent-heat-3647',
  storageBucket: 'incandescent-heat-3647.appspot.com',
  messagingSenderId: '20765315670'
}

firebase.initializeApp(config)

export default {
  database: firebase.database(),
  config: config
}
