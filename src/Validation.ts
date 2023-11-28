import { ArrayShape, BooleanShape, ClassShape, DictionaryShape, LiteralShape, NumberShape, Shape, StringShape, UnionShape } from "./Shapes"
import { ShapeToType } from "./Types"

export class ShapeValidationError extends Error {
	path: Array<string | number>
	constructor(path: Array<string | number>) {
		super(getErrorMessage(path))
		this.name = "ShapeValidationError"
		this.path = path
	}
}

export function getErrorMessage(path: Array<string | number>): string {
	if (path.length > 0) {
		const stringedPath = path.map((entry, index) => {
			if (index === 0 && typeof entry !== "number" && path.length > 1) {
				return entry
			} else if (index === 0 && typeof entry !== "number") {
				return JSON.stringify(entry)
			} else {
				return `[${JSON.stringify(entry)}]`
			}
		}).join("")
		return `Invalid value for parameter ${stringedPath}.`
	} else {
		return "Invalid parameter value."
	}
}

export function validateShape<T extends Shape>(entity: any, shape: T, options?: {error: (err: ShapeValidationError) => Error}): ShapeToType<T> {
	try {
		validateShapeAux(entity, shape, [])
	} catch (error) {
		if (error instanceof ShapeValidationError && options?.error !== undefined) {
			throw options?.error(error)
		} else {
			throw error
		}
	}
	return entity as ShapeToType<T>
}

export function validateShapeAux<T extends Shape>(entity: any, shape: T, path: Array<string | number>) {
	if (shape instanceof StringShape) {
		if (typeof entity === "string") {
			if (shape._internal._condition && !shape._internal._condition(entity)) throw new ShapeValidationError(path)
		} else {
			throw new ShapeValidationError(path)
		}
	} else if (shape instanceof NumberShape) {
		if (typeof entity === "number") {
			if (shape._internal._condition && !shape._internal._condition(entity)) throw new ShapeValidationError(path)
		} else {
			throw new ShapeValidationError(path)
		}
	} else if (shape instanceof BooleanShape) {
		if (typeof entity !== "boolean") throw new ShapeValidationError(path)
	} else if (shape instanceof LiteralShape) {
		if (entity !== shape.value()) throw new ShapeValidationError(path)
	} else if (shape instanceof DictionaryShape) {
		if (typeof entity !== "object" || entity === null) throw new ShapeValidationError(path)
		Object.keys(entity).forEach(k1 => {
			if (!Object.keys(shape._internal._dictionary).find(k2 => k1 === k2)) {
				throw new ShapeValidationError(path)
			}
		})
		Object.keys(shape._internal._dictionary).forEach(parameterKey => {
			validateShapeAux(entity[parameterKey], (shape._internal._dictionary)[parameterKey], [...path, parameterKey])
		})
	} else if (shape instanceof ArrayShape) {
		if (Array.isArray(entity)) {
			entity.forEach((element, index) => validateShapeAux(element, shape._internal._memberShape, [...path, index]))
			if (shape._internal._condition && !shape._internal._condition(entity)) throw new ShapeValidationError(path)
		} else {
			throw new ShapeValidationError(path)
		}
	} else if (shape instanceof UnionShape) {
		const matchedMembers = (shape._internal._members as Array<Shape>).filter(member => {
			try {
				validateShapeAux(entity, member, path)
				return true
			} catch (error) {
				if (error instanceof ShapeValidationError) return false
				else throw error
			}
		})
		if (matchedMembers.length === 0) throw new ShapeValidationError(path)
	} else if (shape instanceof ClassShape) {
		if (entity instanceof shape._internal._clazz) {
			if (shape._internal._condition !== undefined && !shape._internal._condition(entity)) throw new ShapeValidationError(path)
		} else {
			throw new ShapeValidationError(path)
		}
	} else {
		throw Error("Unmatched shape.")
	}
}
