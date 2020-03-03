import "../styles/index.scss";
import * as p5 from "p5";

const s = instance => {
  const sk = instance;
  let stop = -5;
  let rect = { x: 0, y: 0, r: 30, fill: 0, increment: 5 };
  sk.setup = () => {
    sk.pixelDensity(10.0);
    sk.createCanvas(100, 100);
    sk.background(255, 255, 0);
    sk.noStroke();
  };
  sk.draw = () => {
    if (rect.x >= Math.abs(sk.width - rect.r - stop)) {
      rect.x = sk.width - rect.r;
      rect.y += rect.increment;
    } else {
      rect.x += rect.increment;
    }
    if (rect.y > Math.abs(sk.height - rect.r - stop)) {
      rect.fill = [
        sk.random(-700, 300),
        sk.random(-255, 100),
        sk.random(-500, 500)
      ];
      rect.r += (Math.random() - 0.3) * 30;
      rect.x = -10;
      rect.y = -5;
    }
    if (rect.r > Math.abs(sk.height - stop)) {
      rect.r = 10;
      rect.increment = (Math.random() * 1000) / rect.r;
      if (rect.increment > 3) {
        console.log(stop);
        stop += 10;
        sk.translate(0, 0);
        sk.scale(3);
        if (stop > sk.width) {
          sk.noLoop();
          // sk.saveCanvas(
          //   document.querySelector("canvas"),
          //   `ok${Math.random()}`,
          //   "png"
          // );
          setTimeout(() => {
            sk.clear();
            rect = { x: 0, y: 0, r: 30, fill: 0, increment: 5 };
            stop = -5;
            sk.loop();
          }, 2000);
        }
      } else {
        sk.translate(0, sk.width);
        sk.scale(1);
      }
    }
    sk.fill(rect.fill);
    sk.rect(rect.x, rect.y, rect.r);
  };
  sk.keyPressed = () => {
    if (sk.keyCode == "32") {
      sk.saveCanvas(
        document.querySelector("canvas"),
        `ok${Math.random()}`,
        "png"
      );
    }
  };
};

const P5 = new p5(s);
