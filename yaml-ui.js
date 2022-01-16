const tp = require('@tabletop-playground/api');
const yaml = require('js-yaml');

function buildUI(def, context) {
    context.widgets = {}
    const doc = yaml.load(def, 'utf8');
    let ui = new tp.UIElement();
    ui.widget = createWidget(doc, context);
    return ui;
}

function createWidget(w, context) {
    let key = Object.keys(w)[0];
    let widget = new tp[key]();

    props = Object.keys(w[key]);
    props.forEach(p => {
        let val = w[key][p];
        if (p === 'name') {
            context.widgets[val] = widget;
        } else if (p.startsWith('on')) {
            widget[p].add(() => context[val](context));
        } else if (p === 'options') {
            val.forEach(o => widget.addOption(o));
        } else {
            let f = "set" + cap(p);
            if (f in widget) {
                if (typeof val === 'object') {
                    if (p === 'imageSize') {
                        widget.setImageSize(val.width, val.height);
                    } else {
                        widget[f](createWidget(val, context));
                    }
                } else {
                    if (typeof val === 'string' && val.startsWith('#')) {
                        val = parseInt(val.substring(1), 16);
                        val = new tp.Color(((val >> 16) & 0xff) / 255, ((val >> 8) & 0xff) / 255, (val & 0xff) / 255);
                    }
                    widget[f](val);
                }
            }
        }
    });

    if (w[key]['children'] !== null && Array.isArray((w[key]['children']))) {
        w[key]['children'].forEach(it => widget.addChild(createWidget(it, context)));
    }

    return widget;
}

function cap(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

module.exports = buildUI;