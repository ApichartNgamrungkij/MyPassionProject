// =====================================
// PLAYER
// =====================================

const player = document.getElementById("dododo");
const lyrics = document.getElementById("lyrics");

player.volume = 0.1;


// =====================================
// SONG DATA
// =====================================

const song = [
  {
    call: false,

    // Megumi
    colors: ["#c8c2c6"],

    syllables: [
      { text: "Na", start: 15.100515 },
      { text: "ga", start: 15.318 },
      { text: "re", start: 15.440 },
      { text: "bo", start: 15.532 },
      { text: "shi ", start: 15.822 },

      { text: "so", start: 16.128 },
      { text: "ra ", start: 16.305 },
      { text: "e ", start: 16.492 },
      { text: "to ", start: 16.698 },

      { text: "u", start: 16.868 },
      { text: "chi", start: 17.022 },
      { text: "ka", start: 17.153 },
      { text: "e", start: 17.325 },
      { text: "su", start: 17.481 }
    ],

    end: 17.701,
    
  },

  // เพิ่มท่อนถัดไปตรงนี้
  {
    call: false,
    colors: ["#e7609e"],

    syllables: [
      { text: "Ho", start: 18.0 },
      { text: "o", start: 18.2 },
      { text: "mu ", start: 18.4 },
      { text: "ran!!", start: 18.7 }
    ],

    end: 19.2
  }
];


// =====================================
// GLOW GENERATOR
// =====================================

// แปลง Hex เป็น RGB
function hexToRGB(hex) {
  const value = hex.replace("#", "");

  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16)
  };
}

// สร้างสีแบบกำหนดความโปร่งใส
function rgba(hex, alpha = 1) {
  const { r, g, b } = hexToRGB(hex);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ทำสีขอบให้เข้มขึ้นเล็กน้อย
// เพื่อให้มองเห็นบนกระดาษสีขาว
function darkenColor(hex, factor = 0.74) {
  const { r, g, b } = hexToRGB(hex);

  return `rgb(
    ${Math.round(r * factor)},
    ${Math.round(g * factor)},
    ${Math.round(b * factor)}
  )`;
}


// สร้างขอบเรืองแสง
function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16)
  };
}

function rgba(hex, alpha) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ทำสีตัวอักษร active ให้อ่อนขึ้นนิดนึง
function lightenColor(hex, amount = 0.35) {
  const { r, g, b } = hexToRgb(hex);

  const mix = (v) => Math.round(v + (255 - v) * amount);

  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

function makeGlow(colors, faint = false) {
  const shadows = [];

  const singerColors =
    colors?.length ? colors : ["#c8c2c6"];

  singerColors.forEach((color, index) => {
    const hex = color.replace("#", "");

    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    // สีเงาชั้นในเข้มขึ้น เพื่อให้เห็นบนพื้นขาว
    const dark = `rgb(
      ${Math.round(r * 0.65)},
      ${Math.round(g * 0.65)},
      ${Math.round(b * 0.65)}
    )`;

    const rgb = (alpha) =>
      `rgba(${r}, ${g}, ${b}, ${alpha})`;

    // กรณีหลายคนร้อง แยกตำแหน่งแสงเล็กน้อย
    const angle =
      (index / singerColors.length) * Math.PI * 2;

    const distance =
      singerColors.length > 1 ? 1.5 : 0;

    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    if (faint) {

  // เงาชั้นในเข้มขึ้นเพื่อให้มองเห็นบนพื้นขาว
  const passedEdge = `rgba(
    ${Math.round(r * 0.58)},
    ${Math.round(g * 0.58)},
    ${Math.round(b * 0.58)},
    0.6
  )`;

  shadows.push(
    `0 0 1px ${passedEdge}`,
    `${x}px ${y}px 3px ${rgb(0.8)}`,
    `${x}px ${y}px 6px ${rgb(0.45)}`
  );

} else {
      shadows.push(
        // เงาชั้นใน ทำให้มองเห็นชัด
        `0 0 1px ${dark}`,

        // เงาชั้นกลาง สีตัวละคร
        `${x}px ${y}px 3px ${rgb(1)}`,

        // แสงฟุ้งด้านนอก
        `${x}px ${y}px 6px ${rgb(0.9)}`,
        `${x}px ${y}px 10px ${rgb(0.55)}`
      );
    }
  });

  return shadows.join(", ");
}


// =====================================
// BUILD LYRICS
// =====================================

const syllableElements = [];
const lineElements = [];

song.forEach(line => {

  const p = document.createElement("p");

  p.className = line.call
    ? "lyric call"
    : "lyric";

  const lineStart = line.syllables[0].start;
  const lineEnd = line.end;

  lineElements.push({
    element: p,
    start: lineStart,
    end: lineEnd
  });


  line.syllables.forEach((syllable, index) => {

    const span = document.createElement("span");

    span.textContent = syllable.text;
    span.className = "syllable";

    // ใช้สีประจำพยางค์ก่อน
    // หากไม่มี ใช้สีประจำบรรทัด
    const colors =
      syllable.colors ??
      line.colors ??
      ["#c8c2c6"];
      const mainColor = colors[0];

    span.style.setProperty(
    "--active-text-color",
    lightenColor(mainColor, 0.25)
    );

    span.style.setProperty(
    "--passed-text-color",
    lightenColor(mainColor, 0.12)
    );

    // แสงปัจจุบัน
    span.style.setProperty(
      "--active-glow",
      makeGlow(colors)
    );

    // แสงหลังร้องผ่าน
    span.style.setProperty(
      "--passed-glow",
      makeGlow(colors, true)
    );

    const start = syllable.start;

    const end =
      line.syllables[index + 1]?.start
      ?? line.end;

    syllableElements.push({
      element: span,
      start,
      end,
      lineEnd
    });

    // คลิกพยางค์เพื่อข้ามเวลา
    span.addEventListener("click", () => {

      player.currentTime = start;

      player.play().catch(console.error);

    });

    p.appendChild(span);

  });

  lyrics.appendChild(p);

});


// =====================================
// KARAOKE SYNC
// =====================================

function updateLyrics() {

  const time = player.currentTime;

  // จบทั้งบรรทัด
  lineElements.forEach(line => {

    const finished = time >= line.end;

    line.element.classList.toggle(
      "line-past",
      finished
    );

  });


  // อัปเดตแต่ละพยางค์
  syllableElements.forEach(item => {

    const lineFinished =
      time >= item.lineEnd;

    const active =
      time >= item.start &&
      time < item.end;

    const passed =
      time >= item.end &&
      time < item.lineEnd;

    item.element.classList.toggle(
      "active",
      active && !lineFinished
    );

    item.element.classList.toggle(
      "passed",
      passed && !lineFinished
    );

  });

}


// =====================================
// ANIMATION
// =====================================

let animationId = null;

function animate() {

  updateLyrics();

  animationId = requestAnimationFrame(animate);

}

player.addEventListener("play", () => {

  cancelAnimationFrame(animationId);

  animate();

});

player.addEventListener("pause", () => {

  cancelAnimationFrame(animationId);

  updateLyrics();

});

player.addEventListener("seeked", updateLyrics);

player.addEventListener("timeupdate", updateLyrics);

updateLyrics();


// =====================================
// TIMING EDITOR
// =====================================

const timeDisplay =
  document.getElementById("currentTimeDisplay");

const capturedTime =
  document.getElementById("capturedTime");


// แสดงเวลาแบบเรียลไทม์
function showCurrentTime() {

  timeDisplay.textContent =
    player.currentTime.toFixed(3);

  requestAnimationFrame(showCurrentTime);

}

showCurrentTime();


// จับเวลา
document.getElementById("captureTime")
  .addEventListener("click", () => {

    capturedTime.value =
      player.currentTime.toFixed(3);

  });


// คัดลอกเวลา
document.getElementById("copyTime")
  .addEventListener("click", async () => {

    if (!capturedTime.value) return;

    try {

      await navigator.clipboard.writeText(
        capturedTime.value
      );

    } catch (error) {

      capturedTime.select();

      console.log(
        "เลือกเวลาแล้ว กด Ctrl+C เพื่อคัดลอก"
      );

    }

  });