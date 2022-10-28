import { LexResult } from "../lexer/LexResult";
import { ProgramNode } from "./ast/ProgramNode";
import { SyntaxTree } from "./ast/SyntaxTree";
import { RuleParser } from "./RuleParser";

export class Parser extends RuleParser {
  constructor(lexResult: LexResult) {
    super(lexResult);
  }

  public static new(lexResult: LexResult) {
    return new Parser(lexResult);
  }

  public parse(): SyntaxTree {
    console.log(this.lexResult.tokens);
    const start = this.lexResult.tokens.get(0).location;
    const end = this.lexResult.tokens.get(
      this.lexResult.tokens.length - 1
    ).location;
    let program = ProgramNode.new(start, end);

    while (!this.reader.eof()) {
      program.append(this.parseToplevel());
    }

    return SyntaxTree.new(program, this.diagnostics, this.lexResult);
  }

  private parseToplevel() {
    return this.parseExpression();
  }
}
