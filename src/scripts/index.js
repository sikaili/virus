import "../styles/index.scss";
import * as p5 from "p5";
import * as Tone from "tone";

const synth = new Tone.Synth().toMaster();

const s = instance => {
  const sk = instance;
  const savedRects = JSON.parse(
    localStorage.getItem(
      "Tue Mar 03 2020 23:07:29 GMT+0100 (Central European Standard Time)"
    )
  );
  let currentRectNumber = 0;
  let rect = { x: 0, y: 0, r: 30, fill: [1, 1, 1, 1], increment: 5, stop: -5 };
  const rects = [{ ...rect }];
  const playback = () => {
    return savedRects.length > 0 && true;
  };
  sk.setup = () => {
    sk.pixelDensity(30);
    sk.createCanvas(100, 100);
    sk.background(255, 255, 0);
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
      rect.x += rect.increment;
    }
    if (rect.y > Math.abs(sk.height - rect.r - rect.stop)) {
      if (playback()) {
        currentRectNumber += 1;
        rect = savedRects[currentRectNumber];
      } else {
        // generate new rect
        rect.fill = [
          sk.random(-700, 300),
          sk.random(-255, 100),
          sk.random(-500, 500)
        ];
        rect.r += (Math.random() - 0.3) * 30;
        rect.x = -5;
        rect.y = -5;
        rects.push({ ...rect });
      }
      synth.triggerAttackRelease(
        Math.abs(rect.fill[1] / rect.fill[2]) * rect.increment,
        "6"
      );
    }
    if (rect.r > Math.abs(sk.height - rect.stop)) {
      rect.r = 10;
      if (!playback()) {
        rect.increment = (Math.random() * 1000) / rect.r;
      }
      if (rect.increment > 3) {
        rect.stop += 10;
        if (rect.stop > sk.width) {
          sk.noLoop();
          if (sk.pixelDensity() > 5) {
            sk.saveCanvas(
              document.querySelector("canvas"),
              `ok${Date()}`,
              "png"
            );
            console.log(JSON.stringify(rects));
            localStorage.setItem(Date(), JSON.stringify(rects));
          }

          setTimeout(() => {
            sk.clear();
            rect = { x: 0, y: 0, r: 30, fill: 0, increment: 5, stop: -5 };
            sk.loop();
          }, 5000);
        }
      }
    }
    sk.fill(rect.fill);
    sk.rect(rect.x, rect.y, rect.r);
  };
  sk.keyPressed = () => {
    switch (sk.keyCode) {
      case 32:
        sk.saveCanvas(
          document.querySelector("canvas"),
          `ok${Math.random()}`,
          "png"
        );
        break;
      case 66:
        sk.noLoop();
        break;
      default:
    }
  };
};

const P5 = new p5(s);
