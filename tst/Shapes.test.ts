import { s } from "../src"

describe("object", () => {
	test("shapeMappings", () => {
		expect(s.object({one: s.literal(1), two: s.literal(2)}).propertyShapes).toStrictEqual({one: s.literal(1), two: s.literal(2)})
	})
})

describe("union", () => {
	test("memberShapes", () => {
		expect(s.union([s.literal("apple"), s.literal("orange")]).memberShapes)
			.toStrictEqual([s.literal("apple"), s.literal("orange")])
	})
})

describe("literal", () => {
	test("value", () => {
		expect(s.literal("apple").value).toStrictEqual("apple")
	})
})
