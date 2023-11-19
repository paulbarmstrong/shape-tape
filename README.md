## shape-tape
A TypeScript/JavaScript library to help with typing and runtime validation of structured data.

### Usage
```javascript
import { s, validateShape } from "shape-tape"

// Define a shape.
const resourceShape = s.dict({
	id: s.string({regex: /[a-zA-Z0-9\-_]{10}/}),
	state: s.union(s.literal("pending"), s.literal("active"), s.literal("removed")),
	createdAt: s.integer()
})

// Validate that some data matches to your shape.
const goodData = JSON.parse("{\"id\":\"ui_1zoEJ18\",\"state\":\"active\",\"createdAt\":1700354795466}")
const resource = validateShape(goodData, resourceShape)

// Safely access the validated and typed data.
if (resource.state === "active") ...

...

// Data that doesn't match to your shape causes a ShapeValidationError.
const badData = JSON.parse("{\"id\":\"\",\"state\":\"active\",\"createdAt\":1700354795466}")
const resource = validateShape(badData, resourceShape) // This causes ShapeValidationError: "Invalid value for paramter id."
```

If you're using TypeScript you can use the shape's TypeScript Type.
```typescript
import { ShapeToType } from "shape-tape"

type Resource = ShapeToType<typeof resourceShape>

...

const resource: Resource = ...
```