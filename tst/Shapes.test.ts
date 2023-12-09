import { s } from "../src"

describe("dictionary", () => {
	test("keys", () => {
		expect(s.dictionary({one: s.literal(1), two: s.literal(2)}).keys()).toStrictEqual(["one", "two"])
	})
	test("dictionary", () => {
		expect(s.dictionary({one: s.literal(1), two: s.literal(2)}).dictionary()).toStrictEqual({one: s.literal(1), two: s.literal(2)})
	})
})

describe("union", () => {
	test("members", () => {
		expect(s.union([s.literal("apple"), s.literal("orange")]).members())
			.toStrictEqual([s.literal("apple"), s.literal("orange")])
	})
})

describe("literal", () => {
	test("value", () => {
		expect(s.literal("apple").value()).toStrictEqual("apple")
	})
})
