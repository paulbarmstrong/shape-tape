import { AnyClassConstructor, Literal, Shape } from "./Types"

export const s = {
	string: function(options?: { predicate?: (entity: string) => boolean, regex?: RegExp }) {
		const regex: RegExp | undefined = options?.regex !== undefined ? (
			new RegExp(options?.regex.source, options?.regex.flags + options?.regex.global ? "" : "g")
		) : (
			undefined
		)
		const predicate = regex !== undefined || options?.predicate !== undefined ? (
			(entity: string) => {
				return (regex === undefined || regex.test(entity)) && (options?.predicate === undefined || options.predicate(entity))
			}
		) : (
			undefined
		)
		return { type: "string" as "string", predicate: predicate }
	},
	number: function(options?: { predicate?: (entity: number) => boolean }) {
		return { type: "number" as "number", predicate: options?.predicate }
	},
	boolean: function() {
		return { type: "boolean" as "boolean" }
	},
	literal: function<T extends Literal>(literal: T) {
		return { type: "literal" as "literal", data: literal }
	},
	dict: function<T extends { [key: string]: Shape }>(dict: T, options?: { predicate?: (entity: { [key: string]: any }) => boolean }) {
		return { type: "dict" as "dict", data: dict, predicate: options?.predicate }
	},
	array: function<T extends Shape>(shape: T, options?: { predicate?: (arr: Array<any>) => boolean }) {
		return { type: "array" as "array", data: shape, predicate: options?.predicate }
	},
	union: function<T extends Array<Shape>>(...subShapes: T) {
		return { type: "union" as "union", data: subShapes }
	},
	class: function<T extends AnyClassConstructor>(clazz: T, options?: { predicate?: (instance: InstanceType<T>) => boolean } ) {
		return { type: "class" as "class", data: clazz, predicate: options?.predicate }
	},
	optional: function<T extends Shape>(shape: T) {
		return { type: "union" as "union", data: [shape, { type: "literal" as "literal", data: undefined }] }
	}
}