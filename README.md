# KeepFit

指定一个DOM节点，使其按照 **宽度/高度/两者** 为基准的缩放方式，或按`100px = 1rem`的规则，来适应浏览器窗口尺寸。通常用于按照数据可视化大屏设计图进行的前端开发，针对不同尺寸和比例显示设备的自适应。

## 引用 - Install

ES5
```html
<script src="keepfit.min.js"></script>
```

AMD
```javascript
require(['keepfit'], (keepfit)=>{ /* code here */ })
```

CMD
```javascript
const keepfit = require('./keepfit')
```

NPM
```bash
npm install keepfit
```

## 文档 - Document
```javascript
keepfit(target, options);
```
| 参数            | 类型   | 值                                  | 描述                    |
|-----------------|--------|------------------------------------|-------------------------|
| `target`        | object | `document.body`                    | DOM元素节点             |
| `options`       | object | `{ size, mode, fit, align, lock }` | 参数                    |
| `options.mode`  | string | `'scale'`, `'rem'`                 | 默认: scale (v3)        |
| `options.size`  | array  | `[1920, 1080]`                     | 设计图尺寸              |


#### Scale Mode
| 参数            | 类型   | 值                              | 描述                     |
|-----------------|--------|---------------------------------|-------------------------|
| `options.fit`   | string | `'width'`, `'height'`, `'both'` | scale: 缩放基准         |
| `options.align` | string | `'center'`, `'top center'`      | scale: 缩放中心点       |
| `options.lock`  | string | `true`, `false`                 | 锁定屏幕方向 (v3)       |

#### Rem Mode
| 参数              | 类型   | 值       | 描述                                |
|-------------------|--------|---------|-------------------------------------|
| `options.px2rem`  | string | `100`   | `100px = 1rem (不建议修改此值)`      |

## 示例 - Use
```javascript
// 缩放模式
keepfit(document.querySelector('#app'), {
    size: [1920, 1080],
    mode: 'scale',
    fit: 'both',
    align: 'center top'
});


// rem模式
// 100px = 1rem，窗口尺寸变化时会自动计算 html 的 font-size 值
keepfit(document.querySelector('#app'), {
    mode: 'rem',
    size: [1920, 1080]
});
```

## 注意 - Tips
- 默认采用缩放模式，此时页面中CSS单位可放心使用px
- 使用rem模式时，`fit`和`align`参数将被忽略，需要按照`100px = 1rem`规则编写css
- 如有疑惑，请参考`samples`目录中的案例