import { propType } from "./propType";
import { Type } from "./Type";

export const isSubtype = (t1: Type, t2: Type): boolean => {
  if (Type.isNumber(t1) && Type.isNumber(t2)) return true;
  else if (Type.isString(t1) && Type.isString(t2)) return true;
  else if (Type.isBoolean(t1) && Type.isBoolean(t2)) return true;
  else if (Type.isNil(t1) && Type.isNil(t2)) return true;
  else if (Type.isObject(t1) && Type.isObject(t2)) {
    return t2.properties.every(({ name: bName, type: bType }): boolean => {
      const aType = propType(t1, bName);

      if (!aType) return false;
      return isSubtype(aType, bType);
    });
  } else if (Type.isFunction(t1) && Type.isFunction(t2)) {
    return (
      t1.args.length <= t2.args.length &&
      t1.args.every((a, i) => isSubtype(t2.args[i], a)) &&
      isSubtype(t1.ret, t2.ret)
    );
  } else if (Type.isAny(t1)) {
    return true;
  } else return false;
};
