(function (root, factory) {
  let moduleName = 'keepfit';
  if (typeof define === "function" && define.amd) { /* AMD */
    define(moduleName, factory);
  } else if (typeof module === "object" && typeof exports === "object") { /* CommonJS */
    module.exports = factory();
  } else if (typeof exports === "object") { /* CommonJS2 */
    exports[moduleName] = factory();
  } else { /* ES5 */
    root[moduleName] = factory();
  }
})(this, function () {
  let container, options, mode, designSize, designDirection, px2rem, resizeHandler;

  function keepfit(target, opts) {
    if (!target || !opts || !opts.size) {
        throw new Error('Invalid parameters');
    }

    container = target;
    options = opts;
    mode = (options.mode || 'scale').toLowerCase();
    designSize = { w: options.size[0] || 1920, h: options.size[1] || 1080 };
    designDirection = designSize.w >= designSize.h ? 'landscape' : 'portrait';
    px2rem = options.px2rem === undefined ? 100 : options.px2rem;

    options.fit = (options.fit || 'width').toLowerCase();
    options.align = (options.align || 'center').toLowerCase();
    options.lock = options.lock === undefined ? true : options.lock;

    // let viewport = document.getElementsByTagName('meta')['viewport'];
    let viewport = document.querySelector('meta[name="viewport"]');
    let viewportContent = `width=device-width,minimum-scale=1,maximum-scale=1,user-scalable=no`;
    if (viewport) {
      viewport.content = viewportContent;
    } else {
      viewport = document.createElement('meta');
      viewport.setAttribute('name', 'viewport');
      viewport.setAttribute('content', viewportContent);
      document.getElementsByTagName('head')[0].appendChild(viewport);
    }

    if (resizeHandler) {
      window.removeEventListener('resize', resizeHandler);
    }
    resizeHandler = debounce(onResizeHandler, 16);
    window.addEventListener('resize', resizeHandler);
    resizeHandler();
    // onResizeHandler();
    // window.addEventListener('resize', debounce(onResizeHandler, 16));
  };

  function onResizeHandler(e) {

    if (mode == 'scale') {
      useScaleMode(window.innerWidth, window.innerHeight);
    }
    else if (mode == 'rem') {
      useRemMode(px2rem);
    }

  }

  function useScaleMode(w,h) {
    const { fit, align, lock } = options;

    if (px2rem !== undefined) {
      document.documentElement.style.fontSize = `${px2rem}px`;
    }

    let ratioX = 1, ratioY = 1;
    let newTop = 0, newLeft = 0;
    let newTransform, rotate = 0;

    let screenSize = { w, h };
    let screenDirection = w >= h ? 'landscape' : 'portrait';
    let matchDirection = screenDirection == designDirection;

    if (matchDirection || !lock) {
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
        newLeft = 0;
        newTop = 0;
      }

      // 默认计算的坐标是xy居中，这里对特定位置进行锁死
      newTop  = align.includes('top')  ? 0 : newTop;
      newLeft = align.includes('left') ? 0 : newLeft;

    }
    // else if (!matchDirection || lock) {
    else {
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
        newTop = 0;
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

    // htmlStyle.fontSize = (ratio > designRatio ? height / designHeight : width / designWidth) * base + 'px';
    const fontSize = (ratio > designRatio ? height / designHeight : width / designWidth) * base;
    const minFontSize = 12;  // 最小字号
    const maxFontSize = 150; // 最大字号
    htmlStyle.fontSize = Math.min(Math.max(fontSize, minFontSize), maxFontSize) + 'px';
  }

  function debounce(fn, delay) {
    let timer = null;
    return function (...args) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  return keepfit;
});