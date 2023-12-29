import { ShapeToType, ShapeValidationError, s, validateDataShape } from "../src"

test("README example", () => {
    const resourceShape = s.object({
        id: s.string({pattern: /^[a-zA-Z0-9\-_]{10}$/}),
        state: s.union([s.literal("pending"), s.literal("active"), s.literal("removed")]),
        createdAt: s.integer()
    })

    type Resource = ShapeToType<typeof resourceShape>

    const goodData = JSON.parse("{\"id\":\"ui_1zoEJ18\",\"state\":\"active\",\"createdAt\":1700354795466}")
    const resource: Resource = validateDataShape({ data: goodData, shape: resourceShape })
    expect(resource.id).toStrictEqual("ui_1zoEJ18")

    const badData = JSON.parse("{\"id\":\"\",\"state\":\"active\",\"createdAt\":1700354795466}")
    expect(() => validateDataShape({ data: badData, shape: resourceShape })).toThrow(new ShapeValidationError({
        path: ["id"],
        data: "",
        shape: s.string({pattern: /^[a-zA-Z0-9\-_]{10}$/})
    }))
})