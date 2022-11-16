import { BooleanKeyword } from "./BooleanKeyword";
import { FloatKeyword } from "./FloatKeyword";
import { Identifier } from "./Identifier";
import { IntegerKeyword } from "./IntegerKeyword";
import { NilLiteral } from "./NilLiteral";
import { StringKeyword } from "./StringKeyword";
import { TypeLiteral } from "./TypeLiteral";
import { AnyKeyword } from "./AnyKeyword";
import { FunctionType } from "./FunctionType";
import { NumberKeyword } from "./NumberKeyword";

export type AnnotatedType =
  | IntegerKeyword
  | FloatKeyword
  | NumberKeyword
  | BooleanKeyword
  | StringKeyword
  | NilLiteral
  | Identifier
  | TypeLiteral
  | AnyKeyword
  | FunctionType;
