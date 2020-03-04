import "../styles/index.scss";
import * as p5 from "p5";
import * as Tone from "tone";

const synth = new Tone.Synth().toMaster();
const lastKey = localStorage.getItem("last-key") || "notok";
const thisKey = `OK${Date()}`;
const s = instance => {
  const sk = instance;
  const savedRects = JSON.parse(localStorage.getItem(lastKey)) || [];
  let currentRectNumber = 0;
  let rect = { x: 0, y: 0, r: 30, fill: [1, 1, 1, 1], increment: 5, stop: -5 };
  const rects = [{ ...rect }];

  const playback = () => {
    return savedRects.length > 0 && false;
  };
  let looping = true;

  const saveCapture = () => {
    sk.noLoop();
    if (sk.pixelDensity() > 5) {
      sk.saveCanvas(document.querySelector("canvas"), `ok${Date()}`, "png");
      if (!playback()) {
        console.log(JSON.stringify(rects));
        localStorage.setItem(thisKey, JSON.stringify(rects));
        localStorage.setItem("last-key", thisKey);
      }
    }
  };
  sk.speed = 0.05;
  sk.setup = () => {
    sk.noLoop();
    sk.pixelDensity(1);
    sk.createCanvas(100, 100);
    sk.background(255, 255, 100);
    sk.noStroke();
  };
  sk.draw = () => {
    if (playback()) {
      rect = savedRects[currentRectNumber];
    }
    if (rect.x >= Math.abs(sk.width - rect.r - rect.stop)) {
      rect.x = sk.width - rect.r;
      rect.y += rect.increment;
    } else {
      synth.triggerAttackRelease(
        sk.constrain(
          Math.abs(rect.fill[1] / rect.fill[2]) * rect.increment +
            rect.x * 4 -
            rect.y * 10,
          40,
          200000
        ),
        "1"
      );
      rect.x += rect.increment;
    }
    if (rect.y > Math.abs(sk.height - rect.r - rect.stop)) {
      if (playback()) {
        currentRectNumber += 1;
        // disable this line for shoulie, green, yellow-blue
        rect = savedRects[currentRectNumber];
      } else {
        // generate new rect
        rect.fill = [
          Math.floor(sk.random(-700, 300)),
          Math.floor(sk.random(-255, 100)),
          Math.floor(sk.random(-500, 500))
        ];
        rect.r += Math.floor(Math.random() * 5) * 6;
        rect.x = -5;
        rect.y = -5;
        rects.push({ ...rect });
      }
    }
    if (rect.r > Math.abs(sk.height - rect.stop)) {
      rect.r = 10;
      if (!playback()) {
        rect.increment = Math.ceil(
          (Math.ceil(Math.random() * 33) * 33) / rect.r
        );
      }
      if (rect.increment > 3) {
        rect.stop += ((sk.width / 3) * 3 - rect.stop) * sk.speed;
        if (rect.stop > sk.width * 100) {
          saveCapture();
          setTimeout(() => {
            sk.clear();
            rect = { x: 0, y: 0, r: 30, fill: 0, increment: 5, stop: -5 };
            sk.loop();
          }, 10000);
        }
      }
    }
    sk.fill(rect.fill);
    sk.rect(rect.x, rect.y, rect.r);
  };
  sk.keyPressed = () => {
    switch (sk.keyCode) {
      case 32:
        saveCapture();
        break;
      case 78:
        if (looping) {
          sk.noLoop();
          looping = !looping;
        } else {
          sk.loop();
          looping = !looping;
        }
        break;
      default:
    }
  };
};

const P5 = new p5(s);
P5.speed = 0.01;
const P51 = new p5(s);
P51.speed = 0.1;
const P52 = new p5(s);
P52.speed = 0.05;
const P53 = new p5(s);
P53.speed = 0.01;
const P54 = new p5(s);
P54.speed = 0.1;
const P55 = new p5(s);
P55.speed = 0.05;

document.querySelector("body").addEventListener("click", async () => {
  await Tone.start();
  P5.loop();
  P51.loop();
  P52.loop();
  P53.loop();
  P54.loop();
  P55.loop();

  console.log("audio is ready");
});
