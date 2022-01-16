# @banbury/tp-yamlui

Create UIs for Tabletop Playground with YAML.

## Usage

### Installation
```
npm i https://github.com/Banbury/tp-yamlui
```

### Import
```javascript
const { buildUI } = require('@banbury/tp-yamlui');
```

### Creating a UI
Create a file with the extension `.yml` in your `Scripts` folder, e.g `awesome-ui.yml`.
You can load the UI file in you Tabletop Playground file like this:
```javascript
const { buildUI } = require('@banbury/tp-yamlui');

const yaml = tp.world.importText('awesome-ui.yml');

let ui = buildUI(yaml, {});
ui.position = new tp.Vector(0, 0, 80.5);
tp.world.addUI(ui);
```

## YAML Syntax
The YAML files uses the same class and function names as the Tabletop Playground API. All widgets and all functions beginning with `set` and `on` can be used. 
For functions beginning with `set`, omit the `set`. E.g. `setText` becomes `text`.

Refer to the [Tabletop Playground API](https://api.tabletop-playground.com/classes/_api_.widget.html) for possible values.
```yaml
Border:
  color: "#990000"
  child:
    Button:
      text: "Click Me!"
```
This creates a `Border` with a `Button`.
All color values are expected as a string with a [hex color value](https://www.w3schools.com/html/html_colors_hex.asp), e.g. `"#FF00FF"`.

### Border
Border has a special property child, that is equivalent to calling the `addChild` function.
```yaml
Border:
  color: "#990000"
  child:
    Text:
      text: "This is a label."
      textColor: "#00FF00"
```
### Panels
All widgets inheriting from Panel (HorizontalBox, VerticalBox) have a special property `children`, that expects an array of widgets (note the dashes in the example). 
This is equivalent to calling the `addChild` function several times.
```yaml
VerticalBox:
  children:
    - Button:
        text: "Button"
    - TextBox:
        text: "TextBox"
        fontSize: 12
```
### SelectionBox
The selection box has a special property `options`, that expects an array of strings.
```yaml
VerticalBox:
  children:
    - Button:
        text: "Button"
    - TextBox:
        text: "TextBox"
        fontSize: 12
    - SelectionBox:
        options:
          - "one"
          - "two"
          - "three"
        selectedIndex: 2
```
`selectedIndex` has to be placed after the `options`, or it won't have any effect.
### Canvas
Canvas isn't supported yet.
### ImageSize
The property `imageSize` for the widgets `ImageButton` and `ImageWidget` have to be declared as an object with the properties `width` andd `height`.
```yaml
ImageButton:
  imageSize:
    width: 100
    height: 40
```
## Context
### Event handlers
The `buildUI` function has second parameter for a context object. In the context object all event handlers have to be defined.
```javascript
let ui = buildUI(yaml, {
    buttonClicked(self) {
        self.widgets.text1.setText('Hello World!');
    }
});
```
In the YAML file the event handler can be used like this:
```yaml
VerticalBox:
  children:
    - Button:
        text: "Button"
        onClicked: "buttonClicked"
    - TextBox:
        name: "text1"
        text: "TextBox"
        fontSize: 12
```
Notice the `name` property. This is a special property, that adds a reference to a widget to the context.
The widget can then be referenced within the event handler. The first parameter of the event handler holds a reference to the context.

So widgets can be referenced with `self.widgets.<name>`, where `<name>` is the name in the YAML file.
