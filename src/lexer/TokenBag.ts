import { SrcLoc } from "./SrcLoc";
import { Token } from "./Token";
import { TokenNames } from "./TokenNames";
import { TokenTypes } from "./TokenTypes";

export class TokenBag {
  private _tokens: Token[];
  public length: number;

  constructor() {
    this._tokens = [];
    this.length = 0;
  }

  public static new() {
    return new TokenBag();
  }

  private append(token: Token) {
    this._tokens.push(token);
    this.length++;
  }

  public addEOFToken(pos: number, line: number, col: number, trivia: string) {
    this.append(
      Token.new(
        TokenTypes.EOF,
        TokenNames.EOF,
        "EOF",
        SrcLoc.new(pos, line, col),
        trivia
      )
    );
  }

  public addIntegerToken(
    value: string,
    pos: number,
    line: number,
    col: number,
    trivia: string
  ) {
    this.append(
      Token.new(
        TokenTypes.Integer,
        TokenNames.Integer,
        value,
        SrcLoc.new(pos, line, col),
        trivia
      )
    );
  }

  public get(i: number) {
    return this._tokens[i];
  }

  public get tokens() {
    return this._tokens;
  }
}