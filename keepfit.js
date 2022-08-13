(function (root, factory) {
  let moduleName = 'keepfit';
  if (typeof define === "function") { /* AMD */
    define(moduleName, factory);
  } else if (typeof module === "object" && typeof exports === "object") { /* CommonJS */
    module.exports = factory();
  } else if (typeof exports === "object") { /* CommonJS2 */
    exports[moduleName] = factory();
  } else { /* ES5 */
    root[moduleName] = factory();
  }
})(this, function () {
  let container, options, mode, designSize, designDir, px2rem;

  function keepfit(target, opts) {
    container = target;
    options = opts;
    mode = options.mode || 'scale';
    designSize = { w: options.size[0] || 1920, h: options.size[1] || 1080 };
    designDir = designSize.w >= designSize.h ? 'landscape' : 'portrait';
    px2rem = options.px2rem === undefined ? 100 : options.px2rem;

    let viewport = document.getElementsByTagName('meta')['viewport'];
    viewport.content = 'width=device-width,minimum-scale=1,maximum-scale=1,user-scalable=no';

    onResizeHandler();
    window.addEventListener('resize', onResizeHandler);

  };

  function onResizeHandler(e) {

    if (mode.toLowerCase() == 'scale') {
      useScaleMode(window.innerWidth, window.innerHeight);
    }
    else if (mode.toLowerCase() == 'rem') {
      useRemMode(px2rem);
    }

  }

  function useScaleMode(w,h) {
    let fit = options.fit.toLowerCase() || 'width';
    let align = options.align.toLowerCase() || 'center';
    let lock = options.lock;
    lock === undefined ? true : lock;

    let ratioX = 1, ratioY = 1;
    let newTop = 0, newLeft = 0;
    let newTransform, rotate = 0;

    let screenSize = { w, h };
    let screenDir = w >= h ? 'landscape' : 'portrait';
    let matchDir = screenDir == designDir;

    if (matchDir || !lock) {
      rotate = 0;

      if (fit === 'width') {
        ratioX = ratioY = screenSize.w / designSize.w;
        newTop = (screenSize.h - designSize.h * ratioX) / 2;
      }
      else if (fit === 'height') {
        ratioX = ratioY = screenSize.h / designSize.h;
        newLeft = (screenSize.w - designSize.w * ratioY) / 2;
      }
      else if (fit === 'both') {
        ratioX = screenSize.w / designSize.w;
        ratioY = screenSize.h / designSize.h;
        newTop = newLeft = 0;
      }

      // 默认计算的坐标是xy居中，这里对特定位置进行锁死
      newTop  = align.includes('top')  ? 0 : newTop;
      newLeft = align.includes('left') ? 0 : newLeft;

    }
    else if (!matchDir || lock) {
      rotate = 90;
      
      if (fit === 'width') {
        ratioX = ratioY = screenSize.h / designSize.w;
        newTop = (screenSize.h - designSize.w * ratioX) / 2;
        newLeft = (screenSize.w + designSize.h * ratioX) / 2;
      }
      else if (fit === 'height') {
        ratioX = ratioY = screenSize.w / designSize.h;
        newTop = (screenSize.h - designSize.w * ratioY) / 2;
        newLeft = screenSize.w;
      }
      else if (fit === 'both') {
        ratioX = screenSize.w / designSize.h;
        ratioY = screenSize.h / designSize.w;
        newLeft = screenSize.w;
      }

      newTop  = align.includes('left') ? 0 : newTop;
      newLeft = align.includes('top') ? screenSize.w : newLeft;
      
    }

    newTransform = `scale(${ratioX}, ${ratioY}) rotate(${rotate}deg)`;

    container.setAttribute('style', `
      position: absolute;
      width: ${designSize.w}px;
      height: ${designSize.h}px;
      top: ${newTop}px;
      left: ${newLeft}px;
      transform-origin: 0px 0px;
      transform: ${newTransform}
    `);
  }

  function useRemMode(base) {
    const htmlStyle = document.documentElement.style;
    const designWidth = designSize.w;
    const designHeight = designSize.h;
    const designRatio = designWidth / designHeight;
    const { innerWidth: width, innerHeight: height } = window;
    const ratio = width / height;

    htmlStyle.fontSize = (ratio > designRatio ? height / designHeight : width / designWidth) * base + 'px';
  }

  return keepfit;
});