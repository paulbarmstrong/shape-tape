import { Shape } from "./Types"

export const s = {
	string: { type: "string" as "string" },
	number: { type: "number" as "number" },
	boolean: { type: "boolean" as "boolean" },
	undefined: { type: "undefined" as "undefined" },
	literal: function<T extends string>(str: T) {
		return { type: "literal" as "literal", data: str }
	},
	dict: function<T extends { [key: string]: Shape }>(dict: T, predicate?: (value: { [key: string]: any }) => boolean) {
		return { type: "dict" as "dict", data: dict, predicate: predicate }
	},
	array: function<T extends Shape>(shape: T, predicate?: (arr: Array<any>) => boolean) {
		return { type: "array" as "array", data: shape, predicate: predicate }
	},
	union: function<T extends Array<Shape>>(...values: T) {
		return { type: "union" as "union", data: values }
	}
}
