import { Bodies, Body } from "matter-js";
import calDistance from "../utils/calDistance";

export default class Particle {
  constructor(x, y, virus, number) {
    const scale = 200 / number;
    this.r = (10 + Math.random() * 15) * scale;
    this.r = this.r < 5 ? 5 : this.r;
    this.pos = { x, y };
    this.updating = true;
    if (virus) {
      this.virus = true;
      this.fill = virus;
      this.r *= 2;
    }
    this.body = Bodies.circle(x, y, this.r / 1.5);
    Body.setMass(this.body, 3 / scale);
  }

  contagion(particles) {
    particles.forEach(particle => {
      if (
        calDistance(
          particle.body.position.x,
          this.body.position.x,
          particle.body.position.y,
          this.body.position.y
        ) <
          (this.r + particle.r) / 1.2 &&
        this.virus &&
        !particle.virus &&
        Math.random() > 0.7 &&
        !this.updating
      ) {
        if (this.fill[3] > 100) window.sampler.triggerAttack(this.fill[2]);
        setTimeout(() => {
          particle.virus = true;
          particle.mother = this;
          particle.fill = [
            ...this.fill.slice(0, 3),
            Math.abs(this.fill[3] - 30) + 10
          ];
        }, (2000 / this.fill[3]) ** 2);
      }
    });
  }

  changePos() {
    if (Math.random() > 0.5) {
      this.updating = true;
      const force = {
        x: (Math.random() - 0.5) * 0.03,
        y: (Math.random() - 0.5) * 0.03
      };
      Body.applyForce(this.body, this.body.position, force);
    }
  }

  display(sk) {
    // console.log(this.body.angularVelocity);
    if (this.body.angularVelocity < 0.1) {
      this.updating = false;
    }
    if (this.died) {
      Body.applyForce(this.body, this.body.position, { x: 0, y: 0.01 });
    }
    sk.push();
    sk.translate(this.body.position.x, this.body.position.y);
    sk.rotate(this.body.angle);
    sk.fill(this.virus ? this.fill : [255, 255, 255, this.r * 3]);
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
        this.mother.body.position.x,
        this.body.position.x,
        this.mother.body.position.y,
        this.body.position.y
      ) <
        this.r * 3
    ) {
      sk.strokeWeight(this.r / 2);
      sk.stroke([...this.fill.slice(0, 4)]);
      sk.line(
        this.body.position.x,
        this.body.position.y,
        this.mother.body.position.x,
        this.mother.body.position.y
      );
    }
    sk.pop();
  }
}
