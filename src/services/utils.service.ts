import isEqual from 'lodash/isEqual';
import isString from 'lodash/isString';
import isPlainObject from 'lodash/isPlainObject';

export const urlConcat = (...parts: Array<string | number | void>): string =>
    parts
        .join('/')
        .replace(/\/+/g, '/')
        .replace(/^https?:/, '$&/');

export function hasValue(value: any): boolean {
    return (
        value !== undefined &&
        value !== null &&
        value !== '' &&
        !(isString(value) && isBlank(value)) &&
        !(Array.isArray(value) && value.length === 0) &&
        !(isPlainObject(value) && Object.keys(value).length === 0)
    );
}

export const isNull = (value: any | null | undefined) => {
    return value === null || value === undefined;
};

export const softEq = (a: any, b: any): boolean => {
    const softA = hasValue(a) ? a : null;
    const softB = hasValue(b) ? b : null;
    return isEqual(softA, softB);
};

export function isBlank(value: any): boolean {
    return (value || '').trim().length === 0;
}

export const hasChanges = (initialObj: any, updatedObj: any): boolean => {
    return !softEq(initialObj, updatedObj);
};
