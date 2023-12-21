import { ArrayShape, BooleanShape, ClassShape, DictionaryShape, LiteralShape, NumberShape, Shape, StringShape, UnionShape } from "./Shapes"
import { ShapeToType } from "./Types"
import { regexTest } from "./Utilities"
import { GenericReason, ShapeValidationError, MaxReason, MaxLengthReason, MinReason, MinLengthReason, IntegerReason, PatternReason } from "./ValidationError"

export function validateObjectShape<T extends Shape>(props: {
	object: any,
	shape: T
	shapeValidationErrorOverride?: (err: ShapeValidationError) => Error
}): ShapeToType<T> {
	try {
		validateObjectShapeAux(props.object, props.shape, [])
	} catch (error) {
		if (error instanceof ShapeValidationError && props.shapeValidationErrorOverride !== undefined) {
			throw props.shapeValidationErrorOverride(error)
		} else {
			throw error
		}
	}
	return props.object as ShapeToType<T>
}

export function validateObjectShapeAux<T extends Shape>(entity: any, shape: T, path: Array<string | number>) {
	if (shape instanceof StringShape) {
		if (typeof entity === "string") {
			if (shape.minLength !== undefined && entity.length < shape.minLength)
				throw new ShapeValidationError({path: path, reason: new MinLengthReason({ minLength: shape.minLength, maxLength: shape.maxLength })})
			if (shape.maxLength !== undefined && entity.length > shape.maxLength)
				throw new ShapeValidationError({path: path, reason: new MaxLengthReason({ minLength: shape.minLength, maxLength: shape.maxLength })})
			if (shape.pattern !== undefined && !regexTest(shape.pattern, entity))
				throw new ShapeValidationError({path: path, reason: new PatternReason({ pattern: shape.pattern })})
			if (shape.condition !== undefined && !shape.condition(entity))
				throw new ShapeValidationError({path: path, reason: new GenericReason()})
		} else {
			throw new ShapeValidationError({path: path, reason: new GenericReason()})
		}
	} else if (shape instanceof NumberShape) {
		if (typeof entity === "number") {
			if (shape.min !== undefined && entity < shape.min)
				throw new ShapeValidationError({path: path, reason: new MinReason({ min: shape.min, max: shape.max })})
			if (shape.max !== undefined && entity > shape.max)
				throw new ShapeValidationError({path: path, reason: new MaxReason({ min: shape.min, max: shape.max })})
			if (shape.integer === true && !Number.isInteger(entity))
				throw new ShapeValidationError({path: path, reason: new IntegerReason()})
			if (shape.condition !== undefined && !shape.condition(entity))
				throw new ShapeValidationError({path: path, reason: new GenericReason()})
		} else {
			throw new ShapeValidationError({path: path, reason: new GenericReason()})
		}
	} else if (shape instanceof BooleanShape) {
		if (typeof entity !== "boolean") throw new ShapeValidationError({path: path, reason: new GenericReason()})
	} else if (shape instanceof LiteralShape) {
		if (entity !== shape.value) throw new ShapeValidationError({path: path, reason: new GenericReason()})
	} else if (shape instanceof DictionaryShape) {
		if (typeof entity !== "object" || entity === null) throw new ShapeValidationError({path: path, reason: new GenericReason()})
		Object.keys(entity).forEach(k1 => {
			if (!Object.keys(shape.dictionary).find(k2 => k1 === k2)) {
				throw new ShapeValidationError({path: [...path, k1], reason: new GenericReason()})
			}
		})
		Object.keys(shape.dictionary).forEach(parameterKey => {
			validateObjectShapeAux(entity[parameterKey], (shape.dictionary)[parameterKey], [...path, parameterKey])
		})
	} else if (shape instanceof ArrayShape) {
		if (Array.isArray(entity)) {
			entity.forEach((element, index) => validateObjectShapeAux(element, shape.elementShape, [...path, index]))
			if (shape.condition && !shape.condition(entity)) throw new ShapeValidationError({path: path, reason: new GenericReason()})
		} else {
			throw new ShapeValidationError({path: path, reason: new GenericReason()})
		}
	} else if (shape instanceof UnionShape) {
		const matchedMembers = (shape.members as Array<Shape>).filter(member => {
			try {
				validateObjectShapeAux(entity, member, path)
				return true
			} catch (error) {
				if (error instanceof ShapeValidationError) return false
				else throw error
			}
		})
		if (matchedMembers.length === 0) throw new ShapeValidationError({path: path, reason: new GenericReason()})
	} else if (shape instanceof ClassShape) {
		if (entity instanceof shape.clazz) {
			if (shape.condition !== undefined && !shape.condition(entity)) throw new ShapeValidationError({path: path, reason: new GenericReason()})
		} else {
			throw new ShapeValidationError({path: path, reason: new GenericReason()})
		}
	} else {
		throw Error("Unmatched shape.")
	}
}
