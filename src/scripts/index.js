import "../styles/index.scss";
import * as p5 from "p5";
import * as Tone from "tone";
import virus from "./virus";
import E3 from "../sound/chasing.mp3";
import D3 from "../sound/light.mp3";

// const distortion = new Tone.Distortion(0.1);
// const tremolo = new Tone.Tremolo(5, 0.6).start();
const sampler2 = new Tone.Sampler(
  { D3 },
  {
    onload: () => {
      this.isLoaded = true;
    }
  }
).chain(new Tone.Volume(-10), Tone.Master);
// virus.sampler = sampler;
// virus.sampler2 = sampler2;
window.samplers = [];
for (let i = 0; i < 3; i += 1) {
  window.samplers[i] = new Tone.Sampler(
    { E3 },
    {
      onload: () => {
        this.isLoaded = true;
      }
    }
  ).chain(new Tone.Volume(-14), Tone.Master);
}
window.sampler2 = sampler2;
p5.disableFriendlyErrors = true;
document.querySelector("html").addEventListener(
  "click",
  async () => {
    await Tone.start();
    let canvas = new p5(virus, 'canvasContainer'); //eslint-disable-line
    canvas.start();
  },
  { once: true }
);
