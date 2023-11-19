export type AnyClassConstructor<T = any> = new (...args: any[]) => T
export type Literal = string | number | boolean | null | undefined

type StringShape = {
	type: "string",
	condition?: (value: string) => boolean
}

type NumberShape = {
	type: "number",
	condition?: (entity: number) => boolean
}

type BooleanShape = {
	type: "boolean"
}

type UndefinedShape = {
	type: "undefined"
}

type LiteralShape = {
	type: "literal",
	data: Literal
}

type DictShape = {
	type: "dict",
	data: {
		[key: string]: Shape
	}
	condition?: (entity: { [key: string]: any }) => boolean
}

type ArrayShape = {
	type: "array",
	data: Shape,
	condition?: (entity: Array<any>) => boolean
}

type UnionShape = {
	type: "union",
	data: Array<Shape>
}

type ClassShape = {
	type: "class",
	data: AnyClassConstructor,
	condition?: (entity: AnyClassConstructor) => boolean
}

export type Shape = StringShape | NumberShape | BooleanShape | UndefinedShape | LiteralShape | DictShape
	| ArrayShape | UnionShape | ClassShape

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
	S extends { type: infer T } ? (
		T extends "string" ? string :
		T extends "number" ? number :
		T extends "boolean" ? boolean :
		T extends "undefined" ? undefined :
		S extends { type: infer T, data: infer D } ? (
			T extends "literal" ? D extends Literal ? (
				D
			) : never :
			T extends "dict" ? D extends { [key: string]: infer U extends Shape } ? (
				{ [K in keyof D]: ShapeToType<D[K], IncrDepth<Depth>> }
			) : never :
			T extends "array" ? D extends Shape ? (
				Array<ShapeToType<D, IncrDepth<Depth>>>
			) : never :
			T extends "union" ? D extends Array<Shape> ? (
				ShapeToType<D[number], IncrDepth<Depth>>
			) : never :
			T extends "class" ? D extends AnyClassConstructor ? (
				InstanceType<D>
			) : never :
			T extends "optional" ? D extends Shape ? (
				D | undefined
			) : never :
			never
		) : (
			never
		)
	) : (
		never
	)
