import { AnyClassConstructor, Literal } from "./Types"
import { getConstructFunction, regexTest } from "./Utilities"

export class StringShape {
	#classname = "StringShape"
	_internal: { _condition?: (value: string) => boolean }
	constructor(options?: { condition?: (entity: string) => boolean, regex?: RegExp }) {
		const regex: RegExp | undefined = options?.regex !== undefined ? (
			new RegExp(options!.regex!)
		) : (
			undefined
		)
		const condition = options?.condition !== undefined || regex !== undefined ? (
			(entity: string) => {
				return (options?.condition === undefined || options.condition(entity)) && (regex === undefined || regexTest(regex, entity))
			}
		) : (
			undefined
		)
		this._internal = { _condition: condition }
	}
}

export class NumberShape {
	#classname = "NumberShape"
	_internal: { _condition?: (entity: number) => boolean }
	constructor(options?: { condition?: (entity: number) => boolean, lowerBound?: number, upperBound?: number }) {
		const condition = options?.condition !== undefined || options?.lowerBound !== undefined || options?.upperBound !== undefined ? (
			(entity: number) => {
				return (options?.condition === undefined || options.condition(entity)) &&
					(options?.lowerBound === undefined || entity >= options?.lowerBound) &&
					(options?.upperBound === undefined || entity <= options?.upperBound)
			}
		) : (
			undefined
		)
		this._internal = { _condition: condition }
	}
}

export class BooleanShape {
	#classname = "BooleanShape"
}

export class LiteralShape<T extends Literal> {
	#classname = "LiteralShape"
	_internal: { _value: T }
	constructor(value: T) {
		this._internal = { _value: value }
	}
	value(): T {
		return this._internal._value
	}
}

export class DictionaryShape<T extends { [key: string]: Shape }> {
	#classname = "DictionaryShape"
	_internal: { _dictionary: T, _condition?: (entity: T) => boolean }
	constructor(dictionary: T, options?: { condition?: (entity: T) => boolean }) {
		this._internal = { _dictionary: dictionary, _condition: options?.condition }
	}
	keys(): Array<keyof T> {
		return Object.keys(this._internal._dictionary)
	}
}

export class ArrayShape<T extends Shape> {
	#classname = "ArrayShape"
	_internal: { _memberShape: T, _condition?: (entity: Array<T>) => boolean }
	constructor(shape: T, options?: { condition?: (entity: Array<T>) => boolean }) {
		this._internal = { _memberShape: shape, _condition: options?.condition }
	}
}

export class UnionShape<T extends Array<Shape>> {
	#classname = "UnionShape"
	_internal: { _members: T }
	constructor(members: T) {
		this._internal = { _members: members }
	}
	members(): T {
		return this._internal._members
	}
}

export class ClassShape<T extends AnyClassConstructor> {
	#classname = "ClassShape"
	_internal: { _clazz: T, _condition?: (instance: InstanceType<T>) => boolean }
	constructor(clazz: T, options?: { condition?: (instance: InstanceType<T>) => boolean }) {
		this._internal = { _clazz: clazz, _condition: options?.condition }
	}
}

export type Shape = StringShape | NumberShape | BooleanShape | LiteralShape<any> | DictionaryShape<any> | ArrayShape<any>
	| UnionShape<any> | ClassShape<any>

export const s = {
	string: getConstructFunction(StringShape),
	number: getConstructFunction(NumberShape),
	boolean: getConstructFunction(BooleanShape),
	literal: getConstructFunction(LiteralShape),
	dictionary: getConstructFunction(DictionaryShape),
	array: getConstructFunction(ArrayShape),
	union: getConstructFunction(UnionShape),
	class: getConstructFunction(ClassShape),
	optional: <T extends Shape>(shape: T) => new UnionShape([shape, new LiteralShape(undefined)]),
	integer: (options?: { lowerBound?: number, upperBound?: number }) =>
		new NumberShape({condition: Number.isInteger, lowerBound: options?.lowerBound, upperBound: options?.upperBound})
}
