import { s } from "../src"

describe("dictionary", () => {
	test("keys", () => {
		expect(s.dictionary({one: s.literal(1), two: s.literal(2)}).keys).toStrictEqual(["one", "two"])
	})
})

describe("union", () => {
	test("subShapes", () => {
		expect(s.union([s.literal("apple"), s.literal("orange")]).subShapes)
			.toStrictEqual([s.literal("apple"), s.literal("orange")])
	})
})

describe("literal", () => {
	test("value", () => {
		expect(s.literal("apple").value).toStrictEqual("apple")
	})
})
