import * as Types from "./Types";
import { propType } from "./propType";
import * as Type from "./validators";

export const isSubtype = (a: Types.Type, b: Types.Type): boolean => {
  if (Type.isUnion(a)) return a.types.every((a) => isSubtype(a, b));
  if (Type.isUnion(b)) return b.types.some((b) => isSubtype(a, b));

  if (Type.isIntersection(a)) return a.types.some((a) => isSubtype(a, b));

  if (Type.isIntersection(b)) return b.types.every((b) => isSubtype(a, b));

  if (Type.isNil(a) && Type.isNil(b)) return true;
  if (Type.isBoolean(a) && Type.isBoolean(b)) return true;
  if (Type.isNumber(a) && Type.isNumber(b)) return true;
  if (Type.isString(a) && Type.isString(b)) return true;

  if (Type.isObject(a) && Type.isObject(b)) {
    return b.properties.every(({ name: bName, type: bType }) => {
      const aType = propType(a, bName);
      if (!aType) return false;
      else return isSubtype(aType, bType);
    });
  }

  if (Type.isFunction(a) && Type.isFunction(b)) {
    return (
      a.args.length === b.args.length &&
      a.args.every((a, i) => isSubtype(b.args[i], a)) &&
      isSubtype(a.ret, b.ret)
    );
  }

  if (Type.isSingleton(a)) {
    if (Type.isSingleton(b)) return a.value === b.value;
    else return isSubtype(a.base, b);
  }

  if (Type.isAny(a) || Type.isAny(b)) return true;
  if (Type.isNever(a)) return true;
  if (Type.isUnknown(b)) return true;

  return false;
};
