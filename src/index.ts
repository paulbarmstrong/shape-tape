/**
 * This is low level documentation. Please see [README.md](../README.md) for the high level documentation.
 * @module shape-tape
 */

export { Shape, StringShape, NumberShape, BooleanShape, LiteralShape, ObjectShape, ArrayShape, UnionShape,
	ClassShape, s } from "./Shapes"
export { ShapeToType } from "./Types"
export { validateDataShape } from "./Validation"
export { ShapeValidationError } from "./ValidationError"
