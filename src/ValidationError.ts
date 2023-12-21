import { plurality } from "./Utilities"

export interface ShapeValidationErrorReason {}

export class GenericReason implements ShapeValidationErrorReason {}

export class MinLengthReason implements ShapeValidationErrorReason {
	readonly minLength: number
	readonly maxLength?: number
	constructor(props: { minLength: number, maxLength?: number }) {
		this.minLength = props.minLength
		this.maxLength = props.maxLength
	}
}

export class MaxLengthReason implements ShapeValidationErrorReason {
	readonly minLength?: number
	readonly maxLength: number
	constructor(props: { minLength?: number, maxLength: number }) {
		this.minLength = props.minLength
		this.maxLength = props.maxLength
	}
}

export class MinReason implements ShapeValidationErrorReason {
	readonly min: number
	readonly max?: number
	constructor(props: { min: number, max?: number }) {
		this.min = props.min
		this.max = props.max
	}
}

export class MaxReason implements ShapeValidationErrorReason {
	readonly min?: number
	readonly max: number
	constructor(props: { min?: number, max: number }) {
		this.min = props.min
		this.max = props.max
	}
}

export class IntegerReason implements ShapeValidationErrorReason {}

export class PatternReason implements ShapeValidationErrorReason {
	readonly pattern: RegExp
	constructor(props: { pattern: RegExp }) {
		this.pattern = props.pattern
	}
}

export class ShapeValidationError extends Error {
	name = "ShapeValidationError"
	readonly path: Array<string | number>
	readonly reason: ShapeValidationErrorReason
	constructor(props: {
		path: Array<string | number>,
		reason: ShapeValidationErrorReason,
	}) {
		super(getErrorMessage(props.path, props.reason))
		this.path = props.path
		this.reason = props.reason
	}
}

export function getErrorMessage(path: Array<string | number>, reason: ShapeValidationErrorReason): string {
	return `Parameter${path.length > 0 ? ` ${getPathString(path)}` : ""} ${getReasonString(reason)}.`
}

function getReasonString(reason: ShapeValidationErrorReason): string {
	if (reason instanceof MinLengthReason || reason instanceof MaxLengthReason) {
		if (reason.minLength !== undefined && reason.maxLength !== undefined) {
			return `must be between ${reason.minLength} and ${reason.maxLength} character${plurality(reason.maxLength)}`
		} else {
			if (reason instanceof MinLengthReason) {
				return `must be at least ${reason.minLength} character${plurality(reason.minLength)}`
			} else {
				return `must not exceed ${reason.maxLength} character${plurality(reason.maxLength)}`
			}
		}
	} else if (reason instanceof MinReason || reason instanceof MaxReason) {
		if (reason.min !== undefined && reason.max !== undefined) {
			return `must be between ${reason.min} and ${reason.max}`
		} else {
			if (reason instanceof MinReason) {
				return `must be at least ${reason.min}`
			} else {
				return `must not exceed ${reason.max}`
			}
		}
	} else if (reason instanceof IntegerReason) {
		return `must be an integer`
	} else if (reason instanceof PatternReason) {
		return `must match the pattern ${reason.pattern}`
	} else {
		return "is invalid"
	}
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