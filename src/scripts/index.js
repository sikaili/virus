import * as p5 from "p5";
import virus from "./virus";

p5.disableFriendlyErrors = true;
let canvas = new p5(virus, 'canvasContainer'); //eslint-disable-line

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
