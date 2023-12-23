import { s, validateObjectShape } from "../src"
import { ShapeValidationError } from "../src/ValidationError"

test("ShapeValidationError path", () => {
	expect(getErrorPath(() => validateObjectShape({ object: 5, shape: s.string() }))).toStrictEqual([])
	expect(getErrorPath(() => validateObjectShape({ object: true, shape: s.number() }))).toStrictEqual([])
	expect(getErrorPath(() => validateObjectShape({ object: "false", shape: s.boolean() }))).toStrictEqual([])
	expect(getErrorPath(() => validateObjectShape({ object: "apple", shape: s.literal("banana") }))).toStrictEqual([])
	expect(getErrorPath(() => validateObjectShape({ object: "apple", shape: s.dictionary({fruit: s.string()}) }))).toStrictEqual([])
	expect(getErrorPath(() => validateObjectShape({
		object: {plant: "grass"},
		shape: s.dictionary({fruit: s.string()})
	}))).toStrictEqual([])

	expect(getErrorPath(() => validateObjectShape({
		object: {},
		shape: s.dictionary({fruit: s.string()})
	}))).toStrictEqual(["fruit"])
	expect(getErrorPath(() => validateObjectShape({
		object: {fruit: 5},
		shape: s.dictionary({fruit: s.string()})
	}))).toStrictEqual(["fruit"])

	expect(getErrorPath(() => validateObjectShape({
		object: {config: {frequency: "ten"}},
		shape: s.dictionary({config: s.dictionary({frequency: s.number()})})
	})))
		.toStrictEqual(["config", "frequency"])
	expect(getErrorPath(() => validateObjectShape({
		object: ["pear", "apple"],
		shape: s.array(s.union([s.literal("apple"), s.literal("banana")]))
	}))).toStrictEqual([0])
	expect(getErrorPath(() => validateObjectShape({
		object: {users: [{id: 0, name: "banana"}, {id: "a", name: "pear"}]},
		shape: s.dictionary({
			users: s.array(s.dictionary({
				id: s.number(),
				name: s.string()
			}))
		})
	}))).toStrictEqual(["users", 1, "id"])
})

test("ShapeValidationError message", () => {
	expect(new ShapeValidationError({path: [], object: 10, shape: s.string()}).message)
		.toStrictEqual("Parameter is invalid.")
	expect(new ShapeValidationError({path: ["name"], object: 10, shape: s.string()}).message)
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