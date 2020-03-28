import "../styles/index.scss";
import * as p5 from "p5";
import * as Tone from "tone";
import virus from "./virus";
import E3 from "../sound/chasing.mp3";
import D3 from "../sound/light.mp3";

const sampler2 = new Tone.Sampler(
  { D3 },
  {
    onload: () => {
      this.isLoaded = true;
    }
  }
).chain(new Tone.Volume(-10), Tone.Master);
virus.sampler2 = sampler2;
virus.samplers = [];
for (let i = 0; i < 3; i += 1) {
  virus.samplers[i] = new Tone.Sampler(
    { E3 },
    {
      onload: () => {
        this.isLoaded = true;
      }
    }
  ).chain(new Tone.Volume(-14), Tone.Master);
}

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

// cosnt handleBodyClick = () => {
//   if (typeof DeviceMotionEvent.requestPermission === "function") {
//     DeviceMotionEvent.requestPermission()
//       .then(permissionState => {
//         if (permissionState === "granted") {
//           divNode.addEventListener("deviceorientation", e => {
//             engine.world.gravity.x = e.gamma / 90;
//             const arr = ["alpha", "beta", "gamma"];
//             arr.map(a => {
//               document.createElement("p");
//             });
//             document.querySelectors("p").map((a, i) => {
//               a.innerHtml = e[arr[i]];
//             });
//           });
//         }
//       })
//       .catch(console.error);
//   } else {
//     // handle regular non iOS 13+ devices
//   }
// };
