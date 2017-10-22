<template>
  <header class="mdl-layout__header">
      <div class="mdl-layout__header-row">
        <span class="mdl-layout-title">Noteh</span>
        <div class="mdl-layout-spacer"></div>
        <div>
          <router-link class="" to="/addMemory" v-if="isLoggedIn">
            <i class="material-icons">add</i>
          </router-link>
          <router-link class="mdl-js-ripple-effect" to="/auth" v-if="!isLoggedIn">
            <i class="">signin</i>
          </router-link>
        </div>
      </div>
    </header>
</template>

<<script>
export default {
  name: 'home-toolbar',
  props: ['isLoggedIn']
}
</script>
