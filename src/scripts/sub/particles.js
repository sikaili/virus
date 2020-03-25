import calDistance from "../utils/calDistance";

export default class Particle {
  constructor(x, y, virus, number) {
    const scale = 200 / number;
    this.r = (25 + Math.random() * 15) * scale;
    this.r = this.r < 5 ? 5 : this.r;
    this.pos = { x, y };
    this.updating = true;
    if (virus) {
      this.virus = true;
      this.fill = virus;
      this.r *= 2;
    }
  }

  contagion(particles) {
    particles.forEach(particle => {
      if (
        calDistance(particle.pos.x, this.pos.x, particle.pos.y, this.pos.y) <
          this.r / 2 &&
        this.virus &&
        !particle.virus &&
        Math.random() > 0.6
      ) {
        particle.virus = true;
        particle.mother = this;
        particle.fill = [
          ...this.fill.slice(0, 3),
          Math.abs(this.fill[3] - 30) + 10
        ];
      }
    });
  }

  update(pos) {
    this.updating = true;
    this.pos.x += (pos.x - this.pos.x) * 0.08;
    this.pos.y += (pos.y - this.pos.y) * 0.08;
    if (calDistance(pos.x, this.pos.x, pos.y, this.pos.y) < 3) {
      this.updating = false;
    }
  }

  display(sk) {
    if (!this.died) {
      sk.push();
      sk.fill(this.virus ? this.fill : [255, 255, 255, this.r * 3]);
      sk.ellipse(this.pos.x, this.pos.y, this.r);
      if (
        this.mother &&
        calDistance(
          this.mother.pos.x,
          this.pos.x,
          this.mother.pos.y,
          this.pos.y
        ) <
          this.r * 3
      ) {
        sk.strokeWeight(this.r / 2);
        sk.stroke([...this.fill.slice(0, 4)]);
        sk.line(this.pos.x, this.pos.y, this.mother.pos.x, this.mother.pos.y);
      }
      sk.pop();
    }
  }
}
