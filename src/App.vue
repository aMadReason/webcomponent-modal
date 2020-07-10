<template>
  <div>
    <article class="note">
      <h1>Simple Modal Web Component</h1>
      <p>
        Based on wai-aria gudelines:
        <a
          href="https://www.w3.org/TR/wai-aria-practices/#dialog_modal"
        >Dialog Modal</a>.
      </p>

      <strong>Features</strong>
      <ul>
        <li>Keyboard / Screen Reader (NVDA) accessible</li>
        <li>Click-On-Overlay or Escape key will close without close button.</li>
        <li>Mobile First / Responsive</li>
        <li>Tested in latest FF, Chrome, IE Edge</li>
      </ul>

      <hr>

      <strong>Requires:</strong>

      <p>The webcomponent is intended for use in an es6+ setup with transpilation.</p>
      <p>Web component polyfills, use the below for rapid prototyping, but remember to include these scripts in you're source.</p>
      <p>DO NOT transpile the polyfills, the world will break.</p>

      <pre>
        &lt;script src="https://cdnjs.com/libraries/webcomponents.js"&gt; &lt;/script&gt;
        &lt;script src="https://cdnjs.cloudflare.com/ajax/libs/webcomponentsjs/2.4.1/custom-elements-es5-adapter.js"&gt; &lt;/script&gt;
      </pre>

      <hr>
      <strong>Syntax</strong>
      <p>Import the file in js</p>
      <pre>
        import '{path to component}/wc-modal-vanilla.js';
      </pre>

      <p>(or) Import via module script in html (not tested yet!!).</p>
      <pre>
        &lt;script type="module" src="{path to component}/wc-modal-vanilla.js"&gt; &lt;/script&gt;
      </pre>

      <p>The use tag in html (basic usage) then use a button with an event to change 'data-open' to 'true' to open it.</p>

      <pre>
        &lt;wc-modal data-open="false"&gt;
          &lt;div class="modal-content" &gt;
            I am the modal content
          &lt;/div&gt;          
        &lt;/wc-modal&gt;

        &lt;button id="modaltrigger"&gt;
          open modal
        &lt;/button&gt;

        &lt;script&gt;
        
        const modal = document.getElementById('wc-modal');
        const content = document.getElementById('wc-modal > .modal-content');
        const modaltrigger = document.getElementById('modaltrigger');

        modaltrigger.addEventListener("click", (e) => {
          content.innerHTML = "hello i'm updated content";

          modal.open({ trigger: e.target}); // most accessible as focus will return to trigger on close.

          // modal.setAttribute('data-open', true); // this will also work
        })
        
        &lt;/script&gt;
      </pre>

      <p>For advanced usage see the source in this demo where the modal is used inside of a vue instance.</p>
    </article>

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
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
