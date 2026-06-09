import { fakerMap } from './faker-map';

export function resolveResponseBody(value: any): any {
  if (Array.isArray(value)) {
    return value.map(resolveResponseBody);
  }

  if (value && typeof value === 'object') {
    const result: any = {};

    for (const key in value) {
      result[key] = resolveResponseBody(value[key]);
    }

    return result;
  }

  if (typeof value === 'string' && value.startsWith('FAKER_')) {
    const generator = fakerMap[value as keyof typeof fakerMap];

    if (generator) {
      return generator();
    }
  }

  return value;
}
