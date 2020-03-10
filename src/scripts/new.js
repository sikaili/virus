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

  const triggerSynth = time => {
    const notes = ["C2", "A4", "D3", "A2", "E4", "Eb3", "A2", "D4"];
    synth.triggerAttackRelease(
      notes[Math.floor(Math.random() * notes.length)],
      "16N",
      time
    );
  };

  const seq = new Tone.Sequence(
    (time, note) => {
      // sk.background(sk.random(-300, 300), 30);
      rect.fill = [
        Math.floor(sk.random(-200, 600)),
        Math.floor(sk.random(-255, 100)),
        Math.floor(sk.random(-500, 500))
      ];
      rect.r = (Math.floor(Math.random() * 5) * sk.scaleRef) / 15;
      rect.x = sk.width / 2;
      rect.y = note + 100;
      synth.triggerAttackRelease(note, "16n");
    },
    [440, 220, [440, 220, [440, 220, 440]]]
  );
  sk.setup = () => {
    sk.pixelDensity(3);
    sk.createCanvas(sk.windowWidth, sk.windowHeight);
    sk.scaleRef = (sk.width + sk.height) / 2;
    sk.background(0);
    sk.noStroke();
    sk.rectMode(sk.CENTER);
    seq.start();
    Tone.Transport.schedule(triggerSynth, 0);
    Tone.Transport.schedule(triggerSynth, "16n");
    Tone.Transport.schedule(triggerSynth, "8n");
    Tone.Transport.schedule(triggerSynth, "4n");

    Tone.Transport.loopEnd = "1:0:0";
    Tone.Transport.loop = true;
    Tone.Transport.bpm.value = 70;
  };

  sk.draw = () => {
    rect.r +=
      ((sk.noise(rect.fill[0], rect.fill[3], rect.fill[1]) * sk.scaleRef) / 2 -
        rect.r) *
      0.5;
    // sk.background(255, 255);
    sk.fill(rect.fill);
    if (rect.y < sk.height / 2) {
      sk.rect(rect.x, rect.y, rect.r);
    } else {
      sk.ellipse(rect.x, rect.y, rect.r);
    }
  };
  sk.mousePressed = () => {
    rect.x += 5;
    Tone.Transport.start();
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
        Tone.Transport.clear(2);
        break;
      default:
        Tone.Transport.schedule(triggerSynth, "3n");
        console.log(Tone.Transport);
    }
  };

  sk.saveCapture = () => {
    if (sk.pixelDensity() > 1) {
      sk.saveCanvas(document.querySelector("canvas"), `ok${Date()}`, "png");
    }
  };
};

export default s;
