import { Shape } from "./Shapes"

export class ShapeValidationError extends Error {
	name = "ShapeValidationError"
	readonly path: Array<string | number>
	readonly object: any
	readonly shape: Shape
	constructor(props: {
		path: Array<string | number>,
		object: any,
		shape: Shape
	}) {
		super(getErrorMessage(props.path))
		this.path = props.path
		this.object = props.object
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