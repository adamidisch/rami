(function () {
  'use strict';
  const art = document.querySelector('.artist-key-art');
  if (!art) return;
  const greek = document.documentElement.lang === 'el';
  const Audio = window.AudioContext || window.webkitAudioContext;
  if (!Audio) return;
  const notes = [
    { midi: 65, name: 'F4', label: 'Φα', key: 'a', white: 0 },
    { midi: 66, name: 'F♯4', label: 'Φα δίεση', key: 'w', black: 1 },
    { midi: 67, name: 'G4', label: 'Σολ', key: 's', white: 1 },
    { midi: 68, name: 'G♯4', label: 'Σολ δίεση', key: 'e', black: 2 },
    { midi: 69, name: 'A4', label: 'Λα', key: 'd', white: 2 },
    { midi: 70, name: 'A♯4', label: 'Λα δίεση', key: 't', black: 3 },
    { midi: 71, name: 'B4', label: 'Σι', key: 'f', white: 3 }
  ];
  const instrument = document.createElement('div');
  instrument.className = 'mini-piano';
  const hint = document.createElement('p');
  hint.className = 'piano-hint';
  hint.id = 'piano-hint';
  hint.textContent = greek ? 'Παίξε λίγες νότες.' : 'Play a little.';
  const board = document.createElement('div');
  board.className = 'piano-board';
  board.setAttribute('role', 'group');
  board.setAttribute('aria-label', greek ? 'Μικρό πιάνο' : 'Mini piano');
  board.setAttribute('aria-describedby', hint.id);
  const status = document.createElement('span');
  status.className = 'piano-sr';
  status.setAttribute('role', 'status');
  instrument.append(board, hint, status);
  art.replaceWith(instrument);

  let context, master;
  const held = new Map();
  const voices = new Set();
  const buttons = new Map();
  function setupAudio() {
    if (!context) {
      context = new Audio({ latencyHint: 'interactive' });
      master = context.createGain();
      master.gain.value = 0.35;
      const limiter = context.createDynamicsCompressor();
      limiter.threshold.value = -12;
      limiter.knee.value = 12;
      limiter.ratio.value = 8;
      master.connect(limiter);
      limiter.connect(context.destination);
    }
    if (context.state !== 'running') context.resume().catch(() => {
      status.textContent = greek ? 'Ο ήχος δεν είναι διαθέσιμος. Δοκίμασε ξανά.' : 'Audio unavailable. Try again.';
      stopAll();
    });
  }
  function voice(note) {
    if (voices.size >= 12) voices.values().next().value.stop();
    const now = context.currentTime;
    const envelope = context.createGain();
    envelope.gain.setValueAtTime(1, now);
    envelope.connect(master);
    const oscillators = [];
    const frequency = 440 * Math.pow(2, (note.midi - 69) / 12);
    // A soft hammer attack with faster decay of upper string harmonics.
    [1, 0.5, 0.26, 0.13, 0.07, 0.04].forEach((weight, index) => {
      const harmonic = index + 1;
      const oscillator = context.createOscillator();
      oscillator.frequency.value = frequency * harmonic * Math.sqrt(1 + 0.00012 * harmonic * harmonic);
      const gain = context.createGain();
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(weight * 0.28, now + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.00001, now + 3.5 / Math.sqrt(harmonic));
      oscillator.connect(gain);
      gain.connect(envelope);
      oscillator.start(now);
      oscillator.stop(now + 3.6);
      oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
      oscillators.push(oscillator);
    });
    let stopped = false;
    const sound = { stop() {
      if (stopped) return;
      stopped = true;
      const time = context.currentTime;
      envelope.gain.cancelScheduledValues(time);
      envelope.gain.setTargetAtTime(0, time, 0.06);
      oscillators.forEach(oscillator => oscillator.stop(time + 0.3));
    }};
    oscillators[0].addEventListener('ended', () => { voices.delete(sound); envelope.disconnect(); });
    voices.add(sound);
    return sound;
  }
  function press(note, source) {
    if (held.has(source)) return;
    try {
      setupAudio();
      held.set(source, { note, sound: voice(note) });
      buttons.get(note.midi).classList.add('is-playing');
    } catch {
      status.textContent = greek ? 'Ο ήχος δεν είναι διαθέσιμος.' : 'Audio unavailable.';
    }
  }
  function release(source) {
    const active = held.get(source);
    if (!active) return;
    active.sound.stop();
    held.delete(source);
    if (![...held.values()].some(item => item.note === active.note)) buttons.get(active.note.midi).classList.remove('is-playing');
  }
  function stopAll() {
    [...held.keys()].forEach(release);
    voices.forEach(sound => sound.stop());
  }
  notes.forEach(note => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'piano-key ' + (note.black ? 'piano-black' : 'piano-white');
    button.style.setProperty('--position', note.black || note.white);
    button.dataset.note = note.name;
    button.setAttribute('aria-label', greek ? 'Παίξε ' + note.label : 'Play ' + note.name);
    button.setAttribute('aria-keyshortcuts', note.key.toUpperCase());
    button.title = (greek ? note.label : note.name) + ' · ' + note.key.toUpperCase();
    buttons.set(note.midi, button);
    board.append(button);
    button.addEventListener('pointerdown', event => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      event.preventDefault();
      button.focus({ preventScroll: true });
      button.setPointerCapture(event.pointerId);
      press(note, 'pointer-' + event.pointerId);
    });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(type => button.addEventListener(type, event => release('pointer-' + event.pointerId)));
    button.addEventListener('click', event => {
      // Assistive technology can activate a button without a pointer event.
      if (event.detail !== 0) return;
      const source = Symbol('accessible-tap');
      press(note, source);
      setTimeout(() => release(source), 450);
    });
    button.addEventListener('keydown', event => {
      if (event.key !== ' ' && event.key !== 'Enter') return;
      event.preventDefault();
      if (!event.repeat) press(note, 'activation-' + event.code);
    });
  });
  board.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const note = notes.find(item => 'Key' + item.key.toUpperCase() === event.code);
    if (!note) return;
    event.preventDefault();
    if (!event.repeat) press(note, 'keyboard-' + event.code);
  });
  document.addEventListener('keyup', event => {
    release('keyboard-' + event.code);
    release('activation-' + event.code);
  });
  board.addEventListener('focusout', event => { if (!board.contains(event.relatedTarget)) stopAll(); });
  window.addEventListener('blur', stopAll);
  document.addEventListener('visibilitychange', () => { if (document.hidden) { stopAll(); if (context) context.suspend().catch(() => {}); } });
})();
