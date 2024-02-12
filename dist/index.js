'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var COMPONENT_NAME_REGEX = /^[A-Z]/;
function checkFunction(context, node) {
    var _a, _b, _c, _d, _e, _f, _g;
    var fnName = 
    // @ts-ignore
    (_e = (_b = (_a = node.id) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : 
    // @ts-ignore
    (_d = (_c = node.parent) === null || _c === void 0 ? void 0 : _c.id) === null || _d === void 0 ? void 0 : _d.name) !== null && _e !== void 0 ? _e : 
    // @ts-ignore
    (_g = (_f = node.parent) === null || _f === void 0 ? void 0 : _f.id) === null || _g === void 0 ? void 0 : _g.name; // memo(() => {})
    if (COMPONENT_NAME_REGEX.test(fnName) &&
        // @ts-ignore
        !node.returnType)
        context.report({ node: node, messageId: "return-type" });
}
var rule = {
    meta: {
        messages: {
            "return-type": "Component must has return type"
        }
    },
    create: function (context) { return ({
        ArrowFunctionExpression: function (node) {
            checkFunction(context, node);
        },
        FunctionDeclaration: function (node) {
            checkFunction(context, node);
        },
        FunctionExpression: function (node) {
            checkFunction(context, node);
        }
    }); }
};

var rules = {
    "return-type": rule
};

exports.rules = rules;
