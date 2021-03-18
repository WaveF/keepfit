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
    let target, fitMode, designSize, alignment;
    
    return function main(el, params) {
        target = el || document.body;
        let fit = params.fit || 'width';
        let size = params.size || [1920, 1080];
        let align = params.align || 'top left';
        fitMode = fit;
        alignment = align;

        let viewport = document.getElementsByTagName('meta')['viewport'];
        viewport.parentElement.removeChild(viewport);
        viewport = appendViewPortMeta(size);
        
        let config = formatMetaContent(viewport.content);
        let designWidth = config.width;
        let designHeight = config.height;
        designSize = [designWidth, designHeight];

        if (fit.toLowerCase() == 'width') {
            fitWidthScale(target);
            window.onresize = fitWidthScale;
        }
        else if (fit.toLowerCase() == 'height') {
            fitHeightScale(target);
            window.onresize = fitHeightScale;
        }
        else if (fit.toLowerCase() == 'all') {
            fitAllScale(target);
            window.onresize = fitAllScale;
        }
    }

    function fitWidthScale(e) {
        let winSize = [window.innerWidth, window.innerHeight];
        let ratio = winSize[0]/designSize[0];
        setScale(target, ratio);
    }

    function fitHeightScale(e) {
        let winSize = [window.innerWidth, window.innerHeight];
        let ratio = winSize[1]/designSize[1];
        setScale(target, ratio);
    }

    function fitAllScale(e) {
        let winSize = [window.innerWidth, window.innerHeight];
        let ratioW = winSize[0]/designSize[0];
        let ratioH = winSize[1]/designSize[1];
        setAllScale(target, ratioW, ratioH);
    }

    function setScale(el, ratio) {
        el.style.transformOrigin = alignment;

        if (alignment == 'center') {
            el.style.position = 'absolute';
            el.style.top = '50%';
            el.style.left = '50%';
            el.style.transform = `translate(-50%, -50%) scale(${ratio})`;
        }
        else if (alignment.indexOf('top')!=-1 && alignment.indexOf('center')!=-1) {
            el.style.position = 'absolute';
            el.style.top = '0';
            el.style.left = '50%';
            el.style.transform = `translateX(-50%) scale(${ratio})`;
        }
        else if (alignment.indexOf('top')!=-1 && alignment.indexOf('left')!=-1) {
            el.style.position = 'absolute';
            el.style.top = '0';
            el.style.left = '0';
            el.style.transform = `scale(${ratio})`;
        }
        else {
            el.style.transform = `scale(${ratio})`;
        }
    }

    function setAllScale(el, ratioW, ratioH) {
        el.parentNode.style.overflow = 'hidden';
        el.style.transformOrigin = 'top left';
        el.style.position = 'absolute';
        el.style.top = '0';
        el.style.left = '0';
        el.style.transform = `scale(${ratioW}, ${ratioH})`;
    }

    function getTransform(el) {
        let st = window.getComputedStyle(el, null);
        let tr = st.getPropertyValue("-webkit-transform") ||
            st.getPropertyValue("-moz-transform") ||
            st.getPropertyValue("-ms-transform") ||
            st.getPropertyValue("-o-transform") ||
            st.getPropertyValue("transform") ||
            "FAIL";
        let values = tr.split('(')[1].split(')')[0].split(',');
        let a = values[0];
        let b = values[1];
        let c = values[2];
        let d = values[3];
        let scale = Math.sqrt(a * a + b * b);
        let sin = b / scale;
        let angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
        return {
            scale: scale,
            rotate: angle
        };
    }

    function appendViewPortMeta(size) {
        size = size || [1920, 1080];
        let meta = document.createElement('meta');
        meta.content = `width=${size[0]},height=${size[1]},initial-scale=1.0,maximum-scale=1,user-scalable=no`;
        document.head.appendChild(meta);
        return meta;
    }

    function formatMetaContent(str) {
        let res = {};
        let arr = str.split(',');
        for (let i=0; i<arr.length; i++) {
            let kv = arr[i].split('=');
            let key = kv[0];
            let val = kv[1];
            if (!isNaN(Number(val))) {
                val = Number(val);
            }
            res[key] = val;
        }
        return res;
    }
    
});