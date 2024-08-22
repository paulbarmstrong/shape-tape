import { ArrayShape, BooleanShape, ClassShape, LiteralShape, NumberShape, ObjectShape, Shape, StringShape,
	UnionShape } from "./Shapes"

export type AnyClassConstructor<T = any> = new (...args: any[]) => T

/** Utility type for converting Shapes to the static types they represent. */
export type ShapeToType<S extends Shape> =
	S extends StringShape ? string :
	S extends NumberShape ? number :
	S extends BooleanShape ? boolean :
	S extends LiteralShape<any> ? S["value"] :
	S extends ObjectShape<any, any> ? { [K in keyof S["propertyShapes"]]: ShapeToType<S["propertyShapes"][K]> } & 
		(DefinitelyTrue<S["allowExtraProperties"]> extends true ? Record<string, any> : {}) :
	S extends ArrayShape<any> ? Array<ShapeToType<S["elementShape"]>> :
	S extends UnionShape<any> ? ShapeToType<S["memberShapes"][number]> :
	S extends ClassShape<any> ? InstanceType<S["clazz"]> :
	never

export type DefinitelyTrue<T extends boolean | undefined> =
	[T] extends [undefined] ? false :
	[T] extends [true | undefined] ? true :
	[T] extends [false | undefined] ? false :
	never