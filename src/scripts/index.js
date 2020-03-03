import "../styles/index.scss";
import * as p5 from "p5";
import * as Tone from "tone";

const synth = new Tone.Synth().toMaster();

const s = instance => {
  const rects1 = JSON.parse(localStorage.getItem("shoulie"));
  const sk = instance;
  let stop = -5;
  const rects = [];
  let no = 0;
  let rect = { x: 0, y: 0, r: 30, fill: [1, 1, 1, 1], increment: 5 };
  rects.push({ ...rect, stop });
  const playback = true;
  sk.setup = () => {
    sk.pixelDensity(30);
    sk.createCanvas(100, 100);
    sk.background(255, 255, 0);
    sk.noStroke();
  };
  sk.draw = () => {
    if (playback) {
      rect = rects1[no];
      stop = rect.stop;
    }
    if (rect.x >= Math.abs(sk.width - rect.r - stop)) {
      rect.x = sk.width - rect.r;
      rect.y += rect.increment;
    } else {
      rect.x += rect.increment;
    }
    if (rect.y > Math.abs(sk.height - rect.r - stop)) {
      if (playback) {
        no += 1;
      } else {
        rect.fill = [
          sk.random(-700, 300),
          sk.random(-255, 100),
          sk.random(-500, 500)
        ];
        rect.r += (Math.random() - 0.3) * 30;
        rect.x = -5;
        rect.y = -5;
        rects.push({ ...rect, stop });
      }
      console.log(rect);
      synth.triggerAttackRelease(
        Math.abs(rect.fill[1] / rect.fill[2]) * rect.increment,
        "6"
      );
    }
    if (rect.r > Math.abs(sk.height - stop)) {
      rect.r = 10;
      if (!playback) {
        rect.increment = (Math.random() * 1000) / rect.r;
      }
      if (rect.increment > 3) {
        stop += 10;
        if (stop > sk.width) {
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
            rect = { x: 0, y: 0, r: 30, fill: 0, increment: 5 };
            stop = -5;
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
