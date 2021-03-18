# KeepFit - 可视化大屏自动缩放

## Install
```html
<script src="keepfit.min.js"></script>
```

## Usage
```javascript
keepfit(target, options)
```
| Param  | Type   | Default         | Description |
| ------ | ------ | --------------- | ----------- |
| target | object | `document.body` | ... |
| options.fit | string | `width` | ... |


## Example
```javascript
keepfit(document.querySelector('#app'), {
    fit: 'height',
    size: [1920, 1080],
    align: 'center'
});
```

