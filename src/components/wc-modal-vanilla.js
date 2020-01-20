/* global ShadyCSS */

// vanilla web component using web-components polyfill

const template = () => `
<style>
  /*
  It's a good idea to prefix WC styles with :host for scoping in shadow dom. 
  Looky here 👀 : https://developers.google.com/web/fundamentals/web-components/shadowdom
  */
  :host > [role="dialog"]  {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    justify-content: center;
    align-items: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s;
  }

  :host([data-open=true]) > [role="dialog"] {
    opacity: 1;
    pointer-events: all;
  }

  :host .outer {
    background: #111111;
    opacity: 0.9;
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: -1;
  }


  :host  .inner {
    position: absolute; 
    width: 100%;
    height: 100%;
    max-width: 85%;
    max-width: var(--wc-modal-maxwidth, 85%);
    max-height: 85%;
    max-height: var(--wc-modal-maxheight, 85%);        
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-sizing: border-box;    
  }

  :host .content {
    padding: 1rem;
    background: white;
    background: var(--wc-modal-bgcolor, white);
    border-radius: 5px;    
    overflow-y: auto;
    height: 100%;
    max-height: 85%;
  }

  :host .control {
    position: absolute;
    text-align: right;
    width: 100%;
  }

  :host .control button.close {
    transform: translate(-70%, 25%);
    color: #000;
    border: 0;
    font-size: 1rem;
    font-weight: bold;
    min-height: 30px;
    min-width: 30px;
    line-height: 1.1rem;    
    border: 2px solid 
    transition: background .2s, rotate .2s;    
    z-index: 2;
    opacity: 0.8;
  }

  :host button.close:hover {
    cursor: pointer;
    background: #ccc;
  }

  :host button.close:focus {
    cursor: pointer;
    border-color: #000;
  }

  /* Medium devices (tablets, 768px and up) */
  @media screen and (min-width: 768px) and (orientation: landscape) {
    :host .inner {
      max-width: 60%;
      max-width: var(--wc-med-modal-maxwidth, 60%);
      max-height: 70%;
      max-height: var(--wc-med-modal-maxheight, 70%);
    }
  }

  /* Large devices (desktops, 992px and up) */
  @media screen and (min-width: 992px) and (orientation: landscape) {
    :host .inner {
      max-width: 50%;
      max-width: var(--wc-med-modal-maxwidth, 50%);
      max-height: 50%;
      max-height: var(--wc-med-modal-maxheight, 50%);
    }
  }
</style>
<div role="dialog">
  <div class="outer"></div>

  <div class="inner">
    <div class="control">
      <button class="close" aria-label="close">
      ×
      </button>
    </div>
    <div class="content">
      <slot></slot>
    </div>
  </div>




</div>
`;

const tag = "wc-modal";

class Component extends HTMLElement {
  constructor() {
    super(); // !required!
    this._hasShadow = true; // true or fals to disable or enable shadow dom
    this.dom = this._hasShadow ? this.attachShadow({ mode: "open" }) : this;
    this.triggerEl = null;

    // setup your template
    const temp = document.createElement("template");

    // we're using innerHTML but you could manually create each element and add to this._elements for complex use-cases
    temp.innerHTML = template();

    /* Style Polyfill Step 1 */
    if (window.ShadyCSS) ShadyCSS.prepareTemplate(temp, tag); // prepare template
    /* END Style Polyfill Step 1 */

    this.template = document.importNode(temp.content, true); // copy template contents into 'this'

    /* Style Polyfill Step 2 */
    if (window.ShadyCSS) ShadyCSS.styleElement(this);
    /* END Style Polyfill Step 2 */

    this.dom.appendChild(this.template);
    return this;
  }

  static get observedAttributes() {
    return ["data-open", "data-label", "data-labelledby"];
  }

  dispatch() {
    const attributes = [].slice
      .call(this.attributes)
      .filter(i => i.name && i.value)
      .map(i => ({ name: i.name, value: i.value }));

    const event = new CustomEvent("wc-event", {
      detail: {
        tag,
        attributes,
        isOpen: this.getAttribute("data-open")
      }
    });
    this.dispatchEvent(event);
  }

  close() {
    this.elements.map(i => i.setAttribute("tabindex", -1));
    if (this.triggerEl) {
      this.triggerEl.focus();
      this.triggerEl = null;
    }
    this.setAttribute("data-open", false);
  }

  open(opts = { trigger: null }) {
    this.triggerEl = opts.trigger;
    this.elements.map(i => i.setAttribute("tabindex", 0));
    this.setAttribute("data-open", true);
    this.closeEl.focus();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return false; // if value hadn't changed do nothing
    // respond to attribute changes here
    if (name === "data-label") this.dialogEl.setAttribute("aria-label", newValue);
    if (name === "data-labelledby") this.dialogEl.setAttribute("aria-labelledby", newValue);
    this.dispatch();
    return this;
  }

  handleTrapFocus(e) {
    const target = e.explicitOriginalTarget || e.target;
    const last = this.elements[this.elements.length - 1];
    const first = this.elements[0];
    const isLast = target === last && !e.shiftKey;
    const isFirst = target === first && e.shiftKey;

    if (isFirst || isLast) e.preventDefault();
    if (isLast) first.focus();
    if (isFirst) last.focus();
  }

  connectedCallback() {
    this.dialogEl = this.dom.querySelector('[role="dialog]');
    this.outerEl = this.dom.querySelector(".outer");
    this.innerEl = this.dom.querySelector(".inner");
    this.closeEl = this.dom.querySelector(".close");

    const label = this.getAttribute("data-label");
    const labelledBy = this.getAttribute("data-labelledby");
    if (!label && !labelledBy) this.setAttribute("aria-label", "Modal Label");

    this.closeEl.addEventListener("click", () => this.close());
    this.outerEl.addEventListener("click", e => e.target === this.outerEl && this.close());

    this.dom.addEventListener("keydown", e => {
      if (e.key.includes("Esc")) return this.close();
      if (e.key === "Tab") return this.handleTrapFocus(e);
    });

    // used for focus trapping
    const focusables = this.querySelectorAll(
      "a, input, button, textarea, [tabindex], [contenteditable='true']"
    );
    this.elements = [this.closeEl, ...[].slice.call(focusables)];
  }

  disconnectedCallback() {
    this.closeEl.removeEventListener("click", () => this.close());
    this.outerEl.removeEventListener("click", e => e.target === this.outerEl && this.close());

    this.dom.removeEventListener("keydown", e => {
      if (e.key.includes("Esc")) return this.close();
      if (e.key === "Tab") return this.handleTrapFocus(e);
    });
  }

  // better to use default, predefined tag for css polyfill
  // this could be done externally, but having a method that does it for you is easier
  static register() {
    if (window.customElements.get(tag) === undefined) {
      window.customElements.define(tag, Component);
    }
  }
}

Component.register();
// magic that registers the tag
export default Component;
