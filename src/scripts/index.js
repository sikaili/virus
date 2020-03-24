import "../styles/index.scss";
import * as p5 from "p5";
import * as Tone from "tone";
import s from "./squerror";
import n from "./new";
import virus from "./virus";

const distortion = new Tone.Distortion(0.1);
const tremolo = new Tone.Tremolo(5, 0.6).start();
const synth = new Tone.Synth({
  oscillator: {
    type: "sine",
    modulationType: "sawtooth",
    modulationIndex: 6,
    harmonicity: 1
  },
  envelope: {
    attack: 0.4,
    decay: 0.1,
    sustain: 0.8,
    release: 1
  }
}).chain(distortion, tremolo, Tone.Master);

s.synth = synth;
n.synth = synth;
n.Tone = Tone;

// const squerror = new p5(s);
const current = new p5(virus);
p5.friendlyReport = false;
document.querySelector("body").addEventListener("click", async () => {
  await Tone.start();
  // squerror.loop();
  console.log("audio is ready");
});
