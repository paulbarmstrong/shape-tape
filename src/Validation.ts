import { ArrayShape, BooleanShape, ClassShape, LiteralShape, NumberShape, ObjectShape, Shape, StringShape, UnionShape } from "./Shapes"
import { ShapeToType } from "./Types"
import { regexTest } from "./Utilities"
import { ShapeValidationError } from "./ValidationError"

/**
 * Validates that the given data matches the given Shape.
 * @returns The validated data casted to the appropriate type.
 * @throws [ShapeValidationError](classes/ShapeValidationError.md) when the data doesn't match the Shape.
 */
export function validateDataShape<T extends Shape>(params: {
	/**Data to be validated. */
	data: any,
	/** Shape to validate the data against. */
	shape: T,
	/** Optionally allow properties on objects in the data that aren't defined by the Shape. */
	allowExtraProperties?: boolean,
	/** Optional function for overriding the Error thrown in the case of a shape validation error */
	shapeValidationErrorOverride?: (err: ShapeValidationError) => Error
}): ShapeToType<T> {
	try {
		validateDataShapeAux(params.data, params.shape, params.allowExtraProperties === true, [])
	} catch (error) {
		if (error instanceof ShapeValidationError && params.shapeValidationErrorOverride !== undefined) {
			throw params.shapeValidationErrorOverride(error)
		} else {
			throw error
		}
	}
	return params.data as ShapeToType<T>
}

export function validateDataShapeAux<T extends Shape>(data: any, shape: T, allowExtraProperties: boolean, path: Array<string | number>) {
	if (shape instanceof StringShape) {
		if (typeof data === "string") {
			if (shape.minLength !== undefined && data.length < shape.minLength)
				throw new ShapeValidationError({path: path, data: data, shape: shape})
			if (shape.maxLength !== undefined && data.length > shape.maxLength)
				throw new ShapeValidationError({path: path, data: data, shape: shape})
			if (shape.pattern !== undefined && !regexTest(shape.pattern, data))
				throw new ShapeValidationError({path: path, data: data, shape: shape})
			if (shape.condition !== undefined && !shape.condition(data))
				throw new ShapeValidationError({path: path, data: data, shape: shape})
		} else {
			throw new ShapeValidationError({path: path, data: data, shape: shape})
		}
	} else if (shape instanceof NumberShape) {
		if (typeof data === "number") {
			if (shape.min !== undefined && data < shape.min)
				throw new ShapeValidationError({path: path, data: data, shape: shape})
			if (shape.max !== undefined && data > shape.max)
				throw new ShapeValidationError({path: path, data: data, shape: shape})
			if (shape.integer === true && !Number.isInteger(data))
				throw new ShapeValidationError({path: path, data: data, shape: shape})
			if (shape.condition !== undefined && !shape.condition(data))
				throw new ShapeValidationError({path: path, data: data, shape: shape})
		} else {
			throw new ShapeValidationError({path: path, data: data, shape: shape})
		}
	} else if (shape instanceof BooleanShape) {
		if (typeof data !== "boolean") throw new ShapeValidationError({path: path, data: data, shape: shape})
	} else if (shape instanceof LiteralShape) {
		if (data !== shape.value) throw new ShapeValidationError({path: path, data: data, shape: shape})
	} else if (shape instanceof ObjectShape) {
		if (typeof data !== "object" || data === null) throw new ShapeValidationError({path: path, data: data, shape: shape})
		if (!allowExtraProperties) {
			Object.keys(data).forEach(k1 => {
				if (!Object.keys(shape.propertyShapes).find(k2 => k1 === k2)) {
					throw new ShapeValidationError({path: path, data: data, shape: shape})
				}
			})
		}
		Object.keys(shape.propertyShapes).forEach(parameterKey => {
			validateDataShapeAux(data[parameterKey], (shape.propertyShapes)[parameterKey], allowExtraProperties, [...path, parameterKey])
		})
		if (shape.condition !== undefined && !shape.condition(data)) throw new ShapeValidationError({path: path, data: data, shape: shape})
	} else if (shape instanceof ArrayShape) {
		if (Array.isArray(data)) {
			data.forEach((element, index) => validateDataShapeAux(element, shape.elementShape, allowExtraProperties, [...path, index]))
			if (shape.condition !== undefined && !shape.condition(data)) throw new ShapeValidationError({path: path, data: data, shape: shape})
		} else {
			throw new ShapeValidationError({path: path, data: data, shape: shape})
		}
	} else if (shape instanceof UnionShape) {
		const matchedMembers = (shape.memberShapes as Array<Shape>).filter(member => {
			try {
				validateDataShapeAux(data, member, allowExtraProperties, path)
				return true
			} catch (error) {
				if (error instanceof ShapeValidationError) return false
				else throw error
			}
		})
		if (matchedMembers.length === 0) throw new ShapeValidationError({path: path, data: data, shape: shape})
	} else if (shape instanceof ClassShape) {
		if (data instanceof shape.clazz) {
			if (shape.condition !== undefined && !shape.condition(data)) throw new ShapeValidationError({path: path, data: data, shape: shape})
		} else {
			throw new ShapeValidationError({path: path, data: data, shape: shape})
		}
	} else {
		throw Error("Unmatched shape.")
	}
}
