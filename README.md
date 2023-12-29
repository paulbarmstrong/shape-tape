## shape-tape

### Notice
Please note this package is brand new and highly experimental so breaking changes may be made without notice.

### About

A TypeScript/JavaScript library to help with runtime validation of structured data.

Consumers define Shapes that represent the structure of their data. Consumers call `validateDataShape` to validate some data matches their Shape.

### Installation
```
npm install shape-tape
```

### Usage

```javascript
import { s, validateObjectShape } from "shape-tape"

// Define a shape.
const resourceShape = s.object({
	id: s.string({regex: /^[a-zA-Z0-9\-_]{10}$/}),
	state: s.union([s.literal("pending"), s.literal("active"), s.literal("removed")]),
	createdAt: s.integer()
})

// Validate that some object matches your shape.
const goodData = JSON.parse("{\"id\":\"ui_1zoEJ18\",\"state\":\"active\",\"createdAt\":1700354795466}")
const resource = validateDataShape({ data: goodData, shape: resourceShape })

// Safely access the validated and typed data.
if (resource.state === "active") ...

...

// Data that doesn't match your shape causes a ShapeValidationError.
const badData = JSON.parse("{\"id\":\"\",\"state\":\"active\",\"createdAt\":1700354795466}")
const resource = validateDataShape({ data: badData, shape: resourceShape })
// ^ throws ShapeValidationError "Parameter \"id\" is invalid."
```

If you're using TypeScript you can use the shape's TypeScript type.
```typescript
import { ShapeToType } from "shape-tape"

type Resource = ShapeToType<typeof resourceShape>

...

const resource: Resource = ...
```

Please see [the unit test demonstrating this example](https://github.com/paulbarmstrong/shape-tape/blob/main/tst/README.test.ts).

### Documentation

Please see [the low level documentation](https://github.com/paulbarmstrong/shape-tape/blob/main/docs/index.md) for more details.
