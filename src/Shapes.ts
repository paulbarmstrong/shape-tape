import { AnyClassConstructor, Literal, Shape } from "./Types"
import { getGlobalRegex } from "./Utilities"

function string(options?: { condition?: (entity: string) => boolean, regex?: RegExp }) {
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
}

function number(options?: { condition?: (entity: number) => boolean, lowerBound?: number, upperBound?: number }) {
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
}

function boolean() {
	return { _type: "boolean" as "boolean" }
}

function literal<T extends Literal>(literal: T) {
	return { _type: "literal" as "literal", _data: literal, value: literal }
}

function dictionary<T extends { [key: string]: Shape }>(dictionary: T,
		options?: {condition?: (entity: { [key: string]: any }) => boolean}) {
	return {
		_type: "dictionary" as "dictionary",
		_data: dictionary,
		_condition: options?.condition,
		keys: Object.keys(dictionary)
	}
}

function array<T extends Shape>(shape: T, options?: { condition?: (arr: Array<any>) => boolean }) {
	return { _type: "array" as "array", _data: shape, _condition: options?.condition }
}

function union<T extends Array<Shape>>(subShapes: T) {
	return { _type: "union" as "union", _data: subShapes, subShapes: subShapes }
}

function clazz<T extends AnyClassConstructor>(clazz: T, options?: { condition?: (instance: InstanceType<T>) => boolean } ) {
	return { _type: "class" as "class", _data: clazz, _condition: options?.condition }
}

function optional<T extends Shape>(shape: T) {
	return union([shape, s.literal(undefined)])
}

function integer(options?: { lowerBound?: number, upperBound?: number }) {
	return s.number({condition: Number.isInteger, lowerBound: options?.lowerBound, upperBound: options?.upperBound})
}

export const s = {
	string: string,
	number: number,
	boolean: boolean,
	literal: literal,
	dictionary: dictionary,
	array: array,
	union: union,
	class: clazz,
	optional: optional,
	integer: integer
}