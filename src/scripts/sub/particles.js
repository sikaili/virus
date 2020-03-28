import { Bodies, Body } from "matter-js";
import Tone from "tone";
import calDistance from "../utils/calDistance";
import E3 from "../../sound/chasing.mp3";
import D3 from "../../sound/light.mp3";

const sampler2 = new Tone.Sampler(
  { D3 },
  {
    onload: () => {
      this.isLoaded = true;
    }
  }
).chain(new Tone.Volume(-12), Tone.Master);
const samplers = [];
for (let i = 0; i < 3; i += 1) {
  samplers[i] = new Tone.Sampler(
    { E3 },
    {
      onload: () => {
        this.isLoaded = true;
      }
    }
  ).chain(new Tone.Volume(-15), Tone.Master);
}
export default class Particle {
  constructor(x, y, virus, number) {
    const scale = 200 / number;
    this.r = (10 + Math.random() * 15) * scale;
    this.r = this.r < 5 ? 5 : this.r;
    this.pos = { x, y };
    this.updating = true;
    if (virus) {
      this.virus = true;
      this.fill = virus.color;
      this.r *= 2;
      this.id = virus.id;
    }
    this.body = Bodies.circle(x, y, this.r / 1.4);
    Body.setMass(this.body, 3 / scale);
    if (virus) {
      Body.applyForce(this.body, this.body.position, {
        x: Math.random() / 1000,
        y: Math.random() / 1000
      });
    }
  }

  contagion(particles) {
    particles.forEach(particle => {
      const distance = calDistance(
        particle.body.position.x,
        this.body.position.x,
        particle.body.position.y,
        this.body.position.y
      );
      // contagion
      if (
        distance < (this.r + particle.r) / 1.2 &&
        this.virus &&
        !particle.virus &&
        Math.random() > 0.8 &&
        !this.updating &&
        !particle.immu
      ) {
        if (this.fill[3] > 200 && this.id) {
          samplers[this.id].volume.value =
            -3 - 100 / (this.r + this.fill[3] / 5);
          samplers[this.id].triggerAttack(this.fill[2]);
        }
        setTimeout(() => {
          particle = this.infection(particle);
          setTimeout(() => {
            if (Math.random() > 0.7) {
              particle.virus = false;
              if (Math.random() > 0.6 && particle.fill[3] < 150) {
                particle.immu = true;
              }
              setTimeout(() => {
                particle.immu = false;
              }, 3000);
            }
            if (Math.random() > 0.97 && particle.fill[3] > 100) {
              particle.died = true;
              sampler2.triggerAttack(130 + (particle.r - 20) * 2);
            }
          }, 3000);
        }, (1500 / this.fill[3]) ** 2);
        // virus vs virus
      } else if (
        distance < (this.r + particle.r) / 1.2 &&
        this.virus &&
        particle.virus &&
        particle.id !== this.id
      ) {
        particle.fill = particle.fill.map(
          (color, index) => (color + this.fill[index]) / 2
        );
      }
    });
  }

  infection(particle) {
    particle.id = this.id;
    particle.virus = true;
    particle.mother = { position: this.body.position };
    particle.fill = [
      ...this.fill.slice(0, 3),
      Math.abs(this.fill[3] - 30) + 10
    ];
    return particle;
  }

  triggerAttack() {
    sampler2.triggerAttack(130 + (this.r - 20) * 2);
  }

  changePos() {
    if (Math.random() > 0.3) {
      this.updating = true;
      const force = {
        x: (Math.random() - 0.5) * 0.05,
        y: (Math.random() - 0.5) * 0.06
      };
      Body.applyForce(this.body, this.body.position, force);
    }
  }

  display(sk) {
    // console.log(this.body.angularVelocity);
    if (this.body.angularVelocity < 0.005) {
      this.updating = false;
    }
    if (this.died) {
      Body.applyForce(this.body, this.body.position, { x: 0, y: 0.01 });
    } else if (this.immu) {
      Body.applyForce(this.body, this.body.position, { x: 0, y: -0.0003 });
    }
    sk.push();
    sk.translate(this.body.position.x, this.body.position.y);
    sk.rotate(this.body.angle);

    if (this.virus) {
      sk.fill(this.fill);
    } else if (this.immu) {
      sk.fill([255, 255, 255, sk.noise(this.body.position.y) * 255]);
    } else {
      sk.fill([255, 255, 255, this.r * 3]);
    }

    if (this.died) {
      sk.fill(0);
      sk.rect(0, 0, this.r * 2);
    } else {
      sk.ellipse(0, 0, this.r * 2);
    }
    sk.stroke(255, this.r * 3);
    // sk.line(0, 0, 0, this.r);
    sk.pop();
    sk.push();
    if (
      this.mother &&
      calDistance(
        this.mother.position.x,
        this.body.position.x,
        this.mother.position.y,
        this.body.position.y
      ) <
        this.r * 3
    ) {
      sk.strokeWeight(this.r / 2);
      sk.stroke([...this.fill.slice(0, 4)]);
      sk.line(
        this.body.position.x,
        this.body.position.y,
        this.mother.position.x,
        this.mother.position.y
      );
    }
    sk.pop();
  }
}
