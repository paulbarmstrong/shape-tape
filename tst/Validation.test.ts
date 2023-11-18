import { ShapeValidationError, s, validateShape } from "../src"

describe("validateShape", () => {
	test("string", () => {
		expect(() => validateShape("banana", s.string)).not.toThrow()
		expect(() => validateShape("", s.string)).not.toThrow()
		;[true, false, null, undefined, {}, {a: "b"}, [], ["a", "b"], new Map()].forEach((nonString: any) => {
			expect(() => validateShape(nonString, s.string)).toThrow(ShapeValidationError)
		})
	})
})
