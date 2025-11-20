import { trimAndRemoveDuplicatedWhitespacesFromString } from '@/utils/trim-and-remove-duplicated-whitespaces-from-string';

export const extractAndSanitizeObjectStringFields = <
  T extends object,
  TKeys extends (keyof T)[],
>(
  obj: T,
  keys: TKeys,
  maxDepth = 10,
): {
  [P in TKeys[number]]: T[P];
} => {
  const processValue = (value: unknown, currentDepth: number): unknown => {
    if (value === undefined) {
      return undefined;
    }

    if (value === null) {
      return null;
    }

    if (currentDepth >= maxDepth) {
      return value;
    }

    if (Array.isArray(value)) {
      return value.map((item) => processValue(item, currentDepth + 1));
    }

    if (typeof value === 'object') {
      const obj = value as Record<string, unknown>;
      const acc: Record<string, unknown> = {};

      for (const key of Object.keys(obj)) {
        acc[key] = processValue(obj[key], currentDepth + 1);
      }

      return acc;
    }

    if (typeof value === 'string') {
      return trimAndRemoveDuplicatedWhitespacesFromString(value);
    }

    return value;
  };

  return keys.reduce((acc, key) => {
    const value = processValue(obj[key], 0);

    if (value === undefined) {
      return acc;
    }

    acc[key] = value;

    return acc;
  }, {} as T);
};
