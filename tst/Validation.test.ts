import { ShapeValidationError, s, validateShape } from "../src"

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
})
