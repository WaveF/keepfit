# KeepFit

Keep specified DOM element fit the browser size.

## Install
```html
<script src="keepfit.min.js"></script>
```

## Usage
```javascript
keepfit(target, options)
```
| Param           | Type   | Value(s)                        | Description           |
|-----------------|--------|---------------------------------|-----------------------|
| `target`        | object | `document.body`                 | DOM element           |
| `options`       | object | `{ fit, size, align }`          | parameters            |
| `options.fit`   | string | `'width'`, `'height'`, `'both'` | scale mode for target |
| `options.size`  | array  | `[1920, 1080]`                  | size of your design   |
| `options.align` | string | `'center'`, `'top center'`      | transform Origin      |


## Example
```javascript
keepfit(document.querySelector('#app'), {
    fit: 'height',
    size: [1920, 1080],
    align: 'center'
});
```
