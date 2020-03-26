import "../styles/index.scss";
import * as p5 from "p5";
import * as Tone from "tone";
import virus from "./virus";
import E3 from "../sound/chasing.mp3";
import D3 from "../sound/light.mp3";

// const distortion = new Tone.Distortion(0.1);
const tremolo = new Tone.Tremolo(5, 0.6).start();
const synth = new Tone.PolySynth(300, Tone.Synth, {
  oscillator: {
    type: "sine"
  }
}).chain(new Tone.Volume(-12), tremolo, Tone.Master);

const sampler = new Tone.Sampler(
  { E3 },
  {
    onload: () => {
      this.isLoaded = true;
    }
  }
).chain(new Tone.Volume(-12), Tone.Master);
const sampler2 = new Tone.Sampler(
  { D3 },
  {
    onload: () => {
      this.isLoaded = true;
    }
  }
).toMaster();
virus.sampler = sampler;
virus.sampler2 = sampler2;

virus.synth = synth;

p5.disableFriendlyErrors = true;
const canvas = new p5(virus); //eslint-disable-line

document.querySelector("body").addEventListener(
  "click",
  async () => {
    await Tone.start();
    console.log("audio is ready"); //eslint-disable-line
  },
  { once: true }
);

window.canvas = canvas;
