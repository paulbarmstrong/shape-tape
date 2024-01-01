[shape-tape](../index.md) / LiteralShape

# Class: LiteralShape\<T\>

Shape representing any literal instance of JavaScript `string`, `number`, `boolean`, `null`,
or `undefined`.

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `string` \| `number` \| `boolean` \| ``null`` \| `undefined` |

## Table of contents

### Constructors

- [constructor](LiteralShape.md#constructor)

### Properties

- [value](LiteralShape.md#value)

## Constructors

### constructor

• **new LiteralShape**\<`T`\>(`value`): [`LiteralShape`](LiteralShape.md)\<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `undefined` \| ``null`` \| `string` \| `number` \| `boolean` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `T` | The literal value that the Shape should represent. |

#### Returns

[`LiteralShape`](LiteralShape.md)\<`T`\>

#### Defined in

[src/Shapes.ts:85](https://github.com/paulbarmstrong/shape-tape/blob/main/src/Shapes.ts#L85)

## Properties

### value

• `Readonly` **value**: `T`

Contains the value of the `value` constructor parameter.

#### Defined in

[src/Shapes.ts:82](https://github.com/paulbarmstrong/shape-tape/blob/main/src/Shapes.ts#L82)
