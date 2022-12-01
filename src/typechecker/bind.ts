import { AsExpression } from "../syntax/parser/ast/AsExpression";
import { AssignmentExpression } from "../syntax/parser/ast/AssignmentExpression";
import { ASTNode } from "../syntax/parser/ast/ASTNode";
import { BooleanLiteral } from "../syntax/parser/ast/BooleanLiteral";
import { CallExpression } from "../syntax/parser/ast/CallExpression";
import { FloatLiteral } from "../syntax/parser/ast/FloatLiteral";
import { Identifier } from "../syntax/parser/ast/Identifier";
import { IntegerLiteral } from "../syntax/parser/ast/IntegerLiteral";
import { LambdaExpression } from "../syntax/parser/ast/LambdaExpression";
import { MemberExpression } from "../syntax/parser/ast/MemberExpression";
import { ObjectLiteral } from "../syntax/parser/ast/ObjectLiteral";
import { ObjectProperty } from "../syntax/parser/ast/ObjectProperty";
import { ParenthesizedExpression } from "../syntax/parser/ast/ParenthesizedExpression";
import { StringLiteral } from "../syntax/parser/ast/StringLiteral";
import { SyntaxNodes } from "../syntax/parser/ast/SyntaxNodes";
import { VariableDeclaration } from "../syntax/parser/ast/VariableDeclaration";
import { isSubtype } from "./isSubtype";
import { propType } from "./propType";
import { synth } from "./synth";
import { BoundAssignmentExpression } from "./bound/BoundAssignmentExpression";
import { BoundASTNode } from "./bound/BoundASTNode";
import { BoundBooleanLiteral } from "./bound/BoundBooleanLiteral";
import { BoundCallExpression } from "./bound/BoundCallExpression";
import { BoundFloatLiteral } from "./bound/BoundFloatLiteral";
import { BoundIdentifier } from "./bound/BoundIdentifier";
import { BoundIntegerLiteral } from "./bound/BoundIntegerLiteral";
import { BoundLambdaExpression } from "./bound/BoundLambdaExpression";
import { BoundMemberExpression } from "./bound/BoundMemberExpression";
import { BoundObjectLiteral } from "./bound/BoundObjectLiteral";
import { BoundObjectProperty } from "./bound/BoundObjectProperty";
import { BoundParenthesizedExpression } from "./bound/BoundParenthesizedExpression";
import { BoundStringLiteral } from "./bound/BoundStringLiteral";
import { BoundVariableDeclaration } from "./bound/BoundVariableDeclaration";
import { Type } from "./Type";
import { TypeEnv } from "./TypeEnv";
import { ObjectType } from "./Types";
import { FunctionDeclaration } from "../syntax/parser/ast/FunctionDeclaration";
import { BoundFunctionDeclaration } from "./bound/BoundFunctionDeclaration";
import { BoundParameter } from "./bound/BoundParameter";
import { BoundBlock } from "./bound/BoundBlock";
import { Block } from "../syntax/parser/ast/Block";
import { BoundReturnStatement } from "./bound/BoundReturnStatement";
import { ReturnStatement } from "../syntax/parser/ast/ReturnStatement";
import { BoundBinaryOperation } from "./bound/BoundBinaryOperation";
import { BinaryOperation } from "../syntax/parser/ast/BinaryOperation";
import { LogicalOperation } from "../syntax/parser/ast/LogicalOperation";
import { BoundLogicalOperation } from "./bound/BoundLogicalOperation";
import { UnaryOperation } from "../syntax/parser/ast/UnaryOperation";
import { BoundUnaryOperation } from "./bound/BoundUnaryOperation";
import { BoundSymbolLiteral } from "./bound/BoundSymbolLiteral";
import { SymbolLiteral } from "../syntax/parser/ast/SymbolLiteral";
import { IfExpression } from "../syntax/parser/ast/IfExpression";
import { BoundIfExpression } from "./bound/BoundIfExpression";
import { BoundNilLiteral } from "./bound/BoundNilLiteral";
import { NilLiteral } from "../syntax/parser/ast/NilLiteral";
import { getType } from "./getType";
import { Parameter } from "../syntax/parser/ast/Parameter";
import { getAliasBase } from "./getAliasBase";
import { Tuple } from "../syntax/parser/ast/Tuple";
import { BoundTuple } from "./bound/BoundTuple";

export const bind = (node: ASTNode, env: TypeEnv, ty?: Type): BoundASTNode => {
  let key, value, synthType;
  switch (node.kind) {
    case SyntaxNodes.FunctionDeclaration:
      if (node instanceof FunctionDeclaration) {
        // gets extended environment from type checker
        const name = bind(node.name, env, ty!) as BoundIdentifier;
        const boundParams = node.params.map((p) =>
          BoundParameter.new(p, p.type ? getType(p.type, env) : Type.any())
        );
        const boundBody = bind(
          node.body,
          env,
          (ty! as Type.Function).ret
        ) as BoundBlock;

        return BoundFunctionDeclaration.new(
          name,
          boundParams,
          boundBody,
          // ty guaranteed to be a function type passed in from type checker
          (ty! as Type.Function).ret,
          node.start,
          node.end
        );
      }
      // Should never happen
      throw new Error("WTF, indeed?");

    case SyntaxNodes.Block:
      if (node instanceof Block) {
        const exprs = node.expressions;
        const boundExprs = exprs.map((expr, i, a) => {
          let type = synth(expr, env);

          if (expr.kind === SyntaxNodes.ReturnStatement || i === a.length - 1) {
            // ty will be passed in from the type checker
            if (!isSubtype(type, ty!)) {
              throw new Error(`Cannot use ${type} as a subtype of ${ty}`);
            }
          }

          return bind(expr, env, type);
        });

        return BoundBlock.new(boundExprs, ty!, node.start, node.end);
      }
      throw new Error("WTAF");

    case SyntaxNodes.ReturnStatement:
      if (!ty) {
        ty = synth((node as ReturnStatement).expression, env);
      }

      const boundExpr = bind((node as ReturnStatement).expression, env, ty);
      return BoundReturnStatement.new(boundExpr, ty!, node.start, node.end);
    default:
      throw new Error(`Cannot bind node of kind ${node.kind}`);

    case SyntaxNodes.BinaryOperation:
      const left = bind((node as BinaryOperation).left, env, ty);
      const right = bind((node as BinaryOperation).right, env, ty);
      const op = (node as BinaryOperation).operator;

      if (!ty) {
        ty = synth(node, env);
      }

      return BoundBinaryOperation.new(
        left,
        right,
        op,
        node.start,
        node.end,
        ty
      );

    case SyntaxNodes.LogicalOperation:
      const leftL = bind((node as LogicalOperation).left, env, ty);
      const rightL = bind((node as LogicalOperation).right, env, ty);
      const oper = (node as LogicalOperation).operator;

      if (!ty) {
        ty = synth(node, env);
      }

      return BoundLogicalOperation.new(
        leftL,
        rightL,
        oper,
        node.start,
        node.end,
        // passed in from type checker
        ty
      );

    case SyntaxNodes.UnaryOperation:
      const expr = bind((node as UnaryOperation).expression, env, ty);
      const operator = (node as UnaryOperation).operator;

      if (!ty) {
        ty = synth(node, env);
      }

      return BoundUnaryOperation.new(expr, operator, node.start, node.end, ty);

    case SyntaxNodes.IfExpression:
      if (node instanceof IfExpression) {
        const testSynth = synth(node.test, env);
        const thenSynth = synth(node.then, env);
        const elseSynth = synth(node.else, env);

        if (!ty) {
          ty = synth(node, env);
        }

        return BoundIfExpression.new(
          bind(node.test, env, testSynth),
          bind(node.then, env, thenSynth),
          bind(node.else, env, elseSynth),
          ty,
          node.start,
          node.end
        );
      }

      throw new Error("WTF?");

    case SyntaxNodes.Tuple:
      if (node instanceof Tuple) {
        if (!ty) {
          ty = synth(node, env) as Type.Tuple;
        }

        if (Type.isTypeAlias(ty)) {
          ty = getAliasBase(ty);
        }

        const values = node.values.map((v, i) =>
          bind(v, env, (ty as Type.Tuple).types[i])
        );

        return BoundTuple.new(values, ty as Type.Tuple, node.start, node.end);
      }

      throw new Error("WTF?");
  }
};
