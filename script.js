const root = document.documentElement;
const soundButton = document.getElementById("soundToggle");
const volumeSlider = document.getElementById("volumeSlider");
let audioContext;
let masterGain;
let padOscillators = [];
let delayNode;
let soundEnabled = false;
let currentLanguage = "en";
let lastHoverTone = 0;
let ambientVolume = Number(volumeSlider.value) / 100;

const translations = {
  en: {
    "nav.projects": "Projects",
    "nav.gallery": "Gallery",
    "nav.courses": "Courses",
    "nav.experience": "Experience",
    "nav.contact": "Contact",
    "sound.off": "Ambient: Off",
    "sound.on": "Ambient: On",
    "sound.volume": "Vol",
    "hero.eyebrow": "Mechatronics / Robotics / Embedded",
    "hero.title": "Hello! I'm Szymon, a Mechatronics Technician.",
    "hero.lead": "I design and build robots, electronics and embedded software for STM32 and PLCs. I also use Autodesk Fusion 360 extensively, turning CAD ideas into reliable 3D printed parts and practical prototypes.",
    "hero.email": "Copy email",
    "tag.mech": "Mechatronics",
    "tag.print": "3D Printing",
    "projects.eyebrow": "Project gallery",
    "projects.title": "Robots, embedded systems and 3D printed ideas.",
    "project.gruzik": "Advanced STM32 based line-following robot with route optimization.",
    "project.github": "See on GitHub",
    "project.flight": "Flight computer",
    "project.straglider": "STM32 based flight computer with 2x IMU, environment sensors, SD card and USB-C.",
    "project.aura": "Autonomous walking robot platform for control, sensors and machine learning experiments.",
    "project.preview": "Robotics profile",
    "project.print": "3D printing",
    "project.makerworld": "3D printing models shared with the community on MakerWorld.",
    "project.makerlink": "See on MakerWorld",
    "employer.technician": "Graduated Mechatronics Technician",
    "employer.technicianText": "Formal mechatronics education with practical work in mechanics, electronics, automation and diagnostics.",
    "employer.robotics": "Fusion 360 and 3D printing workflow",
    "employer.roboticsText": "Many years of Autodesk Fusion 360 practice for functional 3D printed parts, robot components and mechanical prototypes.",
    "employer.ready": "Robotics and prototyping mindset",
    "employer.readyText": "Robotics projects combine CAD, 3D printing, sensors, STM32 firmware, control algorithms and practical testing.",
    "gallery.eyebrow": "Gallery",
    "gallery.title": "Workshop snapshots and project moments.",
    "courses.eyebrow": "Education, courses & certificates",
    "courses.title": "Training that supports real mechatronics work.",
    "course.robotics": "Robotics 101 - control algorithms",
    "course.autocad": "AutoCAD - advanced course / Fusion 360 practice",
    "course.cnc": "CNC programming G-code",
    "course.sep": "Electrical certificate SEP up to 1kV",
    "course.sepdate": "Valid until August 2030",
    "experience.eyebrow": "Experience & education",
    "experience.title": "Technician background with practical industrial experience.",
    "experience.danone": "Intern - Danone",
    "experience.danoneText": "PLC programming and 3D CAD part design for machines, using CAD thinking that also supports my Fusion 360 and 3D printing workflow.",
    "experience.school": "Technician in Mechatronics - PCKTiB Oświęcim",
    "experience.schoolText": "Graduated as a Mechatronics Technician with practical education in mechatronic systems, electronics and automation.",
    "awards.eyebrow": "Awards",
    "awards.title": "Competition results.",
    "award.international": "International competition",
    "award.national": "National competition",
    "award.roztoczanska": "Roztoczańska Liga Robotów 2025",
    "contact.eyebrow": "Contact",
    "contact.title": "Let's talk about robotics, embedded systems and technical projects.",
    "contact.note": "Professional contact details for cooperation, project discussion and engineering opportunities.",
    "contact.phone": "Phone",
    "contact.copyHint": "Click to copy",
    "contact.copied": "Copied",
    "footer": "© Szymon Nyderek - szymonnyderek.pl style concept"
  },
  pl: {
    "nav.projects": "Projekty",
    "nav.gallery": "Galeria",
    "nav.courses": "Kursy",
    "nav.experience": "Doświadczenie",
    "nav.contact": "Kontakt",
    "sound.off": "Ambient: Wył.",
    "sound.on": "Ambient: Wł.",
    "sound.volume": "Głośn.",
    "hero.eyebrow": "Mechatronika / Robotyka / Embedded",
    "hero.title": "Cześć! Jestem Szymon, Technik Mechatronik.",
    "hero.lead": "Projektuję i buduję roboty, elektronikę oraz oprogramowanie embedded dla STM32 i PLC. Od wielu lat intensywnie używam Autodesk Fusion 360, zamieniając pomysły CAD w działające części drukowane 3D i praktyczne prototypy.",
    "hero.email": "Kopiuj email",
    "tag.mech": "Mechatronika",
    "tag.print": "Druk 3D",
    "projects.eyebrow": "Galeria projektów",
    "projects.title": "Roboty, systemy embedded i pomysły drukowane w 3D.",
    "project.gruzik": "Zaawansowany robot line follower na STM32 z optymalizacją trasy.",
    "project.github": "Zobacz na GitHub",
    "project.flight": "Komputer pokładowy",
    "project.straglider": "Komputer pokładowy na STM32 z 2x IMU, sensorami środowiskowymi, kartą SD i USB-C.",
    "project.aura": "Autonomiczna platforma robota kroczącego do sterowania, sensorów i eksperymentów z uczeniem maszynowym.",
    "project.preview": "Profil robotyczny",
    "project.print": "Druk 3D",
    "project.makerworld": "Modele do druku 3D udostępnione społeczności na MakerWorld.",
    "project.makerlink": "Zobacz MakerWorld",
    "employer.technician": "Wykształcony Technik Mechatronik",
    "employer.technicianText": "Formalna edukacja mechatroniczna z praktyką w mechanice, elektronice, automatyce i diagnostyce.",
    "employer.robotics": "Fusion 360 i workflow druku 3D",
    "employer.roboticsText": "Wieloletnia praktyka w Autodesk Fusion 360 przy funkcjonalnych częściach drukowanych 3D, komponentach robotów i prototypach mechanicznych.",
    "employer.ready": "Robotyka i prototypowanie",
    "employer.readyText": "Projekty robotyczne łączą CAD, druk 3D, sensory, firmware STM32, algorytmy sterowania i praktyczne testy.",
    "gallery.eyebrow": "Galeria",
    "gallery.title": "Zdjęcia z warsztatu i momenty z projektów.",
    "courses.eyebrow": "Edukacja, kursy i certyfikaty",
    "courses.title": "Przygotowanie pod realną pracę w mechatronice.",
    "course.robotics": "Robotics 101 - algorytmy sterowania",
    "course.autocad": "AutoCAD - kurs zaawansowany / praktyka Fusion 360",
    "course.cnc": "Programowanie CNC G-code",
    "course.sep": "Uprawnienia SEP do 1kV",
    "course.sepdate": "Ważne do sierpnia 2030",
    "experience.eyebrow": "Doświadczenie i edukacja",
    "experience.title": "Techniczne przygotowanie i praktyka przemysłowa.",
    "experience.danone": "Stażysta - Danone",
    "experience.danoneText": "Programowanie PLC i projektowanie części maszyn w 3D CAD, z podejściem projektowym rozwijanym również w Fusion 360 i druku 3D.",
    "experience.school": "Technik Mechatronik - PCKTiB Oświęcim",
    "experience.schoolText": "Ukończone wykształcenie jako Technik Mechatronik z praktyczną nauką systemów mechatronicznych, elektroniki i automatyki.",
    "awards.eyebrow": "Osiągnięcia",
    "awards.title": "Wyniki konkursów.",
    "award.international": "Konkurs międzynarodowy",
    "award.national": "Konkurs ogólnopolski",
    "award.roztoczanska": "Roztoczańska Liga Robotów 2025",
    "contact.eyebrow": "Kontakt",
    "contact.title": "Porozmawiajmy o robotyce, embedded systems i projektach technicznych.",
    "contact.note": "Profesjonalne dane kontaktowe do współpracy, rozmów projektowych i możliwości technicznych.",
    "contact.phone": "Telefon",
    "contact.copyHint": "Kliknij, aby skopiować",
    "contact.copied": "Skopiowano",
    "footer": "© Szymon Nyderek - koncepcja w stylu szymonnyderek.pl"
  }
};

window.addEventListener("pointermove", (event) => {
  root.style.setProperty("--x", `${event.clientX}px`);
  root.style.setProperty("--y", `${event.clientY}px`);
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 5, 4) * 55}ms`;
  revealObserver.observe(element);
});

document.querySelectorAll("[data-tilt]").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateX = ((y / rect.height) - 0.5) * -4;
    const rotateY = ((x / rect.width) - 0.5) * 4;
    card.style.transform = `perspective(950px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

function applyLanguage(language) {
  currentLanguage = language;
  document.documentElement.lang = language;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    element.textContent = translations[language][key] || translations.en[key] || element.textContent;
  });
  document.querySelectorAll(".lang-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.lang === language);
  });
  soundButton.textContent = translations[language][soundEnabled ? "sound.on" : "sound.off"];
}

document.querySelectorAll(".lang-button").forEach((button) => {
  button.addEventListener("click", () => {
    applyLanguage(button.dataset.lang);
  });
});

function ensureAudio() {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
}

function targetAmbientGain() {
  return Math.max(0.0001, ambientVolume * 0.08);
}

function startAmbient() {
  ensureAudio();
  masterGain = audioContext.createGain();
  masterGain.gain.value = 0.0001;

  delayNode = audioContext.createDelay(1.2);
  delayNode.delayTime.value = 0.42;
  const feedback = audioContext.createGain();
  feedback.gain.value = 0.16;
  delayNode.connect(feedback);
  feedback.connect(delayNode);

  const filter = audioContext.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 620;

  masterGain.connect(filter);
  filter.connect(delayNode);
  filter.connect(audioContext.destination);
  delayNode.connect(audioContext.destination);

  const notes = [146.83, 220, 277.18];
  padOscillators = notes.map((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = index === 1 ? "triangle" : "sine";
    oscillator.frequency.value = frequency;
    gain.gain.value = 0.16 / notes.length;
    oscillator.connect(gain);
    gain.connect(masterGain);
    oscillator.start();
    return oscillator;
  });

  masterGain.gain.exponentialRampToValueAtTime(targetAmbientGain(), audioContext.currentTime + 1.2);
}

function stopAmbient() {
  if (!audioContext || !masterGain) return;
  masterGain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.6);
  padOscillators.forEach((oscillator) => oscillator.stop(audioContext.currentTime + 0.7));
  padOscillators = [];
  masterGain = null;
}

function playSoftPing() {
  if (!soundEnabled || !audioContext) return;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(660, audioContext.currentTime + 0.16);
  gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.026 * ambientVolume, audioContext.currentTime + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.55);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.58);
}

function playHoverTone() {
  if (!soundEnabled || !audioContext || ambientVolume <= 0) return;
  const now = performance.now();
  if (now - lastHoverTone < 90) return;
  lastHoverTone = now;

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(330, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(495, audioContext.currentTime + 0.09);
  gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.018 * ambientVolume, audioContext.currentTime + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.18);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.2);
}

function copyEmail(button) {
  const email = button.dataset.email;
  const fallbackCopy = () => new Promise((resolve) => {
    const textarea = document.createElement("textarea");
    textarea.value = email;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
    resolve();
  });

  const write = navigator.clipboard
    ? navigator.clipboard.writeText(email).catch(fallbackCopy)
    : fallbackCopy();

  write.then(() => {
    const hint = button.querySelector("small");
    if (hint) {
      hint.textContent = translations[currentLanguage]["contact.copied"];
      setTimeout(() => {
        hint.textContent = translations[currentLanguage]["contact.copyHint"];
      }, 1400);
    } else {
      const original = button.textContent;
      button.textContent = translations[currentLanguage]["contact.copied"];
      setTimeout(() => {
        button.textContent = translations[currentLanguage]["hero.email"];
      }, 1200);
    }
    playSoftPing();
  });
}

document.querySelectorAll(".copy-email").forEach((button) => {
  button.addEventListener("click", () => copyEmail(button));
});

document.querySelectorAll("a, button, .project-card, .award, .contact-row, .employer-card, .mini-ide").forEach((element) => {
  element.addEventListener("pointerenter", playHoverTone);
});

volumeSlider.addEventListener("input", () => {
  ambientVolume = Number(volumeSlider.value) / 100;
  if (soundEnabled && masterGain && audioContext) {
    masterGain.gain.setTargetAtTime(targetAmbientGain(), audioContext.currentTime, 0.08);
  }
});

soundButton.addEventListener("click", async () => {
  ensureAudio();
  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }

  soundEnabled = !soundEnabled;
  soundButton.setAttribute("aria-pressed", String(soundEnabled));
  soundButton.textContent = translations[currentLanguage][soundEnabled ? "sound.on" : "sound.off"];

  if (soundEnabled) {
    startAmbient();
    playSoftPing();
  } else {
    stopAmbient();
  }
});

applyLanguage("en");
