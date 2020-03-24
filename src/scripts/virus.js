import Particle from "./sub/particles";

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
  const rect = { x: 30, y: 30, r: 10, fill: [0, 0, 0, 0] };

  const particles = [];
  let positions = [];
  let virusNo = 4;
  let count = 0;
  const deathByDay = [];
  const number = 300;

  sk.setup = () => {
    // sk.pixelDensity(3);
    sk.createCanvas(sk.windowWidth, sk.windowHeight);
    sk.scaleRef = (sk.width + sk.height) / 2;
    sk.background(0);
    sk.noStroke();
    sk.rectMode(sk.CENTER);
    sk.textAlign(sk.CENTER);
    sk.textSize(40);
    sk.strokeCap(sk.SQUARE);
    window.addEventListener("touchend", sk.handleTouchEnd);

    // particles.sort((a, b) => a.pos.y - b.pos.y);

    for (let i = 0; i < number; i += 1) {
      particles[i] = new Particle(
        sk.random(0, sk.width),
        sk.random(0, sk.height),
        false,
        number
      );
      positions[i] = { x: sk.random(0, sk.width), y: sk.random(0, sk.height) };
    }
  };

  sk.draw = () => {
    sk.background(200, 200, 200);
    sk.beginShape();
    sk.noFill();
    particles.forEach((particle, index) => {
      if (!particle.updating) {
        particle.contagion(particles);
      }
      particle.update(positions[index]);
      particle.display(sk);
      if (particle.virus) {
      }
    });
    sk.fill(255, 100, 100, 160);
    sk.ellipse(sk.mouseX, sk.mouseY, 80);
    sk.text(
      `${count} Days\n${(
        (particles.filter(a => a.virus).length / particles.length) *
        100
      ).toFixed(2)}%\n${particles.filter(a => !a.died).length} Left`,
      sk.width / 2,
      sk.height * 0.7
    );
    sk.push();
    for (let i = 0; i < deathByDay.length; i += 1) {
      sk.stroke(0, 180);
      sk.strokeWeight(10);
      const x = 20 + i * 10;
      sk.textSize(8);
      sk.line(x, sk.height - deathByDay[i] * 8, x, sk.height);
      sk.noStroke();
      sk.text(i, x, sk.height - 5);
    }
    sk.textSize(10);
    sk.fill(0);
    sk.text("plot: death by day", sk.width / 2, sk.height - 15);
    sk.pop();
  };

  sk.handleTouchEnd = () => {
    if (!particles.every(a => !a.updating)) {
      return;
    }
    if (virusNo > 0) {
      particles.push(new Particle(sk.mouseX, sk.mouseY, true, number));
      positions.push({ x: sk.mouseX, y: sk.mouseY });
      virusNo -= 1;
    }

    count += 1;
    let deathToday = 0;
    particles.forEach(particle => {
      if (Math.random() > 0.9 && particle.virus && !particle.died) {
        particle.died = true;
        deathToday += 1;
      }
    });
    deathByDay.push(deathToday);
    positions = positions.map(a => {
      if (particles.every(a => a.virus) && Math.random() > 0.3) {
        return {
          x: sk.mouseX + sk.random(-150, 50),
          y: sk.mouseY + sk.random(-50, 150)
        };
      }
      if (Math.random() > 0.9) {
        return {
          ancient: { x: a.x, y: a.y },
          x: sk.mouseX + sk.random(-50, 50),
          y: sk.mouseY + sk.random(-50, 50)
        };
      }
      if (Math.random() > 0.8) {
        return {
          ancient: { x: a.x, y: a.y },
          x: sk.random(0, sk.width),
          y: sk.random(0, sk.height)
        };
      }
      if (Math.random() > 0.5 && a.ancient) {
        return a.ancient;
      }
      return a;
    });
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
