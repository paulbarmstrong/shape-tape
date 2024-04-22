import { ObjectShape, ShapeToType, StringShape, s } from "../src"
import { DefinitelyTrue } from "../src/Types"

type AssertEqual<A, B> = [A] extends [never] ? (
	[B] extends [never] ? true : false
) : (
	B extends A ? (A extends B ? true : false) : false
)

describe("ShapeToType", () => {
	test("StringShape", () => {
		const shape = s.string()
		const assertion: AssertEqual<ShapeToType<typeof shape>, string> = true
	})
	test("NumberShape", () => {
		const shape = s.number()
		const assertion: AssertEqual<ShapeToType<typeof shape>, number> = true
	})
	test("BooleanShape", () => {
		const shape = s.boolean()
		const assertion: AssertEqual<ShapeToType<typeof shape>, boolean> = true
	})
	describe("LiteralShape", () => {
		test("banana", () => {
			const shape = s.literal("banana")
			const assertion: AssertEqual<ShapeToType<typeof shape>, "banana"> = true
		})
		test("5", () => {
			const shape = s.literal(5)
			const assertion: AssertEqual<ShapeToType<typeof shape>, 5> = true
		})
		test("false", () => {
			const shape = s.literal(false)
			const assertion: AssertEqual<ShapeToType<typeof shape>, false> = true
		})
		test("null", () => {
			const shape = s.literal(null)
			const assertion: AssertEqual<ShapeToType<typeof shape>, null> = true
		})
		test("undefined", () => {
			const shape = s.literal(undefined)
			const assertion: AssertEqual<ShapeToType<typeof shape>, undefined> = true
		})
	})
	describe("ObjectShape", () => {
		test("empty", () => {
			const shape = s.object({})
			const assertion: AssertEqual<ShapeToType<typeof shape>, {}> = true
		})
		test("with parameters", () => {
			const shape = s.object({
				id: s.string(),
				updatedAt: s.integer(),
				status: s.union([s.literal("available"), s.literal("deleted")]),
				children: s.array(s.string())
			})
			const assertion: AssertEqual<ShapeToType<typeof shape>, {
				id: string,
				updatedAt: number,
				status: "available" | "deleted",
				children: Array<string>
			}> = true
		})
		test("with allowExtraProperties", () => {
			const shape = s.object({
				id: s.string()
			}, { allowExtraProperties: true })
			const assertion: AssertEqual<ShapeToType<typeof shape>, {
				id: string;
			} & Record<string, any>> = true
		})
	})
	describe("ArrayShape", () => {
		test("string", () => {
			const shape = s.array(s.string())
			const assertion: AssertEqual<ShapeToType<typeof shape>, Array<string>> = true
		})
		test("boolean", () => {
			const shape = s.array(s.boolean())
			const assertion: AssertEqual<ShapeToType<typeof shape>, Array<boolean>> = true
		})
	})
	describe("UnionShape", () => {
		test("empty", () => {
			const shape = s.union([])
			const assertion: AssertEqual<ShapeToType<typeof shape>, never> = true
		})
		test("one member", () => {
			const shape = s.union([s.literal("apple")])
			const assertion: AssertEqual<ShapeToType<typeof shape>, "apple"> = true
		})
		test("multiple members", () => {
			const shape = s.union([s.number(), s.literal("banana")])
			const assertion: AssertEqual<ShapeToType<typeof shape>, number | "banana"> = true
		})
	})
	describe("ClassShape", () => {
		test("Uint8Array", () => {
			const shape = s.class(Uint8Array)
			const assertion: AssertEqual<ShapeToType<typeof shape>, Uint8Array> = true
		})
		test("MyClass", () => {
			class MyClass {}
			const shape = s.class(MyClass)
			const assertion: AssertEqual<ShapeToType<typeof shape>, MyClass> = true
		})
	})
})

describe("DefinitelyTrue", () => {
	const assertion0: AssertEqual<DefinitelyTrue<true>, true> = true
	const assertion1: AssertEqual<DefinitelyTrue<false>, false> = true
	const assertion2: AssertEqual<DefinitelyTrue<true | undefined>, true> = true
	const assertion3: AssertEqual<DefinitelyTrue<false | undefined>, false> = true
	const assertion4: AssertEqual<DefinitelyTrue<undefined>, false> = true
	const assertion5: AssertEqual<DefinitelyTrue<boolean>, never> = true
})