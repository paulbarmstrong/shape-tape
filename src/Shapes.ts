import { AnyClassConstructor } from "./Types"
import { getConstructFunction } from "./Utilities"

/** Shape representing JavaScript `string`. */
export class StringShape {
	/** @hidden */
	#classname = "StringShape"
	/** Contains the value of the `minLength` constructor option or length constructor option if specified. */
	readonly minLength?: number
	/** Contains the value of the `maxLength` constructor option or length constructor option if specified. */
	readonly maxLength?: number
	/** Contains the value of the `pattern` constructor option. */
	readonly pattern?: RegExp
	/** Contains the value of the `condition` constructor option. */
	readonly condition?: (object: string) => boolean

	/** @param options Optional parameters for the Shape. */
	constructor(options?: {
		/** Adds a certain length constraint. */
		length?: number,
		/** Adds a minimum length constraint. Cannot be included if `length` is included. */
		minLength?: number,
		/** Adds a maximum length constraint. Cannot be included if `length` is included. */
		maxLength?: number,
		/** Adds a regular expression constraint. */
		pattern?: RegExp,
		/** Adds a customizable constraint. */
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

/** Shape representing JavaScript `number`. */
export class NumberShape {
	/** @hidden */
	#classname = "NumberShape"
	/** Contains the value of the `min` constructor option. */
	readonly min?: number
	/** Contains the value of the `max` constructor option. */
	readonly max?: number
	/** Contains the value of the `integer` constructor option. */
	readonly integer?: boolean
	/** Contains the value of the `condition` constructor option. */
	readonly condition?: (object: number) => boolean

	/** @param options Optional parameters for the Shape. */
	constructor(options?: {
		/** Adds a minimum length constraint. */
		min?: number,
		/** Adds a maximum length constraint. */
		max?: number,
		/** Adds a constraint that the number must be an integer. */
		integer?: boolean
		/** Adds a customizable constraint. */
		condition?: (object: number) => boolean,
	}) {
		this.min = options?.min
		this.max = options?.max
		this.integer = options?.integer
		this.condition = options?.condition
	}
}

/** Shape representing JavaScript `boolean`. */
export class BooleanShape {
	/** @hidden */
	#classname = "BooleanShape"
}

/** Shape representing any literal instance of JavaScript `string`, `number`, `boolean`, `null`,
 * or `undefined`. */
export class LiteralShape<T extends string | number | boolean | null | undefined> {
	/** @hidden */
	#classname = "LiteralShape"
	/** Contains the value of the `value` constructor parameter. */
	readonly value: T

	/** @param value The literal value that the Shape should represent. */
	constructor(value: T) {
		this.value = value
	}
}

/** Shape representing a regular JavaScript `object` with keys and values. */
export class DictionaryShape<T extends { [key: string]: Shape }> {
	/** @hidden */
	#classname = "DictionaryShape"
	/** Contains the value of the `dictionary` constructor parameter. */
	readonly dictionary: T
	/** Contains the value of the `condition` constructor option. */
	readonly condition?: (object: T) => boolean
	/** 
	 * @param dictionary A dictionary where the keys are the keys of the dictionary the Shape should 
	 * represent, and the values are the Shapes of the values the Shape should represent.
	 * @param options Optional parameters for the Shape.
	 */
	constructor(dictionary: T, options?: {
		/** Adds a customizable constraint. */
		condition?: (object: T) => boolean
	}) {
		this.dictionary = dictionary,
		this.condition = options?.condition
	}
}

/** Shape representing a JavaScript array */
export class ArrayShape<T extends Shape> {
	/** @hidden */
	#classname = "ArrayShape"
	/** Contains the value of the `elementShape` constructor parameter. */
	readonly elementShape: T
	/** Contains the value of the `condition` constructor parameter. */
	readonly condition?: (object: Array<T>) => boolean
	
	/** 
	 * @param elementShape The Shape of the elements of the array.
	 * @param options Optional parameters for the Shape.
	 */
	constructor(elementShape: T, options?: {
		/** Adds a customizable constraint. */
		condition?: (object: Array<T>) => boolean
	}) {
		this.elementShape = elementShape
		this.condition = options?.condition
	}
}

/** Shape representing a union of Shapes. It represents a structure which is allowed to take the form of
 * any of its member shapes. It's the Shape version of TypeScript's union. */
export class UnionShape<T extends Array<Shape>> {
	/** @hidden */
	#classname = "UnionShape"
	/** Contains the value of the `members` constructor parameter. */
	readonly members: T
	/** @param members An array of the Shapes being unioned. */
	constructor(members: T) {
		this.members = members
	}
}

/** Shape representing a JavaScript class. */
export class ClassShape<T extends AnyClassConstructor> {
	/** @hidden */
	#classname = "ClassShape"
	/** Contains the value of the `clazz` constructor parameter. */
	readonly clazz: T
	/** Contains the value of the `clazz` constructor option. */
	readonly condition?: (instance: InstanceType<T>) => boolean
	/** 
	 * @param clazz The class that the Shape should represent.
	 * @param options Optional parameters for the Shape.
	 */
	constructor(clazz: T, options?: {
		/** Adds a customizable constraint. */
		condition?: (instance: InstanceType<T>) => boolean
	}) {
		this.clazz = clazz,
		this.condition = options?.condition
	}
}

/** Type representing any Shape. It's a union of all Shape classes. */
export type Shape = StringShape | NumberShape | BooleanShape | LiteralShape<any> | DictionaryShape<any> | ArrayShape<any>
	| UnionShape<any> | ClassShape<any>

/**
 * A collection of convenience functions for creating Shapes.
 */
export const s = {
	/** Alias for the `StringShape` constructor. */
	string: getConstructFunction(StringShape),
	/** Alias for the `NumberShape` constructor. */
	number: getConstructFunction(NumberShape),
	/** Alias for the `BooleanShape` constructor. */
	boolean: getConstructFunction(BooleanShape),
	/** Alias for the `LiteralShape` constructor. */
	literal: getConstructFunction(LiteralShape),
	/** Alias for the `DictionaryShape` constructor. */
	dictionary: getConstructFunction(DictionaryShape),
	/** Alias for the `ArrayShape` constructor. */
	array: getConstructFunction(ArrayShape),
	/** Alias for the `UnionShape` constructor. */
	union: getConstructFunction(UnionShape),
	/** Alias for the `ClassShape` constructor. */
	class: getConstructFunction(ClassShape),
	/**
	 * Convenience function for creating a `UnionShape` of a given Shape and `undefined`.
	 * @param shape The Shape of that which should be optional.
	*/
	optional: <T extends Shape>(shape: T) => new UnionShape([shape, new LiteralShape(undefined)]),
	/**
	 * Convenience function for creating a `NumberShape` with `integer: true`.
	 * @param options Optional parameters for the Shape.
	*/
	integer: (options?: {
		/** Adds a minimum length constraint. */
		min?: number,
		/** Adds a maximum length constraint. */
		max?: number
	}) => new NumberShape({ min: options?.min, max: options?.max, integer: true })
}
