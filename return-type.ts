import { Rule } from "eslint";
import * as ESTree from "estree";

const COMPONENT_NAME_REGEX = /^[A-Z]/;

function checkFunction(
  context: Rule.RuleContext,
  node: (
    | ESTree.ArrowFunctionExpression
    | ESTree.FunctionExpression
    | ESTree.FunctionDeclaration
  ) &
    Rule.NodeParentExtension
) {
  const fnName =
    // @ts-ignore
    node.id?.name ?? // function fn() はこっち
    // @ts-ignore
    node.parent?.id?.name ?? // const fn はこっち
    // @ts-ignore
    node.parent?.id?.name; // memo(() => {})

  if (
    COMPONENT_NAME_REGEX.test(fnName) &&
    // @ts-ignore
    !node.returnType
  )
    context.report({ node, messageId: "return-type" });
}

const rule: Rule.RuleModule = {
  meta: {
    messages: {
      "return-type": "Component must has return type",
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
