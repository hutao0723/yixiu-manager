<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
body{
  margin:0;
  height: 100%;
  width: 100%;
}
#app {
  height: 100%;
  width: 100%;
}
  .el-container{
    flex-basis:0 !important;
  }
</style>
