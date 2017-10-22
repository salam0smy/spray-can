<template>
  <div class="memory-card-wide mdl-card mdl-shadow--4dp">
    <div class="mdl-card__title" :id="index">
      <h2 class="mdl-card__title-text">{{memory.title}}</h2>
    </div>
    <div class="mdl-card__supporting-text">
      {{memory.memory}}
    </div>
    <div class="mdl-card__menu">
      <!-- <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
              <i class="material-icons mdl-js-ripple-effect">share</i>
            </button> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'memory-card-item',
  props: ['memory', 'index']
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
