export type AnyClassConstructor<T = any> = new (...args: any[]) => T
export type Literal = string | number | boolean | null | undefined

export type StringShape = {
	_type: "string",
	_condition?: (value: string) => boolean
}

export type NumberShape = {
	_type: "number",
	_condition?: (entity: number) => boolean
}

export type BooleanShape = {
	_type: "boolean"
}

export type LiteralShape = {
	_type: "literal",
	_data: Literal,
	value: Literal
}

export type DictionaryShape = {
	_type: "dictionary",
	_data: {
		[key: string]: Shape
	}
	_condition?: (entity: { [key: string]: any }) => boolean,
	keys: Array<string>
}

export type ArrayShape = {
	_type: "array",
	_data: Shape,
	_condition?: (entity: Array<any>) => boolean
}

export type UnionShape = {
	_type: "union",
	_data: Array<Shape>,
	subShapes: Array<Shape>
}

export type ClassShape = {
	_type: "class",
	_data: AnyClassConstructor,
	_condition?: (entity: InstanceType<AnyClassConstructor>) => boolean
}

export type Shape = StringShape | NumberShape | BooleanShape | LiteralShape | DictionaryShape
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
	S extends { _type: infer T } ? (
		T extends "string" ? string :
		T extends "number" ? number :
		T extends "boolean" ? boolean :
		T extends "undefined" ? undefined :
		S extends { _type: infer T, _data: infer D } ? (
			T extends "literal" ? D extends Literal ? (
				D
			) : never :
			T extends "dictionary" ? D extends { [key: string]: infer U extends Shape } ? (
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
