shape-tape

# shape-tape

This is low level documentation. Please see [README.md](../README.md) for the high level documentation.

## Table of contents

### Classes

- [ArrayShape](classes/ArrayShape.md)
- [BooleanShape](classes/BooleanShape.md)
- [ClassShape](classes/ClassShape.md)
- [LiteralShape](classes/LiteralShape.md)
- [NumberShape](classes/NumberShape.md)
- [ObjectShape](classes/ObjectShape.md)
- [ShapeValidationError](classes/ShapeValidationError.md)
- [StringShape](classes/StringShape.md)
- [UnionShape](classes/UnionShape.md)

### Type Aliases

- [Shape](index.md#shape)
- [ShapeToType](index.md#shapetotype)

### Variables

- [s](index.md#s)

### Functions

- [validateDataShape](index.md#validatedatashape)

## Type Aliases

### Shape

Ƭ **Shape**: [`StringShape`](classes/StringShape.md) \| [`NumberShape`](classes/NumberShape.md) \| [`BooleanShape`](classes/BooleanShape.md) \| [`LiteralShape`](classes/LiteralShape.md)\<`any`\> \| [`ObjectShape`](classes/ObjectShape.md)\<`any`\> \| [`ArrayShape`](classes/ArrayShape.md)\<`any`\> \| [`UnionShape`](classes/UnionShape.md)\<`any`\> \| [`ClassShape`](classes/ClassShape.md)\<`any`\>

Type representing any Shape. It's a union of all Shape classes.

#### Defined in

[src/Shapes.ts:175](https://github.com/paulbarmstrong/shape-tape/blob/main/src/Shapes.ts#L175)

___

### ShapeToType

Ƭ **ShapeToType**\<`S`\>: `ShapeToTypeAux`\<`S`\>

Utility type for converting Shapes to the static types they represent.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `S` | extends [`Shape`](index.md#shape) |

#### Defined in

[src/Types.ts:18](https://github.com/paulbarmstrong/shape-tape/blob/main/src/Types.ts#L18)

## Variables

### s

• `Const` **s**: `Object`

A collection of convenience functions for creating Shapes.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `array` | `Function` | Alias for the `ArrayShape` constructor. |
| `boolean` | (...`args`: []) => [`BooleanShape`](classes/BooleanShape.md) | Alias for the `BooleanShape` constructor. |
| `class` | `Function` | Alias for the `ClassShape` constructor. |
| `integer` | (`options?`: \{ `max?`: `number` ; `min?`: `number`  }) => [`NumberShape`](classes/NumberShape.md) | Convenience function for creating a `NumberShape` with `integer: true`. |
| `literal` | `Function` | Alias for the `LiteralShape` constructor. |
| `number` | (...`args`: [options?: Object]) => [`NumberShape`](classes/NumberShape.md) | Alias for the `NumberShape` constructor. |
| `object` | `Function` | Alias for the `ObjectShape` constructor. |
| `optional` | \<T\>(`shape`: `T`) => [`UnionShape`](classes/UnionShape.md)\<(`T` \| [`LiteralShape`](classes/LiteralShape.md)\<`undefined`\>)[]\> | Convenience function for creating a `UnionShape` of a given Shape and `undefined`. |
| `string` | (...`args`: [options?: Object]) => [`StringShape`](classes/StringShape.md) | Alias for the `StringShape` constructor. |
| `union` | `Function` | Alias for the `UnionShape` constructor. |

#### Defined in

[src/Shapes.ts:179](https://github.com/paulbarmstrong/shape-tape/blob/main/src/Shapes.ts#L179)

## Functions

### validateDataShape

▸ **validateDataShape**\<`T`\>(`params`): [`ShapeToType`](index.md#shapetotype)\<`T`\>

Validates that the given data matches the given Shape.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Shape`](index.md#shape) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | - |
| `params.data` | `any` | Data to be validated. |
| `params.shape` | `T` | Shape to validate the data against. |
| `params.shapeValidationErrorOverride?` | (`err`: [`ShapeValidationError`](classes/ShapeValidationError.md)) => `Error` | Optional function for overriding the Error thrown in the case of a shape validation error |

#### Returns

[`ShapeToType`](index.md#shapetotype)\<`T`\>

The validated data casted to the appropriate type.

**`Throws`**

[ShapeValidationError](classes/ShapeValidationError.md) when the data doesn't match the Shape.

#### Defined in

[src/Validation.ts:11](https://github.com/paulbarmstrong/shape-tape/blob/main/src/Validation.ts#L11)
