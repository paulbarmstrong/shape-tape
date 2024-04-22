import { ArrayShape, BooleanShape, ClassShape, LiteralShape, NumberShape, ObjectShape, Shape, StringShape,
	UnionShape } from "./Shapes"

export type AnyClassConstructor<T = any> = new (...args: any[]) => T
type IncrDepth<Depth extends any[]> = [...Depth, never]

type D0 = []
type D1 = IncrDepth<D0>
type D2 = IncrDepth<D1>
type D3 = IncrDepth<D2>
type D4 = IncrDepth<D3>
type D5 = IncrDepth<D4>
type D6 = IncrDepth<D5>
type D7 = IncrDepth<D6>
type D8 = IncrDepth<D7>

/** Utility type for converting Shapes to the static types they represent. */
export type ShapeToType<S extends Shape> = ShapeToTypeAux<S>

type ShapeToTypeAux<S extends Shape, Depth extends any[] = D0> =
	Depth extends D8 ? any :
	S extends StringShape ? string :
	S extends NumberShape ? number :
	S extends BooleanShape ? boolean :
	S extends LiteralShape<any> ? S["value"] :
	S extends ObjectShape<any, any> ? { [K in keyof S["propertyShapes"]]: ShapeToTypeAux<S["propertyShapes"][K], IncrDepth<Depth>> } & 
		(DefinitelyTrue<S["allowExtraProperties"]> extends true ? Record<string, any> : {}) :
	S extends ArrayShape<any> ? Array<ShapeToTypeAux<S["elementShape"], IncrDepth<Depth>>> :
	S extends UnionShape<any> ? ShapeToTypeAux<S["memberShapes"][number], IncrDepth<Depth>> :
	S extends ClassShape<any> ? InstanceType<S["clazz"]> :
	never

export type DefinitelyTrue<T extends boolean | undefined> =
	[T] extends [undefined] ? false :
	[T] extends [true | undefined] ? true :
	[T] extends [false | undefined] ? false :
	never