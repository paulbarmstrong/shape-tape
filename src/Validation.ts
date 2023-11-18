import { Shape, ShapeToType } from "./Types"

export class ShapeValidationError extends Error {
	path: Array<string | number>
	constructor(path: Array<string | number>) {
		const message = path.length > 0 ? (
			`Invalid shape for parameter ${path.map((entry, index) => index === 0 ? entry : `[${JSON.stringify(entry)}]`).join(".")}.`
		) : (
			"Invalid parameter."
		)
		super(message)
		this.name = "ShapeValidationError"
		this.path = path
	}
}

export function validateShape<T extends Shape>(entity: any, shape: T, path: Array<string | number> = []): ShapeToType<T> {
	if (shape.type === "string") {
		if (typeof entity === "string") {
			if (shape.predicate && !shape.predicate(entity)) throw new ShapeValidationError(path)
		} else {
			throw new ShapeValidationError(path)
		}
	} else if (shape.type === "number") {
		if (typeof entity === "number") {
			if (shape.predicate && !shape.predicate(entity)) throw new ShapeValidationError(path)
		} else {
			throw new ShapeValidationError(path)
		}
	} else if (shape.type === "boolean") {
		if (typeof entity !== "boolean") throw new ShapeValidationError(path)
	} else if (shape.type === "undefined") {
		if (typeof entity !== "undefined") throw new ShapeValidationError(path)
	} else if (shape.type === "literal") {
		if (entity !== shape.data) throw new ShapeValidationError(path)
	} else if (shape.type === "dict") {
		if (typeof entity !== "object" || entity === null) throw new ShapeValidationError(path)
		Object.keys(entity).forEach(k1 => {
			if (!Object.keys(shape.data).find(k2 => k1 === k2)) {
				throw new ShapeValidationError([...path, k1])
			}
		})
		Object.keys(shape.data).forEach(parameterKey => {
			validateShape(entity[parameterKey], (shape.data)[parameterKey], [...path, parameterKey])
		})
	} else if (shape.type === "array") {
		if (isArray(entity)) {
			entity.forEach((element, index) => validateShape(element, shape.data, [...path, index]))
			if (shape.predicate && !shape.predicate(entity)) throw new ShapeValidationError(path)
		} else {
			throw new ShapeValidationError(path)
		}
	} else if (shape.type === "union") {
		if (!shape.data.includes(entity)) throw new ShapeValidationError(path)
	} else {
		throw Error("Unmatched shape.")
	}

	return entity as ShapeToType<typeof shape>
}
