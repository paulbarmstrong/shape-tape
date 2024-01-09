import { ShapeValidationError, s } from "../src"
import { validateDataShape } from "../src/Validation"

describe("validateDataShape", () => {
	describe("string", () => {
		test("no options", () => {
			["apple", "banana", ""].forEach(validEntity => {
				expect(() => validateDataShape({ data: validEntity, shape: s.string() })).not.toThrow()
			})
			;[true, false, null, undefined, {}, {a: "b"}, [], [5, "b"], new Map(), 5].forEach((invalidEntity: any) => {
				expect(() => validateDataShape({ data: invalidEntity, shape: s.string() })).toThrow(ShapeValidationError)
			})
		})
		test("length option", () => {
			expect(() => validateDataShape({data: "pear", shape: s.string({length: 4})})).not.toThrow()
			expect(() => validateDataShape({data: "pear", shape: s.string({length: 3})})).toThrow(ShapeValidationError)
		})
		test("minLength option", () => {
			const shape = s.string({minLength: 5})
			expect(() => validateDataShape({data: "pear", shape: shape})).toThrow(ShapeValidationError)
			expect(() => validateDataShape({data: "apple", shape: shape})).not.toThrow()
			expect(() => validateDataShape({data: "banana", shape: shape})).not.toThrow()
		})
		test("maxLength option", () => {
			const shape = s.string({maxLength: 5})
			expect(() => validateDataShape({data: "pear", shape: shape})).not.toThrow()
			expect(() => validateDataShape({data: "apple", shape: shape})).not.toThrow()
			expect(() => validateDataShape({data: "banana", shape: shape})).toThrow(ShapeValidationError)
		})
		test("condition option", () => {
			const shape = s.string({condition: str => str.length === 5})
			expect(() => validateDataShape({data: "pear", shape: shape})).toThrow(ShapeValidationError)
			expect(() => validateDataShape({data: "apple", shape: shape})).not.toThrow()
			expect(() => validateDataShape({data: "banana", shape: shape})).toThrow(ShapeValidationError)
		})
		test("pattern option", () => {
			const shape = s.string({pattern: /^[0-9]+px$/})
			expect(() => validateDataShape({data: "10px", shape: shape})).not.toThrow()
			expect(() => validateDataShape({data: "10pt", shape: shape})).toThrow(ShapeValidationError)
		})
	})
	describe("number", () => {
		test("no options", () => {
			[-10, 0, 1.5, 81, 13/6].forEach(validEntity => {
				expect(() => validateDataShape({ data: validEntity, shape: s.number() })).not.toThrow()
			})
			;["apple", "", true, false, null, undefined, {}, {a: "b"}, [], [5, 6], new Map()].forEach((invalidEntity: any) => {
				expect(() => validateDataShape({ data: invalidEntity, shape: s.number() })).toThrow(ShapeValidationError)
			})
		})
		test("condition option", () => {
			expect(() => validateDataShape({ data: 5, shape: s.number({condition: num => num < 6}) })).not.toThrow()
			expect(() => validateDataShape({ data: 5, shape: s.number({condition: num => num < 5}) })).toThrow(ShapeValidationError)
		})
		test("min/max options", () => {
			const shape = s.number({min: 4, max: 10})
			expect(() => validateDataShape({ data: 0, shape: shape })).toThrow(ShapeValidationError)
			expect(() => validateDataShape({ data: 3, shape: shape })).toThrow(ShapeValidationError)
			expect(() => validateDataShape({ data: 4, shape: shape })).not.toThrow()
			expect(() => validateDataShape({ data: 10, shape: shape })).not.toThrow()
			expect(() => validateDataShape({ data: 11, shape: shape })).toThrow(ShapeValidationError)
		})
	})
	test("boolean", () => {
		[false, true].forEach(validEntity => {
			expect(() => validateDataShape({ data: validEntity, shape: s.boolean() })).not.toThrow()
		})
		;["apple", "", null, undefined, {}, {a: "b"}, [], [5, "c"], new Map(), 5].forEach((invalidEntity: any) => {
			expect(() => validateDataShape({ data: invalidEntity, shape: s.boolean() })).toThrow(ShapeValidationError)
		})
	}),
	test("literal", () => {
		expect(() => validateDataShape({ data: "banana", shape: s.literal("banana")})).not.toThrow()
		expect(() => validateDataShape({ data: "", shape: s.literal("") })).not.toThrow()
		;["apple", "", null, undefined, {}, {a: "b"}, [], [5, "c"], new Map(), 5].forEach((invalidEntity: any) => {
			expect(() => validateDataShape({ data: invalidEntity, shape: s.literal("banana") })).toThrow(ShapeValidationError)
		})
		expect(() => validateDataShape({ data: 5, shape: s.literal(5) })).not.toThrow()
		expect(() => validateDataShape({ data: 6, shape: s.literal(5) })).toThrow(ShapeValidationError)
		expect(() => validateDataShape({ data: true, shape: s.literal(true) })).not.toThrow()
		expect(() => validateDataShape({ data: false, shape: s.literal(true) })).toThrow(ShapeValidationError)
		expect(() => validateDataShape({ data: undefined, shape: s.literal(undefined) })).not.toThrow()
		expect(() => validateDataShape({ data: undefined, shape: s.literal(null) })).toThrow(ShapeValidationError)
		expect(() => validateDataShape({ data: null, shape: s.literal(null) })).not.toThrow()
		expect(() => validateDataShape({ data: null, shape: s.literal(undefined) })).toThrow(ShapeValidationError)
	})
	test("object", () => {
		expect(() => validateDataShape({ data: {}, shape: s.object({}) })).not.toThrow()
		const fruitSelectionShape = s.object({fruit: s.union([s.literal("apple"), s.literal("banana"), s.literal("orange")])})
		;[{fruit: "apple"}, {fruit: "banana"}, {fruit: "orange"}].forEach(validEntity => {
			expect(() => validateDataShape({ data: validEntity, shape: fruitSelectionShape })).not.toThrow()
		})
		;[
			"apple", "", null, true, false, undefined, {}, {a: "b"}, [], [5, "c"], new Map(), 5, {fruit: "grape"}
		].forEach((invalidEntity: any) => {
			expect(() => validateDataShape({ data: invalidEntity, shape: fruitSelectionShape })).toThrow(ShapeValidationError)
		})
		const weightsShape = s.object({
			weight0: s.number(),
			weight1: s.number()
		}, { condition: obj => obj.weight0+obj.weight1 === 100 })
		expect(() => validateDataShape({
			data: {
				weight0: 25,
				weight1: 75
			},
			shape: weightsShape
		})).not.toThrow()
		expect(() => validateDataShape({
			data: {
				weight0: 25,
				weight1: 50
			},
			shape: weightsShape
		})).toThrow(ShapeValidationError)
	})
	test("array", () => {
		;[[], ["apple", "banana"]].forEach(validEntity => {
			expect(() => validateDataShape({ data: validEntity, shape: s.array(s.string()) })).not.toThrow()
		})
		;["apple", "", null, true, false, undefined, {}, {a: "b"}, [5, "c"], new Map(), 5, [5]].forEach((invalidEntity: any) => {
			expect(() => validateDataShape({ data: invalidEntity, shape: s.array(s.string()) })).toThrow(ShapeValidationError)
		})
		expect(() => validateDataShape({
			data: ["a", "b"],
			shape: s.array(s.string(), {condition: arr => arr.length < 3})
		})).not.toThrow()
		expect(() => validateDataShape({
			data: ["a", "b", "c"],
			shape: s.array(s.string(), {condition: arr => arr.length < 3})
		})).toThrow(ShapeValidationError)
		expect(() => validateDataShape({
			data: ["a", "b", "c"],
			shape: s.array(s.string(), {condition: arr => !arr.includes("d")})
		})).not.toThrow()
		expect(() => validateDataShape({
			data: ["a", "b", "c"],
			shape: s.array(s.string(), {condition: arr => !arr.includes("b")})
		})).toThrow(ShapeValidationError)
	})
	test("union", () => {
		const fruitShape = s.union([s.literal("apple"), s.literal("banana"), s.literal("orange")])
		;["apple", "banana", "orange"].forEach(validEntity => {
			expect(() => validateDataShape({ data: validEntity, shape: fruitShape })).not.toThrow()
		})
		;[
			"grape", "", null, true, false, undefined, {}, {a: "b"}, [5, "c"], new Map(), 5, [5], {fruit: "apple"}
		].forEach((invalidEntity: any) => {
			expect(() => validateDataShape({ data: invalidEntity, shape: fruitShape })).toThrow(ShapeValidationError)
		})
	})
	test("class", () => {
		class Fruit {
			name: string
			constructor(name: string) {
				this.name = name
			}
		}
		expect(() => validateDataShape({
			data: [new Fruit("apple"), new Fruit("banana")],
			shape: s.array(s.class(Fruit))
		})).not.toThrow()
		expect(() => validateDataShape({
			data: [new Fruit("apple"), "banana"],
			shape: s.array(s.class(Fruit))
		})).toThrow(ShapeValidationError)
		expect(() => validateDataShape({
			data: new Fruit("apple"),
			shape: s.class(Fruit, {condition: fruit => fruit.name.length > 4})
		})).not.toThrow()
		expect(() => validateDataShape({
			data: new Fruit("apple"),
			shape: s.class(Fruit, {condition: fruit => fruit.name.length > 5})
		})).toThrow(ShapeValidationError)
		expect(() => validateDataShape({ data: new Uint8Array(), shape: s.class(Uint8Array) })).not.toThrow()
		expect(() => validateDataShape({ data: new Uint16Array(), shape: s.class(Uint8Array) })).toThrow(ShapeValidationError)
	})
	test("optional", () => {
		expect(() => validateDataShape({ data: undefined, shape: s.optional(s.string()) })).not.toThrow()
		expect(() => validateDataShape({ data: "hello", shape: s.optional(s.string()) })).not.toThrow()
		expect(() => validateDataShape({ data: 10, shape: s.optional(s.string()) })).toThrow(ShapeValidationError)
	})
	test("integer", () => {
		[-20, 0, 1, 100, 65000].forEach(validEntity => {
			expect(() => validateDataShape({ data: validEntity, shape: s.integer() })).not.toThrow()
		})
		;[true, false, null, undefined, {}, {a: "b"}, [], [5, "b"], new Map(), 5.1, 3/2].forEach((invalidEntity: any) => {
			expect(() => validateDataShape({ data: invalidEntity, shape: s.string() })).toThrow(ShapeValidationError)
		})
		;[0, 1, 2, 3, 4].forEach(validEntity => {
			expect(() => validateDataShape({ data: validEntity, shape: s.integer({min: 0, max: 4}) })).not.toThrow()
		})
		;[0.5, 2/3].forEach(invalidEntity => {
			expect(() => validateDataShape({ data: invalidEntity, shape: s.integer() })).toThrow(ShapeValidationError)
		})
		;[-100, -2, -1, 5, 6, 1000].forEach(invalidEntity => {
			expect(() => validateDataShape({
				data: invalidEntity,
				shape: s.integer({min: 0, max: 4})
			})).toThrow(ShapeValidationError)
		})
	})

	test("shapeValidationErrorOverride", () => {
		class MyError extends Error {
			constructor(message: string) { super(message) }
		}
		expect(() => validateDataShape({
			data: "five",
			shape: s.string(),
			shapeValidationErrorOverride: e => new MyError(e.message)
		})).not.toThrow()
		expect(() => validateDataShape({
			data: 5,
			shape: s.string(),
			shapeValidationErrorOverride: e => new MyError(e.message)
		})).toThrow(new MyError("Parameter is invalid."))
	})	
})
