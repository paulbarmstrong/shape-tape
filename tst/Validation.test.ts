import { Shape, ShapeToType, ShapeValidationError, s, validateShape } from "../src"

describe("validateShape", () => {
	test("string", () => {
		["apple", "banana", ""].forEach(validEntity => {
			expect(() => validateShape(validEntity, s.string)).not.toThrow()
		})
		;[true, false, null, undefined, {}, {a: "b"}, [], [5, "b"], new Map(), 5].forEach((invalidEntity: any) => {
			expect(() => validateShape(invalidEntity, s.string)).toThrow(ShapeValidationError)
		})
	})
	test("number", () => {
		[-10, 0, 1.5, 81, 13/6].forEach(validEntity => {
			expect(() => validateShape(validEntity, s.number)).not.toThrow()
		})
		;["apple", "", true, false, null, undefined, {}, {a: "b"}, [], [5, 6], new Map()].forEach((invalidEntity: any) => {
			expect(() => validateShape(invalidEntity, s.number)).toThrow(ShapeValidationError)
		})
	})
	test("boolean", () => {
		[false, true].forEach(validEntity => {
			expect(() => validateShape(validEntity, s.boolean)).not.toThrow()
		})
		;["apple", "", null, undefined, {}, {a: "b"}, [], [5, "c"], new Map(), 5].forEach((invalidEntity: any) => {
			expect(() => validateShape(invalidEntity, s.boolean)).toThrow(ShapeValidationError)
		})
	}),
	test("literal", () => {
		expect(() => validateShape("banana", s.literal("banana"))).not.toThrow()
		expect(() => validateShape("", s.literal(""))).not.toThrow()
		;["apple", "", null, undefined, {}, {a: "b"}, [], [5, "c"], new Map(), 5].forEach((invalidEntity: any) => {
			expect(() => validateShape(invalidEntity, s.literal("banana"))).toThrow(ShapeValidationError)
		})
	})
	test("dict", () => {
		expect(() => validateShape({}, s.dict({}))).not.toThrow()
		const fruitSelectionShape = s.dict({fruit: s.union(s.literal("apple"), s.literal("banana"), s.literal("orange"))})
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
			expect(() => validateShape(validEntity, s.array(s.string))).not.toThrow()
		})
		;["apple", "", null, true, false, undefined, {}, {a: "b"}, [5, "c"], new Map(), 5, [5]].forEach((invalidEntity: any) => {
			expect(() => validateShape(invalidEntity, s.array(s.string))).toThrow(ShapeValidationError)
		})
	})
	test("union", () => {
		const fruitShape = s.union(s.literal("apple"), s.literal("banana"), s.literal("orange"))
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
		expect(() => validateShape([new Fruit("apple"), new Fruit("banana")] as any, s.array(s.class(Fruit)))).not.toThrow()
		expect(() => validateShape([new Fruit("apple"), "banana" as any], s.array(s.class(Fruit)))).toThrow(ShapeValidationError)
	})
	test("ShapeValidationError path", () => {
		expect(getErrorPath(() => validateShape(5, s.string))).toStrictEqual([])
		expect(getErrorPath(() => validateShape(true, s.number))).toStrictEqual([])
		expect(getErrorPath(() => validateShape("false", s.boolean))).toStrictEqual([])
		expect(getErrorPath(() => validateShape("apple", s.literal("banana")))).toStrictEqual([])
		expect(getErrorPath(() => validateShape("apple", s.dict({fruit: s.string})))).toStrictEqual([])
		expect(getErrorPath(() => validateShape({plant: "grass"}, s.dict({fruit: s.string})))).toStrictEqual([])

		expect(getErrorPath(() => validateShape({}, s.dict({fruit: s.string})))).toStrictEqual(["fruit"])
		expect(getErrorPath(() => validateShape({fruit: 5}, s.dict({fruit: s.string})))).toStrictEqual(["fruit"])

		expect(getErrorPath(() => validateShape({config: {frequency: "ten"}}, s.dict({config: s.dict({frequency: s.number})}))))
			.toStrictEqual(["config", "frequency"])
		expect(getErrorPath(() => validateShape(["pear", "apple"], s.array(s.union(s.literal("apple"), s.literal("banana"))))))
			.toStrictEqual([0])
		const usersShape = s.dict({
			users: s.array(s.dict({
				id: s.number,
				name: s.string
			}))
		})
		expect(getErrorPath(() => validateShape({users: [{id: 0, name: "banana"}, {id: "a", name: "pear"}]}, usersShape)))
			.toStrictEqual(["users", 1, "id"])
	})
})

test("getErrorMessage", () => {
	expect(new ShapeValidationError([]).message).toStrictEqual("Invalid parameter value.")
	expect(new ShapeValidationError(["name"]).message).toStrictEqual("Invalid value for parameter \"name\".")
	expect(new ShapeValidationError(["config", "frequency"]).message)
		.toStrictEqual("Invalid value for parameter \"config\"[\"frequency\"].")
	expect(new ShapeValidationError(["fruit", 0, "id"]).message).toStrictEqual("Invalid value for parameter \"fruit\"[0][\"id\"].")
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
