import { s } from "../src"

describe("object", () => {
	test("object", () => {
		expect(s.object({one: s.literal(1), two: s.literal(2)}).object).toStrictEqual({one: s.literal(1), two: s.literal(2)})
	})
})

describe("union", () => {
	test("members", () => {
		expect(s.union([s.literal("apple"), s.literal("orange")]).members)
			.toStrictEqual([s.literal("apple"), s.literal("orange")])
	})
})

describe("literal", () => {
	test("value", () => {
		expect(s.literal("apple").value).toStrictEqual("apple")
	})
})
