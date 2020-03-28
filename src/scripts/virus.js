import { Engine, World, Bodies, MouseConstraint } from "matter-js";
import Particle from "./sub/particles";

const s = instance => {
  const sk = instance;
  const divNode = document.querySelector("#canvasContainer");
  const engine = Engine.create();
  const setBordersAndMouse = () => {
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
    const mouseConstraint = MouseConstraint.create(engine, {
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false
        }
      }
    });
    World.add(engine.world, [
      border1,
      border2,
      border3,
      border4,
      mouseConstraint
    ]);
  };
  engine.world.gravity.y = 0;

  sk.start = () => {
    sk.loop();
    Engine.run(engine);
    document.querySelector(".landing").style.display = "none";
  };

  sk.stop = () => {
    World.clear(engine.world);
    Engine.clear(engine);
    sk.remove();
  };

  const { samplers, sampler2 } = s;
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
  const positions = [];
  let virusNo = 3;
  const deathByDay = [];
  const number = 250;
  let cursor = {
    color: [Math.random() * 120, Math.random() * 120, Math.random() * 120, 255],
    r: 80,
    text: `virus ${virusNo}`
  };
  let touched = false;
  sk.setup = () => {
    sk.createCanvas(sk.windowWidth, sk.windowHeight);
    setBordersAndMouse(sk);
    sk.scaleRef = (sk.width + sk.height) / 2;
    // sk.noLoop();
    sk.background(0);
    sk.noStroke();
    sk.strokeCap(sk.SQUARE);
    sk.rectMode(sk.CENTER);
    sk.textAlign(sk.CENTER);
    sk.textSize(40);
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
    particles.forEach(particle => {
      if (!particle.updating) {
        particle.contagion(particles, samplers, sampler2);
      }
      if (touched) {
        particle.changePos();
      }
      particle.display(sk);
    });
    // curso
    sk.push();
    sk.fill([...cursor.color.slice(0, 3), 100]);
    sk.ellipse(sk.mouseX, sk.mouseY, cursor.r);
  };

  sk.addVirus = () => {
    const virus = {
      color: cursor.color,
      id: virusNo - 1
    };
    const particle = new Particle(sk.mouseX, sk.mouseY, virus, number);
    particles.push(particle);
    positions.push({ x: sk.mouseX, y: sk.mouseY });
    World.add(engine.world, particle.body);
    setTimeout(() => {
      // random to 120 is good
      const scale = Math.random() * 255;
      cursor.color =
        virusNo > 0
          ? [
              Math.random() * scale,
              Math.random() * scale,
              Math.random() * scale,
              255
            ]
          : [100, 100, 100, 100];
      cursor.text = `virus ${virusNo}`;
    }, 50);
  };

  sk.handleTouchEnd = ev => {
    touched = false;
    ev.preventDefault();
    if (virusNo > 0 && sk.mouseX + sk.mouseY > 10) {
      sk.addVirus();
      virusNo -= 1;
    } else {
      cursor = { color: [100, 100, 100, 100], r: 40, text: "" };
      let deathToday = 0;

      // dead by click
      particles.forEach(particle => {
        if (Math.random() > 0.95 && particle.virus && !particle.died) {
          particle.died = true;
          sampler2.triggerAttack(130 + (particle.r - 20) * 2);
          deathToday += 1;
        }
      });
      deathByDay.push(deathToday);
    }
  };

  sk.keyPressed = () => {
    switch (sk.keyCode) {
      case 32:
        sk.saveCapture();
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

  const setListeners = (divNode, sk) => { //eslint-disable-line
    divNode.addEventListener(
      "touchstart",
      () => {
        touched = true;
      },
      {
        passive: false
      }
    );

    divNode.addEventListener(
      "mousedown",
      () => {
        touched = true;
      },
      {
        passive: false
      }
    );

    divNode.addEventListener("touchend", sk.handleTouchEnd, {
      passive: false
    });

    divNode.addEventListener("mouseup", sk.handleTouchEnd, {
      passive: false
    });

    divNode.addEventListener(
      "ontouchmove",
      m => {
        m.preventDefault();
      },
      { passive: false }
    );

    divNode.addEventListener(
      "touchmove",
      ev => {
        ev.preventDefault();
      },
      { passive: false }
    );
  };

  setListeners(divNode, sk);
};

export default s;
