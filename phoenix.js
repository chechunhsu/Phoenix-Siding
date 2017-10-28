Phoenix.set({
  daemon: true,
  openAtLogin: true
});

const frameCaches = {};

const getFrameCache = window => frameCaches[window.hash()];
const cacheFrame = window => {
  frameCaches[window.hash()] = window.frame();
};
const restoreFrame = window => {
  const frameCache = frameCaches[window.hash()];

  if (!frameCache) return;

  window.setFrame(frameCache);
  delete frameCaches[window.hash()];
};

const getScreenAndWindow = _ => ({
  screen: Screen.main().flippedVisibleFrame(),
  window: Window.focused()
});

Key.on('up', [ 'alt', 'cmd' ], function () {
  const { screen, window } = getScreenAndWindow();
  const currentFrame = window.frame();
  const previousFrame = getFrameCache(window);

  const morphing = !previousFrame ||
    currentFrame.width < screen.width ||
    (currentFrame.height + 6) < screen.height; // FIXME: The setted height might be lower than the actual available height

  if (morphing) {
    if (currentFrame.width !== screen.width / 2 && currentFrame.width !== screen.width) cacheFrame(window);
    window.maximise()
  } else {
    restoreFrame(window);
  }
});

Key.on('left', [ 'alt', 'cmd' ], function () {
  const { screen, window } = getScreenAndWindow();
  const currentFrame = window.frame();
  const previousFrame = getFrameCache(window);

  const morphing = !previousFrame ||
    currentFrame.x !== 0 ||
    currentFrame.width !== screen.width / 2 ||
    (currentFrame.height + 6) < screen.height; // FIXME: The setted height might be lower than the actual available height

  if (morphing) {
    if (currentFrame.width !== screen.width / 2 && currentFrame.width !== screen.width) cacheFrame(window);
    window.setTopLeft({ x: 0, y: 0 });
    window.setSize({ height: screen.height, width: screen.width / 2 });
  } else {
    restoreFrame(window);
  }
});

Key.on('right', [ 'alt', 'cmd' ], function () {
  const { screen, window } = getScreenAndWindow();
  const currentFrame = window.frame();
  const previousFrame = getFrameCache(window);

  const morphing = !previousFrame ||
    currentFrame.x !== screen.width / 2 ||
    currentFrame.width !== screen.width / 2 ||
    (currentFrame.height + 6) < screen.height; // FIXME: The setted height might be lower than the actual available height

  if (morphing) {
    if (currentFrame.width !== screen.width / 2 && currentFrame.width !== screen.width) cacheFrame(window);
    window.setTopLeft({ x: screen.width / 2, y: 0 });
    window.setSize({ height: screen.height, width: screen.width / 2 });
  } else {
    restoreFrame(window);
  }
});

Key.on('down', [ 'alt', 'cmd' ], function () {
  const { screen, window } = getScreenAndWindow();
  const previousFrame = getFrameCache(window);

  if (previousFrame) {
    restoreFrame(window);
  } else {
    const menuBarHeight = 20;
    const margin = 50;
    window.setTopLeft({ x: margin, y: margin + menuBarHeight });
    window.setSize({ height: screen.height - menuBarHeight - margin * 2, width: screen.width - margin * 2 });
    cacheFrame(window);
  }
});

Phoenix.notify("Configuration reloaded successfully");
