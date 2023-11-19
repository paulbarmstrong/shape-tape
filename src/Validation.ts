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
	const _internal = shape._internal
	if (_internal._type === "string") {
		if (typeof entity === "string") {
			if (_internal._condition && !_internal._condition(entity)) throw new ShapeValidationError(path)
		} else {
			throw new ShapeValidationError(path)
		}
	} else if (_internal._type === "number") {
		if (typeof entity === "number") {
			if (_internal._condition && !_internal._condition(entity)) throw new ShapeValidationError(path)
		} else {
			throw new ShapeValidationError(path)
		}
	} else if (_internal._type === "boolean") {
		if (typeof entity !== "boolean") throw new ShapeValidationError(path)
	} else if (_internal._type === "literal") {
		if (entity !== _internal._data) throw new ShapeValidationError(path)
	} else if (_internal._type === "dictionary") {
		if (typeof entity !== "object" || entity === null) throw new ShapeValidationError(path)
		Object.keys(entity).forEach(k1 => {
			if (!Object.keys(_internal._data).find(k2 => k1 === k2)) {
				throw new ShapeValidationError(path)
			}
		})
		Object.keys(_internal._data).forEach(parameterKey => {
			validateShapeAux(entity[parameterKey], (_internal._data)[parameterKey], [...path, parameterKey])
		})
	} else if (_internal._type === "array") {
		if (Array.isArray(entity)) {
			entity.forEach((element, index) => validateShapeAux(element, _internal._data, [...path, index]))
			if (_internal._condition && !_internal._condition(entity)) throw new ShapeValidationError(path)
		} else {
			throw new ShapeValidationError(path)
		}
	} else if (_internal._type === "union") {
		const matchedMembers = _internal._data.filter(member => {
			try {
				validateShapeAux(entity, member, path)
				return true
			} catch (error) {
				if (error instanceof ShapeValidationError) return false
				else throw error
			}
		})
		if (matchedMembers.length === 0) throw new ShapeValidationError(path)
	} else if (_internal._type === "class") {
		if (entity instanceof _internal._data) {
			if (_internal._condition !== undefined && !_internal._condition(entity)) throw new ShapeValidationError(path)
		} else {
			throw new ShapeValidationError(path)
		}
	} else {
		throw Error("Unmatched shape.")
	}
}
