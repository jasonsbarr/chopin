export class Env<T> {
  private _vars = new Map<string, T>();

  constructor(public parent?: Env<T>) {}

  public static new<T>(parent?: Env<T>) {
    return new Env<T>(parent);
  }

  public get vars() {
    return this._vars;
  }

  public get entries() {
    return Array.from(this._vars.entries());
  }

  public get names() {
    return Array.from(this.vars.keys());
  }

  public extend(): Env<T> {
    return Env.new(this);
  }

  public get(name: string) {
    const scope = this.lookup(name);

    if (scope) {
      return scope._vars.get(name);
    }

    throw new Error(`Name ${name} cannot be resolved in the current scope`);
  }

  // looks in current scope ONLY
  public has(name: string) {
    return this._vars.has(name);
  }

  public set(name: string, value: T) {
    this._vars.set(name, value);
  }

  private lookup(name: string) {
    let scope: Env<T> | undefined = this;

    while (scope) {
      if (scope.has(name)) {
        return scope;
      } else {
        scope = scope.parent;
      }
    }
  }
}