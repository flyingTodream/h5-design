
import { mitation, getter } from 'src/design/store';

const GUIDER_MAX = 10 // / getter.zoom() // 辅助线阈值

export default {
    methods: {
        // 更新缩放比
        updateZoom(h, w) {
            let ch = getter.canvasH();
            let cw = getter.canvasW();
            let zoomX = (w - 140) / cw;
            let zoomY = (h - 140) / ch;
            if (zoomX > zoomY) {
                mitation.setZoom(zoomY);
            } else {
                mitation.setZoom(zoomX);
            }
        },
        // 适应屏幕
        adaptScreen() {
            let el = document.querySelector('#js-container');

            let h = el.clientHeight, w = el.clientWidth;
            this.updateZoom(h, w);
        },
        // 原始尺寸
        acutalSize() {
            mitation.setZoom(1);
        },
        // 重叠检测
        overlap(index) {
            let _this = getter.layout().elements[index];
            let t = _this.top, l = _this.left,
                b = _this.top + _this.height,
                r = _this.left + _this.width;
            let up = [], down = [];
            getter.layout().elements.forEach((item, i) => {
                if (index !== i) {
                    let item_t = item.top, item_r = item.left + item.width,
                        item_b = item.top + item.height, item_l = item.left;
                    if (!(item_r < l || item_l > r || item_b < t || item_t > b)) {
                        if (i < index) {
                            down.push(i)
                        } else {
                            up.push(i)
                        }
                    }
                }
            });
            return {
                up,
                down
            };
        },
        // 辅助线检测(影响性能)
        guider(index = -1) {
            if (index < 0) return
            let W = getter.layout().width, H = getter.layout().height;
            let _this = getter.layout().elements[index];
            let t = _this.top, l = _this.left,
                b = _this.top + _this.height,
                r = _this.left + _this.width,
                CX = W / 2, CY = H / 2,
                cx = l + _this.width / 2, cy = t + _this.height / 2;
            let guiderObj = {};
            // 画布top
            if (Math.abs(t) < GUIDER_MAX) {
                guiderObj['T'] = { t: 0, l: l, r: 0 }
            }
            // 画布left
            if (Math.abs(l) < GUIDER_MAX) {
                guiderObj['L'] = { t: t, l: 0, b: 0 }
            }
            // 画布bottom
            if (Math.abs(b - H) < GUIDER_MAX) {
                guiderObj['B'] = { b: 0, l: l, r: 0 }
            }
            // 画布right
            if (Math.abs(r - W) < GUIDER_MAX) {
                guiderObj['R'] = { r: 0, t: t, b: 0 }
            }
            // 画布cx
            if (Math.abs(cy - CY) < GUIDER_MAX) {
                guiderObj['cx'] = { t: CY, type: 'canvas' }
            }
            // 画布cy
            if (Math.abs(cx - CX) < GUIDER_MAX) {
                guiderObj['cy'] = { l: CX, type: 'canvas' }
            }
            getter.layout().elements.forEach((item, i) => {
                if (index !== i) {
                    let item_t = item.top, item_r = item.left + item.width,
                        item_b = item.top + item.height, item_l = item.left,
                        item_cx = item_l + item.width / 2, item_cy = item_t + item.height / 2;
                    if (!(item_r < l || item_l > r || item_b < t || item_t > b)) {
                        guiderObj = Object.assign({}, guiderObj, this.elementGuider({
                            t, l, b, r, cx, cy
                        }, { t: item_t, l: item_l, b: item_b, r: item_r, cx: item_cx, cy: item_cy }, W, H));
                    }
                }
            });
            mitation.setGuider(guiderObj);
        },
        elementGuider(self, element, W, H) {
            // t,l,b,r
            let t = self.t - element.t,
                l = self.l - element.l,
                b = self.b - element.b,
                r = self.r - element.r,
                cx = self.cx - element.cx,
                cy = self.cy - element.cy;
            let guiderObj = {};
            // top
            if (Math.abs(t) < GUIDER_MAX) {
                guiderObj['T'] = { t: element.t, l: 0, r: 0 }
            }
            // left
            if (Math.abs(l) < GUIDER_MAX) {
                guiderObj['L'] = { t: 0, l: element.l, b: 0 }
            }
            // bottom
            if (Math.abs(b) < GUIDER_MAX) {
                guiderObj['B'] = { b: H - Math.abs(element.b), l: 0, r: 0 }
            }
            // right
            if (Math.abs(r) < GUIDER_MAX) {
                guiderObj['R'] = { t: 0, r: W - Math.abs(element.r), b: 0 }
            }
            // cx
            if (Math.abs(cy) < GUIDER_MAX) {
                guiderObj['cx'] = { t: element.cy }
            }
            // cy
            if (Math.abs(cx) < GUIDER_MAX) {
                guiderObj['cy'] = { l: element.cx }
            }
            return guiderObj;
        },
        selected(e) {
            let current = getter.current();
            if (current.parent !== undefined && current.parent !== -1) {
                let x = e.offsetX, y = e.offsetY;
                let zoom = getter.zoom();
                let widgets = getter.layout().elements[current.id].elements
                let isSelect = true;
                widgets.forEach((item, index) => {
                    let l = item.left * zoom,
                        t = item.top * zoom;
                    let r = l + item.width * zoom,
                        b = t + item.height * zoom;

                    if (x > l && x < r && y > t && y < b) {
                        current.index = index;
                        mitation.setCurrent(
                            current
                        );
                        isSelect = false;
                        return
                    }
                });
                if (isSelect) {
                    current.index = -1;
                    mitation.setCurrent(
                        current
                    );
                }
            }
        },
    }
}