import { AnyClassConstructor, Literal, Shape } from "./Types"

export const s = {
	string: function(options?: { predicate?: (entity: string) => boolean, regex?: RegExp }) {
		const regex: RegExp | undefined = options?.regex !== undefined ? (
			new RegExp(options?.regex.source, options?.regex.flags + options?.regex.global ? "" : "g")
		) : (
			undefined
		)
		const predicate = options?.predicate !== undefined || regex !== undefined ? (
			(entity: string) => {
				return (options?.predicate === undefined || options.predicate(entity)) && (regex === undefined || regex.test(entity))
			}
		) : (
			undefined
		)
		return { type: "string" as "string", predicate: predicate }
	},
	number: function(options?: { predicate?: (entity: number) => boolean, lowerBound?: number, upperBound?: number }) {
		const predicate = options?.predicate !== undefined || options?.lowerBound !== undefined || options?.upperBound !== undefined ? (
			(entity: number) => {
				return (options?.predicate === undefined || options.predicate(entity)) &&
					(options?.lowerBound === undefined || entity >= options?.lowerBound) &&
					(options?.upperBound === undefined || entity <= options?.upperBound)
			}
		) : (
			undefined
		)
		return { type: "number" as "number", predicate: predicate }
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
	},
	integer: function(options?: { lowerBound?: number, upperBound?: number }) {
		function predicate(entity: number) {
			return Number.isInteger(entity) &&
				(options?.lowerBound === undefined || entity >= options?.lowerBound) &&
				(options?.upperBound === undefined || entity <= options?.upperBound)
		}
		return { type: "number" as "number", predicate: predicate }
	}
}