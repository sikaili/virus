import "../styles/index.scss";
import * as Matter from "matter-js";
import * as p5 from "p5";
import * as Tone from "tone";
import s from "./squerror";
import n from "./new";
import virus from "./virus";

// module aliases
// const { Engine } = Matter;
// const { Render } = Matter;
// const { World } = Matter;
// const { Bodies } = Matter;

// create an engine
// const engine = Engine.create();

// create a renderer
// const render = Render.create({
//   element: document.body,
//   engine
// });

// const boxA = Bodies.rectangle(400, 200, 80, 80);
// const boxB = Bodies.rectangle(450, 50, 80, 80);
// const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
// World.add(engine.world, [boxA, boxB, ground]);
// virus.boxA = boxA;

// run the engine
// Engine.run(engine);

// run the renderer
// Render.run(render);

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
