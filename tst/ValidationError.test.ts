import { s, validateObjectShape } from "../src"
import { GenericReason, IntegerReason, MaxLengthReason, MaxReason, MinLengthReason, MinReason, PatternReason, ShapeValidationError, ShapeValidationErrorReason, getErrorMessage } from "../src/ValidationError"

test("ShapeValidationError path", () => {
	expect(getErrorPath(() => validateObjectShape({ object: 5, shape: s.string() }))).toStrictEqual([])
	expect(getErrorPath(() => validateObjectShape({ object: true, shape: s.number() }))).toStrictEqual([])
	expect(getErrorPath(() => validateObjectShape({ object: "false", shape: s.boolean() }))).toStrictEqual([])
	expect(getErrorPath(() => validateObjectShape({ object: "apple", shape: s.literal("banana") }))).toStrictEqual([])
	expect(getErrorPath(() => validateObjectShape({ object: "apple", shape: s.dictionary({fruit: s.string()}) }))).toStrictEqual([])
	expect(getErrorPath(() => validateObjectShape({
		object: {plant: "grass"},
		shape: s.dictionary({fruit: s.string()})
	}))).toStrictEqual(["plant"])

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

describe("ShapeValidationError reason", () => {
	test("GenericReason", () => {
		expect(getErrorReason(() => validateObjectShape({ object: 5, shape: s.string() }))).toStrictEqual(new GenericReason())
		expect(getErrorReason(() => validateObjectShape({ object: 5, shape: s.string({minLength: 1}) }))).toStrictEqual(new GenericReason())
		expect(getErrorReason(() => validateObjectShape({ object: "three", shape: s.number() }))).toStrictEqual(new GenericReason())
		expect(getErrorReason(() => validateObjectShape({ object: "three", shape: s.number({min: 5}) }))).toStrictEqual(new GenericReason())
	})
	test("MinLengthReason", () => {
		expect(getErrorReason(() => validateObjectShape({ object: "", shape: s.string({minLength: 1}) }))).toStrictEqual(new MinLengthReason({minLength: 1}))
		expect(getErrorReason(() => validateObjectShape({ object: "", shape: s.string({minLength: 1, maxLength: 3}) }))).toStrictEqual(new MinLengthReason({minLength: 1, maxLength: 3}))
	})
	test("MaxLengthReason", () => {
		expect(getErrorReason(() => validateObjectShape({ object: "33333", shape: s.string({minLength: 1, maxLength: 3}) }))).toStrictEqual(new MaxLengthReason({minLength: 1, maxLength: 3}))
		expect(getErrorReason(() => validateObjectShape({ object: "33333", shape: s.string({maxLength: 4}) }))).toStrictEqual(new MaxLengthReason({maxLength: 4}))
	})
	test("MinReason", () => {
		expect(getErrorReason(() => validateObjectShape({ object: 0, shape: s.number({min: 5}) }))).toStrictEqual(new MinReason({min: 5}))
		expect(getErrorReason(() => validateObjectShape({ object: 4, shape: s.number({min: 5, max: 6}) }))).toStrictEqual(new MinReason({min: 5, max: 6}))
	})
	test("MaxReason", () => {
		expect(getErrorReason(() => validateObjectShape({ object: 89.3, shape: s.number({min: 5, max: 6}) }))).toStrictEqual(new MaxReason({min: 5, max: 6}))
		expect(getErrorReason(() => validateObjectShape({ object: 89, shape: s.number({max: 9}) }))).toStrictEqual(new MaxReason({max: 9}))
	})
	test("IntegerReason", () => {
		expect(getErrorReason(() => validateObjectShape({ object: 5/6, shape: s.integer({max: 9}) }))).toStrictEqual(new IntegerReason())
		expect(getErrorReason(() => validateObjectShape({ object: 5/6, shape: s.integer({max: 9}) }))).toStrictEqual(new IntegerReason())
	})
	test("PatternReason", () => {
		expect(getErrorReason(() => validateObjectShape({ object: "10px", shape: s.string({pattern: /^[0-9]+$/}) }))).toStrictEqual(new PatternReason({pattern: /^[0-9]+$/}))
	})
})

describe("getErrorMessage", () => {
	test("GenericReason", () => {
		expect(getErrorMessage([], new GenericReason())).toStrictEqual("Parameter is invalid.")
		expect(getErrorMessage(["name"], new GenericReason())).toStrictEqual("Parameter \"name\" is invalid.")
		expect(getErrorMessage(["config", "frequency"], new GenericReason())).toStrictEqual("Parameter config[\"frequency\"] is invalid.")
		expect(getErrorMessage(["fruit", 0, "id"], new GenericReason())).toStrictEqual("Parameter fruit[0][\"id\"] is invalid.")
		expect(getErrorMessage([0], new GenericReason())).toStrictEqual("Parameter [0] is invalid.")
		expect(getErrorMessage([0, "id"], new GenericReason())).toStrictEqual("Parameter [0][\"id\"] is invalid.")
	})
	test("MinLengthReason", () => {
		expect(getErrorMessage([], new MinLengthReason({minLength: 1}))).toStrictEqual("Parameter must be at least 1 character.")
		expect(getErrorMessage([], new MinLengthReason({minLength: 4}))).toStrictEqual("Parameter must be at least 4 characters.")
		expect(getErrorMessage([], new MinLengthReason({minLength: 4, maxLength: 10}))).toStrictEqual("Parameter must be between 4 and 10 characters.")
		expect(getErrorMessage([], new MinLengthReason({minLength: 0, maxLength: 1}))).toStrictEqual("Parameter must be between 0 and 1 character.")
	})
	test("MaxLengthReason", () => {
		expect(getErrorMessage([], new MaxLengthReason({maxLength: 1}))).toStrictEqual("Parameter must not exceed 1 character.")
		expect(getErrorMessage([], new MaxLengthReason({maxLength: 30}))).toStrictEqual("Parameter must not exceed 30 characters.")
		expect(getErrorMessage([], new MaxLengthReason({minLength: 4, maxLength: 10}))).toStrictEqual("Parameter must be between 4 and 10 characters.")
		expect(getErrorMessage([], new MaxLengthReason({minLength: 0, maxLength: 1}))).toStrictEqual("Parameter must be between 0 and 1 character.")
	})
	test("MinReason", () => {
		expect(getErrorMessage([], new MinReason({min: 1}))).toStrictEqual("Parameter must be at least 1.")
		expect(getErrorMessage([], new MinReason({min: 4}))).toStrictEqual("Parameter must be at least 4.")
		expect(getErrorMessage([], new MinReason({min: 4, max: 10}))).toStrictEqual("Parameter must be between 4 and 10.")
		expect(getErrorMessage([], new MinReason({min: 0, max: 1}))).toStrictEqual("Parameter must be between 0 and 1.")
	})
	test("MaxReason", () => {
		expect(getErrorMessage([], new MaxReason({max: 1}))).toStrictEqual("Parameter must not exceed 1.")
		expect(getErrorMessage([], new MaxReason({max: 30}))).toStrictEqual("Parameter must not exceed 30.")
		expect(getErrorMessage([], new MaxReason({min: 4, max: 10}))).toStrictEqual("Parameter must be between 4 and 10.")
		expect(getErrorMessage([], new MaxReason({min: 0, max: 1}))).toStrictEqual("Parameter must be between 0 and 1.")
	})
	test("IntegerReason", () => {
		expect(getErrorMessage([], new IntegerReason())).toStrictEqual("Parameter must be an integer.")
	})
	test("PatternReason", () => {
		expect(getErrorMessage([], new PatternReason({pattern: /^[a-z]{3}$/}))).toStrictEqual("Parameter must match the pattern /^[a-z]{3}$/.")
	})
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

function getErrorReason(fnc: () => void): ShapeValidationErrorReason | undefined {
	try {
		fnc()
		return undefined
	} catch (error) {
		if (error instanceof ShapeValidationError) return error.reason
		else throw error
	}
}
