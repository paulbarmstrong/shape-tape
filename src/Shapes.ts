import { AnyClassConstructor, DefinitelyTrue, ShapeToType } from "./Types"
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
	readonly condition?: (data: string) => boolean

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
		condition?: (data: string) => boolean
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
	readonly condition?: (data: number) => boolean

	/** @param options Optional parameters for the Shape. */
	constructor(options?: {
		/** Adds a minimum length constraint. */
		min?: number,
		/** Adds a maximum length constraint. */
		max?: number,
		/** Adds a constraint that the number must be an integer. */
		integer?: boolean
		/** Adds a customizable constraint. */
		condition?: (data: number) => boolean,
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

/** Shape representing a regular JavaScript `object` having keys and values. */
export class ObjectShape<T extends { [key: string]: Shape }, AEP extends boolean = false> {
	/** @hidden */
	#classname = "ObjectShape"
	/** Contains the value of the `propertyShapes` constructor parameter. */
	readonly propertyShapes: T
	/** Contains the value of the `condition` constructor option. */
	readonly condition?: (data: { [K in keyof T]: ShapeToType<T[K]> } & (DefinitelyTrue<AEP> extends true ? Record<string, any> : {})) => boolean
	/** Contains the value of the `allowExtraProperties` constructor option. */
	readonly allowExtraProperties?: AEP
	/** 
	 * @param propertyShapes An object where the keys are the keys of the object the Shape should 
	 * represent, and the values are the Shapes of the values the Shape should represent.
	 * @param options Optional parameters for the Shape.
	 */
	constructor(propertyShapes: T, options?: {
		/** Adds a customizable constraint. */
		condition?: (data: { [K in keyof T]: ShapeToType<T[K]> } & (DefinitelyTrue<AEP> extends true ? Record<string, any> : {})) => boolean,
		/** Optionally allow properties that aren't defined in propertyShapes. */
		allowExtraProperties?: AEP
	}) {
		this.propertyShapes = propertyShapes,
		this.condition = options?.condition
		this.allowExtraProperties = options?.allowExtraProperties
	}
}

/** Shape representing a JavaScript array */
export class ArrayShape<T extends Shape> {
	/** @hidden */
	#classname = "ArrayShape"
	/** Contains the value of the `elementShape` constructor parameter. */
	readonly elementShape: T
	/** Contains the value of the `condition` constructor parameter. */
	readonly condition?: (data: Array<ShapeToType<T>>) => boolean
	/** 
	 * @param elementShape The Shape of the elements of the array.
	 * @param options Optional parameters for the Shape.
	 */
	constructor(elementShape: T, options?: {
		/** Adds a customizable constraint. */
		condition?: (data: Array<ShapeToType<T>>) => boolean
	}) {
		this.elementShape = elementShape
		this.condition = options?.condition
	}
}

/** 
 * Shape representing a union of Shapes. It represents a structure which is allowed to 
 * take the form of any of its member shapes. It's the Shape version of TypeScript's union. 
 */
export class UnionShape<T extends Array<Shape>> {
	/** @hidden */
	#classname = "UnionShape"
	/** Contains the value of the `memberShapes` constructor parameter. */
	readonly memberShapes: T
	/** @param memberShapes An array of the Shapes being unioned. */
	constructor(memberShapes: T) {
		this.memberShapes = memberShapes
	}
}

/** Shape representing a JavaScript class. */
export class ClassShape<T extends AnyClassConstructor> {
	/** @hidden */
	#classname = "ClassShape"
	/** Contains the value of the `clazz` constructor parameter. */
	readonly clazz: T
	/** Contains the value of the `clazz` constructor option. */
	readonly condition?: (data: InstanceType<T>) => boolean
	/** 
	 * @param clazz The class that the Shape should represent.
	 * @param options Optional parameters for the Shape.
	 */
	constructor(clazz: T, options?: {
		/** Adds a customizable constraint. */
		condition?: (data: InstanceType<T>) => boolean
	}) {
		this.clazz = clazz,
		this.condition = options?.condition
	}
}

/** Type representing any Shape. It's a union of all Shape classes. */
export type Shape = StringShape | NumberShape | BooleanShape | LiteralShape<any> | ObjectShape<any,any> | ArrayShape<any>
	| UnionShape<any> | ClassShape<any>

/** A collection of convenience functions for creating Shapes. */
export const s = {
	/** Alias for the `StringShape` constructor. */
	string: getConstructFunction(StringShape),
	/** Alias for the `NumberShape` constructor. */
	number: getConstructFunction(NumberShape),
	/** Alias for the `BooleanShape` constructor. */
	boolean: getConstructFunction(BooleanShape),
	/** Alias for the `LiteralShape` constructor. */
	literal: getConstructFunction(LiteralShape),
	/** Alias for the `ObjectShape` constructor. */
	object: getConstructFunction(ObjectShape),
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
