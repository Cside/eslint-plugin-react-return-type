import { Rule } from "eslint";
import * as ESTree from "estree";

const componentNameRegex = /^[A-Z]/;

function isMemoCallExpression(node: Rule.Node) {
  if (node.type !== "CallExpression") return false;
  if (node.callee.type === "MemberExpression") {
    const {
      callee: { object, property },
    } = node;
    if (
      object.type === "Identifier" &&
      property.type === "Identifier" &&
      object.name === "React" &&
      property.name === "memo"
    ) {
      return true;
    }
  } else if (node.callee.type === "Identifier" && node.callee.name === "memo") {
    return true;
  }

  return false;
}

function checkFunction(
  context: Rule.RuleContext,
  node: (
    | ESTree.ArrowFunctionExpression
    | ESTree.FunctionExpression
    | ESTree.FunctionDeclaration
  ) &
    Rule.NodeParentExtension
) {
  if (node.params.length === 0) return;

  let currentNode = node.parent;
  while (currentNode.type === "CallExpression") {
    if (isMemoCallExpression(currentNode)) {
      return;
    }

    currentNode = currentNode.parent;
  }

  if (currentNode.type === "VariableDeclarator") {
    const { id } = currentNode;
    if (id.type === "Identifier") {
      if (componentNameRegex.test(id.name)) {
        context.report({ node, messageId: "memo-required" });
      }
    }
  } else if (
    node.type === "FunctionDeclaration" &&
    ["Program", "ExportNamedDeclaration"].includes(currentNode.type)
  ) {
    if (node.id !== null && componentNameRegex.test(node.id.name)) {
      context.report({ node, messageId: "memo-required" });
    } else {
      // 関数名が大文字始まりでない場合、ファイル名を見て判断する。
      // なんじゃこりゃ… イラネ。。
      // if (context.getFilename() === "<input>") return;
      // const filename = path.basename(context.getFilename());
      // if (componentNameRegex.test(filename)) {
      //   context.report({ node, messageId: "memo-required" });
      // }
    }
  }
}

const rule: Rule.RuleModule = {
  meta: {
    messages: {
      "memo-required": "Component definition not wrapped in React.memo()",
    },
  },
  create: (context) => ({
    ArrowFunctionExpression(node) {
      checkFunction(context, node);
    },
    FunctionDeclaration(node) {
      checkFunction(context, node);
    },
    FunctionExpression(node) {
      checkFunction(context, node);
    },
  }),
};

export default rule;
