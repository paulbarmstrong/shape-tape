import { s, validateDataShape } from "../src"
import { ShapeValidationError } from "../src/ValidationError"

test("ShapeValidationError path", () => {
	expect(getErrorPath(() => validateDataShape({ data: 5, shape: s.string() }))).toStrictEqual([])
	expect(getErrorPath(() => validateDataShape({ data: true, shape: s.number() }))).toStrictEqual([])
	expect(getErrorPath(() => validateDataShape({ data: "false", shape: s.boolean() }))).toStrictEqual([])
	expect(getErrorPath(() => validateDataShape({ data: "apple", shape: s.literal("banana") }))).toStrictEqual([])
	expect(getErrorPath(() => validateDataShape({ data: "apple", shape: s.object({fruit: s.string()}) }))).toStrictEqual([])
	expect(getErrorPath(() => validateDataShape({
		data: {plant: "grass"},
		shape: s.object({fruit: s.string()})
	}))).toStrictEqual([])

	expect(getErrorPath(() => validateDataShape({
		data: {},
		shape: s.object({fruit: s.string()})
	}))).toStrictEqual(["fruit"])
	expect(getErrorPath(() => validateDataShape({
		data: {fruit: 5},
		shape: s.object({fruit: s.string()})
	}))).toStrictEqual(["fruit"])

	expect(getErrorPath(() => validateDataShape({
		data: {config: {frequency: "ten"}},
		shape: s.object({config: s.object({frequency: s.number()})})
	})))
		.toStrictEqual(["config", "frequency"])
	expect(getErrorPath(() => validateDataShape({
		data: ["pear", "apple"],
		shape: s.array(s.union([s.literal("apple"), s.literal("banana")]))
	}))).toStrictEqual([0])
	expect(getErrorPath(() => validateDataShape({
		data: {users: [{id: 0, name: "banana"}, {id: "a", name: "pear"}]},
		shape: s.object({
			users: s.array(s.object({
				id: s.number(),
				name: s.string()
			}))
		})
	}))).toStrictEqual(["users", 1, "id"])
})

test("ShapeValidationError message", () => {
	expect(new ShapeValidationError({path: [], data: 10, shape: s.string()}).message)
		.toStrictEqual("Parameter is invalid.")
	expect(new ShapeValidationError({path: ["name"], data: 10, shape: s.string()}).message)
		.toStrictEqual("Parameter \"name\" is invalid.")
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