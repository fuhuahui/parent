webpackJsonp([24],[
/* 0 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__(46)('wks');
var uid = __webpack_require__(31);
var Symbol = __webpack_require__(0).Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

var core = module.exports = { version: '2.5.3' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),
/* 3 */,
/* 4 */
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file.
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate

    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 5 */,
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(12);
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),
/* 7 */,
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(6);
var IE8_DOM_DEFINE = __webpack_require__(70);
var toPrimitive = __webpack_require__(43);
var dP = Object.defineProperty;

exports.f = __webpack_require__(13) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),
/* 9 */,
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(0);
var core = __webpack_require__(2);
var ctx = __webpack_require__(19);
var hide = __webpack_require__(11);
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && key in exports) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(8);
var createDesc = __webpack_require__(21);
module.exports = __webpack_require__(13) ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(20)(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 14 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(74);
var defined = __webpack_require__(41);
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),
/* 16 */,
/* 17 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(132)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction) {
  isProduction = _isProduction

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[data-vue-ssr-id~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(29);
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = {};


/***/ }),
/* 23 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getIterator2 = __webpack_require__(145);

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _typeof2 = __webpack_require__(54);

var _typeof3 = _interopRequireDefault(_typeof2);

var _axios = __webpack_require__(57);

var _axios2 = _interopRequireDefault(_axios);

var _env = __webpack_require__(95);

var _env2 = _interopRequireDefault(_env);

var _semver = __webpack_require__(181);

var _semver2 = _interopRequireDefault(_semver);

var _package = __webpack_require__(182);

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var util = {};
util.title = function (title) {
    title = title || 'Fastjee';
    window.document.title = title;
};


util.inOf = function (arr, targetArr) {
    var res = true;
    arr.forEach(function (item) {
        if (targetArr.indexOf(item) < 0) {
            res = false;
        }
    });
    return res;
};

util.oneOf = function (ele, targetArr) {
    if (targetArr.indexOf(ele) >= 0) {
        return true;
    } else {
        return false;
    }
};

util.showThisRoute = function (itAccess, currentAccess) {
    if ((typeof itAccess === 'undefined' ? 'undefined' : (0, _typeof3.default)(itAccess)) === 'object' && Array.isArray(itAccess)) {
        return util.oneOf(currentAccess, itAccess);
    } else {
        return itAccess === currentAccess;
    }
};

util.getRouterObjByName = function (routers, name) {
    if (!name || !routers || !routers.length) {
        return null;
    }

    var routerObj = null;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = (0, _getIterator3.default)(routers), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var item = _step.value;

            if (item.name === name) {
                return item;
            }
            routerObj = util.getRouterObjByName(item.children, name);
            if (routerObj) {
                return routerObj;
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return null;
};

util.setCurrentPath = function (vm, name) {
    var title = '';
    var currentPathArr = [];
    if (name === 'home_index') {
        currentPathArr = [{
            title: '??????',
            path: '',
            name: 'home_index'
        }];
    } else if (name.indexOf('_index') >= 0 && name !== 'home_index') {
        currentPathArr = [{
            title: '??????',
            path: '/home',
            name: 'home_index'
        }, {
            title: title,
            path: '',
            name: name
        }];
    } else {
        var currentPathObj = vm.$store.getters.permissionRouters.filter(function (item) {
            if (item.children.length <= 1) {
                return item.children[0].name === name;
            } else {
                var i = 0;
                var childArr = item.children;
                var len = childArr.length;
                while (i < len) {
                    if (childArr[i].name === name) {
                        return true;
                    }
                    i++;
                }
                return false;
            }
        })[0];
        if (currentPathObj.children.length <= 1 && currentPathObj.name === 'home') {
            currentPathArr = [{
                title: '??????',
                path: '',
                name: 'home_index'
            }];
        } else if (currentPathObj.children.length <= 1 && currentPathObj.name !== 'home') {
            currentPathArr = [{
                title: '??????',
                path: '/home',
                name: 'home_index'
            }, {
                title: currentPathObj.title,
                path: '',
                name: name
            }];
        } else {
            var childObj = currentPathObj.children.filter(function (child) {
                return child.name === name;
            })[0];
            currentPathArr = [{
                title: '??????',
                path: '/home',
                name: 'home_index'
            }, {
                title: currentPathObj.title,
                path: '',
                name: currentPathObj.name
            }, {
                title: childObj.title,
                path: currentPathObj.path + '/' + childObj.path,
                name: name
            }];
        }
    }
    vm.$store.commit('setCurrentPath', currentPathArr);

    return currentPathArr;
};

util.openNewPage = function (vm, name, argu, query) {
    var pageOpenedList = vm.$store.state.app.pageOpenedList;
    var openedPageLen = pageOpenedList.length;
    var i = 0;
    var tagHasOpened = false;
    while (i < openedPageLen) {
        if (name === pageOpenedList[i].name) {
            vm.$store.commit('pageOpenedList', {
                index: i,
                argu: argu,
                query: query
            });
            tagHasOpened = true;
            break;
        }
        i++;
    }
    if (!tagHasOpened) {
        var tag = vm.$store.state.app.tagsList.filter(function (item) {
            if (item.children) {
                return name === item.children[0].name;
            } else {
                return name === item.name;
            }
        });
        tag = tag[0];
        if (tag) {
            tag = tag.children ? tag.children[0] : tag;
            if (argu) {
                tag.argu = argu;
            }
            if (query) {
                tag.query = query;
            }
            vm.$store.commit('increateTag', tag);
        }
    }
    vm.$store.commit('setCurrentPageName', name);
};

util.toDefaultPage = function (routers, name, route, next) {
    var len = routers.length;
    var i = 0;
    var notHandle = true;
    while (i < len) {
        if (routers[i].name === name && routers[i].children && routers[i].redirect === undefined) {
            route.replace({
                name: routers[i].children[0].name
            });
            notHandle = false;
            next();
            break;
        }
        i++;
    }
    if (notHandle) {
        next();
    }
};

util.fullscreenEvent = function (vm) {
    vm.$store.commit('initCachepage');
};

util.checkUpdate = function (vm) {
    _axios2.default.get('https://api.github.com/repos/iview/iview-admin/releases/latest').then(function (res) {
        var version = res.data.tag_name;
        vm.$Notice.config({
            duration: 0
        });
        if (_semver2.default.lt(_package2.default.version, version)) {
            vm.$Notice.info({
                title: 'iview-admin?????????',
                desc: '<p>iView-admin????????????' + version + '?????????????????????????????????</p><a style="font-size:13px;" href="https://github.com/iview/iview-admin/releases" target="_blank">??????github??????</a>'
            });
        }
    });
};

exports.default = util;

/***/ }),
/* 25 */,
/* 26 */,
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at = __webpack_require__(120)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(69)(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});


/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = true;


/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__(73);
var enumBugKeys = __webpack_require__(47);

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),
/* 31 */
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(8).f;
var has = __webpack_require__(14);
var TAG = __webpack_require__(1)('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),
/* 33 */,
/* 34 */
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(187), __esModule: true };

/***/ }),
/* 39 */,
/* 40 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),
/* 41 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(12);
var document = __webpack_require__(0).document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(12);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(40);
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(46)('keys');
var uid = __webpack_require__(31);
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(0);
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});
module.exports = function (key) {
  return store[key] || (store[key] = {});
};


/***/ }),
/* 47 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(41);
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(78);
var ITERATOR = __webpack_require__(1)('iterator');
var Iterators = __webpack_require__(22);
module.exports = __webpack_require__(2).getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.asyncRouterMap = exports.commonRouterMap = undefined;

var _vue = __webpack_require__(5);

var _vue2 = _interopRequireDefault(_vue);

var _vueRouter = __webpack_require__(80);

var _vueRouter2 = _interopRequireDefault(_vueRouter);

var _Main = __webpack_require__(129);

var _Main2 = _interopRequireDefault(_Main);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vue2.default.use(_vueRouter2.default);

var commonRouterMap = exports.commonRouterMap = [{ path: '/login', name: 'login', meta: { title: '???????????? - Fastjee' }, component: function component() {
        return __webpack_require__.e/* import() */(6).then(__webpack_require__.bind(null, 264));
    } }, { path: '/locking', name: 'locking', meta: { title: '??????????????? - Fastjee' }, component: function component() {
        return __webpack_require__.e/* import() */(10).then(__webpack_require__.bind(null, 265));
    } }, { path: '/403', name: 'error-403', meta: { title: '403 - ????????????' }, component: function component() {
        return __webpack_require__.e/* import() */(21).then(__webpack_require__.bind(null, 266));
    } }, { path: '/500', name: 'error-500', meta: { title: '403 - ????????????' }, component: function component() {
        return __webpack_require__.e/* import() */(19).then(__webpack_require__.bind(null, 267));
    } }, { path: '/404', name: 'error-404', meta: { title: '404 - ???????????????' }, component: function component() {
        return __webpack_require__.e/* import() */(20).then(__webpack_require__.bind(null, 268));
    } }, {
    path: '/',
    name: 'home',
    redirect: '/home',
    component: _Main2.default,
    hidden: true,
    children: [{ path: 'home', title: { i18n: 'home' }, name: 'home_index', component: function component() {
            return __webpack_require__.e/* import() */(1).then(__webpack_require__.bind(null, 269));
        } }]
}];

exports.default = new _vueRouter2.default({
    scrollBehavior: function scrollBehavior() {
        return { y: 0 };
    },
    routes: commonRouterMap
});
var asyncRouterMap = exports.asyncRouterMap = [{
    path: '/system',
    icon: 'gear-b',
    name: 'systemManager',
    title: '????????????',
    component: _Main2.default,
    children: [{
        path: 'userManager',
        icon: 'person-stalker',
        name: 'userManager',
        title: '????????????',
        component: function component() {
            return __webpack_require__.e/* import() */(16).then(__webpack_require__.bind(null, 270));
        }
    }, {
        path: 'roleManager',
        icon: 'social-buffer',
        name: 'roleManager',
        title: '????????????',
        component: function component() {
            return __webpack_require__.e/* import() */(0/* duplicate */).then(__webpack_require__.bind(null, 39));
        }
    }, {
        path: 'resourceManager',
        icon: 'navicon-round',
        name: 'resourceManager',
        title: '????????????',
        component: function component() {
            return __webpack_require__.e/* import() */(0/* duplicate */).then(__webpack_require__.bind(null, 39));
        }
    }, {
        path: 'sectionManager',
        icon: 'network',
        name: 'sectionManager',
        title: '????????????',
        component: function component() {
            return __webpack_require__.e/* import() */(0/* duplicate */).then(__webpack_require__.bind(null, 39));
        }
    }]
}, {
    path: '/examples',
    icon: 'social-buffer',
    name: 'iview-examples',
    title: 'iView????????????',
    component: _Main2.default,
    children: [{
        path: 'text-editor',
        icon: 'compose',
        name: 'text-editor',
        title: '??????????????????',
        component: function component() {
            return __webpack_require__.e/* import() */(0/* duplicate */).then(__webpack_require__.bind(null, 39));
        }
    }, {
        path: 'md-editor',
        icon: 'pound',
        name: 'md-editor',
        title: 'Markdown?????????',
        component: function component() {
            return __webpack_require__.e/* import() */(2).then(__webpack_require__.bind(null, 271));
        }
    }, {
        path: 'image-editor',
        icon: 'crop',
        name: 'image-editor',
        title: '??????????????????',
        component: function component() {
            return __webpack_require__.e/* import() */(5).then(__webpack_require__.bind(null, 272));
        }
    }, {
        path: 'draggable-list',
        icon: 'arrow-move',
        name: 'draggable-list',
        title: '???????????????',
        component: function component() {
            return __webpack_require__.e/* import() */(12).then(__webpack_require__.bind(null, 273));
        }
    }, {
        path: 'area-linkage',
        icon: 'ios-more',
        name: 'area-linkage',
        title: '????????????',
        component: function component() {
            return __webpack_require__.e/* import() */(13).then(__webpack_require__.bind(null, 274));
        }
    }, {
        path: 'file-upload',
        icon: 'android-upload',
        name: 'file-upload',
        title: '????????????',
        component: function component() {
            return __webpack_require__.e/* import() */(17).then(__webpack_require__.bind(null, 275));
        }
    }, {
        path: 'count-to',
        icon: 'arrow-graph-up-right',
        name: 'count-to',
        title: '????????????',
        component: function component() {
            return __webpack_require__.e/* import() */(8).then(__webpack_require__.bind(null, 276));
        }
    }, {
        path: 'split-pane-page',
        icon: 'ios-pause',
        name: 'split-pane-page',
        title: 'split-pane',
        component: function component() {
            return __webpack_require__.e/* import() */(4).then(__webpack_require__.bind(null, 277));
        }
    }, {
        path: 'artical-publish',
        title: '????????????',
        name: 'artical-publish',
        icon: 'compose',
        component: function component() {
            return __webpack_require__.e/* import() */(14).then(__webpack_require__.bind(null, 278));
        }
    }, {
        path: 'workflow',
        title: '?????????',
        name: 'workflow',
        icon: 'arrow-swap',
        component: function component() {
            return __webpack_require__.e/* import() */(18).then(__webpack_require__.bind(null, 279));
        }
    }, {
        path: 'dragableTable',
        title: '?????????????????????',
        name: 'dragable-table',
        icon: 'arrow-move',
        component: function component() {
            return __webpack_require__.e/* import() */(7).then(__webpack_require__.bind(null, 280));
        }
    }, {
        path: 'editableTable',
        title: '???????????????',
        name: 'editable-table',
        icon: 'edit',
        component: function component() {
            return __webpack_require__.e/* import() */(3).then(__webpack_require__.bind(null, 281));
        }
    }, {
        path: 'searchableTable',
        title: '???????????????',
        name: 'searchable-table',
        icon: 'search',
        component: function component() {
            return __webpack_require__.e/* import() */(11).then(__webpack_require__.bind(null, 282));
        }
    }, {
        path: 'exportableTable',
        title: '??????????????????',
        name: 'exportable-table',
        icon: 'code-download',
        component: function component() {
            return __webpack_require__.e/* import() */(9).then(__webpack_require__.bind(null, 283));
        }
    }, {
        path: 'table2image',
        title: '???????????????',
        name: 'table-to-image',
        icon: 'images',
        component: function component() {
            return __webpack_require__.e/* import() */(15).then(__webpack_require__.bind(null, 284));
        }
    }, {
        path: 'mutative-router',
        title: '????????????',
        name: 'mutative-router',
        icon: 'link',
        component: function component() {
            return __webpack_require__.e/* import() */(22).then(__webpack_require__.bind(null, 285));
        }
    }, {
        path: 'argument-page',
        title: '????????????111',
        name: 'argument-page',
        icon: 'android-send',
        component: function component() {
            return __webpack_require__.e/* import() */(23).then(__webpack_require__.bind(null, 286));
        }
    }]
}];

/***/ }),
/* 51 */
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),
/* 52 */,
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(147);
var global = __webpack_require__(0);
var hide = __webpack_require__(11);
var Iterators = __webpack_require__(22);
var TO_STRING_TAG = __webpack_require__(1)('toStringTag');

var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
  'TextTrackList,TouchList').split(',');

for (var i = 0; i < DOMIterables.length; i++) {
  var NAME = DOMIterables[i];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _iterator = __webpack_require__(151);

var _iterator2 = _interopRequireDefault(_iterator);

var _symbol = __webpack_require__(153);

var _symbol2 = _interopRequireDefault(_symbol);

var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

exports.f = __webpack_require__(1);


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(0);
var core = __webpack_require__(2);
var LIBRARY = __webpack_require__(28);
var wksExt = __webpack_require__(55);
var defineProperty = __webpack_require__(8).f;
module.exports = function (name) {
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
};


/***/ }),
/* 57 */,
/* 58 */,
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(203), __esModule: true };

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 25.4.1.5 NewPromiseCapability(C)
var aFunction = __webpack_require__(29);

function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
}

module.exports.f = function (C) {
  return new PromiseCapability(C);
};


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getToken = getToken;
exports.getRefreshToken = getRefreshToken;
exports.setToken = setToken;
exports.removeToken = removeToken;

var _jsCookie = __webpack_require__(26);

var _jsCookie2 = _interopRequireDefault(_jsCookie);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var accessTokenKey = 'FASTJEE_ACCESS_TOKEN';
var refreshTokenKey = 'FASTJEE_REFRESH_TOKEN';

function getToken() {
    return _jsCookie2.default.get(accessTokenKey);
}

function getRefreshToken() {
    return _jsCookie2.default.get(refreshTokenKey);
}

function setToken(token, refToken) {
    _jsCookie2.default.set(accessTokenKey, token);
    _jsCookie2.default.set(refreshTokenKey, refToken);
}

function removeToken() {
    _jsCookie2.default.remove(accessTokenKey);
    _jsCookie2.default.remove(refreshTokenKey);
}

/***/ }),
/* 62 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(5);
// using with vue-i18n in CDN
/*eslint-disable */

const isServer = __WEBPACK_IMPORTED_MODULE_0_vue__["default"].prototype.$isServer;

/* harmony default export */ __webpack_exports__["a"] = (function (lang) {
    if (!isServer) {
        if (typeof window.iview !== 'undefined') {
            if (!('langs' in iview)) {
                iview.langs = {};
            }
            iview.langs[lang.i.locale] = lang;
        }
    }
});;
/*eslint-enable */

/***/ }),
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _from = __webpack_require__(116);

var _from2 = _interopRequireDefault(_from);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  } else {
    return (0, _from2.default)(arr);
  }
};

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__(28);
var $export = __webpack_require__(10);
var redefine = __webpack_require__(71);
var hide = __webpack_require__(11);
var has = __webpack_require__(14);
var Iterators = __webpack_require__(22);
var $iterCreate = __webpack_require__(121);
var setToStringTag = __webpack_require__(32);
var getPrototypeOf = __webpack_require__(125);
var ITERATOR = __webpack_require__(1)('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = (!BUGGY && $native) || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && !has(IteratorPrototype, ITERATOR)) hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(13) && !__webpack_require__(20)(function () {
  return Object.defineProperty(__webpack_require__(42)('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(11);


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__(6);
var dPs = __webpack_require__(122);
var enumBugKeys = __webpack_require__(47);
var IE_PROTO = __webpack_require__(45)('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(42)('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(75).appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(14);
var toIObject = __webpack_require__(15);
var arrayIndexOf = __webpack_require__(123)(false);
var IE_PROTO = __webpack_require__(45)('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(23);
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__(0).document;
module.exports = document && document.documentElement;


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__(6);
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators = __webpack_require__(22);
var ITERATOR = __webpack_require__(1)('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(23);
var TAG = __webpack_require__(1)('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR = __webpack_require__(1)('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};


/***/ }),
/* 80 */,
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = __webpack_require__(82);

var _extends3 = _interopRequireDefault(_extends2);

var _vuex = __webpack_require__(52);

var _logo = __webpack_require__(84);

var _shrinkableMenu = __webpack_require__(136);

var _shrinkableMenu2 = _interopRequireDefault(_shrinkableMenu);

var _tagsPageOpened = __webpack_require__(184);

var _tagsPageOpened2 = _interopRequireDefault(_tagsPageOpened);

var _breadcrumbNav = __webpack_require__(189);

var _breadcrumbNav2 = _interopRequireDefault(_breadcrumbNav);

var _fullscreen = __webpack_require__(191);

var _fullscreen2 = _interopRequireDefault(_fullscreen);

var _lockscreen = __webpack_require__(193);

var _lockscreen2 = _interopRequireDefault(_lockscreen);

var _messageTip = __webpack_require__(195);

var _messageTip2 = _interopRequireDefault(_messageTip);

var _themeSwitch = __webpack_require__(197);

var _themeSwitch2 = _interopRequireDefault(_themeSwitch);

var _util = __webpack_require__(24);

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    components: {
        shrinkableMenu: _shrinkableMenu2.default,
        tagsPageOpened: _tagsPageOpened2.default,
        breadcrumbNav: _breadcrumbNav2.default,
        fullScreen: _fullscreen2.default,
        lockScreen: _lockscreen2.default,
        messageTip: _messageTip2.default,
        themeSwitch: _themeSwitch2.default
    },
    data: function data() {
        var _this = this;

        var validateReNewPassword = function validateReNewPassword(rule, value, callback) {
            if (value !== _this.updatePwdForm.newPassword) {
                callback(new Error('?????????????????????????????????'));
            } else {
                callback();
            }
        };
        return {
            shrink: false,
            isFullScreen: false,
            updatePwdModel: false,
            updatePwdModelLoading: false,
            openedSubmenuArr: this.$store.state.app.openedSubmenuArr,
            updatePwdForm: {
                oldPassword: '',
                newPassword: '',
                reNewPassword: ''
            },
            updatePwdFormRules: {
                oldPassword: [{ required: true, message: '????????????????????????', trigger: 'blur' }],
                newPassword: [{ required: true, message: '?????????????????????', trigger: 'blur' }],
                reNewPassword: [{ required: true, message: '????????????????????????', trigger: 'blur' }, { validator: validateReNewPassword, trigger: 'blur' }]
            }
        };
    },

    computed: (0, _extends3.default)({}, (0, _vuex.mapGetters)(["nickname", "avatar", "username", "email", "roles", "permissionRouters", "pageOpenedList", "currentPath", "cachePage", "lang", "menuTheme", "themeColor", "logoSrc"])),
    methods: {
        init: function init() {
            var pathArr = _util2.default.setCurrentPath(this, this.$route.name);
            if (pathArr.length >= 2) {
                this.$store.commit('addOpenSubmenu', pathArr[1].name);
            }
            this.checkTag(this.$route.name);
        },
        toggleClick: function toggleClick() {
            this.shrink = !this.shrink;
        },
        logout: function logout() {
            var _this2 = this;

            this.$Modal.confirm({
                title: '??????',
                content: '?????????????????????',
                onOk: function onOk() {
                    _this2.$store.dispatch('LogOut').then(function () {
                        location.reload();
                    });
                }
            });
        },
        updatePassword: function updatePassword() {
            var _this3 = this;

            this.$refs.updatePwdForm.validate(function (valid) {
                if (valid) {
                    _this3.updatePwdModelLoading = true;
                    _this3.$store.dispatch('UpdatePassword', _this3.updatePwdForm).then(function () {
                        _this3.updatePwdModelLoading = false;
                        _this3.updatePwdModel = false;

                        _this3.$Notice.success({ title: '????????????,??????3??????????????????' });
                        setTimeout(function () {
                            _this3.$store.dispatch('LogOut').then(function () {
                                location.reload();
                            });
                        }, 3000);
                    }).catch(function () {
                        _this3.updatePwdModelLoading = false;
                    });
                }
            });
        },
        checkTag: function checkTag(name) {
            var openpageHasTag = this.pageOpenedList.some(function (item) {
                if (item.name === name) {
                    return true;
                }
            });
            if (!openpageHasTag) {
                _util2.default.openNewPage(this, name, this.$route.params || {}, this.$route.query || {});
            }
        },
        handleSubmenuChange: function handleSubmenuChange(val) {},
        beforePush: function beforePush(name) {
            return true;
        },
        fullscreenChange: function fullscreenChange(isFullScreen) {}
    },
    watch: {
        '$route': function $route(to) {
            this.$store.commit('setCurrentPageName', to.name);
            var pathArr = _util2.default.setCurrentPath(this, to.name);
            if (pathArr.length > 2) {
                this.$store.commit('addOpenSubmenu', pathArr[1].name);
            }
            this.checkTag(to.name);
            localStorage.currentPageName = to.name;
        },
        lang: function lang() {
            _util2.default.setCurrentPath(this, this.$route.name);
        }
    },
    mounted: function mounted() {
        this.init();
    },
    created: function created() {
        this.$store.commit('setOpenedList');
    }
};

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _assign = __webpack_require__(83);

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _assign2.default || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(133), __esModule: true };

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getLogoSrcBySuffix = getLogoSrcBySuffix;
function getLogoSrcBySuffix(suffix) {
    if (suffix === 'black_g') {
        suffix = '';
    }
    if (suffix !== '') {
        suffix = '_' + suffix;
    }
    return ['/static/logo/logo-full' + suffix + '.svg', '/static/logo/logo-mini' + suffix + '.svg'];
};

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _sidebarMenu = __webpack_require__(139);

var _sidebarMenu2 = _interopRequireDefault(_sidebarMenu);

var _sidebarMenuShrink = __webpack_require__(143);

var _sidebarMenuShrink2 = _interopRequireDefault(_sidebarMenuShrink);

var _util = __webpack_require__(24);

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    name: 'shrinkableMenu',
    components: {
        sidebarMenu: _sidebarMenu2.default,
        sidebarMenuShrink: _sidebarMenuShrink2.default
    },
    props: {
        shrink: {
            type: Boolean,
            default: false
        },
        menuList: {
            type: Array,
            required: true
        },
        theme: {
            type: String,
            default: 'dark',
            validator: function validator(val) {
                return _util2.default.oneOf(val, ['dark', 'light']);
            }
        },
        beforePush: {
            type: Function
        },
        openNames: {
            type: Array
        }
    },
    computed: {
        bgColor: function bgColor() {
            return this.theme === 'dark' ? '#495060' : '#fff';
        },
        shrinkIconColor: function shrinkIconColor() {
            return this.theme === 'dark' ? '#fff' : '#495060';
        }
    },
    methods: {
        handleChange: function handleChange(name) {
            var willpush = true;
            if (this.beforePush !== undefined) {
                if (!this.beforePush(name)) {
                    willpush = false;
                }
            }
            if (willpush) {
                this.$router.push({
                    name: name
                });
            }
            this.$emit('on-change', name);
        }
    }
};

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    name: 'sidebarMenu',
    props: {
        menuList: Array,
        iconSize: Number,
        menuTheme: {
            type: String,
            default: 'dark'
        },
        openNames: {
            type: Array
        }
    },
    mounted: function mounted() {
        console.log('build menuList:');
        console.log(this.menuList);
    },

    methods: {
        changeMenu: function changeMenu(active) {
            this.$emit('on-change', active);
        },
        itemTitle: function itemTitle(item) {
            return item.title ? item.title : '?????????';
        }
    },
    updated: function updated() {
        var _this = this;

        this.$nextTick(function () {
            if (_this.$refs.sideMenu) {
                _this.$refs.sideMenu.updateOpened();
            }
        });
    }
};

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    name: 'sidebarMenuShrink',
    props: {
        menuList: {
            type: Array
        },
        iconColor: {
            type: String,
            default: 'white'
        },
        menuTheme: {
            type: String,
            default: 'darck'
        }
    },
    methods: {
        changeMenu: function changeMenu(active) {
            this.$emit('on-change', active);
        }
    }
};

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = __webpack_require__(73);
var hiddenKeys = __webpack_require__(47).concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};


/***/ }),
/* 89 */
/***/ (function(module, exports) {



/***/ }),
/* 90 */,
/* 91 */,
/* 92 */,
/* 93 */,
/* 94 */,
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = "development";

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _stringify = __webpack_require__(38);

var _stringify2 = _interopRequireDefault(_stringify);

var _typeof2 = __webpack_require__(54);

var _typeof3 = _interopRequireDefault(_typeof2);

var _vue = __webpack_require__(5);

var _vue2 = _interopRequireDefault(_vue);

var _vueI18n = __webpack_require__(97);

var _vueI18n2 = _interopRequireDefault(_vueI18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vue2.default.use(_vueI18n2.default);
exports.default = {
    name: 'tagsPageOpened',
    data: function data() {
        return {
            currentPageName: this.$route.name,
            tagBodyLeft: 0,
            refsTag: [],
            tagsCount: 1
        };
    },

    props: {
        pageTagsList: Array,
        beforePush: {
            type: Function,
            default: function _default(item) {
                return true;
            }
        }
    },
    computed: {
        tagsList: function tagsList() {
            return this.$store.state.app.pageOpenedList;
        }
    },
    methods: {
        itemTitle: function itemTitle(item) {
            if ((0, _typeof3.default)(item.title) === 'object') {
                return this.$t(item.title.i18n);
            } else {
                return item.title;
            }
        },
        closePage: function closePage(event, name) {
            var pageOpenedList = this.$store.state.app.pageOpenedList;
            var lastPageObj = pageOpenedList[0];
            if (this.currentPageName === name) {
                var len = pageOpenedList.length;
                for (var i = 1; i < len; i++) {
                    if (pageOpenedList[i].name === name) {
                        if (i < len - 1) {
                            lastPageObj = pageOpenedList[i + 1];
                        } else {
                            lastPageObj = pageOpenedList[i - 1];
                        }
                        break;
                    }
                }
            } else {
                var tagWidth = event.target.parentNode.offsetWidth;
                this.tagBodyLeft = Math.min(this.tagBodyLeft + tagWidth, 0);
            }
            this.$store.commit('removeTag', name);
            this.$store.commit('closePage', name);
            pageOpenedList = this.$store.state.app.pageOpenedList;
            localStorage.pageOpenedList = (0, _stringify2.default)(pageOpenedList);
            if (this.currentPageName === name) {
                this.linkTo(lastPageObj);
            }
        },
        linkTo: function linkTo(item) {
            var routerObj = {};
            routerObj.name = item.name;
            if (item.argu) {
                routerObj.params = item.argu;
            }
            if (item.query) {
                routerObj.query = item.query;
            }
            if (this.beforePush(item)) {
                this.$router.push(routerObj);
            }
        },
        handlescroll: function handlescroll(e) {
            var type = e.type;
            var delta = 0;
            if (type === 'DOMMouseScroll' || type === 'mousewheel') {
                delta = e.wheelDelta ? e.wheelDelta : -(e.detail || 0) * 40;
            }
            var left = 0;
            if (delta > 0) {
                left = Math.min(0, this.tagBodyLeft + delta);
            } else {
                if (this.$refs.scrollCon.offsetWidth - 100 < this.$refs.scrollBody.offsetWidth) {
                    if (this.tagBodyLeft < -(this.$refs.scrollBody.offsetWidth - this.$refs.scrollCon.offsetWidth + 100)) {
                        left = this.tagBodyLeft;
                    } else {
                        left = Math.max(this.tagBodyLeft + delta, this.$refs.scrollCon.offsetWidth - this.$refs.scrollBody.offsetWidth - 100);
                    }
                } else {
                    this.tagBodyLeft = 0;
                }
            }
            this.tagBodyLeft = left;
        },
        handleTagsOption: function handleTagsOption(type) {
            if (type === 'clearAll') {
                this.$store.commit('clearAllTags');
                this.$router.push({
                    name: 'home_index'
                });
            } else {
                this.$store.commit('clearOtherTags', this);
            }
            this.tagBodyLeft = 0;
        },
        moveToView: function moveToView(tag) {
            if (tag.offsetLeft < -this.tagBodyLeft) {
                this.tagBodyLeft = -tag.offsetLeft + 10;
            } else if (tag.offsetLeft + 10 > -this.tagBodyLeft && tag.offsetLeft + tag.offsetWidth < -this.tagBodyLeft + this.$refs.scrollCon.offsetWidth - 100) {
                this.tagBodyLeft = Math.min(0, this.$refs.scrollCon.offsetWidth - 100 - tag.offsetWidth - tag.offsetLeft - 10);
            } else {
                this.tagBodyLeft = -(tag.offsetLeft - (this.$refs.scrollCon.offsetWidth - 100 - tag.offsetWidth) + 20);
            }
        }
    },
    mounted: function mounted() {
        var _this = this;

        this.refsTag = this.$refs.tagsPageOpened;
        setTimeout(function () {
            _this.refsTag.forEach(function (item, index) {
                if (_this.$route.name === item.name) {
                    var tag = _this.refsTag[index].$el;
                    _this.moveToView(tag);
                }
            });
        }, 1);
        this.tagsCount = this.tagsList.length;
    },

    watch: {
        '$route': function $route(to) {
            var _this2 = this;

            this.currentPageName = to.name;
            this.$nextTick(function () {
                _this2.refsTag.forEach(function (item, index) {
                    if (to.name === item.name) {
                        var tag = _this2.refsTag[index].$el;
                        _this2.moveToView(tag);
                    }
                });
            });
            this.tagsCount = this.tagsList.length;
        }
    }
};

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/*!
 * vue-i18n v5.0.3 
 * (c) 2017 kazuya kawaguchi
 * Released under the MIT License.
 */


/**
 * warn
 *
 * @param {String} msg
 * @param {Error} [err]
 *
 */

function warn (msg, err) {
  if (window.console) {
    console.warn('[vue-i18n] ' + msg);
    if (err) {
      console.warn(err.stack);
    }
  }
}

var Asset = function (Vue, langVM) {
  /**
   * Register or retrieve a global locale definition.
   *
   * @param {String} id
   * @param {Object | Function | Promise} definition
   * @param {Function} cb
   */

  Vue.locale = function (id, definition, cb) {
    if (definition === undefined) { // getter
      return langVM.locales[id]
    } else { // setter
      if (definition === null) {
        langVM.locales[id] = undefined;
        delete langVM.locales[id];
      } else {
        setLocale(id, definition, function (locale) {
          if (locale) {
            langVM.$set(langVM.locales, id, locale);
          } else {
            warn('failed set `' + id + '` locale');
          }
          cb && cb();
        });
      }
    }
  };
};


function setLocale (id, definition, cb) {
  if (typeof definition === 'object') { // sync
    cb(definition);
  } else {
    var future = definition.call(this);
    if (typeof future === 'function') {
      if (future.resolved) {
        // cached
        cb(future.resolved);
      } else if (future.requested) {
        // pool callbacks
        future.pendingCallbacks.push(cb);
      } else {
        future.requested = true;
        var cbs = future.pendingCallbacks = [cb];
        future(function (locale) { // resolve
          future.resolved = locale;
          for (var i = 0, l = cbs.length; i < l; i++) {
            cbs[i](locale);
          }
        }, function () { // reject
          cb();
        });
      }
    } else if (isPromise(future)) { // promise
      future.then(function (locale) { // resolve
        cb(locale);
      }, function () { // reject
        cb();
      }).catch(function (err) {
        console.error(err);
        cb();
      });
    }
  }
}

/**
 * Forgiving check for a promise
 *
 * @param {Object} p
 * @return {Boolean}
 */

function isPromise (p) {
  return p && typeof p.then === 'function'
}

var Override = function (Vue, langVM) {
  // override _init
  var init = Vue.prototype._init;
  Vue.prototype._init = function (options) {
    var this$1 = this;

    init.call(this, options);

    if (!this.$parent) { // root
      this._$lang = langVM;
      this._langUnwatch = this._$lang.$watch('$data', function (val, old) {
        this$1.$forceUpdate();
      }, { deep: true });
    }
  };

  // override _destroy
  var destroy = Vue.prototype._destroy;
  Vue.prototype._destroy = function () {
    if (!this.$parent && this._langUnwatch) {
      this._langUnwatch();
      this._langUnwatch = null;
      this._$lang = null;
    }

    destroy.apply(this, arguments);
  };
};

/**
 * Observer
 */

var Watcher;
/**
 * getWatcher
 *
 * @param {Vue} vm
 * @return {Watcher}
 */

function getWatcher (vm) {
  if (!Watcher) {
    var unwatch = vm.$watch('__watcher__', function (a) {});
    Watcher = vm._watchers[0].constructor;
    unwatch();
  }
  return Watcher
}

var Dep;
/**
 * getDep
 *
 * @param {Vue} vm
 * @return {Dep}
 */

function getDep (vm) {
  if (!Dep && vm && vm._data && vm._data.__ob__ && vm._data.__ob__.dep) {
    Dep = vm._data.__ob__.dep.constructor;
  }
  return Dep
}

/**
 * utilites
 */

/**
 * isNil
 *
 * @param {*} val
 * @return Boolean
 */
function isNil (val) {
  return val === null || val === undefined
}

/**
 * Simple bind, faster than native
 *
 * @param {Function} fn
 * @param {Object} ctx
 * @return Function
 */
function bind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }
  // record original fn length
  boundFn._length = fn.length;
  return boundFn
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 *
 * @param {Object} obj
 * @return Boolean
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 *
 * @param {Object} obj
 * @return Boolean
 */
var toString = Object.prototype.toString;
var OBJECT_STRING = '[object Object]';
function isPlainObject (obj) {
  return toString.call(obj) === OBJECT_STRING
}

/**
 * Check whether the object has the property.
 *
 * @param {Object} obj
 * @param {String} key
 * @return Boolean
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

var fallback; // fallback lang
var missingHandler = null; // missing handler
var i18nFormatter = null; // custom formatter

var Config = function (Vue, langVM, lang) {
  var Watcher = getWatcher(langVM);
  var Dep = getDep(langVM);

  function makeComputedGetter (getter, owner) {
    var watcher = new Watcher(owner, getter, null, {
      lazy: true
    });

    return function computedGetter () {
      watcher.dirty && watcher.evaluate();
      Dep && Dep.target && watcher.depend();
      return watcher.value
    }
  }

  // define Vue.config.lang configration
  Object.defineProperty(Vue.config, 'lang', {
    enumerable: true,
    configurable: true,
    get: makeComputedGetter(function () { return langVM.lang }, langVM),
    set: bind(function (val) { langVM.lang = val; }, langVM)
  });

  // define Vue.config.fallbackLang configration
  fallback = lang;
  Object.defineProperty(Vue.config, 'fallbackLang', {
    enumerable: true,
    configurable: true,
    get: function () { return fallback },
    set: function (val) { fallback = val; }
  });

  // define Vue.config.missingHandler configration
  Object.defineProperty(Vue.config, 'missingHandler', {
    enumerable: true,
    configurable: true,
    get: function () { return missingHandler },
    set: function (val) { missingHandler = val; }
  });

  // define Vue.config.i18Formatter configration
  Object.defineProperty(Vue.config, 'i18nFormatter', {
    enumerable: true,
    configurable: true,
    get: function () { return i18nFormatter },
    set: function (val) { i18nFormatter = val; }
  });
};

/**
 *  String format template
 *  - Inspired:
 *    https://github.com/Matt-Esch/string-template/index.js
 */

var RE_NARGS = /(%|)\{([0-9a-zA-Z_]+)\}/g;


var Format = function (Vue) {
  /**
   * template
   *
   * @param {String} string
   * @param {Array} ...args
   * @return {String}
   */

  function template (string) {
    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

    if (args.length === 1 && typeof args[0] === 'object') {
      args = args[0];
    } else {
      args = {};
    }

    if (!args || !args.hasOwnProperty) {
      args = {};
    }

    return string.replace(RE_NARGS, function (match, prefix, i, index) {
      var result;

      if (string[index - 1] === '{' &&
        string[index + match.length] === '}') {
        return i
      } else {
        result = hasOwn(args, i) ? args[i] : match;
        if (isNil(result)) {
          return ''
        }

        return result
      }
    })
  }

  return template
};

/**
 *  Path paerser
 *  - Inspired:
 *    Vue.js Path parser
 */

// cache
var pathCache = Object.create(null);

// actions
var APPEND = 0;
var PUSH = 1;
var INC_SUB_PATH_DEPTH = 2;
var PUSH_SUB_PATH = 3;

// states
var BEFORE_PATH = 0;
var IN_PATH = 1;
var BEFORE_IDENT = 2;
var IN_IDENT = 3;
var IN_SUB_PATH = 4;
var IN_SINGLE_QUOTE = 5;
var IN_DOUBLE_QUOTE = 6;
var AFTER_PATH = 7;
var ERROR = 8;

var pathStateMachine = [];

pathStateMachine[BEFORE_PATH] = {
  'ws': [BEFORE_PATH],
  'ident': [IN_IDENT, APPEND],
  '[': [IN_SUB_PATH],
  'eof': [AFTER_PATH]
};

pathStateMachine[IN_PATH] = {
  'ws': [IN_PATH],
  '.': [BEFORE_IDENT],
  '[': [IN_SUB_PATH],
  'eof': [AFTER_PATH]
};

pathStateMachine[BEFORE_IDENT] = {
  'ws': [BEFORE_IDENT],
  'ident': [IN_IDENT, APPEND],
  '0': [IN_IDENT, APPEND],
  'number': [IN_IDENT, APPEND]
};

pathStateMachine[IN_IDENT] = {
  'ident': [IN_IDENT, APPEND],
  '0': [IN_IDENT, APPEND],
  'number': [IN_IDENT, APPEND],
  'ws': [IN_PATH, PUSH],
  '.': [BEFORE_IDENT, PUSH],
  '[': [IN_SUB_PATH, PUSH],
  'eof': [AFTER_PATH, PUSH]
};

pathStateMachine[IN_SUB_PATH] = {
  "'": [IN_SINGLE_QUOTE, APPEND],
  '"': [IN_DOUBLE_QUOTE, APPEND],
  '[': [IN_SUB_PATH, INC_SUB_PATH_DEPTH],
  ']': [IN_PATH, PUSH_SUB_PATH],
  'eof': ERROR,
  'else': [IN_SUB_PATH, APPEND]
};

pathStateMachine[IN_SINGLE_QUOTE] = {
  "'": [IN_SUB_PATH, APPEND],
  'eof': ERROR,
  'else': [IN_SINGLE_QUOTE, APPEND]
};

pathStateMachine[IN_DOUBLE_QUOTE] = {
  '"': [IN_SUB_PATH, APPEND],
  'eof': ERROR,
  'else': [IN_DOUBLE_QUOTE, APPEND]
};

/**
 * Check if an expression is a literal value.
 *
 * @param {String} exp
 * @return {Boolean}
 */

var literalValueRE = /^\s?(true|false|-?[\d.]+|'[^']*'|"[^"]*")\s?$/;
function isLiteral (exp) {
  return literalValueRE.test(exp)
}

/**
 * Strip quotes from a string
 *
 * @param {String} str
 * @return {String | false}
 */

function stripQuotes (str) {
  var a = str.charCodeAt(0);
  var b = str.charCodeAt(str.length - 1);
  return a === b && (a === 0x22 || a === 0x27)
    ? str.slice(1, -1)
    : str
}

/**
 * Determine the type of a character in a keypath.
 *
 * @param {Char} ch
 * @return {String} type
 */

function getPathCharType (ch) {
  if (ch === undefined) { return 'eof' }

  var code = ch.charCodeAt(0);

  switch (code) {
    case 0x5B: // [
    case 0x5D: // ]
    case 0x2E: // .
    case 0x22: // "
    case 0x27: // '
    case 0x30: // 0
      return ch

    case 0x5F: // _
    case 0x24: // $
    case 0x2D: // -
      return 'ident'

    case 0x20: // Space
    case 0x09: // Tab
    case 0x0A: // Newline
    case 0x0D: // Return
    case 0xA0:  // No-break space
    case 0xFEFF:  // Byte Order Mark
    case 0x2028:  // Line Separator
    case 0x2029:  // Paragraph Separator
      return 'ws'
  }

  // a-z, A-Z
  if ((code >= 0x61 && code <= 0x7A) || (code >= 0x41 && code <= 0x5A)) {
    return 'ident'
  }

  // 1-9
  if (code >= 0x31 && code <= 0x39) { return 'number' }

  return 'else'
}

/**
 * Format a subPath, return its plain form if it is
 * a literal string or number. Otherwise prepend the
 * dynamic indicator (*).
 *
 * @param {String} path
 * @return {String}
 */

function formatSubPath (path) {
  var trimmed = path.trim();
  // invalid leading 0
  if (path.charAt(0) === '0' && isNaN(path)) { return false }

  return isLiteral(trimmed) ? stripQuotes(trimmed) : '*' + trimmed
}

/**
 * Parse a string path into an array of segments
 *
 * @param {String} path
 * @return {Array|undefined}
 */

function parse (path) {
  var keys = [];
  var index = -1;
  var mode = BEFORE_PATH;
  var subPathDepth = 0;
  var c, newChar, key, type, transition, action, typeMap;

  var actions = [];

  actions[PUSH] = function () {
    if (key !== undefined) {
      keys.push(key);
      key = undefined;
    }
  };

  actions[APPEND] = function () {
    if (key === undefined) {
      key = newChar;
    } else {
      key += newChar;
    }
  };

  actions[INC_SUB_PATH_DEPTH] = function () {
    actions[APPEND]();
    subPathDepth++;
  };

  actions[PUSH_SUB_PATH] = function () {
    if (subPathDepth > 0) {
      subPathDepth--;
      mode = IN_SUB_PATH;
      actions[APPEND]();
    } else {
      subPathDepth = 0;
      key = formatSubPath(key);
      if (key === false) {
        return false
      } else {
        actions[PUSH]();
      }
    }
  };

  function maybeUnescapeQuote () {
    var nextChar = path[index + 1];
    if ((mode === IN_SINGLE_QUOTE && nextChar === "'") ||
      (mode === IN_DOUBLE_QUOTE && nextChar === '"')) {
      index++;
      newChar = '\\' + nextChar;
      actions[APPEND]();
      return true
    }
  }

  while (mode != null) {
    index++;
    c = path[index];

    if (c === '\\' && maybeUnescapeQuote()) {
      continue
    }

    type = getPathCharType(c);
    typeMap = pathStateMachine[mode];
    transition = typeMap[type] || typeMap['else'] || ERROR;

    if (transition === ERROR) {
      return // parse error
    }

    mode = transition[0];
    action = actions[transition[1]];
    if (action) {
      newChar = transition[2];
      newChar = newChar === undefined
        ? c
        : newChar;
      if (action() === false) {
        return
      }
    }

    if (mode === AFTER_PATH) {
      keys.raw = path;
      return keys
    }
  }
}

/**
 * External parse that check for a cache hit first
 *
 * @param {String} path
 * @return {Array|undefined}
 */

function parsePath (path) {
  var hit = pathCache[path];
  if (!hit) {
    hit = parse(path);
    if (hit) {
      pathCache[path] = hit;
    }
  }
  return hit
}

var Path = function (Vue) {
  function empty (target) {
    if (target === null || target === undefined) { return true }

    if (Array.isArray(target)) {
      if (target.length > 0) { return false }
      if (target.length === 0) { return true }
    } else if (isPlainObject(target)) {
      /* eslint-disable prefer-const */
      for (var key in target) {
        if (hasOwn(target, key)) { return false }
      }
      /* eslint-enable prefer-const */
    }

    return true
  }

  /**
   * Get value from path string
   *
   * @param {Object} obj
   * @param {String} path
   * @return value
   */

  function getValue (obj, path) {
    if (!isObject(obj)) { return null }

    var paths = parsePath(path);
    if (empty(paths)) { return null }

    var length = paths.length;
    var ret = null;
    var last = obj;
    var i = 0;
    while (i < length) {
      var value = last[paths[i]];
      if (value === undefined) {
        last = null;
        break
      }
      last = value;
      i++;
    }

    ret = last;
    return ret
  }

  return getValue
};

/**
 * extend
 *
 * @param {Vue} Vue
 * @return {Vue}
 */

var Extend = function (Vue) {
  var format = Format(Vue);
  var getValue = Path(Vue);

  function parseArgs () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var lang = Vue.config.lang;
    var fallback = Vue.config.fallbackLang;

    if (args.length === 1) {
      if (isObject(args[0]) || Array.isArray(args[0])) {
        args = args[0];
      } else if (typeof args[0] === 'string') {
        lang = args[0];
      }
    } else if (args.length === 2) {
      if (typeof args[0] === 'string') {
        lang = args[0];
      }
      if (isObject(args[1]) || Array.isArray(args[1])) {
        args = args[1];
      }
    }

    return { lang: lang, fallback: fallback, params: args }
  }

  function exist (locale, key) {
    if (!locale || !key) { return false }
    return !isNil(getValue(locale, key))
  }

  function interpolate (locale, key, args) {
    if (!locale) { return null }

    var val = getValue(locale, key);
    if (Array.isArray(val)) { return val }
    if (isNil(val)) { val = locale[key]; }
    if (isNil(val)) { return null }
    if (typeof val !== 'string') { warn("Value of key '" + key + "' is not a string!"); return null }

    // Check for the existance of links within the translated string
    if (val.indexOf('@:') >= 0) {
      // Match all the links within the local
      // We are going to replace each of
      // them with its translation
      var matches = val.match(/(@:[\w|.]+)/g);
      for (var idx in matches) {
        var link = matches[idx];
        // Remove the leading @:
        var linkPlaceholder = link.substr(2);
        // Translate the link
        var translatedstring = interpolate(locale, linkPlaceholder, args);
        // Replace the link with the translated string
        val = val.replace(link, translatedstring);
      }
    }

    return !args
      ? val
      : Vue.config.i18nFormatter
        ? Vue.config.i18nFormatter.apply(null, [val].concat(args))
        : format(val, args)
  }

  function translate (getter, lang, fallback, key, params) {
    var res = null;
    res = interpolate(getter(lang), key, params);
    if (!isNil(res)) { return res }

    res = interpolate(getter(fallback), key, params);
    if (!isNil(res)) {
      if (process.env.NODE_ENV !== 'production') {
        warn('Fall back to translate the keypath "' + key + '" with "' +
          fallback + '" language.');
      }
      return res
    } else {
      return null
    }
  }


  function warnDefault (lang, key, vm, result) {
    if (!isNil(result)) { return result }
    if (Vue.config.missingHandler) {
      Vue.config.missingHandler.apply(null, [lang, key, vm]);
    } else {
      if (process.env.NODE_ENV !== 'production') {
        warn('Cannot translate the value of keypath "' + key + '". ' +
          'Use the value of keypath as default');
      }
    }
    return key
  }

  function getAssetLocale (lang) {
    return Vue.locale(lang)
  }

  function getComponentLocale (lang) {
    return this.$options.locales[lang]
  }

  function getOldChoiceIndexFixed (choice) {
    return choice ? choice > 1 ? 1 : 0 : 1
  }

  function getChoiceIndex (choice, choicesLength) {
    choice = Math.abs(choice);

    if (choicesLength === 2) { return getOldChoiceIndexFixed(choice) }

    return choice ? Math.min(choice, 2) : 0
  }

  function fetchChoice (locale, choice) {
    if (!locale && typeof locale !== 'string') { return null }
    var choices = locale.split('|');

    choice = getChoiceIndex(choice, choices.length);
    if (!choices[choice]) { return locale }
    return choices[choice].trim()
  }

  /**
   * Vue.t
   *
   * @param {String} key
   * @param {Array} ...args
   * @return {String}
   */

  Vue.t = function (key) {
    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

    if (!key) { return '' }
    var ref = parseArgs.apply(void 0, args);
    var lang = ref.lang;
    var fallback = ref.fallback;
    var params = ref.params;
    return warnDefault(lang, key, null, translate(getAssetLocale, lang, fallback, key, params))
  };

  /**
   * Vue.tc
   *
   * @param {String} key
   * @param {number|undefined} choice
   * @param {Array} ...args
   * @return {String}
   */

  Vue.tc = function (key, choice) {
    var args = [], len = arguments.length - 2;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 2 ];

    return fetchChoice(Vue.t.apply(Vue, [ key ].concat( args )), choice)
  };

  /**
   * Vue.te
   *
   * @param {String} key
   * @param {Array} ...args
   * @return {Boolean}
   */

  Vue.te = function (key) {
    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

    var ref = parseArgs.apply(void 0, args);
    var lang = ref.lang;
    return exist(getAssetLocale(lang), key)
  };

  /**
   * $t
   *
   * @param {String} key
   * @param {Array} ...args
   * @return {String}
   */

  Vue.prototype.$t = function (key) {
    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

    if (!key) { return '' }
    var ref = parseArgs.apply(void 0, args);
    var lang = ref.lang;
    var fallback = ref.fallback;
    var params = ref.params;
    var res = null;
    if (this.$options.locales) {
      res = translate(
        bind(getComponentLocale, this), lang, fallback, key, params
      );
      if (res) { return res }
    }
    return warnDefault(lang, key, this, translate(getAssetLocale, lang, fallback, key, params))
  };

  /**
   * $tc
   *
   * @param {String} key
   * @param {number|undefined} choice
   * @param {Array} ...args
   * @return {String}
   */

  Vue.prototype.$tc = function (key, choice) {
    var args = [], len = arguments.length - 2;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 2 ];

    if (typeof choice !== 'number' && typeof choice !== 'undefined') {
      return key
    }
    return fetchChoice((ref = this).$t.apply(ref, [ key ].concat( args )), choice)
    var ref;
  };

  /**
   * $te
   *
   * @param {String} key
   * @param {Array} ...args
   * @return {Boolean}
   *
   */

  Vue.prototype.$te = function (key) {
    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

    var ref = parseArgs.apply(void 0, args);
    var lang = ref.lang;
    var found = false;
    if (this.$options.locales) { // exist component locale
      found = exist(bind(getComponentLocale)(lang), key);
    }
    if (!found) {
      found = exist(getAssetLocale(lang), key);
    }
    return found
  };

  Vue.mixin({
    computed: {
      $lang: function $lang () {
        return Vue.config.lang
      }
    }
  });

  return Vue
};

var langVM; // singleton


/**
 * plugin
 *
 * @param {Object} Vue
 * @param {Object} opts
 */

function plugin (Vue, opts) {
  if ( opts === void 0 ) opts = {};

  var version = (Vue.version && Number(Vue.version.split('.')[0])) || -1;

  if (process.env.NODE_ENV !== 'production' && plugin.installed) {
    warn('already installed.');
    return
  }

  if (process.env.NODE_ENV !== 'production' && version < 2) {
    warn(("vue-i18n (" + (plugin.version) + ") need to use Vue 2.0 or later (Vue: " + (Vue.version) + ")."));
    return
  }

  var lang = 'en';
  setupLangVM(Vue, lang);

  Asset(Vue, langVM);
  Override(Vue, langVM);
  Config(Vue, langVM, lang);
  Extend(Vue);
}

function setupLangVM (Vue, lang) {
  var silent = Vue.config.silent;
  Vue.config.silent = true;
  if (!langVM) {
    langVM = new Vue({ data: { lang: lang, locales: {} } });
  }
  Vue.config.silent = silent;
}

plugin.version = '__VERSION__';

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin);
}

module.exports = plugin;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9)))

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof2 = __webpack_require__(54);

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    name: 'breadcrumbNav',
    props: {
        currentPath: Array
    },
    methods: {
        itemTitle: function itemTitle(item) {
            if ((0, _typeof3.default)(item.title) === 'object') {
                return this.$t(item.title.i18n);
            } else {
                return item.title;
            }
        }
    }
};

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    name: 'fullScreen',
    props: {
        value: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        showFullScreenBtn: function showFullScreenBtn() {
            return window.navigator.userAgent.indexOf('MSIE') < 0;
        }
    },
    methods: {
        handleFullscreen: function handleFullscreen() {
            var main = document.body;
            if (this.value) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            } else {
                if (main.requestFullscreen) {
                    main.requestFullscreen();
                } else if (main.mozRequestFullScreen) {
                    main.mozRequestFullScreen();
                } else if (main.webkitRequestFullScreen) {
                    main.webkitRequestFullScreen();
                } else if (main.msRequestFullscreen) {
                    main.msRequestFullscreen();
                }
            }
        },
        handleChange: function handleChange() {
            this.handleFullscreen();
        }
    },
    created: function created() {
        var _this = this;

        var isFullscreen = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
        isFullscreen = !!isFullscreen;
        document.addEventListener('fullscreenchange', function () {
            _this.$emit('input', !_this.value);
            _this.$emit('on-change', !_this.value);
        });
        document.addEventListener('mozfullscreenchange', function () {
            _this.$emit('input', !_this.value);
            _this.$emit('on-change', !_this.value);
        });
        document.addEventListener('webkitfullscreenchange', function () {
            _this.$emit('input', !_this.value);
            _this.$emit('on-change', !_this.value);
        });
        document.addEventListener('msfullscreenchange', function () {
            _this.$emit('input', !_this.value);
            _this.$emit('on-change', !_this.value);
        });
        this.$emit('input', isFullscreen);
    }
};

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _jsCookie = __webpack_require__(26);

var _jsCookie2 = _interopRequireDefault(_jsCookie);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var setLockBackSize = function setLockBackSize() {
    var x = document.body.clientWidth;
    var y = document.body.clientHeight;
    var r = Math.sqrt(x * x + y * y);
    return parseInt(r);
};
exports.default = {
    name: 'lockScreen',
    props: {
        value: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        lockScreen: function lockScreen() {
            var _this = this;

            var lockScreenBack = document.getElementById('lock_screen_back');
            lockScreenBack.style.transition = 'all 3s';
            lockScreenBack.style.zIndex = 10000;
            lockScreenBack.style.boxShadow = '0 0 0 ' + this.lockScreenSize + 'px #667aa6 inset';
            this.showUnlock = true;
            _jsCookie2.default.set('last_page_name', this.$route.name);
            setTimeout(function () {
                lockScreenBack.style.transition = 'all 0s';
                _this.$router.push({
                    name: 'locking'
                });
            }, 800);
            _jsCookie2.default.set('locking', '1');
        }
    },
    mounted: function mounted() {
        var _this2 = this;

        var lockScreenBack = void 0;
        if (!document.getElementById('lock_screen_back')) {
            var lockdiv = document.createElement('div');
            lockdiv.setAttribute('id', 'lock_screen_back');
            lockdiv.setAttribute('class', 'lock-screen-back');
            document.body.appendChild(lockdiv);
            lockScreenBack = document.getElementById('lock_screen_back');
            window.addEventListener('resize', function () {
                var size = setLockBackSize();
                _this2.lockScreenSize = size;
                lockScreenBack.style.transition = 'all 0s';
                lockScreenBack.style.width = lockScreenBack.style.height = size + 'px';
            });
        } else {
            lockScreenBack = document.getElementById('lock_screen_back');
        }
        var size = setLockBackSize();
        this.lockScreenSize = size;
        lockScreenBack.style.transition = 'all 3s';
        lockScreenBack.style.width = lockScreenBack.style.height = size + 'px';
    }
};

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _util = __webpack_require__(24);

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    name: 'messageTip',
    props: {
        value: {
            type: Number,
            default: 0
        }
    },
    methods: {
        showMessage: function showMessage() {
            _util2.default.openNewPage(this, 'message_index');
            this.$router.push({
                name: 'message_index'
            });
        }
    }
};

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _stringify = __webpack_require__(38);

var _stringify2 = _interopRequireDefault(_stringify);

var _config = __webpack_require__(198);

var _config2 = _interopRequireDefault(_config);

var _logo = __webpack_require__(84);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    name: 'themeSwitch',
    data: function data() {
        return {
            themeList: [{
                name: 'black_b',
                menu: '#495060',
                element: '#2d8cf0'
            }, {
                name: 'black_g',
                menu: '#495060',
                element: '#00a854'
            }, {
                name: 'black_y',
                menu: '#495060',
                element: '#e96500'
            }, {
                name: 'black_r',
                menu: '#495060',
                element: '#e43e31'
            }]
        };
    },

    methods: {
        setTheme: function setTheme(themeFile) {
            var menuTheme = themeFile.substr(0, 1);
            var mainTheme = themeFile.substr(-1, 1);
            if (menuTheme === 'b') {
                this.$store.commit('changeMenuTheme', 'dark');
                menuTheme = 'dark';
            } else {
                this.$store.commit('changeMenuTheme', 'light');
                menuTheme = 'light';
            }
            var path = '';
            var themeLink = document.querySelector('link[name="theme"]');
            var userName = this.$store.state.user.username;
            if (localStorage.theme) {
                var themeList = JSON.parse(localStorage.theme);
                var index = 0;
                var hasThisUser = themeList.some(function (item, i) {
                    if (item.userName === userName) {
                        index = i;
                        return true;
                    } else {
                        return false;
                    }
                });
                if (hasThisUser) {
                    themeList[index].mainTheme = mainTheme;
                    themeList[index].menuTheme = menuTheme;
                    themeList[index].logoTheme = themeFile;
                } else {
                    themeList.push({
                        userName: userName,
                        mainTheme: mainTheme,
                        menuTheme: menuTheme,
                        logoTheme: themeFile
                    });
                }
                localStorage.theme = (0, _stringify2.default)(themeList);
            } else {
                localStorage.theme = (0, _stringify2.default)([{
                    userName: userName,
                    mainTheme: mainTheme,
                    menuTheme: menuTheme,
                    logoTheme: themeFile
                }]);
            }
            var stylePath = '';
            if (_config2.default.env.indexOf('dev') > -1) {
                stylePath = './src/views/main-components/theme-switch/theme/';
            } else {
                stylePath = 'dist/';
            }
            if (mainTheme !== 'b') {
                path = stylePath + mainTheme + '.css';
            } else {
                path = '';
            }
            themeLink.setAttribute('href', path);

            this.$store.commit('changeLogoSrc', (0, _logo.getLogoSrcBySuffix)(themeFile));
        }
    },
    created: function created() {
        var _this = this;

        var path = '';
        if (_config2.default.env.indexOf('dev') > -1) {
            path = './src/views/main-components/theme-switch/theme/';
        } else {
            path = 'dist/';
        }
        var name = this.$store.state.user.username;
        if (localStorage.theme) {
            var hasThisUser = JSON.parse(localStorage.theme).some(function (item) {
                if (item.userName === name) {
                    _this.$store.commit('changeMenuTheme', item.menuTheme);
                    _this.$store.commit('changeMainTheme', item.mainTheme);
                    _this.$store.commit('changeLogoSrc', (0, _logo.getLogoSrcBySuffix)(item.logoTheme));
                    return true;
                } else {
                    return false;
                }
            });
            if (!hasThisUser) {
                this.$store.commit('changeMenuTheme', 'dark');
                this.$store.commit('changeMainTheme', 'g');
            }
        } else {
            this.$store.commit('changeMenuTheme', 'dark');
            this.$store.commit('changeMainTheme', 'g');
        }

        if (this.$store.state.app.themeColor !== 'b') {
            var stylesheetPath = path + this.$store.state.app.themeColor + '.css';
            var themeLink = document.querySelector('link[name="theme"]');
            themeLink.setAttribute('href', stylesheetPath);
        }
    }
};

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _vue = __webpack_require__(5);

var _vue2 = _interopRequireDefault(_vue);

var _vuex = __webpack_require__(52);

var _vuex2 = _interopRequireDefault(_vuex);

var _app = __webpack_require__(201);

var _app2 = _interopRequireDefault(_app);

var _user = __webpack_require__(202);

var _user2 = _interopRequireDefault(_user);

var _permission = __webpack_require__(214);

var _permission2 = _interopRequireDefault(_permission);

var _getters = __webpack_require__(216);

var _getters2 = _interopRequireDefault(_getters);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vue2.default.use(_vuex2.default);

var store = new _vuex2.default.Store({
    modules: {
        app: _app2.default,
        user: _user2.default,
        permission: _permission2.default
    },
    getters: _getters2.default
});

exports.default = store;

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = __webpack_require__(6);
var aFunction = __webpack_require__(29);
var SPECIES = __webpack_require__(1)('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__(19);
var invoke = __webpack_require__(207);
var html = __webpack_require__(75);
var cel = __webpack_require__(42);
var global = __webpack_require__(0);
var process = global.process;
var setTask = global.setImmediate;
var clearTask = global.clearImmediate;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (__webpack_require__(23)(process) == 'process') {
    defer = function (id) {
      process.nextTick(ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function (id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function (id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};


/***/ }),
/* 106 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};


/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(6);
var isObject = __webpack_require__(12);
var newPromiseCapability = __webpack_require__(60);

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};


/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = __webpack_require__(59);

var _promise2 = _interopRequireDefault(_promise);

exports.successMessage = successMessage;
exports.errorMessage = errorMessage;

var _axios = __webpack_require__(57);

var _axios2 = _interopRequireDefault(_axios);

var _token = __webpack_require__(61);

var _iview = __webpack_require__(33);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var service = _axios2.default.create({
    timeout: 15000 });

service.interceptors.request.use(function (config) {
    if ((0, _token.getToken)()) {
        config.headers['Authorization'] = 'Bearer ' + (0, _token.getToken)();
    }
    return config;
}, function (error) {
    console.log(error);
    _promise2.default.reject(error);
});

service.interceptors.response.use(function (response) {
    var ret = response.data;

    if (ret && ret.code && ret.code !== 200) {
        errorMessage(ret.message);
        return _promise2.default.reject(ret);
    }
    return response;
}, function (error) {
    var ret = error.response;

    if (ret.status === 400) {
        errorMessage(ret.data.error_description || error.message);
    } else if (ret.status === 403 || ret.status === 401) {
        errorMessage(ret.data.message);
    } else {
        errorMessage('?????????[' + error.message + ']');
    }
    return _promise2.default.reject(error);
});

function successMessage(msg) {
    _iview.Message.success(msg);
}

function errorMessage(msg) {
    _iview.Notice.error({
        title: '????????????',
        desc: msg,
        duration: 6
    });
}

exports.default = service;

/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    data: function data() {
        return {
            theme: this.$store.state.app.themeColor
        };
    },
    mounted: function mounted() {},
    beforeDestroy: function beforeDestroy() {},

    methods: {}
};

/***/ }),
/* 110 */,
/* 111 */,
/* 112 */,
/* 113 */,
/* 114 */,
/* 115 */,
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(119), __esModule: true };

/***/ }),
/* 117 */,
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _toConsumableArray2 = __webpack_require__(68);

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _vue = __webpack_require__(5);

var _vue2 = _interopRequireDefault(_vue);

var _iview = __webpack_require__(33);

var _iview2 = _interopRequireDefault(_iview);

var _router = __webpack_require__(50);

var _router2 = _interopRequireDefault(_router);

var _store = __webpack_require__(103);

var _store2 = _interopRequireDefault(_store);

var _app = __webpack_require__(217);

var _app2 = _interopRequireDefault(_app);

__webpack_require__(221);

__webpack_require__(226);

var _vueI18n = __webpack_require__(97);

var _vueI18n2 = _interopRequireDefault(_vueI18n);

__webpack_require__(227);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vue2.default.use(_vueI18n2.default);
_vue2.default.use(_iview2.default);

new _vue2.default({
    el: '#app',
    router: _router2.default,
    store: _store2.default,
    render: function render(h) {
        return h(_app2.default);
    },
    data: {
        currentPageName: ''
    },
    mounted: function mounted() {
        this.currentPageName = this.$route.name;

        this.$store.commit('setOpenedList');
        this.$store.commit('initCachepage');
    },
    created: function created() {
        var tagsList = [];
        _router.asyncRouterMap.map(function (item) {
            if (item.children.length <= 1) {
                tagsList.push(item.children[0]);
            } else {
                tagsList.push.apply(tagsList, (0, _toConsumableArray3.default)(item.children));
            }
        });
        this.$store.commit('setTagsList', tagsList);
    }
});

/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(27);
__webpack_require__(126);
module.exports = __webpack_require__(2).Array.from;


/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(40);
var defined = __webpack_require__(41);
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};


/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create = __webpack_require__(72);
var descriptor = __webpack_require__(21);
var setToStringTag = __webpack_require__(32);
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(11)(IteratorPrototype, __webpack_require__(1)('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(8);
var anObject = __webpack_require__(6);
var getKeys = __webpack_require__(30);

module.exports = __webpack_require__(13) ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(15);
var toLength = __webpack_require__(44);
var toAbsoluteIndex = __webpack_require__(124);
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(40);
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__(14);
var toObject = __webpack_require__(48);
var IE_PROTO = __webpack_require__(45)('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ctx = __webpack_require__(19);
var $export = __webpack_require__(10);
var toObject = __webpack_require__(48);
var call = __webpack_require__(76);
var isArrayIter = __webpack_require__(77);
var toLength = __webpack_require__(44);
var createProperty = __webpack_require__(127);
var getIterFn = __webpack_require__(49);

$export($export.S + $export.F * !__webpack_require__(79)(function (iter) { Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = getIterFn(O);
    var length, result, step, iterator;
    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for (result = new C(length); length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});


/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $defineProperty = __webpack_require__(8);
var createDesc = __webpack_require__(21);

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};


/***/ }),
/* 128 */,
/* 129 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Main_vue__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Main_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Main_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Main_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Main_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__babel_loader_node_modules_vue_loader_lib_template_compiler_index_id_data_v_7aa0650d_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Main_vue__ = __webpack_require__(200);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__babel_loader_node_modules_vue_loader_lib_template_compiler_index_id_data_v_7aa0650d_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Main_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__babel_loader_node_modules_vue_loader_lib_template_compiler_index_id_data_v_7aa0650d_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Main_vue__);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(130)
}
var normalizeComponent = __webpack_require__(4)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Main_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__babel_loader_node_modules_vue_loader_lib_template_compiler_index_id_data_v_7aa0650d_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Main_vue___default.a,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\views\\Main.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7aa0650d", Component.options)
  } else {
    hotAPI.reload("data-v-7aa0650d", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(131);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(18)("0b8f700c", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7aa0650d\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/less-loader/dist/cjs.js!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Main.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7aa0650d\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/less-loader/dist/cjs.js!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Main.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(17)(false);
// imports


// module
exports.push([module.i, "\n.lock-screen-back {\n  border-radius: 50%;\n  z-index: -1;\n  box-shadow: 0 0 0 0 #667aa6 inset;\n  position: fixed;\n  left: 50%;\n  top: 50%;\n  -webkit-transform: translate(-50%, -50%);\n          transform: translate(-50%, -50%);\n  transition: all 3s;\n}\n.ivu-select-dropdown {\n  max-height: 800px !important;\n}\n.main {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n}\n.main .unlock-con {\n  width: 0px;\n  height: 0px;\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  z-index: 11000;\n}\n.main .sidebar-menu-con {\n  height: 100%;\n  position: fixed;\n  top: 0;\n  left: 0;\n  z-index: 21;\n  transition: width .3s;\n}\n.main .layout-text {\n  display: inline-block;\n  white-space: nowrap;\n  position: absolute;\n}\n.main .main-hide-text .layout-text {\n  display: none;\n}\n.main-content-container {\n  position: relative;\n}\n.main-header-con {\n  box-sizing: border-box;\n  position: fixed;\n  display: block;\n  padding-left: 200px;\n  width: 100%;\n  height: 100px;\n  z-index: 20;\n  box-shadow: 0 2px 1px 1px rgba(100, 100, 100, 0.1);\n  transition: padding .3s;\n}\n.main-breadcrumb {\n  padding: 8px 15px 0;\n}\n.main-menu-left {\n  background: #464c5b;\n  height: 100%;\n}\n.main .tags-con {\n  height: 40px;\n  z-index: -1;\n  overflow: hidden;\n  background: #f0f0f0;\n}\n.main .tags-con .tags-outer-scroll-con {\n  position: relative;\n  box-sizing: border-box;\n  padding-right: 120px;\n  width: 100%;\n  height: 100%;\n}\n.main .tags-con .tags-outer-scroll-con .tags-inner-scroll-body {\n  position: absolute;\n  padding: 2px 10px;\n  overflow: visible;\n  white-space: nowrap;\n  transition: left .3s ease;\n}\n.main .tags-con .tags-outer-scroll-con .close-all-tag-con {\n  position: absolute;\n  right: 0;\n  top: 0;\n  box-sizing: border-box;\n  padding-top: 8px;\n  text-align: center;\n  width: 110px;\n  height: 100%;\n  background: white;\n  box-shadow: -3px 0 15px 3px rgba(0, 0, 0, 0.1);\n  z-index: 10;\n}\n.main-header {\n  height: 60px;\n  background: #fff;\n  box-shadow: 0 2px 1px 1px rgba(100, 100, 100, 0.1);\n  position: relative;\n  z-index: 11;\n}\n.main-header .navicon-con {\n  margin: 6px;\n  display: inline-block;\n}\n.main-header .header-middle-con {\n  position: absolute;\n  left: 60px;\n  top: 0;\n  right: 340px;\n  bottom: 0;\n  padding: 10px;\n  overflow: hidden;\n}\n.main-header .header-avator-con {\n  position: absolute;\n  right: 0;\n  top: 0;\n  height: 100%;\n  width: 300px;\n}\n.main-header .header-avator-con .switch-theme-con {\n  display: inline-block;\n  width: 40px;\n  height: 100%;\n}\n.main-header .header-avator-con .message-con {\n  display: inline-block;\n  width: 30px;\n  padding: 18px 0;\n  text-align: center;\n  cursor: pointer;\n}\n.main-header .header-avator-con .message-con i {\n  vertical-align: middle;\n}\n.main-header .header-avator-con .change-skin {\n  font-size: 14px;\n  font-weight: 500;\n  padding-right: 5px;\n}\n.main-header .header-avator-con .switch-theme {\n  height: 100%;\n}\n.main-header .header-avator-con .user-dropdown-menu-con {\n  position: absolute;\n  right: 0;\n  top: 0;\n  width: 150px;\n  height: 100%;\n}\n.main-header .header-avator-con .user-dropdown-menu-con .main-user-name {\n  display: inline-block;\n  width: 80px;\n  word-break: keep-all;\n  white-space: nowrap;\n  vertical-align: middle;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  text-align: right;\n}\n.main-header .header-avator-con .user-dropdown-innercon {\n  height: 100%;\n  padding-right: 14px;\n}\n.main-header .header-avator-con .full-screen-btn-con {\n  display: inline-block;\n  width: 30px;\n  padding: 18px 0;\n  text-align: center;\n  cursor: pointer;\n}\n.main-header .header-avator-con .full-screen-btn-con i {\n  vertical-align: middle;\n}\n.main-header .header-avator-con .lock-screen-btn-con {\n  display: inline-block;\n  width: 30px;\n  padding: 18px 0;\n  text-align: center;\n  cursor: pointer;\n}\n.main-header .header-avator-con .lock-screen-btn-con i {\n  vertical-align: middle;\n}\n.main .single-page-con {\n  position: absolute;\n  top: 100px;\n  right: 0;\n  bottom: 0;\n  overflow: auto;\n  background-color: #F0F0F0;\n  z-index: 1;\n  transition: left .3s;\n}\n.main .single-page-con .single-page {\n  margin: 10px;\n}\n.main-copy {\n  text-align: center;\n  padding: 10px 0 20px;\n  color: #9ea7b4;\n}\n.taglist-moving-animation-move {\n  transition: -webkit-transform .3s;\n  transition: transform .3s;\n  transition: transform .3s, -webkit-transform .3s;\n}\n.logo-con {\n  padding: 15px;\n  text-align: center;\n}\n.logo-con .logo-full {\n  height: 60px;\n  width: auto;\n}\n.logo-con .logo-mini {\n  height: 35px;\n  width: auto;\n}\n", ""]);

// exports


/***/ }),
/* 132 */
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(134);
module.exports = __webpack_require__(2).Object.assign;


/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__(10);

$export($export.S + $export.F, 'Object', { assign: __webpack_require__(135) });


/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = __webpack_require__(30);
var gOPS = __webpack_require__(51);
var pIE = __webpack_require__(34);
var toObject = __webpack_require__(48);
var IObject = __webpack_require__(74);
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__(20)(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;


/***/ }),
/* 136 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_shrinkable_menu_vue__ = __webpack_require__(85);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_shrinkable_menu_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_shrinkable_menu_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_shrinkable_menu_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_shrinkable_menu_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__babel_loader_node_modules_vue_loader_lib_template_compiler_index_id_data_v_0ddd0800_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_shrinkable_menu_vue__ = __webpack_require__(183);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__babel_loader_node_modules_vue_loader_lib_template_compiler_index_id_data_v_0ddd0800_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_shrinkable_menu_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__babel_loader_node_modules_vue_loader_lib_template_compiler_index_id_data_v_0ddd0800_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_shrinkable_menu_vue__);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(137)
}
var normalizeComponent = __webpack_require__(4)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_shrinkable_menu_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__babel_loader_node_modules_vue_loader_lib_template_compiler_index_id_data_v_0ddd0800_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_shrinkable_menu_vue___default.a,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\views\\main-components\\shrinkable-menu\\shrinkable-menu.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0ddd0800", Component.options)
  } else {
    hotAPI.reload("data-v-0ddd0800", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(138);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(18)("d6160cb0", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-0ddd0800\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../node_modules/less-loader/dist/cjs.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./shrinkable-menu.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-0ddd0800\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../node_modules/less-loader/dist/cjs.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./shrinkable-menu.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(17)(false);
// imports


// module
exports.push([module.i, "\n.ivu-shrinkable-menu {\n  height: 100%;\n  width: 100%;\n}\n", ""]);

// exports


/***/ }),
/* 139 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_sidebarMenu_vue__ = __webpack_require__(86);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_sidebarMenu_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_sidebarMenu_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_sidebarMenu_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_sidebarMenu_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__babel_loader_node_modules_vue_loader_lib_template_compiler_index_id_data_v_672d8b24_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_sidebarMenu_vue__ = __webpack_require__(142);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__babel_loader_node_modules_vue_loader_lib_template_compiler_index_id_data_v_672d8b24_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_sidebarMenu_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__babel_loader_node_modules_vue_loader_lib_template_compiler_index_id_data_v_672d8b24_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_sidebarMenu_vue__);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(140)
}
var normalizeComponent = __webpack_require__(4)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_sidebarMenu_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__babel_loader_node_modules_vue_loader_lib_template_compiler_index_id_data_v_672d8b24_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_sidebarMenu_vue___default.a,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\views\\main-components\\shrinkable-menu\\components\\sidebarMenu.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-672d8b24", Component.options)
  } else {
    hotAPI.reload("data-v-672d8b24", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(141);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(18)("255800c3", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-672d8b24\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../../node_modules/less-loader/dist/cjs.js!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./sidebarMenu.vue", function() {
     var newContent = require("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-672d8b24\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../../node_modules/less-loader/dist/cjs.js!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./sidebarMenu.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(17)(false);
// imports


// module
exports.push([module.i, "\n.ivu-shrinkable-menu {\n  height: 100%;\n  width: 100%;\n}\n", ""]);

// exports


/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var render = function render() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("Menu", {
    ref: "sideMenu",
    attrs: {
      "active-name": _vm.$route.name,
      "open-names": _vm.openNames,
      theme: _vm.menuTheme,
      width: "auto"
    },
    on: { "on-select": _vm.changeMenu }
  }, [_vm._l(_vm.menuList, function (item) {
    return [item.children.length <= 1 ? _c("MenuItem", {
      key: "menuitem" + item.name,
      attrs: { name: item.children[0].name }
    }, [_c("Icon", {
      key: "menuicon" + item.name,
      attrs: {
        type: item.children[0].icon || item.icon,
        size: _vm.iconSize
      }
    }), _vm._v(" "), _c("span", { key: "title" + item.name, staticClass: "layout-text" }, [_vm._v(_vm._s(_vm.itemTitle(item.children[0])))])], 1) : _vm._e(), _vm._v(" "), item.children.length > 1 ? _c("Submenu", { key: item.name, attrs: { name: item.name } }, [_c("template", { slot: "title" }, [_c("Icon", {
      attrs: { type: item.icon, size: _vm.iconSize }
    }), _vm._v(" "), _c("span", { staticClass: "layout-text" }, [_vm._v(_vm._s(_vm.itemTitle(item)))])], 1), _vm._v(" "), _vm._l(item.children, function (child) {
      return [_c("MenuItem", {
        key: "menuitem" + child.name,
        attrs: { name: child.name }
      }, [_c("Icon", {
        key: "icon" + child.name,
        attrs: { type: child.icon, size: _vm.iconSize }
      }), _vm._v(" "), _c("span", {
        key: "title" + child.name,
        staticClass: "layout-text"
      }, [_vm._v(_vm._s(_vm.itemTitle(child)))])], 1)];
    })], 2) : _vm._e()];
  })], 2);
};
var staticRenderFns = [];
render._withStripped = true;
var esExports = { render: render, staticRenderFns: staticRenderFns };
exports.default = esExports;

if (false) {
  module.hot.accept();
  if (module.hot.data) {
    require("vue-hot-reload-api").rerender("data-v-672d8b24", esExports);
  }
}

/***/ }),
/* 143 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_sidebarMenuShrink_vue__ = __webpack_require__(87);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_sidebarMenuShrink_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_sidebarMenuShrink_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_sidebarMenuShrink_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_sidebarMenuShrink_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__babel_loader_node_modules_vue_loader_lib_template_compiler_index_id_data_v_e2f110d2_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_sidebarMenuShrink_vue__ = __webpack_require__(144);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__babel_loader_node_modules_vue_loader_lib_template_compiler_index_id_data_v_e2f110d2_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_sidebarMenuShrink_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__babel_loader_node_modules_vue_loader_lib_template_compiler_index_id_data_v_e2f110d2_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_sidebarMenuShrink_vue__);
var disposed = false
var normalizeComponent = __webpack_require__(4)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_sidebarMenuShrink_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__babel_loader_node_modules_vue_loader_lib_template_compiler_index_id_data_v_e2f110d2_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_sidebarMenuShrink_vue___default.a,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\views\\main-components\\shrinkable-menu\\components\\sidebarMenuShrink.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-e2f110d2", Component.options)
  } else {
    hotAPI.reload("data-v-e2f110d2", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var render = function render() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", [_vm._l(_vm.menuList, function (item, index) {
    return [_c("div", { key: index, staticStyle: { "text-align": "center" } }, [item.children.length !== 1 ? _c("Dropdown", {
      key: index,
      attrs: { transfer: "", placement: "right-start" },
      on: { "on-click": _vm.changeMenu }
    }, [_c("Button", {
      staticStyle: {
        width: "70px",
        "margin-left": "-5px",
        padding: "10px 0"
      },
      attrs: { type: "text" }
    }, [_c("Icon", {
      attrs: {
        size: 20,
        color: _vm.iconColor,
        type: item.icon
      }
    })], 1), _vm._v(" "), _c("DropdownMenu", {
      staticStyle: { width: "200px" },
      attrs: { slot: "list" },
      slot: "list"
    }, [_vm._l(item.children, function (child, i) {
      return [_c("DropdownItem", { key: i, attrs: { name: child.name } }, [_c("Icon", { attrs: { type: child.icon } }), _c("span", { staticStyle: { "padding-left": "10px" } }, [_vm._v(_vm._s(child.title))])], 1)];
    })], 2)], 1) : _c("Dropdown", {
      key: index,
      attrs: { transfer: "", placement: "right-start" },
      on: { "on-click": _vm.changeMenu }
    }, [_c("Button", {
      staticStyle: {
        width: "70px",
        "margin-left": "-5px",
        padding: "10px 0"
      },
      attrs: { type: "text" },
      on: {
        click: function click($event) {
          _vm.changeMenu(item.children[0].name);
        }
      }
    }, [_c("Icon", {
      attrs: {
        size: 20,
        color: _vm.iconColor,
        type: item.children[0].icon || item.icon
      }
    })], 1), _vm._v(" "), _c("DropdownMenu", {
      staticStyle: { width: "200px" },
      attrs: { slot: "list" },
      slot: "list"
    }, [_c("DropdownItem", {
      key: "d" + index,
      attrs: { name: item.children[0].name }
    }, [_c("Icon", {
      attrs: {
        type: item.children[0].icon || item.icon
      }
    }), _c("span", { staticStyle: { "padding-left": "10px" } }, [_vm._v(_vm._s(item.children[0].title))])], 1)], 1)], 1)], 1)];
  })], 2);
};
var staticRenderFns = [];
render._withStripped = true;
var esExports = { render: render, staticRenderFns: staticRenderFns };
exports.default = esExports;

if (false) {
  module.hot.accept();
  if (module.hot.data) {
    require("vue-hot-reload-api").rerender("data-v-e2f110d2", esExports);
  }
}

/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(146), __esModule: true };

/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(53);
__webpack_require__(27);
module.exports = __webpack_require__(150);


/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__(148);
var step = __webpack_require__(149);
var Iterators = __webpack_require__(22);
var toIObject = __webpack_require__(15);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(69)(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),
/* 148 */
/***/ (function(module, exports) {

module.exports = function () { /* empty */ };


/***/ }),
/* 149 */
/***/ (function(module, exports) {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(6);
var get = __webpack_require__(49);
module.exports = __webpack_require__(2).getIterator = function (it) {
  var iterFn = get(it);
  if (typeof iterFn != 'function') throw TypeError(it + ' is not iterable!');
  return anObject(iterFn.call(it));
};


/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(152), __esModule: true };

/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(27);
__webpack_require__(53);
module.exports = __webpack_require__(55).f('iterator');


/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(154), __esModule: true };

/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(155);
__webpack_require__(89);
__webpack_require__(161);
__webpack_require__(162);
module.exports = __webpack_require__(2).Symbol;


/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// ECMAScript 6 symbols shim
var global = __webpack_require__(0);
var has = __webpack_require__(14);
var DESCRIPTORS = __webpack_require__(13);
var $export = __webpack_require__(10);
var redefine = __webpack_require__(71);
var META = __webpack_require__(156).KEY;
var $fails = __webpack_require__(20);
var shared = __webpack_require__(46);
var setToStringTag = __webpack_require__(32);
var uid = __webpack_require__(31);
var wks = __webpack_require__(1);
var wksExt = __webpack_require__(55);
var wksDefine = __webpack_require__(56);
var enumKeys = __webpack_require__(157);
var isArray = __webpack_require__(158);
var anObject = __webpack_require__(6);
var isObject = __webpack_require__(12);
var toIObject = __webpack_require__(15);
var toPrimitive = __webpack_require__(43);
var createDesc = __webpack_require__(21);
var _create = __webpack_require__(72);
var gOPNExt = __webpack_require__(159);
var $GOPD = __webpack_require__(160);
var $DP = __webpack_require__(8);
var $keys = __webpack_require__(30);
var gOPD = $GOPD.f;
var dP = $DP.f;
var gOPN = gOPNExt.f;
var $Symbol = global.Symbol;
var $JSON = global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE = 'prototype';
var HIDDEN = wks('_hidden');
var TO_PRIMITIVE = wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = shared('symbol-registry');
var AllSymbols = shared('symbols');
var OPSymbols = shared('op-symbols');
var ObjectProto = Object[PROTOTYPE];
var USE_NATIVE = typeof $Symbol == 'function';
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function () {
  return _create(dP({}, 'a', {
    get: function () { return dP(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto, key);
  if (protoDesc) delete ObjectProto[key];
  dP(it, key, D);
  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function (tag) {
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if (has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _create(D, { enumerable: createDesc(0, false) });
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  anObject(it);
  var keys = enumKeys(P = toIObject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P) {
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = toIObject(it);
  key = toPrimitive(key, true);
  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto;
  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto) $set.call(OPSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f = $defineProperty;
  __webpack_require__(88).f = gOPNExt.f = $getOwnPropertyNames;
  __webpack_require__(34).f = $propertyIsEnumerable;
  __webpack_require__(51).f = $getOwnPropertySymbols;

  if (DESCRIPTORS && !__webpack_require__(28)) {
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function (name) {
    return wrap(wks(name));
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });

for (var es6Symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), j = 0; es6Symbols.length > j;)wks(es6Symbols[j++]);

for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () { setter = true; },
  useSimple: function () { setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    $replacer = replacer = args[1];
    if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    if (!isArray(replacer)) replacer = function (key, value) {
      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(11)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);


/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

var META = __webpack_require__(31)('meta');
var isObject = __webpack_require__(12);
var has = __webpack_require__(14);
var setDesc = __webpack_require__(8).f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !__webpack_require__(20)(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};


/***/ }),
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

// all enumerable object keys, includes symbols
var getKeys = __webpack_require__(30);
var gOPS = __webpack_require__(51);
var pIE = __webpack_require__(34);
module.exports = function (it) {
  var result = getKeys(it);
  var getSymbols = gOPS.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = pIE.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  } return result;
};


/***/ }),
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__(23);
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};


/***/ }),
/* 159 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = __webpack_require__(15);
var gOPN = __webpack_require__(88).f;
var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};


/***/ }),
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

var pIE = __webpack_require__(34);
var createDesc = __webpack_require__(21);
var toIObject = __webpack_require__(15);
var toPrimitive = __webpack_require__(43);
var has = __webpack_require__(14);
var IE8_DOM_DEFINE = __webpack_require__(70);
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__(13) ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};


/***/ }),
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(56)('asyncIterator');


/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(56)('observable');


/***/ }),
/* 163 */,
/* 164 */,
/* 165 */,
/* 166 */,
/* 167 */,
/* 168 */,
/* 169 */,
/* 170 */,
/* 171 */,
/* 172 */,
/* 173 */,
/* 174 */,
/* 175 */,
/* 176 */,
/* 177 */,
/* 178 */,
/* 179 */,
/* 180 */,
/* 181 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {exports = module.exports = SemVer;

// The debug function is excluded entirely from the minified version.
/* nomin */ var debug;
/* nomin */ if (typeof process === 'object' &&
    /* nomin */ process.env &&
    /* nomin */ process.env.NODE_DEBUG &&
    /* nomin */ /\bsemver\b/i.test(process.env.NODE_DEBUG))
  /* nomin */ debug = function() {
    /* nomin */ var args = Array.prototype.slice.call(arguments, 0);
    /* nomin */ args.unshift('SEMVER');
    /* nomin */ console.log.apply(console, args);
    /* nomin */ };
/* nomin */ else
  /* nomin */ debug = function() {};

// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.
exports.SEMVER_SPEC_VERSION = '2.0.0';

var MAX_LENGTH = 256;
var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991;

// The actual regexps go on exports.re
var re = exports.re = [];
var src = exports.src = [];
var R = 0;

// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.

// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.

var NUMERICIDENTIFIER = R++;
src[NUMERICIDENTIFIER] = '0|[1-9]\\d*';
var NUMERICIDENTIFIERLOOSE = R++;
src[NUMERICIDENTIFIERLOOSE] = '[0-9]+';


// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.

var NONNUMERICIDENTIFIER = R++;
src[NONNUMERICIDENTIFIER] = '\\d*[a-zA-Z-][a-zA-Z0-9-]*';


// ## Main Version
// Three dot-separated numeric identifiers.

var MAINVERSION = R++;
src[MAINVERSION] = '(' + src[NUMERICIDENTIFIER] + ')\\.' +
                   '(' + src[NUMERICIDENTIFIER] + ')\\.' +
                   '(' + src[NUMERICIDENTIFIER] + ')';

var MAINVERSIONLOOSE = R++;
src[MAINVERSIONLOOSE] = '(' + src[NUMERICIDENTIFIERLOOSE] + ')\\.' +
                        '(' + src[NUMERICIDENTIFIERLOOSE] + ')\\.' +
                        '(' + src[NUMERICIDENTIFIERLOOSE] + ')';

// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.

var PRERELEASEIDENTIFIER = R++;
src[PRERELEASEIDENTIFIER] = '(?:' + src[NUMERICIDENTIFIER] +
                            '|' + src[NONNUMERICIDENTIFIER] + ')';

var PRERELEASEIDENTIFIERLOOSE = R++;
src[PRERELEASEIDENTIFIERLOOSE] = '(?:' + src[NUMERICIDENTIFIERLOOSE] +
                                 '|' + src[NONNUMERICIDENTIFIER] + ')';


// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.

var PRERELEASE = R++;
src[PRERELEASE] = '(?:-(' + src[PRERELEASEIDENTIFIER] +
                  '(?:\\.' + src[PRERELEASEIDENTIFIER] + ')*))';

var PRERELEASELOOSE = R++;
src[PRERELEASELOOSE] = '(?:-?(' + src[PRERELEASEIDENTIFIERLOOSE] +
                       '(?:\\.' + src[PRERELEASEIDENTIFIERLOOSE] + ')*))';

// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.

var BUILDIDENTIFIER = R++;
src[BUILDIDENTIFIER] = '[0-9A-Za-z-]+';

// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.

var BUILD = R++;
src[BUILD] = '(?:\\+(' + src[BUILDIDENTIFIER] +
             '(?:\\.' + src[BUILDIDENTIFIER] + ')*))';


// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.

// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.

var FULL = R++;
var FULLPLAIN = 'v?' + src[MAINVERSION] +
                src[PRERELEASE] + '?' +
                src[BUILD] + '?';

src[FULL] = '^' + FULLPLAIN + '$';

// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
var LOOSEPLAIN = '[v=\\s]*' + src[MAINVERSIONLOOSE] +
                 src[PRERELEASELOOSE] + '?' +
                 src[BUILD] + '?';

var LOOSE = R++;
src[LOOSE] = '^' + LOOSEPLAIN + '$';

var GTLT = R++;
src[GTLT] = '((?:<|>)?=?)';

// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifer, meaning "any version"
// Only the first item is strictly required.
var XRANGEIDENTIFIERLOOSE = R++;
src[XRANGEIDENTIFIERLOOSE] = src[NUMERICIDENTIFIERLOOSE] + '|x|X|\\*';
var XRANGEIDENTIFIER = R++;
src[XRANGEIDENTIFIER] = src[NUMERICIDENTIFIER] + '|x|X|\\*';

var XRANGEPLAIN = R++;
src[XRANGEPLAIN] = '[v=\\s]*(' + src[XRANGEIDENTIFIER] + ')' +
                   '(?:\\.(' + src[XRANGEIDENTIFIER] + ')' +
                   '(?:\\.(' + src[XRANGEIDENTIFIER] + ')' +
                   '(?:' + src[PRERELEASE] + ')?' +
                   src[BUILD] + '?' +
                   ')?)?';

var XRANGEPLAINLOOSE = R++;
src[XRANGEPLAINLOOSE] = '[v=\\s]*(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:\\.(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:\\.(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:' + src[PRERELEASELOOSE] + ')?' +
                        src[BUILD] + '?' +
                        ')?)?';

var XRANGE = R++;
src[XRANGE] = '^' + src[GTLT] + '\\s*' + src[XRANGEPLAIN] + '$';
var XRANGELOOSE = R++;
src[XRANGELOOSE] = '^' + src[GTLT] + '\\s*' + src[XRANGEPLAINLOOSE] + '$';

// Tilde ranges.
// Meaning is "reasonably at or greater than"
var LONETILDE = R++;
src[LONETILDE] = '(?:~>?)';

var TILDETRIM = R++;
src[TILDETRIM] = '(\\s*)' + src[LONETILDE] + '\\s+';
re[TILDETRIM] = new RegExp(src[TILDETRIM], 'g');
var tildeTrimReplace = '$1~';

var TILDE = R++;
src[TILDE] = '^' + src[LONETILDE] + src[XRANGEPLAIN] + '$';
var TILDELOOSE = R++;
src[TILDELOOSE] = '^' + src[LONETILDE] + src[XRANGEPLAINLOOSE] + '$';

// Caret ranges.
// Meaning is "at least and backwards compatible with"
var LONECARET = R++;
src[LONECARET] = '(?:\\^)';

var CARETTRIM = R++;
src[CARETTRIM] = '(\\s*)' + src[LONECARET] + '\\s+';
re[CARETTRIM] = new RegExp(src[CARETTRIM], 'g');
var caretTrimReplace = '$1^';

var CARET = R++;
src[CARET] = '^' + src[LONECARET] + src[XRANGEPLAIN] + '$';
var CARETLOOSE = R++;
src[CARETLOOSE] = '^' + src[LONECARET] + src[XRANGEPLAINLOOSE] + '$';

// A simple gt/lt/eq thing, or just "" to indicate "any version"
var COMPARATORLOOSE = R++;
src[COMPARATORLOOSE] = '^' + src[GTLT] + '\\s*(' + LOOSEPLAIN + ')$|^$';
var COMPARATOR = R++;
src[COMPARATOR] = '^' + src[GTLT] + '\\s*(' + FULLPLAIN + ')$|^$';


// An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`
var COMPARATORTRIM = R++;
src[COMPARATORTRIM] = '(\\s*)' + src[GTLT] +
                      '\\s*(' + LOOSEPLAIN + '|' + src[XRANGEPLAIN] + ')';

// this one has to use the /g flag
re[COMPARATORTRIM] = new RegExp(src[COMPARATORTRIM], 'g');
var comparatorTrimReplace = '$1$2$3';


// Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be
// checked against either the strict or loose comparator form
// later.
var HYPHENRANGE = R++;
src[HYPHENRANGE] = '^\\s*(' + src[XRANGEPLAIN] + ')' +
                   '\\s+-\\s+' +
                   '(' + src[XRANGEPLAIN] + ')' +
                   '\\s*$';

var HYPHENRANGELOOSE = R++;
src[HYPHENRANGELOOSE] = '^\\s*(' + src[XRANGEPLAINLOOSE] + ')' +
                        '\\s+-\\s+' +
                        '(' + src[XRANGEPLAINLOOSE] + ')' +
                        '\\s*$';

// Star ranges basically just allow anything at all.
var STAR = R++;
src[STAR] = '(<|>)?=?\\s*\\*';

// Compile to actual regexp objects.
// All are flag-free, unless they were created above with a flag.
for (var i = 0; i < R; i++) {
  debug(i, src[i]);
  if (!re[i])
    re[i] = new RegExp(src[i]);
}

exports.parse = parse;
function parse(version, loose) {
  if (version instanceof SemVer)
    return version;

  if (typeof version !== 'string')
    return null;

  if (version.length > MAX_LENGTH)
    return null;

  var r = loose ? re[LOOSE] : re[FULL];
  if (!r.test(version))
    return null;

  try {
    return new SemVer(version, loose);
  } catch (er) {
    return null;
  }
}

exports.valid = valid;
function valid(version, loose) {
  var v = parse(version, loose);
  return v ? v.version : null;
}


exports.clean = clean;
function clean(version, loose) {
  var s = parse(version.trim().replace(/^[=v]+/, ''), loose);
  return s ? s.version : null;
}

exports.SemVer = SemVer;

function SemVer(version, loose) {
  if (version instanceof SemVer) {
    if (version.loose === loose)
      return version;
    else
      version = version.version;
  } else if (typeof version !== 'string') {
    throw new TypeError('Invalid Version: ' + version);
  }

  if (version.length > MAX_LENGTH)
    throw new TypeError('version is longer than ' + MAX_LENGTH + ' characters')

  if (!(this instanceof SemVer))
    return new SemVer(version, loose);

  debug('SemVer', version, loose);
  this.loose = loose;
  var m = version.trim().match(loose ? re[LOOSE] : re[FULL]);

  if (!m)
    throw new TypeError('Invalid Version: ' + version);

  this.raw = version;

  // these are actually numbers
  this.major = +m[1];
  this.minor = +m[2];
  this.patch = +m[3];

  if (this.major > MAX_SAFE_INTEGER || this.major < 0)
    throw new TypeError('Invalid major version')

  if (this.minor > MAX_SAFE_INTEGER || this.minor < 0)
    throw new TypeError('Invalid minor version')

  if (this.patch > MAX_SAFE_INTEGER || this.patch < 0)
    throw new TypeError('Invalid patch version')

  // numberify any prerelease numeric ids
  if (!m[4])
    this.prerelease = [];
  else
    this.prerelease = m[4].split('.').map(function(id) {
      if (/^[0-9]+$/.test(id)) {
        var num = +id;
        if (num >= 0 && num < MAX_SAFE_INTEGER)
          return num;
      }
      return id;
    });

  this.build = m[5] ? m[5].split('.') : [];
  this.format();
}

SemVer.prototype.format = function() {
  this.version = this.major + '.' + this.minor + '.' + this.patch;
  if (this.prerelease.length)
    this.version += '-' + this.prerelease.join('.');
  return this.version;
};

SemVer.prototype.toString = function() {
  return this.version;
};

SemVer.prototype.compare = function(other) {
  debug('SemVer.compare', this.version, this.loose, other);
  if (!(other instanceof SemVer))
    other = new SemVer(other, this.loose);

  return this.compareMain(other) || this.comparePre(other);
};

SemVer.prototype.compareMain = function(other) {
  if (!(other instanceof SemVer))
    other = new SemVer(other, this.loose);

  return compareIdentifiers(this.major, other.major) ||
         compareIdentifiers(this.minor, other.minor) ||
         compareIdentifiers(this.patch, other.patch);
};

SemVer.prototype.comparePre = function(other) {
  if (!(other instanceof SemVer))
    other = new SemVer(other, this.loose);

  // NOT having a prerelease is > having one
  if (this.prerelease.length && !other.prerelease.length)
    return -1;
  else if (!this.prerelease.length && other.prerelease.length)
    return 1;
  else if (!this.prerelease.length && !other.prerelease.length)
    return 0;

  var i = 0;
  do {
    var a = this.prerelease[i];
    var b = other.prerelease[i];
    debug('prerelease compare', i, a, b);
    if (a === undefined && b === undefined)
      return 0;
    else if (b === undefined)
      return 1;
    else if (a === undefined)
      return -1;
    else if (a === b)
      continue;
    else
      return compareIdentifiers(a, b);
  } while (++i);
};

// preminor will bump the version up to the next minor release, and immediately
// down to pre-release. premajor and prepatch work the same way.
SemVer.prototype.inc = function(release, identifier) {
  switch (release) {
    case 'premajor':
      this.prerelease.length = 0;
      this.patch = 0;
      this.minor = 0;
      this.major++;
      this.inc('pre', identifier);
      break;
    case 'preminor':
      this.prerelease.length = 0;
      this.patch = 0;
      this.minor++;
      this.inc('pre', identifier);
      break;
    case 'prepatch':
      // If this is already a prerelease, it will bump to the next version
      // drop any prereleases that might already exist, since they are not
      // relevant at this point.
      this.prerelease.length = 0;
      this.inc('patch', identifier);
      this.inc('pre', identifier);
      break;
    // If the input is a non-prerelease version, this acts the same as
    // prepatch.
    case 'prerelease':
      if (this.prerelease.length === 0)
        this.inc('patch', identifier);
      this.inc('pre', identifier);
      break;

    case 'major':
      // If this is a pre-major version, bump up to the same major version.
      // Otherwise increment major.
      // 1.0.0-5 bumps to 1.0.0
      // 1.1.0 bumps to 2.0.0
      if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0)
        this.major++;
      this.minor = 0;
      this.patch = 0;
      this.prerelease = [];
      break;
    case 'minor':
      // If this is a pre-minor version, bump up to the same minor version.
      // Otherwise increment minor.
      // 1.2.0-5 bumps to 1.2.0
      // 1.2.1 bumps to 1.3.0
      if (this.patch !== 0 || this.prerelease.length === 0)
        this.minor++;
      this.patch = 0;
      this.prerelease = [];
      break;
    case 'patch':
      // If this is not a pre-release version, it will increment the patch.
      // If it is a pre-release it will bump up to the same patch version.
      // 1.2.0-5 patches to 1.2.0
      // 1.2.0 patches to 1.2.1
      if (this.prerelease.length === 0)
        this.patch++;
      this.prerelease = [];
      break;
    // This probably shouldn't be used publicly.
    // 1.0.0 "pre" would become 1.0.0-0 which is the wrong direction.
    case 'pre':
      if (this.prerelease.length === 0)
        this.prerelease = [0];
      else {
        var i = this.prerelease.length;
        while (--i >= 0) {
          if (typeof this.prerelease[i] === 'number') {
            this.prerelease[i]++;
            i = -2;
          }
        }
        if (i === -1) // didn't increment anything
          this.prerelease.push(0);
      }
      if (identifier) {
        // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
        // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
        if (this.prerelease[0] === identifier) {
          if (isNaN(this.prerelease[1]))
            this.prerelease = [identifier, 0];
        } else
          this.prerelease = [identifier, 0];
      }
      break;

    default:
      throw new Error('invalid increment argument: ' + release);
  }
  this.format();
  this.raw = this.version;
  return this;
};

exports.inc = inc;
function inc(version, release, loose, identifier) {
  if (typeof(loose) === 'string') {
    identifier = loose;
    loose = undefined;
  }

  try {
    return new SemVer(version, loose).inc(release, identifier).version;
  } catch (er) {
    return null;
  }
}

exports.diff = diff;
function diff(version1, version2) {
  if (eq(version1, version2)) {
    return null;
  } else {
    var v1 = parse(version1);
    var v2 = parse(version2);
    if (v1.prerelease.length || v2.prerelease.length) {
      for (var key in v1) {
        if (key === 'major' || key === 'minor' || key === 'patch') {
          if (v1[key] !== v2[key]) {
            return 'pre'+key;
          }
        }
      }
      return 'prerelease';
    }
    for (var key in v1) {
      if (key === 'major' || key === 'minor' || key === 'patch') {
        if (v1[key] !== v2[key]) {
          return key;
        }
      }
    }
  }
}

exports.compareIdentifiers = compareIdentifiers;

var numeric = /^[0-9]+$/;
function compareIdentifiers(a, b) {
  var anum = numeric.test(a);
  var bnum = numeric.test(b);

  if (anum && bnum) {
    a = +a;
    b = +b;
  }

  return (anum && !bnum) ? -1 :
         (bnum && !anum) ? 1 :
         a < b ? -1 :
         a > b ? 1 :
         0;
}

exports.rcompareIdentifiers = rcompareIdentifiers;
function rcompareIdentifiers(a, b) {
  return compareIdentifiers(b, a);
}

exports.major = major;
function major(a, loose) {
  return new SemVer(a, loose).major;
}

exports.minor = minor;
function minor(a, loose) {
  return new SemVer(a, loose).minor;
}

exports.patch = patch;
function patch(a, loose) {
  return new SemVer(a, loose).patch;
}

exports.compare = compare;
function compare(a, b, loose) {
  return new SemVer(a, loose).compare(new SemVer(b, loose));
}

exports.compareLoose = compareLoose;
function compareLoose(a, b) {
  return compare(a, b, true);
}

exports.rcompare = rcompare;
function rcompare(a, b, loose) {
  return compare(b, a, loose);
}

exports.sort = sort;
function sort(list, loose) {
  return list.sort(function(a, b) {
    return exports.compare(a, b, loose);
  });
}

exports.rsort = rsort;
function rsort(list, loose) {
  return list.sort(function(a, b) {
    return exports.rcompare(a, b, loose);
  });
}

exports.gt = gt;
function gt(a, b, loose) {
  return compare(a, b, loose) > 0;
}

exports.lt = lt;
function lt(a, b, loose) {
  return compare(a, b, loose) < 0;
}

exports.eq = eq;
function eq(a, b, loose) {
  return compare(a, b, loose) === 0;
}

exports.neq = neq;
function neq(a, b, loose) {
  return compare(a, b, loose) !== 0;
}

exports.gte = gte;
function gte(a, b, loose) {
  return compare(a, b, loose) >= 0;
}

exports.lte = lte;
function lte(a, b, loose) {
  return compare(a, b, loose) <= 0;
}

exports.cmp = cmp;
function cmp(a, op, b, loose) {
  var ret;
  switch (op) {
    case '===':
      if (typeof a === 'object') a = a.version;
      if (typeof b === 'object') b = b.version;
      ret = a === b;
      break;
    case '!==':
      if (typeof a === 'object') a = a.version;
      if (typeof b === 'object') b = b.version;
      ret = a !== b;
      break;
    case '': case '=': case '==': ret = eq(a, b, loose); break;
    case '!=': ret = neq(a, b, loose); break;
    case '>': ret = gt(a, b, loose); break;
    case '>=': ret = gte(a, b, loose); break;
    case '<': ret = lt(a, b, loose); break;
    case '<=': ret = lte(a, b, loose); break;
    default: throw new TypeError('Invalid operator: ' + op);
  }
  return ret;
}

exports.Comparator = Comparator;
function Comparator(comp, loose) {
  if (comp instanceof Comparator) {
    if (comp.loose === loose)
      return comp;
    else
      comp = comp.value;
  }

  if (!(this instanceof Comparator))
    return new Comparator(comp, loose);

  debug('comparator', comp, loose);
  this.loose = loose;
  this.parse(comp);

  if (this.semver === ANY)
    this.value = '';
  else
    this.value = this.operator + this.semver.version;

  debug('comp', this);
}

var ANY = {};
Comparator.prototype.parse = function(comp) {
  var r = this.loose ? re[COMPARATORLOOSE] : re[COMPARATOR];
  var m = comp.match(r);

  if (!m)
    throw new TypeError('Invalid comparator: ' + comp);

  this.operator = m[1];
  if (this.operator === '=')
    this.operator = '';

  // if it literally is just '>' or '' then allow anything.
  if (!m[2])
    this.semver = ANY;
  else
    this.semver = new SemVer(m[2], this.loose);
};

Comparator.prototype.toString = function() {
  return this.value;
};

Comparator.prototype.test = function(version) {
  debug('Comparator.test', version, this.loose);

  if (this.semver === ANY)
    return true;

  if (typeof version === 'string')
    version = new SemVer(version, this.loose);

  return cmp(version, this.operator, this.semver, this.loose);
};

Comparator.prototype.intersects = function(comp, loose) {
  if (!(comp instanceof Comparator)) {
    throw new TypeError('a Comparator is required');
  }

  var rangeTmp;

  if (this.operator === '') {
    rangeTmp = new Range(comp.value, loose);
    return satisfies(this.value, rangeTmp, loose);
  } else if (comp.operator === '') {
    rangeTmp = new Range(this.value, loose);
    return satisfies(comp.semver, rangeTmp, loose);
  }

  var sameDirectionIncreasing =
    (this.operator === '>=' || this.operator === '>') &&
    (comp.operator === '>=' || comp.operator === '>');
  var sameDirectionDecreasing =
    (this.operator === '<=' || this.operator === '<') &&
    (comp.operator === '<=' || comp.operator === '<');
  var sameSemVer = this.semver.version === comp.semver.version;
  var differentDirectionsInclusive =
    (this.operator === '>=' || this.operator === '<=') &&
    (comp.operator === '>=' || comp.operator === '<=');
  var oppositeDirectionsLessThan =
    cmp(this.semver, '<', comp.semver, loose) &&
    ((this.operator === '>=' || this.operator === '>') &&
    (comp.operator === '<=' || comp.operator === '<'));
  var oppositeDirectionsGreaterThan =
    cmp(this.semver, '>', comp.semver, loose) &&
    ((this.operator === '<=' || this.operator === '<') &&
    (comp.operator === '>=' || comp.operator === '>'));

  return sameDirectionIncreasing || sameDirectionDecreasing ||
    (sameSemVer && differentDirectionsInclusive) ||
    oppositeDirectionsLessThan || oppositeDirectionsGreaterThan;
};


exports.Range = Range;
function Range(range, loose) {
  if (range instanceof Range) {
    if (range.loose === loose) {
      return range;
    } else {
      return new Range(range.raw, loose);
    }
  }

  if (range instanceof Comparator) {
    return new Range(range.value, loose);
  }

  if (!(this instanceof Range))
    return new Range(range, loose);

  this.loose = loose;

  // First, split based on boolean or ||
  this.raw = range;
  this.set = range.split(/\s*\|\|\s*/).map(function(range) {
    return this.parseRange(range.trim());
  }, this).filter(function(c) {
    // throw out any that are not relevant for whatever reason
    return c.length;
  });

  if (!this.set.length) {
    throw new TypeError('Invalid SemVer Range: ' + range);
  }

  this.format();
}

Range.prototype.format = function() {
  this.range = this.set.map(function(comps) {
    return comps.join(' ').trim();
  }).join('||').trim();
  return this.range;
};

Range.prototype.toString = function() {
  return this.range;
};

Range.prototype.parseRange = function(range) {
  var loose = this.loose;
  range = range.trim();
  debug('range', range, loose);
  // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
  var hr = loose ? re[HYPHENRANGELOOSE] : re[HYPHENRANGE];
  range = range.replace(hr, hyphenReplace);
  debug('hyphen replace', range);
  // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
  range = range.replace(re[COMPARATORTRIM], comparatorTrimReplace);
  debug('comparator trim', range, re[COMPARATORTRIM]);

  // `~ 1.2.3` => `~1.2.3`
  range = range.replace(re[TILDETRIM], tildeTrimReplace);

  // `^ 1.2.3` => `^1.2.3`
  range = range.replace(re[CARETTRIM], caretTrimReplace);

  // normalize spaces
  range = range.split(/\s+/).join(' ');

  // At this point, the range is completely trimmed and
  // ready to be split into comparators.

  var compRe = loose ? re[COMPARATORLOOSE] : re[COMPARATOR];
  var set = range.split(' ').map(function(comp) {
    return parseComparator(comp, loose);
  }).join(' ').split(/\s+/);
  if (this.loose) {
    // in loose mode, throw out any that are not valid comparators
    set = set.filter(function(comp) {
      return !!comp.match(compRe);
    });
  }
  set = set.map(function(comp) {
    return new Comparator(comp, loose);
  });

  return set;
};

Range.prototype.intersects = function(range, loose) {
  if (!(range instanceof Range)) {
    throw new TypeError('a Range is required');
  }

  return this.set.some(function(thisComparators) {
    return thisComparators.every(function(thisComparator) {
      return range.set.some(function(rangeComparators) {
        return rangeComparators.every(function(rangeComparator) {
          return thisComparator.intersects(rangeComparator, loose);
        });
      });
    });
  });
};

// Mostly just for testing and legacy API reasons
exports.toComparators = toComparators;
function toComparators(range, loose) {
  return new Range(range, loose).set.map(function(comp) {
    return comp.map(function(c) {
      return c.value;
    }).join(' ').trim().split(' ');
  });
}

// comprised of xranges, tildes, stars, and gtlt's at this point.
// already replaced the hyphen ranges
// turn into a set of JUST comparators.
function parseComparator(comp, loose) {
  debug('comp', comp);
  comp = replaceCarets(comp, loose);
  debug('caret', comp);
  comp = replaceTildes(comp, loose);
  debug('tildes', comp);
  comp = replaceXRanges(comp, loose);
  debug('xrange', comp);
  comp = replaceStars(comp, loose);
  debug('stars', comp);
  return comp;
}

function isX(id) {
  return !id || id.toLowerCase() === 'x' || id === '*';
}

// ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0
function replaceTildes(comp, loose) {
  return comp.trim().split(/\s+/).map(function(comp) {
    return replaceTilde(comp, loose);
  }).join(' ');
}

function replaceTilde(comp, loose) {
  var r = loose ? re[TILDELOOSE] : re[TILDE];
  return comp.replace(r, function(_, M, m, p, pr) {
    debug('tilde', comp, _, M, m, p, pr);
    var ret;

    if (isX(M))
      ret = '';
    else if (isX(m))
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0';
    else if (isX(p))
      // ~1.2 == >=1.2.0 <1.3.0
      ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0';
    else if (pr) {
      debug('replaceTilde pr', pr);
      if (pr.charAt(0) !== '-')
        pr = '-' + pr;
      ret = '>=' + M + '.' + m + '.' + p + pr +
            ' <' + M + '.' + (+m + 1) + '.0';
    } else
      // ~1.2.3 == >=1.2.3 <1.3.0
      ret = '>=' + M + '.' + m + '.' + p +
            ' <' + M + '.' + (+m + 1) + '.0';

    debug('tilde return', ret);
    return ret;
  });
}

// ^ --> * (any, kinda silly)
// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0
// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0
// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0
// ^1.2.3 --> >=1.2.3 <2.0.0
// ^1.2.0 --> >=1.2.0 <2.0.0
function replaceCarets(comp, loose) {
  return comp.trim().split(/\s+/).map(function(comp) {
    return replaceCaret(comp, loose);
  }).join(' ');
}

function replaceCaret(comp, loose) {
  debug('caret', comp, loose);
  var r = loose ? re[CARETLOOSE] : re[CARET];
  return comp.replace(r, function(_, M, m, p, pr) {
    debug('caret', comp, _, M, m, p, pr);
    var ret;

    if (isX(M))
      ret = '';
    else if (isX(m))
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0';
    else if (isX(p)) {
      if (M === '0')
        ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0';
      else
        ret = '>=' + M + '.' + m + '.0 <' + (+M + 1) + '.0.0';
    } else if (pr) {
      debug('replaceCaret pr', pr);
      if (pr.charAt(0) !== '-')
        pr = '-' + pr;
      if (M === '0') {
        if (m === '0')
          ret = '>=' + M + '.' + m + '.' + p + pr +
                ' <' + M + '.' + m + '.' + (+p + 1);
        else
          ret = '>=' + M + '.' + m + '.' + p + pr +
                ' <' + M + '.' + (+m + 1) + '.0';
      } else
        ret = '>=' + M + '.' + m + '.' + p + pr +
              ' <' + (+M + 1) + '.0.0';
    } else {
      debug('no pr');
      if (M === '0') {
        if (m === '0')
          ret = '>=' + M + '.' + m + '.' + p +
                ' <' + M + '.' + m + '.' + (+p + 1);
        else
          ret = '>=' + M + '.' + m + '.' + p +
                ' <' + M + '.' + (+m + 1) + '.0';
      } else
        ret = '>=' + M + '.' + m + '.' + p +
              ' <' + (+M + 1) + '.0.0';
    }

    debug('caret return', ret);
    return ret;
  });
}

function replaceXRanges(comp, loose) {
  debug('replaceXRanges', comp, loose);
  return comp.split(/\s+/).map(function(comp) {
    return replaceXRange(comp, loose);
  }).join(' ');
}

function replaceXRange(comp, loose) {
  comp = comp.trim();
  var r = loose ? re[XRANGELOOSE] : re[XRANGE];
  return comp.replace(r, function(ret, gtlt, M, m, p, pr) {
    debug('xRange', comp, ret, gtlt, M, m, p, pr);
    var xM = isX(M);
    var xm = xM || isX(m);
    var xp = xm || isX(p);
    var anyX = xp;

    if (gtlt === '=' && anyX)
      gtlt = '';

    if (xM) {
      if (gtlt === '>' || gtlt === '<') {
        // nothing is allowed
        ret = '<0.0.0';
      } else {
        // nothing is forbidden
        ret = '*';
      }
    } else if (gtlt && anyX) {
      // replace X with 0
      if (xm)
        m = 0;
      if (xp)
        p = 0;

      if (gtlt === '>') {
        // >1 => >=2.0.0
        // >1.2 => >=1.3.0
        // >1.2.3 => >= 1.2.4
        gtlt = '>=';
        if (xm) {
          M = +M + 1;
          m = 0;
          p = 0;
        } else if (xp) {
          m = +m + 1;
          p = 0;
        }
      } else if (gtlt === '<=') {
        // <=0.7.x is actually <0.8.0, since any 0.7.x should
        // pass.  Similarly, <=7.x is actually <8.0.0, etc.
        gtlt = '<';
        if (xm)
          M = +M + 1;
        else
          m = +m + 1;
      }

      ret = gtlt + M + '.' + m + '.' + p;
    } else if (xm) {
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0';
    } else if (xp) {
      ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0';
    }

    debug('xRange return', ret);

    return ret;
  });
}

// Because * is AND-ed with everything else in the comparator,
// and '' means "any version", just remove the *s entirely.
function replaceStars(comp, loose) {
  debug('replaceStars', comp, loose);
  // Looseness is ignored here.  star is always as loose as it gets!
  return comp.trim().replace(re[STAR], '');
}

// This function is passed to string.replace(re[HYPHENRANGE])
// M, m, patch, prerelease, build
// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
// 1.2.3 - 3.4 => >=1.2.0 <3.5.0 Any 3.4.x will do
// 1.2 - 3.4 => >=1.2.0 <3.5.0
function hyphenReplace($0,
                       from, fM, fm, fp, fpr, fb,
                       to, tM, tm, tp, tpr, tb) {

  if (isX(fM))
    from = '';
  else if (isX(fm))
    from = '>=' + fM + '.0.0';
  else if (isX(fp))
    from = '>=' + fM + '.' + fm + '.0';
  else
    from = '>=' + from;

  if (isX(tM))
    to = '';
  else if (isX(tm))
    to = '<' + (+tM + 1) + '.0.0';
  else if (isX(tp))
    to = '<' + tM + '.' + (+tm + 1) + '.0';
  else if (tpr)
    to = '<=' + tM + '.' + tm + '.' + tp + '-' + tpr;
  else
    to = '<=' + to;

  return (from + ' ' + to).trim();
}


// if ANY of the sets match ALL of its comparators, then pass
Range.prototype.test = function(version) {
  if (!version)
    return false;

  if (typeof version === 'string')
    version = new SemVer(version, this.loose);

  for (var i = 0; i < this.set.length; i++) {
    if (testSet(this.set[i], version))
      return true;
  }
  return false;
};

function testSet(set, version) {
  for (var i = 0; i < set.length; i++) {
    if (!set[i].test(version))
      return false;
  }

  if (version.prerelease.length) {
    // Find the set of versions that are allowed to have prereleases
    // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
    // That should allow `1.2.3-pr.2` to pass.
    // However, `1.2.4-alpha.notready` should NOT be allowed,
    // even though it's within the range set by the comparators.
    for (var i = 0; i < set.length; i++) {
      debug(set[i].semver);
      if (set[i].semver === ANY)
        continue;

      if (set[i].semver.prerelease.length > 0) {
        var allowed = set[i].semver;
        if (allowed.major === version.major &&
            allowed.minor === version.minor &&
            allowed.patch === version.patch)
          return true;
      }
    }

    // Version has a -pre, but it's not one of the ones we like.
    return false;
  }

  return true;
}

exports.satisfies = satisfies;
function satisfies(version, range, loose) {
  try {
    range = new Range(range, loose);
  } catch (er) {
    return false;
  }
  return range.test(version);
}

exports.maxSatisfying = maxSatisfying;
function maxSatisfying(versions, range, loose) {
  var max = null;
  var maxSV = null;
  try {
    var rangeObj = new Range(range, loose);
  } catch (er) {
    return null;
  }
  versions.forEach(function (v) {
    if (rangeObj.test(v)) { // satisfies(v, range, loose)
      if (!max || maxSV.compare(v) === -1) { // compare(max, v, true)
        max = v;
        maxSV = new SemVer(max, loose);
      }
    }
  })
  return max;
}

exports.minSatisfying = minSatisfying;
function minSatisfying(versions, range, loose) {
  var min = null;
  var minSV = null;
  try {
    var rangeObj = new Range(range, loose);
  } catch (er) {
    return null;
  }
  versions.forEach(function (v) {
    if (rangeObj.test(v)) { // satisfies(v, range, loose)
      if (!min || minSV.compare(v) === 1) { // compare(min, v, true)
        min = v;
        minSV = new SemVer(min, loose);
      }
    }
  })
  return min;
}

exports.validRange = validRange;
function validRange(range, loose) {
  try {
    // Return '*' instead of '' so that truthiness works.
    // This will throw if it's invalid anyway
    return new Range(range, loose).range || '*';
  } catch (er) {
    return null;
  }
}

// Determine if version is less than all the versions possible in the range
exports.ltr = ltr;
function ltr(version, range, loose) {
  return outside(version, range, '<', loose);
}

// Determine if version is greater than all the versions possible in the range.
exports.gtr = gtr;
function gtr(version, range, loose) {
  return outside(version, range, '>', loose);
}

exports.outside = outside;
function outside(version, range, hilo, loose) {
  version = new SemVer(version, loose);
  range = new Range(range, loose);

  var gtfn, ltefn, ltfn, comp, ecomp;
  switch (hilo) {
    case '>':
      gtfn = gt;
      ltefn = lte;
      ltfn = lt;
      comp = '>';
      ecomp = '>=';
      break;
    case '<':
      gtfn = lt;
      ltefn = gte;
      ltfn = gt;
      comp = '<';
      ecomp = '<=';
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }

  // If it satisifes the range it is not outside
  if (satisfies(version, range, loose)) {
    return false;
  }

  // From now on, variable terms are as if we're in "gtr" mode.
  // but note that everything is flipped for the "ltr" function.

  for (var i = 0; i < range.set.length; ++i) {
    var comparators = range.set[i];

    var high = null;
    var low = null;

    comparators.forEach(function(comparator) {
      if (comparator.semver === ANY) {
        comparator = new Comparator('>=0.0.0')
      }
      high = high || comparator;
      low = low || comparator;
      if (gtfn(comparator.semver, high.semver, loose)) {
        high = comparator;
      } else if (ltfn(comparator.semver, low.semver, loose)) {
        low = comparator;
      }
    });

    // If the edge version comparator has a operator then our version
    // isn't outside it
    if (high.operator === comp || high.operator === ecomp) {
      return false;
    }

    // If the lowest version comparator has an operator and our version
    // is less than it then it isn't higher than the range
    if ((!low.operator || low.operator === comp) &&
        ltefn(version, low.semver)) {
      return false;
    } else if (low.operator === ecomp && ltfn(version, low.semver)) {
      return false;
    }
  }
  return true;
}

exports.prerelease = prerelease;
function prerelease(version, loose) {
  var parsed = parse(version, loose);
  return (parsed && parsed.prerelease.length) ? parsed.prerelease : null;
}

exports.intersects = intersects;
function intersects(r1, r2, loose) {
  r1 = new Range(r1, loose)
  r2 = new Range(r2, loose)
  return r1.intersects(r2)
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9)))

/***/ }),
/* 182 */
/***/ (function(module, exports) {

module.exports = {"name":"fastjee-webui","version":"1.3.1","description":"fastjee web ui","main":"index.js","scripts":{"init":"webpack --progress --config build/webpack.dev.config.js","dev":"webpack-dev-server --content-base ./ --open --inline --hot --compress --config build/webpack.dev.config.js","build":"webpack --progress --hide-modules --config build/webpack.prod.config.js","lint":"eslint --fix --ext .js,.vue src","test":"npm run lint"},"repository":{"type":"git","url":"https://gitee.com/wuwenze/Fastjee.git"},"author":"??????????????????<wenzewoo@gmail.com>","license":"MIT","dependencies":{"area-data":"^1.0.0","axios":"^0.17.1","clipboard":"^1.7.1","countup":"^1.8.2","cropperjs":"^1.2.2","echarts":"^3.8.5","html2canvas":"^0.5.0-beta4","iview":"^2.8.0","iview-area":"^1.5.14","js-cookie":"^2.2.0","rasterizehtml":"^1.2.4","simplemde":"^1.11.2","sortablejs":"^1.7.0","tinymce":"^4.7.4","vue":"^2.5.13","vue-router":"^3.0.1","vue-virtual-scroller":"^0.10.6","vuex":"^3.0.1"},"devDependencies":{"autoprefixer-loader":"^3.2.0","babel":"^6.23.0","babel-core":"^6.23.1","babel-eslint":"^8.2.1","babel-loader":"^7.1.2","babel-plugin-syntax-dynamic-import":"^6.18.0","babel-plugin-transform-runtime":"^6.12.0","babel-preset-env":"^1.6.1","babel-preset-es2015":"^6.9.0","babel-preset-stage-3":"^6.24.1","babel-runtime":"^6.11.6","clean-webpack-plugin":"^0.1.17","copy-webpack-plugin":"^4.3.1","css-hot-loader":"^1.3.5","css-loader":"^0.28.8","ejs-loader":"^0.3.0","eslint":"^4.15.0","eslint-config-google":"^0.9.1","eslint-config-standard":"^10.2.1","eslint-plugin-html":"^4.0.1","eslint-plugin-import":"^2.8.0","eslint-plugin-node":"^5.2.1","eslint-plugin-promise":"^3.6.0","eslint-plugin-standard":"^3.0.1","extract-text-webpack-plugin":"^3.0.2","file-loader":"^1.1.6","happypack":"^4.0.0","html-loader":"^0.5.4","html-webpack-plugin":"^2.28.0","less":"^2.7.3","less-loader":"^4.0.5","semver":"^5.4.1","style-loader":"^0.19.1","unsupported":"^1.1.0","url-loader":"^0.6.2","vue-hot-reload-api":"^2.2.4","vue-html-loader":"^1.2.3","vue-i18n":"^5.0.3","vue-loader":"^13.7.0","vue-style-loader":"^3.0.3","vue-template-compiler":"^2.5.13","webpack":"^3.10.0","webpack-dev-server":"^2.10.1","webpack-merge":"^4.1.1","webpack-uglify-parallel":"^0.1.4"}}

/***/ }),
/* 183 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var render = function render() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "ivu-shrinkable-menu", style: { background: _vm.bgColor } }, [_vm._t("top"), _vm._v(" "), _c("sidebar-menu", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: !_vm.shrink,
      expression: "!shrink"
    }],
    attrs: {
      "menu-theme": _vm.theme,
      "menu-list": _vm.menuList,
      "open-names": _vm.openNames
    },
    on: { "on-change": _vm.handleChange }
  }), _vm._v(" "), _c("sidebar-menu-shrink", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.shrink,
      expression: "shrink"
    }],
    attrs: {
      "menu-theme": _vm.theme,
      "menu-list": _vm.menuList,
      "icon-color": _vm.shrinkIconColor
    },
    on: { "on-change": _vm.handleChange }
  })], 2);
};
var staticRenderFns = [];
render._withStripped = true;
var esExports = { render: render, staticRenderFns: staticRenderFns };
exports.default = esExports;

if (false) {
  module.hot.accept();
  if (module.hot.data) {
    require("vue-hot-reload-api").rerender("data-v-0ddd0800", esExports);
  }
}

/***/ }),
/* 184 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_tags_page_opened_vue__ = __webpack_require__(96);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_tags_page_opened_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_tags_page_opened_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_tags_page_opened_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_tags_page_opened_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__babel_loader_node_modules_vue_loader_lib_template_compiler_index_id_data_v_73fb9a4e_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_tags_page_opened_vue__ = __webpack_require__(188);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__babel_loader_node_modules_vue_loader_lib_template_compiler_index_id_data_v_73fb9a4e_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_tags_page_opened_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__babel_loader_node_modules_vue_loader_lib_template_compiler_index_id_data_v_73fb9a4e_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_tags_page_opened_vue__);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(185)
}
var normalizeComponent = __webpack_require__(4)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_tags_page_opened_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__babel_loader_node_modules_vue_loader_lib_template_compiler_index_id_data_v_73fb9a4e_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_tags_page_opened_vue___default.a,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\views\\main-components\\tags-page-opened.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-73fb9a4e", Component.options)
  } else {
    hotAPI.reload("data-v-73fb9a4e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 185 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(186);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(18)("202e1d5e", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-73fb9a4e\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/less-loader/dist/cjs.js!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./tags-page-opened.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-73fb9a4e\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/less-loader/dist/cjs.js!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./tags-page-opened.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 186 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(17)(false);
// imports


// module
exports.push([module.i, "\n.lock-screen-back {\n  border-radius: 50%;\n  z-index: -1;\n  box-shadow: 0 0 0 0 #667aa6 inset;\n  position: fixed;\n  left: 50%;\n  top: 50%;\n  -webkit-transform: translate(-50%, -50%);\n          transform: translate(-50%, -50%);\n  transition: all 3s;\n}\n.ivu-select-dropdown {\n  max-height: 800px !important;\n}\n.main {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n}\n.main .unlock-con {\n  width: 0px;\n  height: 0px;\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  z-index: 11000;\n}\n.main .sidebar-menu-con {\n  height: 100%;\n  position: fixed;\n  top: 0;\n  left: 0;\n  z-index: 21;\n  transition: width .3s;\n}\n.main .layout-text {\n  display: inline-block;\n  white-space: nowrap;\n  position: absolute;\n}\n.main .main-hide-text .layout-text {\n  display: none;\n}\n.main-content-container {\n  position: relative;\n}\n.main-header-con {\n  box-sizing: border-box;\n  position: fixed;\n  display: block;\n  padding-left: 200px;\n  width: 100%;\n  height: 100px;\n  z-index: 20;\n  box-shadow: 0 2px 1px 1px rgba(100, 100, 100, 0.1);\n  transition: padding .3s;\n}\n.main-breadcrumb {\n  padding: 8px 15px 0;\n}\n.main-menu-left {\n  background: #464c5b;\n  height: 100%;\n}\n.main .tags-con {\n  height: 40px;\n  z-index: -1;\n  overflow: hidden;\n  background: #f0f0f0;\n}\n.main .tags-con .tags-outer-scroll-con {\n  position: relative;\n  box-sizing: border-box;\n  padding-right: 120px;\n  width: 100%;\n  height: 100%;\n}\n.main .tags-con .tags-outer-scroll-con .tags-inner-scroll-body {\n  position: absolute;\n  padding: 2px 10px;\n  overflow: visible;\n  white-space: nowrap;\n  transition: left .3s ease;\n}\n.main .tags-con .tags-outer-scroll-con .close-all-tag-con {\n  position: absolute;\n  right: 0;\n  top: 0;\n  box-sizing: border-box;\n  padding-top: 8px;\n  text-align: center;\n  width: 110px;\n  height: 100%;\n  background: white;\n  box-shadow: -3px 0 15px 3px rgba(0, 0, 0, 0.1);\n  z-index: 10;\n}\n.main-header {\n  height: 60px;\n  background: #fff;\n  box-shadow: 0 2px 1px 1px rgba(100, 100, 100, 0.1);\n  position: relative;\n  z-index: 11;\n}\n.main-header .navicon-con {\n  margin: 6px;\n  display: inline-block;\n}\n.main-header .header-middle-con {\n  position: absolute;\n  left: 60px;\n  top: 0;\n  right: 340px;\n  bottom: 0;\n  padding: 10px;\n  overflow: hidden;\n}\n.main-header .header-avator-con {\n  position: absolute;\n  right: 0;\n  top: 0;\n  height: 100%;\n  width: 300px;\n}\n.main-header .header-avator-con .switch-theme-con {\n  display: inline-block;\n  width: 40px;\n  height: 100%;\n}\n.main-header .header-avator-con .message-con {\n  display: inline-block;\n  width: 30px;\n  padding: 18px 0;\n  text-align: center;\n  cursor: pointer;\n}\n.main-header .header-avator-con .message-con i {\n  vertical-align: middle;\n}\n.main-header .header-avator-con .change-skin {\n  font-size: 14px;\n  font-weight: 500;\n  padding-right: 5px;\n}\n.main-header .header-avator-con .switch-theme {\n  height: 100%;\n}\n.main-header .header-avator-con .user-dropdown-menu-con {\n  position: absolute;\n  right: 0;\n  top: 0;\n  width: 150px;\n  height: 100%;\n}\n.main-header .header-avator-con .user-dropdown-menu-con .main-user-name {\n  display: inline-block;\n  width: 80px;\n  word-break: keep-all;\n  white-space: nowrap;\n  vertical-align: middle;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  text-align: right;\n}\n.main-header .header-avator-con .user-dropdown-innercon {\n  height: 100%;\n  padding-right: 14px;\n}\n.main-header .header-avator-con .full-screen-btn-con {\n  display: inline-block;\n  width: 30px;\n  padding: 18px 0;\n  text-align: center;\n  cursor: pointer;\n}\n.main-header .header-avator-con .full-screen-btn-con i {\n  vertical-align: middle;\n}\n.main-header .header-avator-con .lock-screen-btn-con {\n  display: inline-block;\n  width: 30px;\n  padding: 18px 0;\n  text-align: center;\n  cursor: pointer;\n}\n.main-header .header-avator-con .lock-screen-btn-con i {\n  vertical-align: middle;\n}\n.main .single-page-con {\n  position: absolute;\n  top: 100px;\n  right: 0;\n  bottom: 0;\n  overflow: auto;\n  background-color: #F0F0F0;\n  z-index: 1;\n  transition: left .3s;\n}\n.main .single-page-con .single-page {\n  margin: 10px;\n}\n.main-copy {\n  text-align: center;\n  padding: 10px 0 20px;\n  color: #9ea7b4;\n}\n.taglist-moving-animation-move {\n  transition: -webkit-transform .3s;\n  transition: transform .3s;\n  transition: transform .3s, -webkit-transform .3s;\n}\n.logo-con {\n  padding: 15px;\n  text-align: center;\n}\n.logo-con .logo-full {\n  height: 60px;\n  width: auto;\n}\n.logo-con .logo-mini {\n  height: 35px;\n  width: auto;\n}\n", ""]);

// exports


/***/ }),
/* 187 */
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__(2);
var $JSON = core.JSON || (core.JSON = { stringify: JSON.stringify });
module.exports = function stringify(it) { // eslint-disable-line no-unused-vars
  return $JSON.stringify.apply($JSON, arguments);
};


/***/ }),
/* 188 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var render = function render() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", {
    ref: "scrollCon",
    staticClass: "tags-outer-scroll-con",
    on: { DOMMouseScroll: _vm.handlescroll, mousewheel: _vm.handlescroll }
  }, [_c("div", { staticClass: "close-all-tag-con" }, [_c("Dropdown", {
    attrs: { transfer: "" },
    on: { "on-click": _vm.handleTagsOption }
  }, [_c("Button", { attrs: { size: "small", type: "primary" } }, [_vm._v("\n                ????????????\n                "), _c("Icon", { attrs: { type: "arrow-down-b" } })], 1), _vm._v(" "), _c("DropdownMenu", { attrs: { slot: "list" }, slot: "list" }, [_c("DropdownItem", { attrs: { name: "clearAll" } }, [_vm._v("????????????")]), _vm._v(" "), _c("DropdownItem", { attrs: { name: "clearOthers" } }, [_vm._v("????????????")])], 1)], 1)], 1), _vm._v(" "), _c("div", {
    ref: "scrollBody",
    staticClass: "tags-inner-scroll-body",
    style: { left: _vm.tagBodyLeft + "px" }
  }, [_c("transition-group", { attrs: { name: "taglist-moving-animation" } }, _vm._l(_vm.pageTagsList, function (item, index) {
    return _c("Tag", {
      key: item.name,
      ref: "tagsPageOpened",
      refInFor: true,
      attrs: {
        type: "dot",
        name: item.name,
        closable: item.name === "home_index" ? false : true,
        color: item.children ? item.children[0].name === _vm.currentPageName ? "blue" : "default" : item.name === _vm.currentPageName ? "blue" : "default"
      },
      on: { "on-close": _vm.closePage },
      nativeOn: {
        click: function click($event) {
          _vm.linkTo(item);
        }
      }
    }, [_vm._v(_vm._s(_vm.itemTitle(item)))]);
  }))], 1)]);
};
var staticRenderFns = [];
render._withStripped = true;
var esExports = { render: render, staticRenderFns: staticRenderFns };
exports.default = esExports;

if (false) {
  module.hot.accept();
  if (module.hot.data) {
    require("vue-hot-reload-api").rerender("data-v-73fb9a4e", esExports);
  }
}

/***/ }),
/* 189 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_breadcrumb_nav_vue__ = __webpack_require__(98);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_breadcrumb_nav_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_breadcrumb_nav_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_breadcrumb_nav_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_breadcrumb_nav_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__babel_loader_node_modules_vue_loader_lib_template_compiler_index_id_data_v_64f9b402_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_breadcrumb_nav_vue__ = __webpack_require__(190);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__babel_loader_node_modules_vue_loader_lib_template_compiler_index_id_data_v_64f9b402_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_breadcrumb_nav_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__babel_loader_node_modules_vue_loader_lib_template_compiler_index_id_data_v_64f9b402_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_breadcrumb_nav_vue__);
var disposed = false
var normalizeComponent = __webpack_require__(4)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_breadcrumb_nav_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__babel_loader_node_modules_vue_loader_lib_template_compiler_index_id_data_v_64f9b402_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_breadcrumb_nav_vue___default.a,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\views\\main-components\\breadcrumb-nav.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-64f9b402", Component.options)
  } else {
    hotAPI.reload("data-v-64f9b402", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 190 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var render = function render() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("Breadcrumb", _vm._l(_vm.currentPath, function (item) {
    return _c("BreadcrumbItem", { key: item.name, attrs: { href: item.path } }, [_vm._v(_vm._s(_vm.itemTitle(item)))]);
  }));
};
var staticRenderFns = [];
render._withStripped = true;
var esExports = { render: render, staticRenderFns: staticRenderFns };
exports.default = esExports;

if (false) {
  module.hot.accept();
  if (module.hot.data) {
    require("vue-hot-reload-api").rerender("data-v-64f9b402", esExports);
  }
}

/***/ }),
/* 191 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_fullscreen_vue__ = __webpack_require__(99);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_fullscreen_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_fullscreen_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_fullscreen_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_fullscreen_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__babel_loader_node_modules_vue_loader_lib_template_compiler_index_id_data_v_5ca08361_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_fullscreen_vue__ = __webpack_require__(192);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__babel_loader_node_modules_vue_loader_lib_template_compiler_index_id_data_v_5ca08361_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_fullscreen_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__babel_loader_node_modules_vue_loader_lib_template_compiler_index_id_data_v_5ca08361_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_fullscreen_vue__);
var disposed = false
var normalizeComponent = __webpack_require__(4)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_fullscreen_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__babel_loader_node_modules_vue_loader_lib_template_compiler_index_id_data_v_5ca08361_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_fullscreen_vue___default.a,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\views\\main-components\\fullscreen.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5ca08361", Component.options)
  } else {
    hotAPI.reload("data-v-5ca08361", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 192 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var render = function render() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _vm.showFullScreenBtn ? _c("div", { staticClass: "full-screen-btn-con", on: { click: _vm.handleChange } }, [_c("Tooltip", {
    attrs: {
      content: _vm.value ? "????????????" : "??????",
      placement: "bottom"
    }
  }, [_c("Icon", {
    attrs: {
      type: _vm.value ? "arrow-shrink" : "arrow-expand",
      size: 23
    }
  })], 1)], 1) : _vm._e();
};
var staticRenderFns = [];
render._withStripped = true;
var esExports = { render: render, staticRenderFns: staticRenderFns };
exports.default = esExports;

if (false) {
  module.hot.accept();
  if (module.hot.data) {
    require("vue-hot-reload-api").rerender("data-v-5ca08361", esExports);
  }
}

/***/ }),
/* 193 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_lockscreen_vue__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_lockscreen_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_lockscreen_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_lockscreen_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_lockscreen_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__babel_loader_node_modules_vue_loader_lib_template_compiler_index_id_data_v_2f167646_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_lockscreen_vue__ = __webpack_require__(194);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__babel_loader_node_modules_vue_loader_lib_template_compiler_index_id_data_v_2f167646_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_lockscreen_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__babel_loader_node_modules_vue_loader_lib_template_compiler_index_id_data_v_2f167646_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_lockscreen_vue__);
var disposed = false
var normalizeComponent = __webpack_require__(4)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_lockscreen_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__babel_loader_node_modules_vue_loader_lib_template_compiler_index_id_data_v_2f167646_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_lockscreen_vue___default.a,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\views\\main-components\\lockscreen\\lockscreen.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2f167646", Component.options)
  } else {
    hotAPI.reload("data-v-2f167646", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 194 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var render = function render() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "lock-screen-btn-con", on: { click: _vm.lockScreen } }, [_c("Tooltip", { attrs: { content: "??????", placement: "bottom" } }, [_c("Icon", { attrs: { type: "locked", size: 20 } })], 1)], 1);
};
var staticRenderFns = [];
render._withStripped = true;
var esExports = { render: render, staticRenderFns: staticRenderFns };
exports.default = esExports;

if (false) {
  module.hot.accept();
  if (module.hot.data) {
    require("vue-hot-reload-api").rerender("data-v-2f167646", esExports);
  }
}

/***/ }),
/* 195 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_message_tip_vue__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_message_tip_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_message_tip_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_message_tip_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_message_tip_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__babel_loader_node_modules_vue_loader_lib_template_compiler_index_id_data_v_76d0411f_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_message_tip_vue__ = __webpack_require__(196);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__babel_loader_node_modules_vue_loader_lib_template_compiler_index_id_data_v_76d0411f_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_message_tip_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__babel_loader_node_modules_vue_loader_lib_template_compiler_index_id_data_v_76d0411f_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_message_tip_vue__);
var disposed = false
var normalizeComponent = __webpack_require__(4)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_message_tip_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__babel_loader_node_modules_vue_loader_lib_template_compiler_index_id_data_v_76d0411f_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_message_tip_vue___default.a,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\views\\main-components\\message-tip.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-76d0411f", Component.options)
  } else {
    hotAPI.reload("data-v-76d0411f", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 196 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var render = function render() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "message-con", on: { click: _vm.showMessage } }, [_c("Tooltip", {
    attrs: {
      content: _vm.value > 0 ? "???" + _vm.value + "???????????????" : "???????????????",
      placement: "bottom"
    }
  }, [_c("Badge", { attrs: { count: _vm.value, dot: "" } }, [_c("Icon", { attrs: { type: "ios-bell", size: 22 } })], 1)], 1)], 1);
};
var staticRenderFns = [];
render._withStripped = true;
var esExports = { render: render, staticRenderFns: staticRenderFns };
exports.default = esExports;

if (false) {
  module.hot.accept();
  if (module.hot.data) {
    require("vue-hot-reload-api").rerender("data-v-76d0411f", esExports);
  }
}

/***/ }),
/* 197 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_theme_switch_vue__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_theme_switch_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_theme_switch_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_theme_switch_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_theme_switch_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__babel_loader_node_modules_vue_loader_lib_template_compiler_index_id_data_v_4ed724b4_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_theme_switch_vue__ = __webpack_require__(199);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__babel_loader_node_modules_vue_loader_lib_template_compiler_index_id_data_v_4ed724b4_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_theme_switch_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__babel_loader_node_modules_vue_loader_lib_template_compiler_index_id_data_v_4ed724b4_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_theme_switch_vue__);
var disposed = false
var normalizeComponent = __webpack_require__(4)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_theme_switch_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__babel_loader_node_modules_vue_loader_lib_template_compiler_index_id_data_v_4ed724b4_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_theme_switch_vue___default.a,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\views\\main-components\\theme-switch\\theme-switch.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4ed724b4", Component.options)
  } else {
    hotAPI.reload("data-v-4ed724b4", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 198 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _env = __webpack_require__(95);

var _env2 = _interopRequireDefault(_env);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = {
    env: _env2.default
};
exports.default = config;

/***/ }),
/* 199 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var render = function render() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticStyle: { display: "inline-block", padding: "0 6px" } }, [_c("Tooltip", { attrs: { content: "????????????", placement: "right" } }, [_c("Dropdown", { attrs: { trigger: "click" }, on: { "on-click": _vm.setTheme } }, [_c("a", { attrs: { href: "javascript:void(0)" } }, [_c("Icon", {
    style: { marginTop: "-2px", verticalAlign: "middle" },
    attrs: { color: "#495060", size: 18, type: "paintbucket" }
  }), _vm._v(" "), _c("Icon", { attrs: { type: "arrow-down-b" } })], 1), _vm._v(" "), _c("DropdownMenu", { attrs: { slot: "list" }, slot: "list" }, _vm._l(_vm.themeList, function (item, index) {
    return _c("DropdownItem", { key: index, attrs: { name: item.name } }, [_c("Row", {
      attrs: {
        type: "flex",
        justify: "center",
        align: "middle"
      }
    }, [_c("span", { staticStyle: { "margin-right": "10px" } }, [_c("Icon", {
      attrs: {
        size: 20,
        type: item.name.substr(0, 1) !== "b" ? "happy-outline" : "happy",
        color: item.menu
      }
    })], 1), _vm._v(" "), _c("span", [_c("Icon", {
      attrs: {
        size: 22,
        type: "record",
        color: item.element
      }
    })], 1)])], 1);
  }))], 1)], 1)], 1);
};
var staticRenderFns = [];
render._withStripped = true;
var esExports = { render: render, staticRenderFns: staticRenderFns };
exports.default = esExports;

if (false) {
  module.hot.accept();
  if (module.hot.data) {
    require("vue-hot-reload-api").rerender("data-v-4ed724b4", esExports);
  }
}

/***/ }),
/* 200 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var render = function render() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "main", class: { "main-hide-text": _vm.shrink } }, [_c("div", {
    staticClass: "sidebar-menu-con",
    style: {
      width: _vm.shrink ? "60px" : "200px",
      overflow: _vm.shrink ? "visible" : "auto"
    }
  }, [_c("shrinkable-menu", {
    attrs: {
      shrink: _vm.shrink,
      theme: _vm.menuTheme,
      "before-push": _vm.beforePush,
      "open-names": _vm.openedSubmenuArr,
      "menu-list": _vm.permissionRouters
    },
    on: { "on-change": _vm.handleSubmenuChange }
  }, [_c("div", {
    staticClass: "logo-con",
    attrs: { slot: "top" },
    slot: "top"
  }, [_c("img", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: !_vm.shrink,
      expression: "!shrink"
    }],
    key: "max-logo",
    staticClass: "logo-full",
    attrs: { src: _vm.logoSrc[0] }
  }), _vm._v(" "), _c("img", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.shrink,
      expression: "shrink"
    }],
    key: "min-logo",
    staticClass: "logo-mini",
    attrs: { src: _vm.logoSrc[1] }
  })])])], 1), _vm._v(" "), _c("div", {
    staticClass: "main-header-con",
    style: { paddingLeft: _vm.shrink ? "60px" : "200px" }
  }, [_c("div", { staticClass: "main-header" }, [_c("div", { staticClass: "navicon-con" }, [_c("Button", {
    style: {
      transform: "rotateZ(" + (this.shrink ? "-90" : "0") + "deg)"
    },
    attrs: { type: "text" },
    on: { click: _vm.toggleClick }
  }, [_c("Icon", { attrs: { type: "navicon", size: "32" } })], 1)], 1), _vm._v(" "), _c("div", { staticClass: "header-middle-con" }, [_c("div", { staticClass: "main-breadcrumb" }, [_c("breadcrumb-nav", {
    attrs: { currentPath: _vm.currentPath }
  })], 1)]), _vm._v(" "), _c("div", { staticClass: "header-avator-con" }, [_c("full-screen", {
    on: { "on-change": _vm.fullscreenChange },
    model: {
      value: _vm.isFullScreen,
      callback: function callback($$v) {
        _vm.isFullScreen = $$v;
      },
      expression: "isFullScreen"
    }
  }), _vm._v(" "), _c("lock-screen"), _vm._v(" "), _c("div", { staticClass: "lock-screen-btn-con" }, [_c("Tooltip", { attrs: { content: "????????????", placement: "bottom" } }, [_c("a", {
    staticStyle: { color: "#657180" },
    attrs: {
      href: "http://github.com/wuwz/Fastjee",
      target: "_blank"
    }
  }, [_c("Icon", {
    attrs: { type: "social-github", size: "20" }
  })], 1)])], 1), _vm._v(" "), _c("theme-switch"), _vm._v(" "), _c("div", { staticClass: "user-dropdown-menu-con" }, [_c("Row", {
    staticClass: "user-dropdown-innercon",
    attrs: { type: "flex", justify: "end", align: "middle" }
  }, [_c("Dropdown", {
    attrs: {
      transfer: "",
      trigger: "click",
      placement: "bottom-end"
    }
  }, [_c("a", { attrs: { href: "javascript:void(0)" } }, [_c("span", { staticClass: "main-user-name" }, [_vm._v(_vm._s(_vm.nickname))]), _vm._v(" "), _c("Avatar", {
    staticStyle: { background: "#619fe7" },
    attrs: { src: _vm.avatar }
  })], 1), _vm._v(" "), _c("DropdownMenu", {
    staticStyle: {
      width: "240px",
      position: "relative",
      top: "-5px"
    },
    attrs: { slot: "list" },
    slot: "list"
  }, [_c("div", {
    staticClass: "header",
    staticStyle: {
      "text-align": "center",
      "margin-bottom": "5px",
      padding: "10px 0px",
      background: "rgb(73, 80, 96)"
    }
  }, [_c("img", {
    staticClass: "user-avatar-detail",
    staticStyle: {
      "border-radius": "50%",
      border: "2px solid #e6e6e6"
    },
    attrs: {
      src: _vm.avatar,
      width: "100",
      height: "100"
    }
  })]), _vm._v(" "), _c("div", {
    staticClass: "info",
    staticStyle: {
      "text-align": "center",
      margin: "10px 0px 10px 0px"
    }
  }, [_c("span", { staticStyle: { "font-size": "14px" } }, [_vm._v("\n                                      " + _vm._s(_vm.nickname) + "\n                                      "), _c("span", {
    staticStyle: {
      display: "block",
      "font-size": "12px",
      color: "#6f7180"
    }
  }, [_vm._v(_vm._s(_vm.email))])]), _vm._v(" "), _c("div", { staticStyle: { "margin-top": "5px" } }, _vm._l(_vm.roles, function (role) {
    return _c("Tag", {
      key: role,
      staticStyle: {
        "font-size": "12px",
        "border-radius": "0px"
      },
      attrs: {
        type: "border",
        color: "green",
        size: "small"
      }
    }, [_vm._v(_vm._s(role))]);
  }))]), _vm._v(" "), _c("div", {
    staticClass: "footer",
    staticStyle: {
      margin: "5px 10px",
      "border-top": "1px solid #dcdfe6",
      "padding-top": "10px"
    }
  }, [_c("Button", {
    staticStyle: { float: "left" },
    attrs: {
      icon: "information-circled",
      type: "primary",
      size: "small"
    },
    on: {
      click: function click($event) {
        _vm.updatePwdModel = true;
      }
    }
  }, [_vm._v("????????????")]), _vm._v(" "), _c("Button", {
    staticStyle: { float: "right" },
    attrs: {
      icon: "log-out",
      type: "error",
      size: "small"
    },
    on: { click: _vm.logout }
  }, [_vm._v("????????????")])], 1)])], 1)], 1)], 1)], 1)]), _vm._v(" "), _c("div", { staticClass: "tags-con" }, [_c("tags-page-opened", {
    attrs: { pageTagsList: _vm.pageOpenedList }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "single-page-con",
    style: { left: _vm.shrink ? "60px" : "200px" }
  }, [_c("div", { staticClass: "single-page" }, [_c("keep-alive", { attrs: { include: _vm.cachePage } }, [_c("router-view")], 1)], 1)]), _vm._v(" "), _c("Modal", {
    model: {
      value: _vm.updatePwdModel,
      callback: function callback($$v) {
        _vm.updatePwdModel = $$v;
      },
      expression: "updatePwdModel"
    }
  }, [_c("p", {
    staticStyle: { "text-align": "left" },
    attrs: { slot: "header" },
    slot: "header"
  }, [_c("Icon", { attrs: { type: "information-circled" } }), _vm._v(" "), _c("span", [_vm._v("????????????")])], 1), _vm._v(" "), _c("Form", {
    ref: "updatePwdForm",
    attrs: {
      model: _vm.updatePwdForm,
      rules: _vm.updatePwdFormRules,
      "label-position": "top"
    }
  }, [_c("FormItem", { attrs: { prop: "oldPassword", label: "????????????" } }, [_c("Input", {
    attrs: {
      type: "password",
      placeholder: "?????????????????????",
      icon: "locked"
    },
    model: {
      value: _vm.updatePwdForm.oldPassword,
      callback: function callback($$v) {
        _vm.$set(_vm.updatePwdForm, "oldPassword", $$v);
      },
      expression: "updatePwdForm.oldPassword"
    }
  })], 1), _vm._v(" "), _c("FormItem", { attrs: { prop: "newPassword", label: "?????????" } }, [_c("Input", {
    attrs: {
      type: "password",
      placeholder: "??????????????????",
      icon: "locked"
    },
    model: {
      value: _vm.updatePwdForm.newPassword,
      callback: function callback($$v) {
        _vm.$set(_vm.updatePwdForm, "newPassword", $$v);
      },
      expression: "updatePwdForm.newPassword"
    }
  })], 1), _vm._v(" "), _c("FormItem", { attrs: { prop: "reNewPassword", label: "????????????" } }, [_c("Input", {
    attrs: {
      type: "password",
      placeholder: "?????????????????????",
      icon: "locked"
    },
    model: {
      value: _vm.updatePwdForm.reNewPassword,
      callback: function callback($$v) {
        _vm.$set(_vm.updatePwdForm, "reNewPassword", $$v);
      },
      expression: "updatePwdForm.reNewPassword"
    }
  })], 1)], 1), _vm._v(" "), _c("div", { attrs: { slot: "footer" }, slot: "footer" }, [_c("Button", {
    attrs: {
      type: "warning",
      size: "large",
      long: "",
      loading: _vm.updatePwdModelLoading
    },
    on: { click: _vm.updatePassword }
  }, [_vm._v("??????")])], 1)], 1)], 1);
};
var staticRenderFns = [];
render._withStripped = true;
var esExports = { render: render, staticRenderFns: staticRenderFns };
exports.default = esExports;

if (false) {
  module.hot.accept();
  if (module.hot.data) {
    require("vue-hot-reload-api").rerender("data-v-7aa0650d", esExports);
  }
}

/***/ }),
/* 201 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _stringify = __webpack_require__(38);

var _stringify2 = _interopRequireDefault(_stringify);

var _toConsumableArray2 = __webpack_require__(68);

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _util = __webpack_require__(24);

var _util2 = _interopRequireDefault(_util);

var _vue = __webpack_require__(5);

var _vue2 = _interopRequireDefault(_vue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = {
    state: {
        cachePage: [],
        lang: '',
        isFullScreen: false,
        openedSubmenuArr: [],
        menuTheme: 'dark',
        themeColor: '',
        currentPageName: '',
        logoSrc: ['/static/logo/logo-full.svg', '/static/logo/logo-mini.svg'],
        pageOpenedList: [{ title: '??????', path: '', name: 'home_index' }],
        currentPath: [{ title: '??????', path: '', name: 'home_index' }],
        tagsList: [{ title: '??????', path: '', name: 'home_index' }],
        dontCache: [] },
    mutations: {
        setTagsList: function setTagsList(state, list) {
            var _state$tagsList;

            (_state$tagsList = state.tagsList).push.apply(_state$tagsList, (0, _toConsumableArray3.default)(list));
        },
        changeLogoSrc: function changeLogoSrc(state, srcs) {
            state.logoSrc = srcs;
        },
        changeMenuTheme: function changeMenuTheme(state, theme) {
            state.menuTheme = theme;
        },
        changeMainTheme: function changeMainTheme(state, mainTheme) {
            state.themeColor = mainTheme;
        },
        addOpenSubmenu: function addOpenSubmenu(state, name) {
            var hasThisName = false;
            var isEmpty = false;
            if (name.length === 0) {
                isEmpty = true;
            }
            if (state.openedSubmenuArr.indexOf(name) > -1) {
                hasThisName = true;
            }
            if (!hasThisName && !isEmpty) {
                state.openedSubmenuArr.push(name);
            }
        },
        closePage: function closePage(state, name) {
            state.cachePage.forEach(function (item, index) {
                if (item === name) {
                    state.cachePage.splice(index, 1);
                }
            });
        },
        initCachepage: function initCachepage(state) {
            if (localStorage.cachePage) {
                state.cachePage = JSON.parse(localStorage.cachePage);
            }
        },
        removeTag: function removeTag(state, name) {
            state.pageOpenedList.map(function (item, index) {
                if (item.name === name) {
                    state.pageOpenedList.splice(index, 1);
                }
            });
        },
        pageOpenedList: function pageOpenedList(state, get) {
            var openedPage = state.pageOpenedList[get.index];
            if (get.argu) {
                openedPage.argu = get.argu;
            }
            if (get.query) {
                openedPage.query = get.query;
            }
            state.pageOpenedList.splice(get.index, 1, openedPage);
            localStorage.pageOpenedList = (0, _stringify2.default)(state.pageOpenedList);
        },
        clearAllTags: function clearAllTags(state) {
            state.pageOpenedList.splice(1);
            state.cachePage.length = 0;
            localStorage.pageOpenedList = (0, _stringify2.default)(state.pageOpenedList);
        },
        clearOtherTags: function clearOtherTags(state, vm) {
            var currentName = vm.$route.name;
            var currentIndex = 0;
            state.pageOpenedList.forEach(function (item, index) {
                if (item.name === currentName) {
                    currentIndex = index;
                }
            });
            if (currentIndex === 0) {
                state.pageOpenedList.splice(1);
            } else {
                state.pageOpenedList.splice(currentIndex + 1);
                state.pageOpenedList.splice(1, currentIndex - 1);
            }
            var newCachepage = state.cachePage.filter(function (item) {
                return item === currentName;
            });
            state.cachePage = newCachepage;
            localStorage.pageOpenedList = (0, _stringify2.default)(state.pageOpenedList);
        },
        setOpenedList: function setOpenedList(state) {
            state.pageOpenedList = localStorage.pageOpenedList ? JSON.parse(localStorage.pageOpenedList) : [];
        },
        setCurrentPath: function setCurrentPath(state, pathArr) {
            state.currentPath = pathArr;
        },
        setCurrentPageName: function setCurrentPageName(state, name) {
            state.currentPageName = name;
        },
        switchLang: function switchLang(state, lang) {
            state.lang = lang;
            _vue2.default.config.lang = lang;
        },
        clearOpenedSubmenu: function clearOpenedSubmenu(state) {
            state.openedSubmenuArr.length = 0;
        },
        increateTag: function increateTag(state, tagObj) {
            if (!_util2.default.oneOf(tagObj.name, state.dontCache)) {
                state.cachePage.push(tagObj.name);
                localStorage.cachePage = (0, _stringify2.default)(state.cachePage);
            }
            state.pageOpenedList.push(tagObj);
            localStorage.pageOpenedList = (0, _stringify2.default)(state.pageOpenedList);
        }
    }
};

exports.default = app;

/***/ }),
/* 202 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = __webpack_require__(59);

var _promise2 = _interopRequireDefault(_promise);

var _login = __webpack_require__(213);

var _token = __webpack_require__(61);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var user = {
    state: {
        token: (0, _token.getToken)(),
        refresh_token: (0, _token.getRefreshToken)(),
        nickname: '',
        email: '',
        username: '',
        avatar: '',
        roles: [],
        menus: [],
        permissions: []
    },
    mutations: {
        SET_TOKEN: function SET_TOKEN(state, token) {
            state.token = token;
        },
        SET_REFRESH_TOKEN: function SET_REFRESH_TOKEN(state, refresh_token) {
            state.refresh_token = refresh_token;
        },
        SET_NICKNAME: function SET_NICKNAME(state, nickname) {
            state.nickname = nickname;
        },
        SET_EMAIL: function SET_EMAIL(state, email) {
            state.email = email;
        },
        SET_USERNAME: function SET_USERNAME(state, username) {
            state.username = username;
        },
        SET_AVATAR: function SET_AVATAR(state, avatar) {
            state.avatar = avatar;
        },
        SET_ROLES: function SET_ROLES(state, roles) {
            state.roles = roles;
        },
        SET_MENUS: function SET_MENUS(state, menus) {
            state.menus = menus;
        },
        SET_PERMISSIONS: function SET_PERMISSIONS(state, permissions) {
            state.permissions = permissions;
        }
    },
    actions: {
        Login: function Login(_ref, form) {
            var commit = _ref.commit;

            var username = form.userName.trim();
            return new _promise2.default(function (resolve, reject) {
                (0, _login.login)(username, form.password).then(function (response) {
                    var data = response.data;
                    (0, _token.setToken)(data.access_token, data.refresh_token);
                    commit('SET_TOKEN', data.access_token);
                    commit('SET_REFRESH_TOKEN', data.refresh_token);
                    resolve();
                }).catch(function (error) {
                    reject(error);
                });
            });
        },
        GetInfo: function GetInfo(_ref2) {
            var commit = _ref2.commit,
                state = _ref2.state;

            return new _promise2.default(function (resolve, reject) {
                (0, _login.getInfo)().then(function (response) {
                    if (response.data.status) {
                        var body = response.data.body;
                        commit('SET_EMAIL', body.user.email);
                        commit('SET_NICKNAME', body.user.nickname);
                        commit('SET_USERNAME', body.user.username);
                        commit('SET_ROLES', body.roles);
                        commit('SET_AVATAR', body.user.avatar);

                        var menus = [];
                        for (var i = 0; i < body.menus.length; i++) {
                            menus[body.menus[i]] = true;
                        }
                        commit('SET_MENUS', menus);

                        var permissions = [];
                        for (var _i = 0; _i < body.permissions.length; _i++) {
                            permissions[body.permissions[_i]] = true;
                        }
                        commit('SET_PERMISSIONS', permissions);
                        resolve(response);
                    }
                }).catch(function (error) {
                    reject(error);
                });
            });
        },
        LogOut: function LogOut(_ref3) {
            var commit = _ref3.commit,
                state = _ref3.state;

            return new _promise2.default(function (resolve, reject) {
                (0, _login.logout)(state.token, state.refresh_token).then(function (response) {
                    if (response.data.status) {
                        commit('SET_TOKEN', '');
                        commit('SET_REFRESH_TOKEN', '');
                        commit('SET_NICKNAME', '');
                        commit('SET_USERNAME', '');
                        commit('SET_ROLES', []);
                        commit('SET_PERMISSIONS', []);
                        commit('SET_AVATAR', '');
                        (0, _token.removeToken)();

                        var themeLink = document.querySelector('link[name="theme"]');
                        themeLink.setAttribute('href', '');

                        var theme = '';
                        if (localStorage.theme) {
                            theme = localStorage.theme;
                        }
                        localStorage.clear();
                        if (theme) {
                            localStorage.theme = theme;
                        }

                        resolve();
                    }
                }).catch(function (error) {
                    reject(error);
                });
            });
        },
        UpdatePassword: function UpdatePassword(_ref4, form) {
            var commit = _ref4.commit;

            return new _promise2.default(function (resolve, reject) {
                (0, _login.updatePassword)(form.oldPassword, form.newPassword).then(function (response) {
                    resolve(response);
                }).catch(function (error) {
                    reject(error);
                });
            });
        },
        FedLogOut: function FedLogOut(_ref5) {
            var commit = _ref5.commit;

            return new _promise2.default(function (resolve) {
                commit('SET_TOKEN', '');
                commit('SET_REFRESH_TOKEN', '');
                (0, _token.removeToken)();
                resolve();
            });
        }
    }
};

exports.default = user;

/***/ }),
/* 203 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(89);
__webpack_require__(27);
__webpack_require__(53);
__webpack_require__(204);
__webpack_require__(211);
__webpack_require__(212);
module.exports = __webpack_require__(2).Promise;


/***/ }),
/* 204 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__(28);
var global = __webpack_require__(0);
var ctx = __webpack_require__(19);
var classof = __webpack_require__(78);
var $export = __webpack_require__(10);
var isObject = __webpack_require__(12);
var aFunction = __webpack_require__(29);
var anInstance = __webpack_require__(205);
var forOf = __webpack_require__(206);
var speciesConstructor = __webpack_require__(104);
var task = __webpack_require__(105).set;
var microtask = __webpack_require__(208)();
var newPromiseCapabilityModule = __webpack_require__(60);
var perform = __webpack_require__(106);
var promiseResolve = __webpack_require__(107);
var PROMISE = 'Promise';
var TypeError = global.TypeError;
var process = global.process;
var $Promise = global[PROMISE];
var isNode = classof(process) == 'process';
var empty = function () { /* empty */ };
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[__webpack_require__(1)('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value);
            if (domain) domain.exit();
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  return promise._h !== 1 && (promise._a || promise._c).length === 0;
};
var onHandleUnhandled = function (promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = __webpack_require__(209)($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
__webpack_require__(32)($Promise, PROMISE);
__webpack_require__(210)(PROMISE);
Wrapper = __webpack_require__(2)[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
  }
});
$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(79)(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});


/***/ }),
/* 205 */
/***/ (function(module, exports) {

module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};


/***/ }),
/* 206 */
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__(19);
var call = __webpack_require__(76);
var isArrayIter = __webpack_require__(77);
var anObject = __webpack_require__(6);
var toLength = __webpack_require__(44);
var getIterFn = __webpack_require__(49);
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;


/***/ }),
/* 207 */
/***/ (function(module, exports) {

// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};


/***/ }),
/* 208 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(0);
var macrotask = __webpack_require__(105).set;
var Observer = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var isNode = __webpack_require__(23)(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
  } else if (Observer && !(global.navigator && global.navigator.standalone)) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    var promise = Promise.resolve();
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};


/***/ }),
/* 209 */
/***/ (function(module, exports, __webpack_require__) {

var hide = __webpack_require__(11);
module.exports = function (target, src, safe) {
  for (var key in src) {
    if (safe && target[key]) target[key] = src[key];
    else hide(target, key, src[key]);
  } return target;
};


/***/ }),
/* 210 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(0);
var core = __webpack_require__(2);
var dP = __webpack_require__(8);
var DESCRIPTORS = __webpack_require__(13);
var SPECIES = __webpack_require__(1)('species');

module.exports = function (KEY) {
  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};


/***/ }),
/* 211 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// https://github.com/tc39/proposal-promise-finally

var $export = __webpack_require__(10);
var core = __webpack_require__(2);
var global = __webpack_require__(0);
var speciesConstructor = __webpack_require__(104);
var promiseResolve = __webpack_require__(107);

$export($export.P + $export.R, 'Promise', { 'finally': function (onFinally) {
  var C = speciesConstructor(this, core.Promise || global.Promise);
  var isFunction = typeof onFinally == 'function';
  return this.then(
    isFunction ? function (x) {
      return promiseResolve(C, onFinally()).then(function () { return x; });
    } : onFinally,
    isFunction ? function (e) {
      return promiseResolve(C, onFinally()).then(function () { throw e; });
    } : onFinally
  );
} });


/***/ }),
/* 212 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/proposal-promise-try
var $export = __webpack_require__(10);
var newPromiseCapability = __webpack_require__(60);
var perform = __webpack_require__(106);

$export($export.S, 'Promise', { 'try': function (callbackfn) {
  var promiseCapability = newPromiseCapability.f(this);
  var result = perform(callbackfn);
  (result.e ? promiseCapability.reject : promiseCapability.resolve)(result.v);
  return promiseCapability.promise;
} });


/***/ }),
/* 213 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.login = login;
exports.getInfo = getInfo;
exports.updatePassword = updatePassword;
exports.logout = logout;

var _request = __webpack_require__(108);

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function login(username, password) {
    var grant_type = 'password';
    var scope = 'webapp';
    return (0, _request2.default)({
        url: '/auth/oauth/token',
        method: 'post',
        headers: {
            'Authorization': 'Basic ZmFzdGplZTpmYXN0amVl' },
        params: { username: username, password: password, grant_type: grant_type, scope: scope }
    });
}

function getInfo() {
    return (0, _request2.default)({
        url: '/uc/user/info',
        method: 'get'
    });
}

function updatePassword(oldPassword, newPassword) {
    return (0, _request2.default)({
        url: '/uc/user/updatePwd',
        method: 'put',
        params: { oldPassword: oldPassword, newPassword: newPassword }
    });
}

function logout(accessToken, refreshToken) {
    return (0, _request2.default)({
        url: '/auth/removeToken',
        method: 'post',
        params: { accessToken: accessToken, refreshToken: refreshToken }
    });
}

/***/ }),
/* 214 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = __webpack_require__(59);

var _promise2 = _interopRequireDefault(_promise);

var _router = __webpack_require__(50);

var _menu = __webpack_require__(215);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function hasPermission(menus, route) {
    return route.name ? menus[route.name] !== undefined : true;
};

function filterAsyncRouterMap(routerMap, menus, allMenus) {
    var accessedRouters = routerMap.filter(function (route) {

        if (hasPermission(menus, route)) {
            route.title = allMenus[route.name].name || route.title;
            route.icon = allMenus[route.name].icon || route.icon;
            route.path = allMenus[route.name].path || route.path;

            if (route.children && route.children.length) {
                route.children = filterAsyncRouterMap(route.children, menus, allMenus);
            }
            return true;
        }
        return false;
    });
    return accessedRouters;
}

var permission = {
    state: {
        routers: _router.commonRouterMap,
        permissionRouters: []
    },
    mutations: {
        SET_ROUTERS: function SET_ROUTERS(state, routers) {
            state.permissionRouters = routers;
            state.routers = _router.commonRouterMap.concat(routers);
        }
    },
    actions: {
        GenerateRoutes: function GenerateRoutes(_ref, menus) {
            var commit = _ref.commit;

            return new _promise2.default(function (resolve) {
                (0, _menu.getAllMenu)().then(function (res) {
                    var data = res.data.body;
                    var allMenus = {};
                    for (var i = 0; i < data.length; i++) {
                        allMenus[data[i].code] = data[i];
                    }
                    commit('SET_ROUTERS', filterAsyncRouterMap(_router.asyncRouterMap, menus, allMenus));
                    resolve();
                });
            });
        }
    }
};

exports.default = permission;

/***/ }),
/* 215 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getAllMenu = getAllMenu;

var _request = __webpack_require__(108);

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getAllMenu() {
    return (0, _request2.default)({
        url: '/uc/resource/all',
        method: 'get'
    });
}

/***/ }),
/* 216 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var getters = {
    token: function token(state) {
        return state.user.token;
    },
    refresh_token: function refresh_token(state) {
        return state.user.refresh_token;
    },
    nickname: function nickname(state) {
        return state.user.nickname;
    },
    email: function email(state) {
        return state.user.email;
    },
    username: function username(state) {
        return state.user.username;
    },
    avatar: function avatar(state) {
        return state.user.avatar;
    },
    roles: function roles(state) {
        return state.user.roles;
    },
    menus: function menus(state) {
        return state.user.menus;
    },
    permissions: function permissions(state) {
        return state.user.permissions;
    },

    cachePage: function cachePage(state) {
        return state.app.cachePage;
    },
    lang: function lang(state) {
        return state.app.lang;
    },
    isFullScreen: function isFullScreen(state) {
        return state.app.isFullScreen;
    },
    openedSubmenuArr: function openedSubmenuArr(state) {
        return state.app.openedSubmenuArr;
    },
    menuTheme: function menuTheme(state) {
        return state.app.menuTheme;
    },
    themeColor: function themeColor(state) {
        return state.app.themeColor;
    },
    logoSrc: function logoSrc(state) {
        return state.app.logoSrc;
    },
    pageOpenedList: function pageOpenedList(state) {
        return state.app.pageOpenedList;
    },
    currentPageName: function currentPageName(state) {
        return state.app.currentPageName;
    },
    currentPath: function currentPath(state) {
        return state.app.currentPath;
    },
    tagsList: function tagsList(state) {
        return state.app.tagsList;
    },

    permissionRouters: function permissionRouters(state) {
        return state.permission.permissionRouters;
    }
};
exports.default = getters;

/***/ }),
/* 217 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_app_vue__ = __webpack_require__(109);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_app_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_app_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_app_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_app_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__babel_loader_node_modules_vue_loader_lib_template_compiler_index_id_data_v_bced26ea_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_app_vue__ = __webpack_require__(220);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__babel_loader_node_modules_vue_loader_lib_template_compiler_index_id_data_v_bced26ea_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_app_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__babel_loader_node_modules_vue_loader_lib_template_compiler_index_id_data_v_bced26ea_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_app_vue__);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(218)
}
var normalizeComponent = __webpack_require__(4)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_app_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__babel_loader_node_modules_vue_loader_lib_template_compiler_index_id_data_v_bced26ea_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_app_vue___default.a,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\app.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-bced26ea", Component.options)
  } else {
    hotAPI.reload("data-v-bced26ea", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 218 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(219);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(18)("7f46d869", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-bced26ea\",\"scoped\":false,\"hasInlineConfig\":false}!../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./app.vue", function() {
     var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-bced26ea\",\"scoped\":false,\"hasInlineConfig\":false}!../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./app.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 219 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(17)(false);
// imports


// module
exports.push([module.i, "\nhtml,body{\r\n    width: 100%;\r\n    height: 100%;\r\n    background: #f0f0f0;\r\n    overflow: hidden;\n}\n.app-main{\r\n    width: 100%;\r\n    height: 100%;\n}\r\n", ""]);

// exports


/***/ }),
/* 220 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var render = function render() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "app-main", attrs: { id: "main" } }, [_c("router-view")], 1);
};
var staticRenderFns = [];
render._withStripped = true;
var esExports = { render: render, staticRenderFns: staticRenderFns };
exports.default = esExports;

if (false) {
  module.hot.accept();
  if (module.hot.data) {
    require("vue-hot-reload-api").rerender("data-v-bced26ea", esExports);
  }
}

/***/ }),
/* 221 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _assign = __webpack_require__(83);

var _assign2 = _interopRequireDefault(_assign);

var _vue = __webpack_require__(5);

var _vue2 = _interopRequireDefault(_vue);

var _locale = __webpack_require__(222);

var _locale2 = _interopRequireDefault(_locale);

var _zhCN = __webpack_require__(223);

var _zhCN2 = _interopRequireDefault(_zhCN);

var _enUS = __webpack_require__(224);

var _enUS2 = _interopRequireDefault(_enUS);

var _zhTW = __webpack_require__(225);

var _zhTW2 = _interopRequireDefault(_zhTW);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var navLang = navigator.language;
var localLang = navLang === 'zh-CN' || navLang === 'en-US' ? navLang : false;
var lang = window.localStorage.lang || localLang || 'zh-CN';

_vue2.default.config.lang = lang;

var locales = _locale2.default;
var mergeZH = (0, _assign2.default)(_zhCN2.default, locales['zh-CN']);
var mergeEN = (0, _assign2.default)(_enUS2.default, locales['en-US']);
var mergeTW = (0, _assign2.default)(_zhTW2.default, locales['zh-TW']);
_vue2.default.locale('zh-CN', mergeZH);
_vue2.default.locale('en-US', mergeEN);
_vue2.default.locale('zh-TW', mergeTW);

/***/ }),
/* 222 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    'zh-CN': {
        home: '??????',
        switchLangTitle: '????????????',
        international: '???????????????',
        iviewComponentTitle: 'iview?????????????????????',
        tip: '??????iview-admin????????????????????????????????????????????????????????????????????????????????????',
        intro: 'iview????????????15?????????????????????????????????iview????????????iview???????????????????????????????????????????????????????????????????????????????????????',
        placeholderText: '???????????????...',
        placeholderDate: '????????????',
        name: '??????',
        company: '??????',
        btnText: '?????????????????????',
        modalText: '????????????????????????iview??????????????????????????????????????????????????????',
        poptip: '????????????????????????',
        showPoptipText: '????????????????????????'
    },
    'zh-TW': {
        home: '??????',
        switchLangTitle: '????????????',
        international: '???????????????',
        iviewComponentTitle: 'iview?????????????????????',
        tip: '??????iview-admin????????????????????????????????????????????????????????????????????????????????????',
        intro: 'iview????????????15?????????????????????????????????iview????????????iview???????????????????????????????????????????????????????????????????????????????????????',
        placeholderText: '???????????????...',
        placeholderDate: '????????????',
        name: '??????',
        company: '??????',
        btnText: '?????????????????????',
        modalText: '????????????????????????iview??????????????????????????????????????????????????????',
        poptip: '????????????????????????',
        showPoptipText: '????????????????????????'
    },
    'en-US': {
        home: 'home',
        switchLangTitle: 'Switch Lang',
        international: 'Switch Lang',
        tip: 'Note: iview-admin just to demonstrate how to achieve multi-language switching, so only the current page to do the translation.',
        iviewComponentTitle: 'The effect on the iview',
        intro: 'iview currently supports 15 languages, as long as you see the iview component where the text will be based on your language type automatically set the corresponding language.',
        placeholderText: 'please enter text...',
        placeholderDate: 'Select Date',
        name: 'name',
        company: 'company',
        btnText: 'Click to show modal',
        modalText: 'Here you can see the iview modal box by default to the OK and Cancel buttons that will switch the language',
        poptip: 'international poptip',
        showPoptipText: 'Click to show poptip'
    }
};

/***/ }),
/* 223 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lang__ = __webpack_require__(62);


const lang = {
    i: {
        locale: 'zh-CN',
        select: {
            placeholder: '?????????',
            noMatch: '???????????????',
            loading: '?????????'
        },
        table: {
            noDataText: '????????????',
            noFilteredDataText: '??????????????????',
            confirmFilter: '??????',
            resetFilter: '??????',
            clearFilter: '??????'
        },
        datepicker: {
            selectDate: '????????????',
            selectTime: '????????????',
            startTime: '????????????',
            endTime: '????????????',
            clear: '??????',
            ok: '??????',
            datePanelLabel: '[yyyy???] [m???]',
            month: '???',
            month1: '1 ???',
            month2: '2 ???',
            month3: '3 ???',
            month4: '4 ???',
            month5: '5 ???',
            month6: '6 ???',
            month7: '7 ???',
            month8: '8 ???',
            month9: '9 ???',
            month10: '10 ???',
            month11: '11 ???',
            month12: '12 ???',
            year: '???',
            weekStartDay: '0',
            weeks: {
                sun: '???',
                mon: '???',
                tue: '???',
                wed: '???',
                thu: '???',
                fri: '???',
                sat: '???'
            },
            months: {
                m1: '1???',
                m2: '2???',
                m3: '3???',
                m4: '4???',
                m5: '5???',
                m6: '6???',
                m7: '7???',
                m8: '8???',
                m9: '9???',
                m10: '10???',
                m11: '11???',
                m12: '12???'
            }
        },
        transfer: {
            titles: {
                source: '?????????',
                target: '????????????'
            },
            filterPlaceholder: '?????????????????????',
            notFoundText: '????????????'
        },
        modal: {
            okText: '??????',
            cancelText: '??????'
        },
        poptip: {
            okText: '??????',
            cancelText: '??????'
        },
        page: {
            prev: '?????????',
            next: '?????????',
            total: '???',
            item: '???',
            items: '???',
            prev5: '?????? 5 ???',
            next5: '?????? 5 ???',
            page: '???/???',
            goto: '??????',
            p: '???'
        },
        rate: {
            star: '???',
            stars: '???'
        },
        tree: {
            emptyText: '????????????'
        }
    }
};

Object(__WEBPACK_IMPORTED_MODULE_0__lang__["a" /* default */])(lang);

/* harmony default export */ __webpack_exports__["default"] = (lang);


/***/ }),
/* 224 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lang__ = __webpack_require__(62);


const lang = {
    i: {
        locale: 'en-US',
        select: {
            placeholder: 'Select',
            noMatch: 'No matching data',
            loading: 'Loading'
        },
        table: {
            noDataText: 'No Data',
            noFilteredDataText: 'No filter data',
            confirmFilter: 'Confirm',
            resetFilter: 'Reset',
            clearFilter: 'All'
        },
        datepicker: {
            selectDate: 'Select date',
            selectTime: 'Select time',
            startTime: 'Start Time',
            endTime: 'End Time',
            clear: 'Clear',
            ok: 'OK',
            datePanelLabel: '[mmmm] [yyyy]',
            month: 'Month',
            month1: 'January',
            month2: 'February',
            month3: 'March',
            month4: 'April',
            month5: 'May',
            month6: 'June',
            month7: 'July',
            month8: 'August',
            month9: 'September',
            month10: 'October',
            month11: 'November',
            month12: 'December',
            year: 'Year',
            weekStartDay: '0',
            weeks: {
                sun: 'Sun',
                mon: 'Mon',
                tue: 'Tue',
                wed: 'Wed',
                thu: 'Thu',
                fri: 'Fri',
                sat: 'Sat'
            },
            months: {
                m1: 'Jan',
                m2: 'Feb',
                m3: 'Mar',
                m4: 'Apr',
                m5: 'May',
                m6: 'Jun',
                m7: 'Jul',
                m8: 'Aug',
                m9: 'Sep',
                m10: 'Oct',
                m11: 'Nov',
                m12: 'Dec'
            }
        },
        transfer: {
            titles: {
                source: 'Source',
                target: 'Target'
            },
            filterPlaceholder: 'Search here',
            notFoundText: 'Not Found'
        },
        modal: {
            okText: 'OK',
            cancelText: 'Cancel'
        },
        poptip: {
            okText: 'OK',
            cancelText: 'Cancel'
        },
        page: {
            prev: 'Previous Page',
            next: 'Next Page',
            total: 'Total',
            item: 'item',
            items: 'items',
            prev5: 'Previous 5 Pages',
            next5: 'Next 5 Pages',
            page: '/page',
            goto: 'Goto',
            p: ''
        },
        rate: {
            star: 'Star',
            stars: 'Stars'
        },
        tree: {
            emptyText: 'No Data'
        }
    }
};

Object(__WEBPACK_IMPORTED_MODULE_0__lang__["a" /* default */])(lang);

/* harmony default export */ __webpack_exports__["default"] = (lang);

/***/ }),
/* 225 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lang__ = __webpack_require__(62);


const lang = {
    i: {
        locale: 'zh-TW',
        select: {
            placeholder: '?????????',
            noMatch: '???????????????',
            loading: '?????????'
        },
        table: {
            noDataText: '????????????',
            noFilteredDataText: '??????????????????',
            confirmFilter: '??????',
            resetFilter: '??????',
            clearFilter: '??????'
        },
        datepicker: {
            selectDate: '????????????',
            selectTime: '????????????',
            startTime: '????????????',
            endTime: '????????????',
            clear: '??????',
            ok: '??????',
            datePanelLabel: '[yyyy???] [m???]',
            month: '???',
            month1: '1 ???',
            month2: '2 ???',
            month3: '3 ???',
            month4: '4 ???',
            month5: '5 ???',
            month6: '6 ???',
            month7: '7 ???',
            month8: '8 ???',
            month9: '9 ???',
            month10: '10 ???',
            month11: '11 ???',
            month12: '12 ???',
            year: '???',
            weekStartDay: '0',
            weeks: {
                sun: '???',
                mon: '???',
                tue: '???',
                wed: '???',
                thu: '???',
                fri: '???',
                sat: '???'
            },
            months: {
                m1: '1???',
                m2: '2???',
                m3: '3???',
                m4: '4???',
                m5: '5???',
                m6: '6???',
                m7: '7???',
                m8: '8???',
                m9: '9???',
                m10: '10???',
                m11: '11???',
                m12: '12???'
            }
        },
        transfer: {
            titles: {
                source: '?????????',
                target: '????????????'
            },
            filterPlaceholder: '?????????????????????',
            notFoundText: '????????????'
        },
        modal: {
            okText: '??????',
            cancelText: '??????'
        },
        poptip: {
            okText: '??????',
            cancelText: '??????'
        },
        page: {
            prev: '?????????',
            next: '?????????',
            total: '???',
            item: '???',
            items: '???',
            prev5: '?????? 5 ???',
            next5: '?????? 5 ???',
            page: '???/???',
            goto: '??????',
            p: '???'
        },
        rate: {
            star: '???',
            stars: '???'
        },
        tree: {
            emptyText: '????????????'
        }
    }
};

Object(__WEBPACK_IMPORTED_MODULE_0__lang__["a" /* default */])(lang);

/* harmony default export */ __webpack_exports__["default"] = (lang);

/***/ }),
/* 226 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 227 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends2 = __webpack_require__(82);

var _extends3 = _interopRequireDefault(_extends2);

var _iview = __webpack_require__(33);

var _iview2 = _interopRequireDefault(_iview);

var _index = __webpack_require__(103);

var _index2 = _interopRequireDefault(_index);

var _index3 = __webpack_require__(50);

var _index4 = _interopRequireDefault(_index3);

var _token = __webpack_require__(61);

var _util = __webpack_require__(24);

var _util2 = _interopRequireDefault(_util);

var _jsCookie = __webpack_require__(26);

var _jsCookie2 = _interopRequireDefault(_jsCookie);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var whiteList = ['/login'];
_index4.default.beforeEach(function (to, from, next) {
    _iview2.default.LoadingBar.start();
    _util2.default.title(to.meta.title);

    if (_jsCookie2.default.get('locking') === '1' && to.name !== 'locking') {
        next({ replace: true, path: '/locking' });
    } else if (_jsCookie2.default.get('locking') === '0' && to.name === 'locking') {
        next(false);
    } else {
        if ((0, _token.getToken)()) {
            if (to.path === '/login') {
                next('/home');
            } else {
                if (_index2.default.getters.nickname === '') {
                    _index2.default.dispatch('GetInfo').then(function (res) {
                        _index2.default.dispatch('GenerateRoutes', _index2.default.getters.menus).then(function () {
                            _index4.default.addRoutes(_index2.default.getters.permissionRouters);
                            next((0, _extends3.default)({}, to));
                        });
                    }).catch(function () {
                        _index2.default.dispatch('FedLogOut').then(function () {
                            next('/login');
                        });
                    });
                } else {
                    next();
                }
            }
        } else {
            if (whiteList.indexOf(to.path) !== -1) {
                next();
            } else {
                next('/login');
            }
        }
    }
});

_index4.default.afterEach(function (to) {
    _util2.default.openNewPage(_index4.default.app, to.name, to.params, to.query);
    _iview2.default.LoadingBar.finish();
    window.scrollTo(0, 0);
});

/***/ })
],[118]);
//# sourceMappingURL=main.js.map