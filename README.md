# KeepFit

指定一个DOM节点，使其按照 **宽度/高度/两者** 为基准的缩放方式，来适应浏览器窗口尺寸。
适用于按照设计图进行前端开发后，进行 **等比** 或 **拉伸** 模式的自适应。

## 引用

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
let keepfit = require('./keepfit')
```

NPM
```bash
npm install keepfit
```

## 文档
```javascript
keepfit(target, options);
```
| 参数            | 类型   | 值                              | 描述                  |
|-----------------|--------|---------------------------------|-----------------------|
| `target`        | object | `document.body`                 | DOM元素节点           |
| `options`       | object | `{ fit, size, align }`          | 参数                  |
| `options.fit`   | string | `'width'`, `'height'`, `'both'` | 缩放模式              |
| `options.size`  | array  | `[1920, 1080]`                  | 设计图尺寸            |
| `options.align` | string | `'center'`, `'top center'`      | 缩放中心点            |


## 示例
```javascript
keepfit(document.querySelector('#app'), {
    fit: 'height',
    size: [1920, 1080],
    align: 'center'
});
```

## 注意
- 请使用`px`作为基本单位
