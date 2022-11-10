import { AnnotatedType } from "../syntax/parser/ast/AnnotatedType";
import { SyntaxNodes } from "../syntax/parser/ast/SyntaxNodes";
import { TypeLiteral } from "../syntax/parser/ast/TypeLiteral";
import { Type } from "./Type";

export const fromAnnotation = (type: AnnotatedType): Type => {
  switch (type.kind) {
    case SyntaxNodes.IntegerKeyword:
      return Type.integer;
    case SyntaxNodes.FloatKeyword:
      return Type.float;
    case SyntaxNodes.BooleanKeyword:
      return Type.boolean;
    case SyntaxNodes.StringKeyword:
      return Type.string;
    case SyntaxNodes.NilLiteral:
      return Type.nil;
    case SyntaxNodes.TypeLiteral:
      return generateObjectType(type as TypeLiteral);
    default:
      throw new Error(`No type definition found for type ${type.kind}`);
  }
};

const generateObjectType = (type: TypeLiteral) => {
  const props = type.properties.map(
    (prop) =>
      ({
        name: prop.name,
        type: fromAnnotation(prop.type),
      } as Type.Property)
  );

  return Type.object(props);
};