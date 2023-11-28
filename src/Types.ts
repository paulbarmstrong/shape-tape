import { ArrayShape, BooleanShape, ClassShape, DictionaryShape, LiteralShape, NumberShape, Shape, StringShape,
	UnionShape } from "./Shapes"

export type AnyClassConstructor<T = any> = new (...args: any[]) => T
export type Literal = string | number | boolean | null | undefined

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

export type ShapeToType<S extends Shape, Depth extends any[] = D0> =
	Depth extends D8 ? any :
	S extends StringShape ? string :
	S extends NumberShape ? number :
	S extends BooleanShape ? boolean :
	S extends LiteralShape<any> ? S["_internal"]["_value"] :
	S extends DictionaryShape<any> ? { [K in keyof S["_internal"]["_dictionary"]]: ShapeToType<S["_internal"]["_dictionary"][K], IncrDepth<Depth>> } :
	S extends ArrayShape<any> ? Array<ShapeToType<S["_internal"]["_memberShape"], IncrDepth<Depth>>> :
	S extends UnionShape<any> ? ShapeToType<S["_internal"]["_members"][number], IncrDepth<Depth>> :
	S extends ClassShape<any> ? InstanceType<S["_internal"]["_clazz"]> :
	never
