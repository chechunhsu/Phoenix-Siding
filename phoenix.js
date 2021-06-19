Phoenix.set({
  daemon: true,
  openAtLogin: true
});

const getScreenFrame = window => window.screen().flippedVisibleFrame();

const getDefaultFrame = window => {
  const frame = getScreenFrame(window);
  const margin = 100;
  const height = frame.height - margin * 2;
  const width = frame.width - margin * 2;
  return {
    x: (frame.width - width) / 2 + frame.x,
    y: (frame.height - height) / 2 + frame.y,
    height,
    width,
  };
};

const createHandler = ({ test, set }) => () => {
  const window = Window.focused();
  const windowFrame = window.frame();
  const screenFrame = getScreenFrame(window);

  if (test && test(windowFrame, screenFrame)) {
    window.setFrame(getDefaultFrame(window));
  } else if (set) {
    set(window, screenFrame);
  }
};

Key.on('up', ['alt', 'cmd'], createHandler({
  test: (wf, sf) => wf.width === sf.width && wf.height === sf.height,
  set: w => w.maximise(),
}));

Key.on('down', ['alt', 'cmd'], createHandler({
  set: w => w.setFrame(getDefaultFrame(w)),
}));

Key.on('left', ['alt', 'cmd'], createHandler({
  test: (wf, sf) => wf.x === sf.x && wf.y === sf.y && wf.height === sf.height && wf.width === sf.width / 2,
  set: (w, sf) => w.setFrame({ x: sf.x, y: sf.y, height: sf.height, width: sf.width / 2 }),
}));

Key.on('right', ['alt', 'cmd'], createHandler({
  test: (wf, sf) => wf.x === (sf.x + sf.width / 2) && wf.y === sf.y && wf.height === sf.height && wf.width === sf.width / 2,
  set: (w, sf) => w.setFrame({ x: sf.x + sf.width / 2, y: sf.y, height: sf.height, width: sf.width / 2 }),
}));

Phoenix.notify('Configuration reloaded successfully');
