import { SrcLoc } from "../../syntax/lexer/SrcLoc";
import { Token } from "../../syntax/lexer/Token";
import { StringLiteral } from "../../syntax/parser/ast/StringLiteral";
import { BoundNodes } from "./BoundNodes";

export class BoundStringLiteral extends StringLiteral {
  constructor(token: Token, start: SrcLoc) {
    super(token, start);
    this.kind = BoundNodes.BoundStringLiteral;
  }

  public static new(token: Token, start: SrcLoc) {
    return new BoundStringLiteral(token, start);
  }
}