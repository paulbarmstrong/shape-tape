import { PatternReason, ShapeToType, ShapeValidationError, s } from "../src"
import { validateObjectShape } from "../src/Validation"

describe("validateObjectShape", () => {
	test("string", () => {
		["apple", "banana", ""].forEach(validEntity => {
			expect(() => validateObjectShape({ object: validEntity, shape: s.string() })).not.toThrow()
		})
		;[true, false, null, undefined, {}, {a: "b"}, [], [5, "b"], new Map(), 5].forEach((invalidEntity: any) => {
			expect(() => validateObjectShape({ object: invalidEntity, shape: s.string() })).toThrow(ShapeValidationError)
		})
		expect(() => validateObjectShape({
			object: "apple",
			shape: s.string({condition: str => str.length === 5})
		})).not.toThrow()
		expect(() => validateObjectShape({
			object: "apple",
			shape: s.string({condition: str => str.length === 6})
		})).toThrow(ShapeValidationError)
		expect(() => validateObjectShape({
			object: "10px",
			shape: s.optional(s.string({pattern: /^[0-9]+px$/}))
		})).not.toThrow()
		expect(() => validateObjectShape({
			object: "10pt",
			shape: s.optional(s.string({pattern: /^[0-9]+px$/}))
		})).toThrow(ShapeValidationError)
	})
	test("number", () => {
		[-10, 0, 1.5, 81, 13/6].forEach(validEntity => {
			expect(() => validateObjectShape({ object: validEntity, shape: s.number() })).not.toThrow()
		})
		;["apple", "", true, false, null, undefined, {}, {a: "b"}, [], [5, 6], new Map()].forEach((invalidEntity: any) => {
			expect(() => validateObjectShape({ object: invalidEntity, shape: s.number() })).toThrow(ShapeValidationError)
		})
		expect(() => validateObjectShape({ object: 5, shape: s.number({condition: num => num < 6}) })).not.toThrow()
		expect(() => validateObjectShape({ object: 5, shape: s.number({condition: num => num < 5}) })).toThrow(ShapeValidationError)
		expect(() => validateObjectShape({ object: 10, shape: s.number({min: 4, max: 10}) })).not.toThrow()
		expect(() => validateObjectShape({ object: 11, shape: s.number({min: 4, max: 10}) })).toThrow(ShapeValidationError)
	})
	test("boolean", () => {
		[false, true].forEach(validEntity => {
			expect(() => validateObjectShape({ object: validEntity, shape: s.boolean() })).not.toThrow()
		})
		;["apple", "", null, undefined, {}, {a: "b"}, [], [5, "c"], new Map(), 5].forEach((invalidEntity: any) => {
			expect(() => validateObjectShape({ object: invalidEntity, shape: s.boolean() })).toThrow(ShapeValidationError)
		})
	}),
	test("literal", () => {
		expect(() => validateObjectShape({ object: "banana", shape: s.literal("banana")})).not.toThrow()
		expect(() => validateObjectShape({ object: "", shape: s.literal("") })).not.toThrow()
		;["apple", "", null, undefined, {}, {a: "b"}, [], [5, "c"], new Map(), 5].forEach((invalidEntity: any) => {
			expect(() => validateObjectShape({ object: invalidEntity, shape: s.literal("banana") })).toThrow(ShapeValidationError)
		})
		expect(() => validateObjectShape({ object: 5, shape: s.literal(5) })).not.toThrow()
		expect(() => validateObjectShape({ object: 6, shape: s.literal(5) })).toThrow(ShapeValidationError)
		expect(() => validateObjectShape({ object: true, shape: s.literal(true) })).not.toThrow()
		expect(() => validateObjectShape({ object: false, shape: s.literal(true) })).toThrow(ShapeValidationError)
		expect(() => validateObjectShape({ object: undefined, shape: s.literal(undefined) })).not.toThrow()
		expect(() => validateObjectShape({ object: undefined, shape: s.literal(null) })).toThrow(ShapeValidationError)
		expect(() => validateObjectShape({ object: null, shape: s.literal(null) })).not.toThrow()
		expect(() => validateObjectShape({ object: null, shape: s.literal(undefined) })).toThrow(ShapeValidationError)
	})
	test("dictionary", () => {
		expect(() => validateObjectShape({ object: {}, shape: s.dictionary({}) })).not.toThrow()
		const fruitSelectionShape = s.dictionary({fruit: s.union([s.literal("apple"), s.literal("banana"), s.literal("orange")])})
		;[{fruit: "apple"}, {fruit: "banana"}, {fruit: "orange"}].forEach(validEntity => {
			expect(() => validateObjectShape({ object: validEntity, shape: fruitSelectionShape })).not.toThrow()
		})
		;[
			"apple", "", null, true, false, undefined, {}, {a: "b"}, [], [5, "c"], new Map(), 5, {fruit: "grape"}
		].forEach((invalidEntity: any) => {
			expect(() => validateObjectShape({ object: invalidEntity, shape: fruitSelectionShape })).toThrow(ShapeValidationError)
		})
	})
	test("array", () => {
		;[[], ["apple", "banana"]].forEach(validEntity => {
			expect(() => validateObjectShape({ object: validEntity, shape: s.array(s.string()) })).not.toThrow()
		})
		;["apple", "", null, true, false, undefined, {}, {a: "b"}, [5, "c"], new Map(), 5, [5]].forEach((invalidEntity: any) => {
			expect(() => validateObjectShape({ object: invalidEntity, shape: s.array(s.string()) })).toThrow(ShapeValidationError)
		})
		expect(() => validateObjectShape({
			object: ["a", "b"],
			shape: s.array(s.string(), {condition: arr => arr.length < 3})
		})).not.toThrow()
		expect(() => validateObjectShape({
			object: ["a", "b", "c"],
			shape: s.array(s.string(), {condition: arr => arr.length < 3})
		})).toThrow(ShapeValidationError)
	})
	test("union", () => {
		const fruitShape = s.union([s.literal("apple"), s.literal("banana"), s.literal("orange")])
		;["apple", "banana", "orange"].forEach(validEntity => {
			expect(() => validateObjectShape({ object: validEntity, shape: fruitShape })).not.toThrow()
		})
		;[
			"grape", "", null, true, false, undefined, {}, {a: "b"}, [5, "c"], new Map(), 5, [5], {fruit: "apple"}
		].forEach((invalidEntity: any) => {
			expect(() => validateObjectShape({ object: invalidEntity, shape: fruitShape })).toThrow(ShapeValidationError)
		})
	})
	test("class", () => {
		class Fruit {
			name: string
			constructor(name: string) {
				this.name = name
			}
		}
		expect(() => validateObjectShape({
			object: [new Fruit("apple"), new Fruit("banana")],
			shape: s.array(s.class(Fruit))
		})).not.toThrow()
		expect(() => validateObjectShape({
			object: [new Fruit("apple"), "banana"],
			shape: s.array(s.class(Fruit))
		})).toThrow(ShapeValidationError)
		expect(() => validateObjectShape({
			object: new Fruit("apple"),
			shape: s.class(Fruit, {condition: fruit => fruit.name.length > 4})
		})).not.toThrow()
		expect(() => validateObjectShape({
			object: new Fruit("apple"),
			shape: s.class(Fruit, {condition: fruit => fruit.name.length > 5})
		})).toThrow(ShapeValidationError)
		expect(() => validateObjectShape({ object: new Uint8Array(), shape: s.class(Uint8Array) })).not.toThrow()
		expect(() => validateObjectShape({ object: new Uint16Array(), shape: s.class(Uint8Array) })).toThrow(ShapeValidationError)
	})
	test("optional", () => {
		expect(() => validateObjectShape({ object: undefined, shape: s.optional(s.string()) })).not.toThrow()
		expect(() => validateObjectShape({ object: "hello", shape: s.optional(s.string()) })).not.toThrow()
		expect(() => validateObjectShape({ object: 10, shape: s.optional(s.string()) })).toThrow(ShapeValidationError)
	})
	test("integer", () => {
		[-20, 0, 1, 100, 65000].forEach(validEntity => {
			expect(() => validateObjectShape({ object: validEntity, shape: s.integer() })).not.toThrow()
		})
		;[true, false, null, undefined, {}, {a: "b"}, [], [5, "b"], new Map(), 5.1, 3/2].forEach((invalidEntity: any) => {
			expect(() => validateObjectShape({ object: invalidEntity, shape: s.string() })).toThrow(ShapeValidationError)
		})
		;[0, 1, 2, 3, 4].forEach(validEntity => {
			expect(() => validateObjectShape({ object: validEntity, shape: s.integer({min: 0, max: 4}) })).not.toThrow()
		})
		;[0.5, 2/3].forEach(invalidEntity => {
			expect(() => validateObjectShape({ object: invalidEntity, shape: s.integer() })).toThrow(ShapeValidationError)
		})
		;[-100, -2, -1, 5, 6, 1000].forEach(invalidEntity => {
			expect(() => validateObjectShape({
				object: invalidEntity,
				shape: s.integer({min: 0, max: 4})
			})).toThrow(ShapeValidationError)
		})
	})

	test("README example", () => {
		const resourceShape = s.dictionary({
			id: s.string({pattern: /^[a-zA-Z0-9\-_]{10}$/}),
			state: s.union([s.literal("pending"), s.literal("active"), s.literal("removed")]),
			createdAt: s.integer()
		})
	
		type Resource = ShapeToType<typeof resourceShape>
	
		const goodData = JSON.parse("{\"id\":\"ui_1zoEJ18\",\"state\":\"active\",\"createdAt\":1700354795466}")
		const resource: Resource = validateObjectShape({ object: goodData, shape: resourceShape })
		expect(resource.id).toStrictEqual("ui_1zoEJ18")
	
		const badData = JSON.parse("{\"id\":\"\",\"state\":\"active\",\"createdAt\":1700354795466}")
		expect(() => validateObjectShape({ object: badData, shape: resourceShape })).toThrow(new ShapeValidationError({
			path: ["id"],
			reason: new PatternReason({pattern: /^[a-zA-Z0-9\-_]{10}$/})
		}))
	})

	test("shapeValidationErrorOverride", () => {
		class MyError extends Error {
			constructor(message: string) { super(message) }
		}
		expect(() => validateObjectShape({
			object: "five",
			shape: s.string(),
			shapeValidationErrorOverride: e => new MyError(e.message)
		})).not.toThrow()
		expect(() => validateObjectShape({
			object: 5,
			shape: s.string(),
			shapeValidationErrorOverride: e => new MyError(e.message)
		})).toThrow(new MyError("Parameter is invalid."))
	})	
})
