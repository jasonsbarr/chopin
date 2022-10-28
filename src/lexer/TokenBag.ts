import { SrcLoc } from "./SrcLoc";
import { Token } from "./Token";
import { TokenNames } from "./TokenNames";
import { TokenTypes } from "./TokenTypes";

export class TokenBag {
  public tokens: Token[];

  constructor() {
    this.tokens = [];
  }

  public static new() {
    return new TokenBag();
  }

  private append(token: Token) {
    this.tokens.push(token);
  }

  public addEOFToken(pos: number, line: number, col: number, trivia: string) {
    const token = Token.new(
      TokenTypes.EOF,
      TokenNames.EOF,
      "EOF",
      SrcLoc.new(pos, line, col),
      trivia
    );

    this.append(token);
  }

  public addIntegerToken(
    value: string,
    pos: number,
    line: number,
    col: number,
    trivia: string
  ) {
    const token = Token.new(
      TokenTypes.Integer,
      TokenNames.Integer,
      value,
      SrcLoc.new(pos, line, col),
      trivia
    );

    this.append(token);
  }
}
