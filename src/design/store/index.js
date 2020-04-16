import Vue from 'vue';
// import Vuex from 'vuex'
import log from 'src/design/utils/log';
import {
  posterStoreGetHandler,
  posterStoreSetHandler
} from './store';

let poster = posterStoreGetHandler();

import {
  history
} from './undo';

let pasteCount = 0; // 粘贴计数器

let state = window.state = Vue.observable({
  global: {
    dpi: 72,
    unit: 'px',
    zoom: 0.2,
    showWatermark: false
  },
  goodsId: null,
  id: null,
  layout: {
    width: 1242,
    height: 2208,
    title: "新的设计",
    elements: [],
    backgroundColor: '#ffffff',
    backgroundImage: null,
    backgroundImageInfo: {
      opacity: 1,
      width: 100,
      height: 100,
      transform: {
        a: 1,
        b: 0,
        c: 0,
        d: 1,
        tx: 0,
        ty: 0,
      }
    },
    backgroundRepeat: "no-repeat",
    backgroundSize: null,
  },
  // 日志
  undoable: false,
  redoable: false,

  guider: {},
  // 当前选择的部件
  current: {
    id: -1,
    type: 'canvas',
    edit: false
  },

  // 上下文信息
  context: {
    clipBoard: null
  },
  // 背景信息
  backgroundInfo: {
    changed: false,
    backgroundColor: '#ffffff',
    backgroundImage: null,
    backgroundImageInfo: {
      opacity: 1,
      width: 100,
      height: 100,
      transform: {
        a: 1,
        b: 0,
        c: 0,
        d: 1,
        tx: 0,
        ty: 0,
      }
    },
    backgroundRepeat: "no-repeat",
    backgroundSize: null,
  },
  // 图片裁剪
  cutInfo: {
    cutable: false, // 裁剪标识
    zoom: 100, // 裁剪图片缩放比
    toolbarPos: {
      top: 0,
      left: 0
    },
    widget: {
      id: -1,
      top: 0,
      left: 0,
      width: 0,
      height: 0
    }
  },
  mulSelected: false,
  selectedItem: [],
  userInfo: { // 用户信息
    isLogin: false // 是否登录
  }
});



if (poster) {
  Object.keys(state).forEach(key => {
    if (poster[key] !== undefined) {
      state[key] = poster[key]
    }
  });
}

const historys = window.historys = history(state);
historys.initialize(JSON.stringify(state));

function overlap(index) {
  let _this = state.layout.elements[index];
  let t = _this.top,
    l = _this.left,
    b = _this.top + _this.height,
    r = _this.left + _this.width;
  let up = [],
    down = [];
  state.layout.elements.forEach((item, i) => {
    if (index !== i) {
      let item_t = item.top,
        item_r = item.left + item.width,
        item_b = item.top + item.height,
        item_l = item.left;
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
}

const getter = window.getter = {
  zoom: () => {
    return state.global.zoom;
  },
  save: () => {
    return {
      global: state.global,
      layout: state.layout
    }
  },
  global: () => state.global,
  layout: () => state.layout,
  id: () => state.id,
  goodsId: () => state.goodsId,
  template: () => {
    return {
      detail: JSON.stringify({
        global: state.global,
        layout: state.layout
      }),
      name: state.layout.title
    }
  },
  title: () => state.layout.title || "",
  canvasW: () => state.layout.width,
  canvasH: () => state.layout.height,
  undoStatus: () => state.undoable, //historys.canUndo(),
  redoStatus: () => state.redoable, //historys.canRedo(),
  guider: () => state.guider,
  current: () => state.current,
  bgIsInit: () => state.backgroundInfo.changed,
  cutImage: () => state.cutInfo.widget,
  cutable: () => state.cutInfo.cutable,
  cutZoom: () => state.cutInfo.zoom,
  toolbarPos: () => {
    return {
      top: state.cutInfo.toolbarPos.top * state.global.zoom,
      left: state.cutInfo.toolbarPos.left * state.global.zoom
    }
  },
  mulSelected: () => state.mulSelected,
  selectedItem: () => state.selectedItem,
  isGroupable: () => state.selectedItem.length > 0, // 成组
  isSplitable: () => state.current.id > -1 &&
    state.layout.elements[state.current.id].type === 'group', // 拆分

  isLogin: () => state.userInfo.isLogin, // 登录标识
};

const mitation = window.mitation = {
  resetCutZoom() {
    state.cutInfo.zoom = 100
  },
  updateCurrentEdit(val) {
    state.current.edit = val
  },
  updateContent(index, content) {
    state.layout.elements[index].content = content
  },

  changeSize(index, w, h) {
    if (index != -1) {
      state.layout.elements[index].width = w
      state.layout.elements[index].height = h
    }

  },
  resetCurrent() {
    state.current.id = -1
    state.current.type = 'canvas'
  },
  setLoginState(val) {
    state.userInfo.isLogin = val
  },
  // 设置缩放比
  setZoom(zoom) {
    state.global.zoom = zoom
  },
  setId(id) {
    state.id = id;
  },
  // 设置模板
  async setTemplate(template, id) {
    state.goodsId = id
    state.global = template.global
    // state.global.showWatermark = template.global.showWatermark || true
    state.global.dpi = template.global.dpi || 72
    state.layout = template.hasOwnProperty('layouts') ? template.layouts[0] : template.layout

    this.initBgInfo()
    await posterStoreSetHandler({
      global: state.global,
      layout: state.layout,
      current: state.current,
      backgroundInfo: state.backgroundInfo,
      goodsId: state.goodsId,
      id: state.id
    });
    historys.initialize(JSON.stringify(state));

  },
  // 设置画布宽度
  setCanvasW(w) {
    state.layout.width = w;
  },
  // 设置画布高度
  setCanvasH(h) {
    state.layout.height = h;
  },
  // 设置画布大小
  setCanvasSize(w, h) {
    state.layout.width = w;
    state.layout.height = h;
  },
  // 设置标题
  setTitle(title) {
    state.layout.title = title || ''
  },
  // 更新位置
  updateTransformPosition(index, data) {
    state.layout.elements[index].top = data.top / state.global.zoom;
    state.layout.elements[index].left = data.left / state.global.zoom;
  },
  // 更新大小
  _updateTransformSize(index, data) {
    state.layout.elements[index].width = data.width / state.global.zoom;
    state.layout.elements[index].height = data.height / state.global.zoom;
    if (data.left) {
      state.layout.elements[index].left = data.left / state.global.zoom;
    }
    if (data.top) {
      state.layout.elements[index].top = data.top / state.global.zoom;
    }
  },
  // 更新旋转角度
  updateTransformRotate(index, data) {
    state.layout.elements[index].transform = data;
  },
  updateWidgetSize(index, type, data) {
    if (type === "transform") {
      this._updateTransformSize(index, data);
    }
  },
  setHistoryState() {
    state.redoable = historys.canRedo();
    state.undoable = historys.canUndo();
    // 写入sessionStorage
    posterStoreSetHandler({
      global: state.global,
      layout: state.layout,
      current: state.current,
      backgroundInfo: state.backgroundInfo,
      goodsId: state.goodsId,
      id: state.id
    });
  },
  // 记录步骤
  setLogger() {
    log.primary('>>>>>>>logger>>>>>>>>>')
    historys.save();
    this.setHistoryState();
  },
  // 撤销
  setUndo() {
    historys.undo(data => {
      let obj = JSON.parse(data);
      state.layout = obj.layout;
      state.global = obj.global;
      state.current = obj.current;
      this.setHistoryState();
    })
  },
  // 重做
  setRedo() {
    historys.redo(data => {
      let obj = JSON.parse(data);
      state.layout = obj.layout;
      state.global = obj.global;
      state.current = obj.current;
      this.setHistoryState();
    })
  },
  // 辅助线
  setGuider(data) { // 设置辅助线位置信息
    state.guider = data;
  },
  // 图层顺序
  // 移到顶层
  moveTop(oldIndex) {
    let el = state.layout.elements.splice(oldIndex, 1); // 截取当前图层
    let id = state.layout.elements.length;
    state.layout.elements.push(...el); // 将当前图层移至图层顶部
    state.current.id = id; // 更新当前图层id
    state.current.over = overlap(id); // 更新当前图层的重叠图层
    this.setLogger(); // 记录日志
  },
  // 移到底层
  moveBottom(oldIndex) {
    let el = state.layout.elements.splice(oldIndex, 1); // 截取当前图层
    state.layout.elements = [...el, ...state.layout.elements]; // 将当前图层移至图层底部
    state.current.id = 0; // 更新当前图层id
    state.current.over = overlap(0); // 更新当前图层的重叠图层
    this.setLogger(); // 记录日志
  },
  // 上移一层
  moveUp(oldIndex, newIndex) {
    let id = newIndex;
    let oldVal = state.layout.elements[oldIndex]; // 截取当前图层
    let len = state.layout.elements.length - 1; // 获取图层大小
    state.layout.elements.splice(oldIndex, 1); // 截取当前图层
    if (newIndex === len) { // 新的图层位置是尾部时，后置push
      state.layout.elements.push(oldVal);
    } else { // 在新的位置插入当前图层
      state.layout.elements.splice(newIndex, 0, oldVal);
    }
    state.current.id = id; // 更新当前图层id
    state.current.over = overlap(id); // 更新当前图层的重叠图层
    this.setLogger(); // 记录日志
  },
  // 下移一层
  moveDown(oldIndex, newIndex) {
    let id = newIndex;
    let oldVal = state.layout.elements[oldIndex]; // 截取当前图层
    state.layout.elements.splice(oldIndex, 1); // 移除当前图层
    if (newIndex < 1) { // 新的图层位置是零时，前置push
      state.layout.elements.unshift(oldVal);
    } else { // 在新的位置插入当前图层
      state.layout.elements.splice(newIndex, 0, oldVal);
    }
    state.current.id = id; // 更新当前图层id
    state.current.over = overlap(id); // 更新当前图层的重叠图层
    this.setLogger(); // 记录日志
  },
  // 锁定图层
  lockWidget(index) {
    state.layout.elements[index].lock = !state.layout.elements[index].lock;
  },
  // 添加文字
  addText(data) {
    state.layout.elements.push(data);
    this.setLogger();
  },
  addImage(data) {
    state.layout.elements.push(data);
    this.setLogger();
  },
  // 修改图片
  updateImg(parent, index, url) {
    if (parent === -1) {
      state.layout.elements[index].url = url;
    } else {
      state.layout.elements[parent].elements.url = url;
    }
  },
  // 设置当前选中图层
  setCurrent(data) {
    state.current = data;
  },

  // 上下文菜单事件处理
  // 复制
  copyEvent() {
    let index = state.current.id;
    if (index < 0) return // index<0时不是图层
    state.context.clipBoard = JSON.stringify( //防止出现引用
      state.layout.elements[index]
    );
    pasteCount = 0;
  },
  // 剪切
  cutEvent() {
    let index = state.current.id;
    if (index < 0) return; // index<0时不是图层
    state.context.clipBoard = JSON.stringify(
      state.layout.elements[index]
    );
    pasteCount = 0;
    state.layout.elements.splice(index, 1);
  },
  // 粘贴
  pasteEvent() {
    if (state.context.clipBoard) { // 剪切板存在内容时执行粘贴操作
      let el = JSON.parse(state.context.clipBoard);
      pasteCount++;
      el.top += 20 * pasteCount; // 改变新图层位置
      el.left += 20 * pasteCount;
      state.layout.elements.push(el);
      let id = state.layout.elements.length - 1;
      state.current = {
        id: id,
        type: 'widget',
        over: overlap(id)
      }
    }
  },
  // 背景设置
  // 保存原始背景信息
  initBgInfo() {
    if (state.layout.backgroundColor) {
      state.backgroundInfo.backgroundColor = state.layout.backgroundColor;
    }
    if (state.layout.backgroundImage) {
      state.backgroundInfo.backgroundImage = state.layout.backgroundImage;
    }
    if (state.layout.backgroundImageInfo) {
      state.backgroundInfo.backgroundImageInfo = Object.assign({}, state.layout.backgroundImageInfo);
    }
    if (state.layout.backgroundRepeat) {
      state.backgroundInfo.backgroundRepeat = state.layout.backgroundRepeat;
    }
    if (state.layout.backgroundSize) {
      state.backgroundInfo.backgroundSize = state.layout.backgroundSize;
    }
    state.backgroundInfo.changed = false;
  },
  // 重置背景信息
  resetBgInfo() {
    state.layout.backgroundColor = state.backgroundInfo.backgroundColor;
    state.layout.backgroundImage = state.backgroundInfo.backgroundImage;
    state.layout.backgroundImageInfo = Object.assign({}, state.backgroundInfo.backgroundImageInfo);
    state.layout.backgroundRepeat = state.backgroundInfo.backgroundRepeat;
    state.layout.backgroundSize = state.backgroundInfo.backgroundSize;
    state.backgroundInfo.changed = false;
  },
  // 设置背景颜色
  setBgColor(color) {
    state.layout.backgroundColor = color;
    state.backgroundInfo.changed = true;
  },
  // 设置背景图片信息(左侧面板选择)
  setBgImg(data) {
    let info = JSON.parse(data);
    state.layout = Object.assign({}, state.layout, info.layout || {});
    state.backgroundInfo.changed = true;
  },
  setbackgroundImage(url) {
    state.layout.backgroundImage = url
  },
  initImgCut() {
    if (state.current.id < 0) {
      state.cutInfo.widget = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      };
      return
    }
    let widget = state.layout.elements[state.current.id];
    if (widget && ['image', 'mask'].includes(widget.type)) {
      let clip = widget.clip || {}
      state.cutInfo.widget = {
        top: clip.top || 0,
        left: clip.left || 0,
        l: widget.left,
        t: widget.top,
        height: widget.originHeight || widget.height,
        width: widget.originWidth || widget.width,
        w: widget.width,
        h: widget.height,
        url: widget.url,
        id: state.current.id
      };
    } else {
      state.cutInfo.widget = null;
    }
  },
  setWidgetCutImageInfo() {
    let info = state.cutInfo.widget;
    if (info.id >= 0) {
      state.layout.elements[info.id].clip = Object.assign({},
        state.layout.elements[info.id].clip || {}, {
        top: info.top,
        left: info.left,
        width: info.height * state.cutInfo.zoom / 100,
        height: info.width * state.cutInfo.zoom / 100
      }
      );
    } else {
      state.layout.backgroundImageInfo = Object.assign({},
        state.layout.backgroundImageInfo || {}, {
        top: info.top,
        left: info.left,
        width: info.height * state.cutInfo.zoom / 100,
        height: info.width * state.cutInfo.zoom / 100
      }
      );
    }
  },
  // 设置是否开始图片裁剪
  setCutable(able) {
    state.cutInfo.cutable = able;
    if (able) {
      this.initImgCut();
    }

  },
  setCutBackgroundAble(able) {
    state.cutInfo.cutable = able;
    if (able) {
      // this.resetCutZoom()
      this.initBackgroundCut();
    }

  },
  initBackgroundCut() {
    let background = state.layout;
    if (!state.cutInfo.originHeight) {
      state.cutInfo.originHeight = background.backgroundImageInfo.height
      state.cutInfo.originWidth = background.backgroundImageInfo.width
    }
    state.cutInfo.widget = {
      top: background.backgroundImageInfo.top || 0,
      left: background.backgroundImageInfo.left || 0,
      l: 0,
      t: 0,
      height: state.cutInfo.originWidth || background.backgroundImageInfo.height,
      width: state.cutInfo.originWidth || background.backgroundImageInfo.width,
      w: background.width,
      h: background.height,
      url: background.backgroundImage
    };
  },
  setCutOk() {
    this.setCutable(false);
    this.setWidgetCutImageInfo();
  },
  setCutCancel() {
    this.setCutable(false);
  },
  // 设置裁剪缩放比
  setCutZoom(zoom) {
    state.cutInfo.zoom = zoom;
  },
  // 设置工具条位置信息
  setCutToolbar(pos) {
    state.cutInfo.toolbarPos = pos;
  },
  // 设置裁剪信息
  setCutImageInfo(data) {
    state.cutInfo.widget = Object.assign({}, state.cutInfo.widget, data);
  },

  restoreBgTransform() {
    if (!state.layout.backgroundImageInfo.transform) {
      let transform = {
        transform: {
          a: 1,
          b: 0,
          c: 0,
          d: 1,
          tx: 0,
          ty: 0,
        }
      }
      state.layout.backgroundImageInfo = Object.assign({}, state.layout.backgroundImageInfo, transform)
    }
  },
  //水平翻转
  rotateBgY() {
    this.restoreBgTransform()
    state.layout.backgroundImageInfo.transform.a = -state.layout.backgroundImageInfo.transform.a
    state.layout.backgroundImageInfo.transform.b = -state.layout.backgroundImageInfo.transform.b

  },
  //垂直翻转
  rotateBgX() {
    this.restoreBgTransform()
    state.layout.backgroundImageInfo.transform.c = -state.layout.backgroundImageInfo.transform.c
    state.layout.backgroundImageInfo.transform.d = -state.layout.backgroundImageInfo.transform.d
  },

  setMulSelected(flag) {
    state.mulSelected = flag;
  },
  setSelectedItem(arr) {
    state.selectedItem = arr;
  },
  setGroup() {
    this.setLogger();
    let arr = [],
      t_arr = [],
      l_arr = [],
      r_arr = [],
      b_arr = [];
    state.selectedItem.forEach(item => {
      let element = Object.assign({}, state.layout.elements[item]);
      if (element.type === 'group') { // 拆分已有组合
        element.elements.forEach(item => {
          item.left += element.left;
          item.top += element.top;
        });
        arr.push(...element);
      } else {
        arr.push(Object.assign({}, element));
      }

      let _t = element.top,
        _l = element.left,
        _w = element.width,
        _h = element.height;
      t_arr.push(_t);
      l_arr.push(_l);
      r_arr.push(_l + _w);
      b_arr.push(_t + _h);
    });
    let t = t_arr.sort((a, b) => a - b)[0]; // top最小值
    let l = l_arr.sort((a, b) => a - b)[0]; // left最小值
    let w = r_arr.sort((a, b) => b - a)[0] - l; // width最大值
    let h = b_arr.sort((a, b) => b - a)[0] - t; // height最大值
    let obj = {
      "type": "group",
      "category": "",
      "opacity": 1,
      "padding": [0, 0, 0, 0],
      "width": w,
      "height": h,
      "left": l,
      "top": t,
      "transform": {
        "a": 1,
        "b": 0,
        "c": 0,
        "d": 1,
        "tx": 0,
        "ty": 0
      },
      "boxShadow": null,
      "resize": 1,
      "dragable": true,
      "rotatable": true,
      "editable": true,
      "frozen": false,
      "hidden": false,
      "lock": false,
      "borderRadius": 0,
      "filter": {
        "hueRotate": 0,
        "saturate": 0,
        "brightness": 0,
        "gaussianBlur": 0
      },
      "elements": arr,
      "autoGrow": false,
      "canCollapse": true,
      "letterSpacing": -50,
      "lineHeight": 1
    };
    obj.elements.forEach(item => { // 重新计算子元素相对于组的位置
      item.top -= obj.top;
      item.left -= obj.left;
    });
    let elements = [];
    state.layout.elements.forEach((item, index) => {
      if (!state.selectedItem.includes(index)) { // 获取未组合的元素
        elements.push(Object.assign({}, item));
      }
    });
    state.layout.elements = elements;
    state.layout.elements.push(obj);
    state.selectedItem = [];
    state.current = {

      id: state.layout.elements.length - 1,
      type: 'group'
    }
    this.setLogger();
  },
  setSplit() {
    this.setLogger();
    let el = Object.assign({}, state.layout.elements[state.current.id]);
    el.elements.forEach(item => { // 重新计算元素相对于画布的位置
      item.left += el.left;
      item.top += el.top;
    });
    state.layout.elements.splice(state.current.id, 1, ...el.elements);
    state.current = {
      id: -1,
      type: 'canvas'
    }
    this.setLogger();
  },
  setWaterMask(flag) {
    state.global.showWatermark = flag;
  },
  resetLayout() {
    state.layout.elements = [...[]]
    state.layout.height = 2208
    state.layout.width = 1242
    state.layout.backgroundColor = '#ffffffff'
    state.layout.backgroundImage = null
    state.layout.backgroundImageInfo = Object.assign({})
    this.restoreBgTransform()
  },
  changeImgUrl(url, index) {
    state.layout.elements[index].url = url
  }
};

export {
  state,
  getter,
  mitation
}
