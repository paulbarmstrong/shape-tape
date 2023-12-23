import { AnyClassConstructor, Literal } from "./Types"
import { getConstructFunction } from "./Utilities"

export class StringShape {
	#classname = "StringShape"
	readonly minLength?: number
	readonly maxLength?: number
	readonly pattern?: RegExp
	readonly condition?: (object: string) => boolean
	constructor(options?: {
		length?: number,
		minLength?: number,
		maxLength?: number,
		pattern?: RegExp,
		condition?: (object: string) => boolean
	}) {
		if (options?.length !== undefined && (options.minLength !== undefined || options.maxLength !== undefined))
			throw new Error("Cannot specify length and minLength or maxLength.")
		this.minLength = options?.length !== undefined ? options.length : options?.minLength,
		this.maxLength = options?.length !== undefined ? options.length : options?.maxLength,
		this.pattern = options?.pattern ? new RegExp(options.pattern) : undefined
		this.condition = options?.condition
	}
}

export class NumberShape {
	#classname = "NumberShape"
	readonly min?: number
	readonly max?: number
	readonly integer?: boolean
	readonly condition?: (object: number) => boolean
	constructor(options?: {
		min?: number,
		max?: number,
		integer?: boolean
		condition?: (object: number) => boolean,
	}) {
		this.min = options?.min
		this.max = options?.max
		this.integer = options?.integer
		this.condition = options?.condition
	}
}

export class BooleanShape {
	#classname = "BooleanShape"
}

export class LiteralShape<T extends Literal> {
	#classname = "LiteralShape"
	readonly value: T 
	constructor(value: T) {
		this.value = value
	}
}

export class DictionaryShape<T extends { [key: string]: Shape }> {
	#classname = "DictionaryShape"
	readonly dictionary: T
	readonly condition?: (object: T) => boolean
	constructor(dictionary: T, options?: { condition?: (object: T) => boolean }) {
		this.dictionary = dictionary,
		this.condition = options?.condition
	}
}

export class ArrayShape<T extends Shape> {
	#classname = "ArrayShape"
	readonly elementShape: T
	readonly condition?: (object: Array<T>) => boolean
	constructor(elementShape: T, options?: { condition?: (object: Array<T>) => boolean }) {
		this.elementShape = elementShape
		this.condition = options?.condition
	}
}

export class UnionShape<T extends Array<Shape>> {
	#classname = "UnionShape"
	readonly members: T
	constructor(members: T) {
		this.members = members
	}
}

export class ClassShape<T extends AnyClassConstructor> {
	readonly clazz: T
	readonly condition?: (instance: InstanceType<T>) => boolean
	constructor(clazz: T, options?: { condition?: (instance: InstanceType<T>) => boolean }) {
		this.clazz = clazz,
		this.condition = options?.condition
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
	integer: (options?: { min?: number, max?: number }) =>
		new NumberShape({ min: options?.min, max: options?.max, integer: true })
}
