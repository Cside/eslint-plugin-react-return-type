import { FunctionDeclaration as IFunctionDeclaration } from "@typescript-eslint/types/dist/ts-estree";
import { Rule } from "eslint";
import * as ESTree from "estree";

const COMPONENT_NAME_REGEX = /^[A-Z]/;

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
  node:
    | ESTree.ArrowFunctionExpression
    | ESTree.FunctionExpression
    | ESTree.FunctionDeclaration
  // &
  //   Rule.NodeParentExtension
) {
  // let currentNode = node.parent;
  // while (currentNode.type === "CallExpression") {
  //   if (isMemoCallExpression(currentNode)) {
  //     return;
  //   }

  //   currentNode = currentNode.parent;
  // }

  const fnName =
    // @ts-ignore
    node.id?.name ?? // function fn() はこっち
    // @ts-ignore
    node.parent?.id?.name; // const fn はこっち

  console.log([
    node.type,
    fnName,

    // @ts-ignore
    node.parent?.parent?.id?.name,
    (node as IFunctionDeclaration).returnType,
  ]);

  if (
    COMPONENT_NAME_REGEX.test(fnName) &&
    !(node as IFunctionDeclaration).returnType
  )
    context.report({ node, messageId: "memo-required" });

  //if (currentNode.type === "VariableDeclarator") {
  //  const { id } = currentNode;
  // if (node.type === "VariableDeclarator") {
  //   const { id } = node;
  //   if (id.type === "Identifier") {
  //     if (
  //       componentNameRegex.test(id.name) &&
  //       !(node as IFunctionDeclaration).returnType
  //     ) {
  //       context.report({ node, messageId: "memo-required" });
  //     }
  //   }
  // } else if (
  //   node.type === "FunctionDeclaration" &&
  //   ["Program", "ExportNamedDeclaration"].includes(currentNode.type)
  // ) {
  //   if (
  //     node.id !== null &&
  //     componentNameRegex.test(node.id.name) &&
  //     !(node as IFunctionDeclaration).returnType
  //   ) {
  //     context.report({ node, messageId: "memo-required" });
  //   }
  // }
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
