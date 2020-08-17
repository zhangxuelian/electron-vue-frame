<template>
  <div class="app-wrap">
    <div class="main-wrap">{{title}}</div>
    <div>调用dll返回的结果：{{dllRet}}</div>
  </div>
</template>
<script>
const { ipcRenderer } = require("electron");
export default {
  data() {
    return {
      title: "首页",
      dllRet: "",
    };
  },
  created() {
    ipcRenderer.send("test-dll");
    ipcRenderer.on("reply-test-dll", (event, arg) => {
      this.dllRet = arg;
    });
  },
};
</script>
<style lang="scss">
@import "./App.scss";
</style>
