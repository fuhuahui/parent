webpackJsonp([16],{

/***/ 270:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_index_vue__ = __webpack_require__(472);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_index_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_index_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_index_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_index_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__babel_loader_node_modules_vue_loader_lib_template_compiler_index_id_data_v_200194c2_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_index_vue__ = __webpack_require__(838);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__babel_loader_node_modules_vue_loader_lib_template_compiler_index_id_data_v_200194c2_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_index_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__babel_loader_node_modules_vue_loader_lib_template_compiler_index_id_data_v_200194c2_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_index_vue__);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(836)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_index_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__babel_loader_node_modules_vue_loader_lib_template_compiler_index_id_data_v_200194c2_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_index_vue___default.a,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\views\\system\\userManager\\index.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-200194c2", Component.options)
  } else {
    hotAPI.reload("data-v-200194c2", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 472:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    data: function data() {
        var _this = this;

        return {
            tableData1: this.mockTableData1(),
            tableColumns1: [{
                title: '用户名',
                key: 'username'
            }, {
                title: '昵称',
                key: 'nickname'
            }, {
                title: '邮箱',
                key: 'email'
            }, {
                title: '状态',
                key: 'status',
                render: function render(h, params) {
                    var row = params.row;
                    var color = row.status === 0 ? 'green' : 'red';
                    var text = row.status === 0 ? '启用' : '禁用';
                    return h('Tag', {
                        props: {
                            type: 'dot',
                            color: color
                        }
                    }, text);
                }
            }, {
                title: '操作',
                key: 'action',
                fixed: 'right',
                align: 'center',
                width: 130,
                render: function render(h, params) {
                    return h('div', [h('Button', {
                        props: {
                            type: 'primary',
                            size: 'small'
                        },
                        style: {
                            marginRight: '5px'
                        },
                        on: {
                            click: function click() {
                                _this.editRow(params.index);
                            }
                        }
                    }, '编辑'), h('Button', {
                        props: {
                            type: 'error',
                            size: 'small'
                        },
                        on: {
                            click: function click() {
                                _this.removeRow(params.index);
                            }
                        }
                    }, '删除')]);
                }
            }]
        };
    },

    methods: {
        mockTableData1: function mockTableData1() {
            var data = [];
            for (var i = 0; i < 10; i++) {
                data.push({
                    username: 'user' + Math.round(Math.random() * 10000),
                    nickname: '用户' + Math.round(Math.random() * 10000),
                    email: 'mail' + Math.round(Math.random() * 10000) + '@gmail.com',
                    status: Math.round(Math.random())
                });
            }
            return data;
        },
        editRow: function editRow(index) {
            this.$Modal.info({
                title: '用户信息',
                content: '\n                    <p> \u7528\u6237\u540D\uFF1A' + this.tableData1[index].username + '</p>\n                    <p> \u6635\u79F0\uFF1A' + this.tableData1[index].nickname + '</p>\n                    <p> \u90AE\u7BB1\u5730\u5740\uFF1A' + this.tableData1[index].email + '</p>\n                '
            });
        },
        removeRow: function removeRow(index) {
            this.tableData1.splice(index, 1);
        },
        changePage: function changePage() {
            this.tableData1 = this.mockTableData1();
        }
    }
};

/***/ }),

/***/ 836:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(837);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(18)("51a55668", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-200194c2\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../node_modules/less-loader/dist/cjs.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./index.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-200194c2\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../node_modules/less-loader/dist/cjs.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./index.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 837:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(17)(false);
// imports


// module
exports.push([module.i, "\n.userManager .classification .title {\n  font-weight: normal !important;\n  border-bottom: 1px solid #e3e8ee !important;\n}\n.userManager .classification .item {\n  /*font-size: 15px;*/\n  cursor: pointer;\n  padding: 8px 0px 8px 22px;\n  border-radius: 2px;\n}\n.userManager .classification .item:hover,\n.userManager .classification .item:active {\n  border-left: 2px solid #33b976;\n  background: rgba(213, 223, 238, 0.35);\n}\n.userManager .classification .section {\n  padding: 8px 0px 8px 5px !important;\n}\n", ""]);

// exports


/***/ }),

/***/ 838:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var render = function render() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "userManager" }, [_c("Row", { attrs: { type: "flex" } }, [_c("Col", { attrs: { md: 6, order: "1" } }, [_c("Card", { attrs: { "dis-hover": "" } }, [_c("div", { attrs: { slot: "title" }, slot: "title" }, [_c("Input", {
    attrs: {
      size: "large",
      placeholder: "搜索用户..",
      icon: "search"
    }
  })], 1), _vm._v(" "), _c("div", { staticClass: "classification" }, [_c("h4", { staticClass: "title" }, [_c("Icon", { attrs: { type: "funnel" } }), _vm._v(" 按类型筛选")], 1), _vm._v(" "), _c("div", {
    staticClass: "item",
    staticStyle: { "margin-top": "10px" }
  }, [_c("Icon", { attrs: { type: "person-stalker" } }), _vm._v(" 所有用户\n                    ")], 1), _vm._v(" "), _c("div", { staticClass: "item" }, [_c("Icon", { attrs: { type: "happy-outline" } }), _vm._v(" 最近添加的用户\n                    ")], 1), _vm._v(" "), _c("div", { staticClass: "item" }, [_c("Icon", { attrs: { type: "sad-outline" } }), _vm._v(" 未分配角色的用户\n                    ")], 1), _vm._v(" "), _c("div", { staticClass: "item" }, [_c("Icon", { attrs: { type: "eye-disabled" } }), _vm._v(" 被禁用的用户\n                    ")], 1)]), _vm._v(" "), _c("br"), _vm._v(" "), _c("div", { staticClass: "classification" }, [_c("h4", { staticClass: "title" }, [_c("Icon", { attrs: { type: "funnel" } }), _vm._v(" 按部门筛选")], 1), _vm._v(" "), _c("Select", {
    staticStyle: { "margin-top": "10px" },
    attrs: { placeholder: "选择父级部门" }
  }, [_c("Option", { attrs: { value: "北京总公司" } }, [_vm._v("北京总公司")]), _vm._v(" "), _c("Option", { attrs: { value: "上海分公司" } }, [_vm._v("上海分公司")]), _vm._v(" "), _c("Option", { attrs: { value: "深圳分公司" } }, [_vm._v("深圳分公司")])], 1), _vm._v(" "), _c("div", { staticClass: "section item" }, [_vm._v("销售部")]), _vm._v(" "), _c("div", { staticClass: "section item" }, [_vm._v("市场研发部")]), _vm._v(" "), _c("div", { staticClass: "section item" }, [_vm._v("售后服务部")]), _vm._v(" "), _c("div", { staticClass: "section item" }, [_vm._v("产品设计部")]), _vm._v(" "), _c("div", { staticClass: "section item" }, [_vm._v("质量管理部")]), _vm._v(" "), _c("div", { staticClass: "section item" }, [_vm._v("行政人事部")]), _vm._v(" "), _c("div", { staticClass: "section item" }, [_vm._v("开发部")]), _vm._v(" "), _c("a", { attrs: { href: "#" } }, [_c("Icon", { attrs: { type: "plus-circled" } }), _vm._v(" 在此创建部门")], 1)], 1)])], 1), _vm._v(" "), _c("Col", { attrs: { md: 1, order: "2" } }), _vm._v(" "), _c("Col", { attrs: { md: 17, order: "3" } }, [_c("Card", { attrs: { "dis-hover": "" } }, [_c("p", { attrs: { slot: "title" }, slot: "title" }, [_vm._v("产品设计部 & 用户管理")]), _vm._v(" "), _c("div", { attrs: { slot: "extra" }, slot: "extra" }, [_c("Button", {
    attrs: {
      type: "success",
      icon: "plus-circled",
      size: "small"
    }
  }, [_vm._v("创建用户")]), _vm._v(" "), _c("Button", {
    attrs: {
      type: "ghost",
      icon: "social-buffer",
      size: "small"
    }
  }, [_vm._v("为选中用户分配角色")])], 1), _vm._v(" "), _c("Table", {
    attrs: {
      border: "false",
      data: _vm.tableData1,
      columns: _vm.tableColumns1,
      stripe: ""
    }
  }), _vm._v(" "), _c("div", { staticStyle: { "margin-top": "10px" } }, [_c("Page", {
    attrs: { total: 100, current: 1 },
    on: { "on-change": _vm.changePage }
  })], 1)], 1)], 1)], 1)], 1);
};
var staticRenderFns = [];
render._withStripped = true;
var esExports = { render: render, staticRenderFns: staticRenderFns };
exports.default = esExports;

if (false) {
  module.hot.accept();
  if (module.hot.data) {
    require("vue-hot-reload-api").rerender("data-v-200194c2", esExports);
  }
}

/***/ })

});
//# sourceMappingURL=16.chunk.js.map