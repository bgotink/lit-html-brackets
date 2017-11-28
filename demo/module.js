import {repeat} from '../../lit-html/lib/repeat.js';
import {html, render} from '../lit-html-brackets.js';

function template(state) {
  const {barCount, count, barWidth} = state;

  return html`
  <style>
  :host {
    display: block;
    width: 100%;
  }

  .wave {
    position: relative;
    height: 150px;
    width: 100%;
    overflow: hidden;
  }

  .bar {
    position: absolute;
    height: 100%;
    border-radius: 50%;
    max-width: 10px;
  }

  .description {
    box-sizing: border-box;
    width: 100%;
    text-align: center;
    font-size: 0.8em;
    color: #747678;
    padding: 2em;
  }
  </style>
  <div class="wave" (click)=${() => state.reverseDirection()}>
    ${
      repeat(
          Array(barCount).fill(null),
          (_, i) => {
            const translateY = Math.sin(count / 10 + i / 5) * 100 * .5;
            const hue = (360 / barCount * i - count) % 360;

            return html`<div class="bar"
          [style.width]="${barWidth}%"
          [style.left]="${barWidth * i}%"
          [style.transform]="scale(0.8,.5) translateY(${translateY}%) rotate(${(count + i) % 360}deg)"
          [style.backgroundColor]="hsl(${hue},95%,55%)"
        ></div>`
          })}
  </div>
  <p class="description">
    The above animation is ${
      barCount} <code>&lt;div&gt;</code> tags. No SVG, no CSS transitions/animations. It's all powered by lit-html which does a full re-render every frame.
  </p>
  `;
}

customElements.define('demo-animation', class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});

    this.active = false;
    this.count = 0;
    this.step = .5;
  }

  connectedCallback() {
    this.active = true;

    this.barCount = Math.min(200, Math.floor(window.innerWidth/15));
    this.barWidth = 100 / this.barCount;

    this.nextFrame();
  }

  disconnectedCallback() {
    this.active = false;
  }

  nextFrame() {
    if (this.active) {
      this.count += this.step;
      window.requestAnimationFrame(() => this.nextFrame());

      render(template(this), this.shadowRoot);
    }
  }

  reverseDirection() {
    this.step *= -1;
  }
});
