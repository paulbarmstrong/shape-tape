import { Shape } from "./Shapes"

/**
 * Error that represents an instance of data not matching a Shape.
 */
export class ShapeValidationError extends Error {
	name = "ShapeValidationError"
	/** The path to where in the data the error occurred. */
	readonly path: Array<string | number>
	/** The most specific data which was found to not match the corresponding Shape. */
	readonly data: any
	/** The specific Shape which the data did not match. */
	readonly shape: Shape

	constructor(props: {
		path: Array<string | number>,
		data: any,
		shape: Shape
	}) {
		super(getErrorMessage(props.path))
		this.path = props.path
		this.data = props.data
		this.shape = props.shape
	}
}

export function getErrorMessage(path: Array<string | number>): string {
	return `Parameter${path.length > 0 ? ` ${getPathString(path)}` : ""} is invalid.`
}

function getPathString(path: Array<string | number>): string {
	return path.map((entry, index) => {
		if (index === 0 && typeof entry !== "number" && path.length > 1) {
			return entry
		} else if (index === 0 && typeof entry !== "number") {
			return JSON.stringify(entry)
		} else {
			return `[${JSON.stringify(entry)}]`
		}
	}).join("")
}