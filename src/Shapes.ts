import { AnyClassConstructor, Shape } from "./Types"

export const s = {
	string: function(predicate?: (entity: string) => boolean) {
		return { type: "string" as "string", predicate: predicate }
	},
	number: function(predicate?: (entity: number) => boolean) {
		return { type: "number" as "number", predicate: predicate }
	},
	boolean: function() {
		return { type: "boolean" as "boolean" }
	},
	undefined: function() {
		return { type: "undefined" as "undefined" }
	},
	literal: function<T extends string>(str: T) {
		return { type: "literal" as "literal", data: str }
	},
	dict: function<T extends { [key: string]: Shape }>(dict: T, predicate?: (entity: { [key: string]: any }) => boolean) {
		return { type: "dict" as "dict", data: dict, predicate: predicate }
	},
	array: function<T extends Shape>(shape: T, predicate?: (arr: Array<any>) => boolean) {
		return { type: "array" as "array", data: shape, predicate: predicate }
	},
	union: function<T extends Array<Shape>>(...subShapes: T) {
		return { type: "union" as "union", data: subShapes }
	},
	class: function<T extends AnyClassConstructor>(clazz: T, predicate?: (instance: InstanceType<T>) => boolean) {
		return { type: "class" as "class", data: clazz, predicate: predicate }
	}
}