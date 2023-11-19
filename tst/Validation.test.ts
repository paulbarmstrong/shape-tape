import { ShapeToType, ShapeValidationError, s, validateShape } from "../src"

describe("validateShape", () => {
	test("string", () => {
		["apple", "banana", ""].forEach(validEntity => {
			expect(() => validateShape(validEntity, s.string())).not.toThrow()
		})
		;[true, false, null, undefined, {}, {a: "b"}, [], [5, "b"], new Map(), 5].forEach((invalidEntity: any) => {
			expect(() => validateShape(invalidEntity, s.string())).toThrow(ShapeValidationError)
		})
		expect(() => validateShape("apple", s.string({condition: str => str.length === 5}))).not.toThrow()
		expect(() => validateShape("apple", s.string({condition: str => str.length === 6}))).toThrow(ShapeValidationError)
		expect(() => validateShape("10px", s.optional(s.string({regex: /^[0-9]+px$/})))).not.toThrow()
		expect(() => validateShape("10pt", s.optional(s.string({regex: /^[0-9]+px$/})))).toThrow(ShapeValidationError)
	})
	test("number", () => {
		[-10, 0, 1.5, 81, 13/6].forEach(validEntity => {
			expect(() => validateShape(validEntity, s.number())).not.toThrow()
		})
		;["apple", "", true, false, null, undefined, {}, {a: "b"}, [], [5, 6], new Map()].forEach((invalidEntity: any) => {
			expect(() => validateShape(invalidEntity, s.number())).toThrow(ShapeValidationError)
		})
		expect(() => validateShape(5, s.number({condition: num => num < 6}))).not.toThrow()
		expect(() => validateShape(5, s.number({condition: num => num < 5}))).toThrow(ShapeValidationError)
		expect(() => validateShape(10, s.number({lowerBound: 4, upperBound: 10}))).not.toThrow()
		expect(() => validateShape(11, s.number({lowerBound: 4, upperBound: 10}))).toThrow(ShapeValidationError)
	})
	test("boolean", () => {
		[false, true].forEach(validEntity => {
			expect(() => validateShape(validEntity, s.boolean())).not.toThrow()
		})
		;["apple", "", null, undefined, {}, {a: "b"}, [], [5, "c"], new Map(), 5].forEach((invalidEntity: any) => {
			expect(() => validateShape(invalidEntity, s.boolean())).toThrow(ShapeValidationError)
		})
	}),
	test("literal", () => {
		expect(() => validateShape("banana", s.literal("banana"))).not.toThrow()
		expect(() => validateShape("", s.literal(""))).not.toThrow()
		;["apple", "", null, undefined, {}, {a: "b"}, [], [5, "c"], new Map(), 5].forEach((invalidEntity: any) => {
			expect(() => validateShape(invalidEntity, s.literal("banana"))).toThrow(ShapeValidationError)
		})
		expect(() => validateShape(5, s.literal(5))).not.toThrow()
		expect(() => validateShape(6, s.literal(5))).toThrow(ShapeValidationError)
		expect(() => validateShape(true, s.literal(true))).not.toThrow()
		expect(() => validateShape(false, s.literal(true))).toThrow(ShapeValidationError)
		expect(() => validateShape(undefined, s.literal(undefined))).not.toThrow()
		expect(() => validateShape(undefined, s.literal(null))).toThrow(ShapeValidationError)
		expect(() => validateShape(null, s.literal(null))).not.toThrow()
		expect(() => validateShape(null, s.literal(undefined))).toThrow(ShapeValidationError)
	})
	test("dict", () => {
		expect(() => validateShape({}, s.dictionary({}))).not.toThrow()
		const fruitSelectionShape = s.dictionary({fruit: s.union([s.literal("apple"), s.literal("banana"), s.literal("orange")])})
		;[{fruit: "apple"}, {fruit: "banana"}, {fruit: "orange"}].forEach(validEntity => {
			expect(() => validateShape(validEntity, fruitSelectionShape)).not.toThrow()
		})
		;[
			"apple", "", null, true, false, undefined, {}, {a: "b"}, [], [5, "c"], new Map(), 5, {fruit: "grape"}
		].forEach((invalidEntity: any) => {
			expect(() => validateShape(invalidEntity, fruitSelectionShape)).toThrow(ShapeValidationError)
		})
	})
	test("array", () => {
		;[[], ["apple", "banana"]].forEach(validEntity => {
			expect(() => validateShape(validEntity, s.array(s.string()))).not.toThrow()
		})
		;["apple", "", null, true, false, undefined, {}, {a: "b"}, [5, "c"], new Map(), 5, [5]].forEach((invalidEntity: any) => {
			expect(() => validateShape(invalidEntity, s.array(s.string()))).toThrow(ShapeValidationError)
		})
		expect(() => validateShape(["a", "b"], s.array(s.string(), {condition: arr => arr.length < 3}))).not.toThrow()
		expect(() => validateShape(["a", "b", "c"], s.array(s.string(), {condition: arr => arr.length < 3}))).toThrow(ShapeValidationError)
	})
	test("union", () => {
		const fruitShape = s.union([s.literal("apple"), s.literal("banana"), s.literal("orange")])
		;["apple", "banana", "orange"].forEach(validEntity => {
			expect(() => validateShape(validEntity, fruitShape)).not.toThrow()
		})
		;[
			"grape", "", null, true, false, undefined, {}, {a: "b"}, [5, "c"], new Map(), 5, [5], {fruit: "apple"}
		].forEach((invalidEntity: any) => {
			expect(() => validateShape(invalidEntity, fruitShape)).toThrow(ShapeValidationError)
		})
	})
	test("class", () => {
		class Fruit {
			name: string
			constructor(name: string) {
				this.name = name
			}
		}
		expect(() => validateShape([new Fruit("apple"), new Fruit("banana")], s.array(s.class(Fruit)))).not.toThrow()
		expect(() => validateShape([new Fruit("apple"), "banana"], s.array(s.class(Fruit)))).toThrow(ShapeValidationError)
		expect(() => validateShape(new Fruit("apple"), s.class(Fruit, {condition: fruit => fruit.name.length > 4}))).not.toThrow()
		expect(() => validateShape(new Fruit("apple"), s.class(Fruit, {condition: fruit => fruit.name.length > 5}))).toThrow(ShapeValidationError)
		expect(() => validateShape(new Uint8Array(), s.class(Uint8Array))).not.toThrow()
		expect(() => validateShape(new Uint16Array(), s.class(Uint8Array))).toThrow(ShapeValidationError)
	})
	test("optional", () => {
		expect(() => validateShape(undefined, s.optional(s.string()))).not.toThrow()
		expect(() => validateShape("hello", s.optional(s.string()))).not.toThrow()
		expect(() => validateShape(10, s.optional(s.string()))).toThrow(ShapeValidationError)
	})
	test("integer", () => {
		[-20, 0, 1, 100, 65000].forEach(validEntity => {
			expect(() => validateShape(validEntity, s.integer())).not.toThrow()
		})
		;[true, false, null, undefined, {}, {a: "b"}, [], [5, "b"], new Map(), 5.1, 3/2].forEach((invalidEntity: any) => {
			expect(() => validateShape(invalidEntity, s.string())).toThrow(ShapeValidationError)
		})
		;[0, 1, 2, 3, 4].forEach(validEntity => {
			expect(() => validateShape(validEntity, s.integer({lowerBound: 0, upperBound: 4}))).not.toThrow()
		})
		;[-100, -2, -1, 5, 6, 1000].forEach(invalidEntry => {
			expect(() => validateShape(invalidEntry, s.integer({lowerBound: 0, upperBound: 4}))).toThrow(ShapeValidationError)
		})
	})
	test("ShapeValidationError path", () => {
		expect(getErrorPath(() => validateShape(5, s.string()))).toStrictEqual([])
		expect(getErrorPath(() => validateShape(true, s.number()))).toStrictEqual([])
		expect(getErrorPath(() => validateShape("false", s.boolean()))).toStrictEqual([])
		expect(getErrorPath(() => validateShape("apple", s.literal("banana")))).toStrictEqual([])
		expect(getErrorPath(() => validateShape("apple", s.dictionary({fruit: s.string()})))).toStrictEqual([])
		expect(getErrorPath(() => validateShape({plant: "grass"}, s.dictionary({fruit: s.string()})))).toStrictEqual([])

		expect(getErrorPath(() => validateShape({}, s.dictionary({fruit: s.string()})))).toStrictEqual(["fruit"])
		expect(getErrorPath(() => validateShape({fruit: 5}, s.dictionary({fruit: s.string()})))).toStrictEqual(["fruit"])

		expect(getErrorPath(() => validateShape({config: {frequency: "ten"}}, s.dictionary({config: s.dictionary({frequency: s.number()})}))))
			.toStrictEqual(["config", "frequency"])
		expect(getErrorPath(() => validateShape(["pear", "apple"], s.array(s.union([s.literal("apple"), s.literal("banana")])))))
			.toStrictEqual([0])
		const usersShape = s.dictionary({
			users: s.array(s.dictionary({
				id: s.number(),
				name: s.string()
			}))
		})
		expect(getErrorPath(() => validateShape({users: [{id: 0, name: "banana"}, {id: "a", name: "pear"}]}, usersShape)))
			.toStrictEqual(["users", 1, "id"])
	}),
	test("README example", () => {
		const resourceShape = s.dictionary({
			id: s.string({regex: /^[a-zA-Z0-9\-_]{10}$/}),
			state: s.union([s.literal("pending"), s.literal("active"), s.literal("removed")]),
			createdAt: s.integer()
		})

		type Resource = ShapeToType<typeof resourceShape>

		const goodData = JSON.parse("{\"id\":\"ui_1zoEJ18\",\"state\":\"active\",\"createdAt\":1700354795466}")
		const resource: Resource = validateShape(goodData, resourceShape)
		expect(resource.id).toStrictEqual("ui_1zoEJ18")

		const badData = JSON.parse("{\"id\":\"\",\"state\":\"active\",\"createdAt\":1700354795466}")
		expect(() => validateShape(badData, resourceShape)).toThrow(ShapeValidationError)
	})
	test("Error option", () => {
		class MyError extends Error {
			constructor(message: string) { super(message) }
		}
		expect(() => validateShape("five", s.string(), {error: e => new MyError(e.message)})).not.toThrow()
		expect(() => validateShape(5, s.string(), {error: e => new MyError(e.message)}))
			.toThrow(new MyError("Invalid parameter value."))
	})
})

test("getErrorMessage", () => {
	expect(new ShapeValidationError([]).message).toStrictEqual("Invalid parameter value.")
	expect(new ShapeValidationError(["name"]).message).toStrictEqual("Invalid value for parameter \"name\".")
	expect(new ShapeValidationError(["config", "frequency"]).message)
		.toStrictEqual("Invalid value for parameter config[\"frequency\"].")
	expect(new ShapeValidationError(["fruit", 0, "id"]).message).toStrictEqual("Invalid value for parameter fruit[0][\"id\"].")
	expect(new ShapeValidationError([0]).message).toStrictEqual("Invalid value for parameter [0].")
	expect(new ShapeValidationError([0, "id"]).message).toStrictEqual("Invalid value for parameter [0][\"id\"].")
})

function getErrorPath(fnc: () => void): Array<string | number> | undefined {
	try {
		fnc()
		return undefined
	} catch (error) {
		if (error instanceof ShapeValidationError) return error.path
		else throw error
	}
}
