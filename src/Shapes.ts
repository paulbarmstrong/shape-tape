import { AnyClassConstructor, Literal, Shape } from "./Types"
import { getGlobalRegex } from "./Utilities"

export const s = {
	string: function(options?: { condition?: (entity: string) => boolean, regex?: RegExp }) {
		const regex: RegExp | undefined = options?.regex !== undefined ? (
			getGlobalRegex(options?.regex)
		) : (
			undefined
		)
		const condition = options?.condition !== undefined || regex !== undefined ? (
			(entity: string) => {
				return (options?.condition === undefined || options.condition(entity)) && (regex === undefined || regex.test(entity))
			}
		) : (
			undefined
		)
		return { _type: "string" as "string", _condition: condition }
	},
	number: function(options?: { condition?: (entity: number) => boolean, lowerBound?: number, upperBound?: number }) {
		const condition = options?.condition !== undefined || options?.lowerBound !== undefined || options?.upperBound !== undefined ? (
			(entity: number) => {
				return (options?.condition === undefined || options.condition(entity)) &&
					(options?.lowerBound === undefined || entity >= options?.lowerBound) &&
					(options?.upperBound === undefined || entity <= options?.upperBound)
			}
		) : (
			undefined
		)
		return { _type: "number" as "number", _condition: condition }
	},
	boolean: function() {
		return { _type: "boolean" as "boolean" }
	},
	literal: function<T extends Literal>(literal: T) {
		return { _type: "literal" as "literal", _data: literal, value: literal }
	},
	dictionary: function<T extends { [key: string]: Shape }>(dictionary: T, options?: {
		condition?: (entity: { [key: string]: any }) => boolean
	}) {
		return {
			_type: "dictionary" as "dictionary",
			_data: dictionary,
			_condition: options?.condition,
			keys: Object.keys(dictionary)
		}
	},
	array: function<T extends Shape>(shape: T, options?: { condition?: (arr: Array<any>) => boolean }) {
		return { _type: "array" as "array", _data: shape, _condition: options?.condition }
	},
	union: function<T extends Array<Shape>>(subShapes: T) {
		return { _type: "union" as "union", _data: subShapes, subShapes: subShapes }
	},
	class: function<T extends AnyClassConstructor>(clazz: T, options?: { condition?: (instance: InstanceType<T>) => boolean } ) {
		return { _type: "class" as "class", _data: clazz, _condition: options?.condition }
	},
	optional: function<T extends Shape>(shape: T) {
		const data = [shape, { _type: "literal" as "literal", _data: undefined, value: undefined }]
		return { _type: "union" as "union", _data: data, subShapes: data }
	},
	integer: function(options?: { lowerBound?: number, upperBound?: number }) {
		function condition(entity: number) {
			return Number.isInteger(entity) &&
				(options?.lowerBound === undefined || entity >= options?.lowerBound) &&
				(options?.upperBound === undefined || entity <= options?.upperBound)
		}
		return { _type: "number" as "number", _condition: condition }
	}
}