import { Engine, World, Bodies } from "matter-js";
import Particle from "./sub/particles";

const engine = Engine.create();
engine.world.gravity.y = 0;
Engine.run(engine);

const s = instance => {
  const sk = instance;
  const { synth, Tone } = s;
  // save and get last
  sk.lastKey = localStorage.getItem("last-key") || "notok";
  sk.thisKey = `OK${Date()}`;
  sk.get = (key = sk.lastKey) => {
    return JSON.parse(localStorage.getItem(key)) || [];
  };
  sk.save = (item, key) => {
    localStorage.setItem(key, JSON.stringify(item));
    localStorage.setItem("last-key", key);
  };

  let looping = true;

  const particles = [];
  let positions = [];
  let virusNo = 3;
  let count = 0;
  const deathByDay = [];
  // const number = parseInt(prompt("Enter a number (250-1000)", "0")) || 250;
  const number = 230;
  const cursor = {
    color: [Math.random() * 120, Math.random() * 120, Math.random() * 120, 255],
    r: 80,
    text: `virus ${virusNo}`
  };

  let touched = false;
  sk.setup = () => {
    // sk.pixelDensity(10);
    sk.createCanvas(sk.windowWidth, sk.windowHeight);
    sk.scaleRef = (sk.width + sk.height) / 2;
    sk.background(0);
    sk.noStroke();
    sk.rectMode(sk.CENTER);
    sk.textAlign(sk.CENTER);
    sk.textSize(40);
    sk.strokeCap(sk.SQUARE);
    window.addEventListener("touchstart", sk.handleTouchEnd, {
      passive: false
    });
    window.addEventListener(
      "touchend",
      () => {
        touched = false;
      },
      {
        passive: false
      }
    );
    window.addEventListener("mousedown", sk.handleTouchEnd, {
      passive: false
    });
    window.addEventListener(
      "mouseup",
      () => {
        touched = false;
      },
      {
        passive: false
      }
    );

    // particles.sort((a, b) => a.pos.y - b.pos.y);
    const border1 = Bodies.rectangle(0, 0, 10, 4000, {
      isStatic: true
    });
    const border2 = Bodies.rectangle(sk.width, 0, 10, 4000, {
      isStatic: true
    });
    const border3 = Bodies.rectangle(0, 0, 4000, 10, {
      isStatic: true
    });
    const border4 = Bodies.rectangle(0, sk.height, 4000, 10, {
      isStatic: true
    });
    World.add(engine.world, [border1, border2, border3, border4]);

    for (let i = 0; i < number; i += 1) {
      particles[i] = new Particle(
        sk.random(0, sk.width),
        sk.random(0, sk.height),
        false,
        number * (1000 / (sk.width + sk.height))
      );
      World.add(engine.world, particles[i].body);

      positions[i] = { x: sk.random(0, sk.width), y: sk.random(0, sk.height) };
    }
  };

  sk.draw = () => {
    sk.background(200, 200, 200);
    sk.noFill();
    particles.forEach((particle, index) => {
      // particle.changePos();
      // sk.fill(0);
      // sk.rect(particle.body.position.x, particle.body.position.y, 30);
      if (!particle.updating) {
        particle.contagion(particles);
      }
      if (touched) {
        particle.changePos();
      }
      particle.display(sk);
      if (particle.virus) {
      }
    });
    /*
    // curso
    sk.push();
    sk.fill(cursor.color);
    sk.ellipse(sk.mouseX, sk.mouseY, cursor.r);
    sk.textSize(15);
    sk.fill(255);
    sk.text(cursor.text, sk.mouseX, sk.mouseY);
    sk.pop();
    // graph
    sk.push();
    for (let i = 0; i < deathByDay.length; i += 1) {
      sk.stroke(0, 180);
      sk.strokeWeight(10);
      const x = 20 + i * 10;
      sk.textSize(5);
      sk.line(
        x,
        sk.height - ((deathByDay[i] * 8) / number) * 250,
        x,
        sk.height
      );
      sk.noStroke();
      sk.fill(255, 125, 125, 220);
      sk.text(i, x, sk.height - 5);
    }
    sk.textSize(10);
    sk.fill(100);
    sk.text("plot: deaths/day", sk.width / 2, sk.height - 15);
    sk.pop();
    // text
    sk.fill(255, 125, 125, 220);
    let text;
    if (virusNo > 0) {
      text = `place patient 0`;
    } else {
      text = `${count} Days\n${(
        (particles.filter(a => a.virus).length / particles.length) *
        100
      ).toFixed(2)}%\n${particles.filter(a => !a.died).length} Left`;
    }
    sk.text(text, sk.width / 2, sk.height * 0.7 - 50);
    */
  };

  sk.handleTouchEnd = ev => {
    touched = true;
    // ev.preventDefault();
    if (virusNo > 0) {
      const particle = new Particle(sk.mouseX, sk.mouseY, cursor.color, number);
      particles.push(particle);
      positions.push({ x: sk.mouseX, y: sk.mouseY });
      World.add(engine.world, particle.body);

      virusNo -= 1;
      setTimeout(() => {
        cursor.color = [
          Math.random() * 120,
          Math.random() * 120,
          Math.random() * 120,
          255
        ];
        cursor.text = `virus ${virusNo}`;
      }, 600);

      positions = positions.map(a => {
        return { x: a.x + sk.random(-30, 30), y: a.y + sk.random(-30, 30) };
      });
    } else {
      cursor.color = [100, 100, 100, 100];
      cursor.r = 40;
      cursor.text = "";

      count += 1;

      let deathToday = 0;
      particles.forEach(particle => {
        if (Math.random() > 0.95 && particle.virus && !particle.died) {
          particle.died = true;
          deathToday += 1;
        }
      });
      deathByDay.push(deathToday);

      positions = positions.map(a => {
        // if (particles.every(a => a.virus) && Math.random() > 0.3) {
        //   return {
        //     x: sk.mouseX + sk.random(-150, 50),
        //     y: sk.mouseY + sk.random(-50, 150)
        //   };
        // }
        if (Math.random() > 0.98) {
          return {
            ancient: { x: a.x, y: a.y },
            x: sk.mouseX + sk.random(-50, 50),
            y: sk.mouseY + sk.random(-50, 50)
          };
        }
        if (Math.random() > 0.8) {
          const distance = number;
          let x = a.x + sk.random(-distance, distance);
          let y = a.y + sk.random(-distance, distance);
          x = x < 0 ? sk.random(0, sk.width) : x;
          y = y < 0 ? sk.random(0, sk.height) : y;
          return {
            ancient: { x: a.x, y: a.y },
            x,
            y
          };
        }
        if (Math.random() > 0.5 && a.ancient) {
          return a.ancient;
        }
        return a;
      });
    }
  };

  sk.keyPressed = () => {
    switch (sk.keyCode) {
      case 32:
        sk.saveCapture();
        break;
      case 78:
        Tone.Transport.toggle();
        if (looping) {
          sk.noLoop();
          looping = !looping;
        } else {
          sk.loop();
          looping = !looping;
        }
        break;
      case 65:
        break;
      default:
    }
  };

  sk.saveCapture = () => {
    if (sk.pixelDensity() > 1) {
      sk.saveCanvas(document.querySelector("canvas"), `ok${Date()}`, "png");
    }
  };

  sk.windowResized = () => {
    sk.resizeCanvas(sk.windowWidth, sk.windowHeight);
  };
};

export default s;
