<template>
  <div id="app">
    <div class="listing">
      <article v-bind:key="i" v-for="(v, i) in entries">
        <h2>{{v.title}}</h2>
        <img v-bind:src="v.img" alt>
        <button @click="e => openModal(e, i)">Info</button>
      </article>
    </div>
    <wc-modal ref="modal" v-bind:data-open="isOpen" v-on:wc-event="updateModal">
      <h1>{{entry && entry.title}}</h1>
      <a href="#">Test</a>
      <p>{{ entry && entry.content}}</p>
    </wc-modal>
  </div>
</template>

<script>
import "./components/wc-modal-vanilla";

export default {
  name: "App",
  data: () => ({
    isOpen: "false",
    entry: false,
    entries: [
      {
        title: "One",
        img: "https://picsum.photos/200?random=1",
        content:
          "This is some longer content. Wowee. This is some longer content. Wowee. This is some longer content. Wowee. This is some longer content. Wowee. This is some longer content. Wowee. This is some longer content. Wowee. This is some longer content. Wowee. v This is some longer content. Wowee. v"
      },
      {
        title: "Two",
        img: "https://picsum.photos/200?random=2",
        content: "Content"
      },
      {
        title: "Three",
        img: "https://picsum.photos/200?random=3",
        content: "Content"
      }
    ]
  }),
  methods: {
    updateModal(e) {
      this.isOpen = e.detail.isOpen;
    },
    openModal: function(e, idx) {
      this.entry = this.entries[idx];
      this.$refs.modal.open({ trigger: e.target });
      //this.isOpen = "true";
    }
  },
  components: {}
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
