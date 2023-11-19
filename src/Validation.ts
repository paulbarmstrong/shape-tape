import { Shape, ShapeToType } from "./Types"

export class ShapeValidationError extends Error {
	path: Array<string | number>
	constructor(path: Array<string | number>) {
		super(getErrorMessage(path))
		this.name = "ShapeValidationError"
		this.path = path
	}
}

export function getErrorMessage(path: Array<string | number>): string {
	return path.length > 0 ? (
		`Invalid value for parameter ${path.map((entry, index) => index === 0 && typeof entry !== "number" ? JSON.stringify(entry) : `[${JSON.stringify(entry)}]`).join("")}.`
	) : (
		"Invalid parameter value."
	)
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
	if (shape._type === "string") {
		if (typeof entity === "string") {
			if (shape._condition && !shape._condition(entity)) throw new ShapeValidationError(path)
		} else {
			throw new ShapeValidationError(path)
		}
	} else if (shape._type === "number") {
		if (typeof entity === "number") {
			if (shape._condition && !shape._condition(entity)) throw new ShapeValidationError(path)
		} else {
			throw new ShapeValidationError(path)
		}
	} else if (shape._type === "boolean") {
		if (typeof entity !== "boolean") throw new ShapeValidationError(path)
	} else if (shape._type === "literal") {
		if (entity !== shape._data) throw new ShapeValidationError(path)
	} else if (shape._type === "dictionary") {
		if (typeof entity !== "object" || entity === null) throw new ShapeValidationError(path)
		Object.keys(entity).forEach(k1 => {
			if (!Object.keys(shape._data).find(k2 => k1 === k2)) {
				throw new ShapeValidationError(path)
			}
		})
		Object.keys(shape._data).forEach(parameterKey => {
			validateShapeAux(entity[parameterKey], (shape._data)[parameterKey], [...path, parameterKey])
		})
	} else if (shape._type === "array") {
		if (Array.isArray(entity)) {
			entity.forEach((element, index) => validateShapeAux(element, shape._data, [...path, index]))
			if (shape._condition && !shape._condition(entity)) throw new ShapeValidationError(path)
		} else {
			throw new ShapeValidationError(path)
		}
	} else if (shape._type === "union") {
		const matchedSubShapes = shape._data.filter(subShape => {
			try {
				validateShapeAux(entity, subShape, path)
				return true
			} catch (error) {
				if (error instanceof ShapeValidationError) return false
				else throw error
			}
		})
		if (matchedSubShapes.length === 0) throw new ShapeValidationError(path)
	} else if (shape._type === "class") {
		if (entity instanceof shape._data) {
			if (shape._condition !== undefined && !shape._condition(entity)) throw new ShapeValidationError(path)
		} else {
			throw new ShapeValidationError(path)
		}
	} else {
		throw Error("Unmatched shape.")
	}
}
