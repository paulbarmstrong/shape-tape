## shape-tape
A TypeScript/JavaScript library to help with typing and runtime validation of structured data.

### Notice
Please note this package is brand new and highly experimental so breaking changes may be made without notice.

### Installation
```
npm install shape-tape
```

### Usage
```javascript
import { s, validateObjectShape } from "shape-tape"

// Define a shape.
const resourceShape = s.dictionary({
	id: s.string({regex: /^[a-zA-Z0-9\-_]{10}$/}),
	state: s.union([s.literal("pending"), s.literal("active"), s.literal("removed")]),
	createdAt: s.integer()
})

// Validate that some data matches your shape.
const goodData = JSON.parse("{\"id\":\"ui_1zoEJ18\",\"state\":\"active\",\"createdAt\":1700354795466}")
const resource = validateObjectShape({ object: goodData, shape: resourceShape })

// Safely access the validated and typed data.
if (resource.state === "active") ...

...

// Data that doesn't match your shape causes a ShapeValidationError.
const badData = JSON.parse("{\"id\":\"\",\"state\":\"active\",\"createdAt\":1700354795466}")
const resource = validateObjectShape({ object: badData, shape: resourceShape }) // This causes ShapeValidationError
```

If you're using TypeScript you can use the shape's TypeScript type.
```typescript
import { ShapeToType } from "shape-tape"

type Resource = ShapeToType<typeof resourceShape>

...

const resource: Resource = ...
```
