import { BooleanKeyword } from "./BooleanKeyword";
import { FloatKeyword } from "./FloatKeyword";
import { Identifier } from "./Identifier";
import { IntegerKeyword } from "./IntegerKeyword";
import { NilLiteral } from "./NilLiteral";
import { StringKeyword } from "./StringKeyword";
import { TypeLiteral } from "./TypeLiteral";

export type AnnotatedType =
  | IntegerKeyword
  | FloatKeyword
  | BooleanKeyword
  | StringKeyword
  | NilLiteral
  | Identifier
  | TypeLiteral;
