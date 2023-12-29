[shape-tape](../index.md) / ArrayShape

# Class: ArrayShape\<T\>

Shape representing a JavaScript array

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Shape`](../index.md#shape) |

## Table of contents

### Constructors

- [constructor](ArrayShape.md#constructor)

### Properties

- [condition](ArrayShape.md#condition)
- [elementShape](ArrayShape.md#elementshape)

## Constructors

### constructor

• **new ArrayShape**\<`T`\>(`elementShape`, `options?`): [`ArrayShape`](ArrayShape.md)\<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Shape`](../index.md#shape) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `elementShape` | `T` | The Shape of the elements of the array. |
| `options?` | `Object` | Optional parameters for the Shape. |
| `options.condition?` | (`object`: `T`[]) => `boolean` | Adds a customizable constraint. |

#### Returns

[`ArrayShape`](ArrayShape.md)\<`T`\>

#### Defined in

[src/Shapes.ts:125](https://github.com/paulbarmstrong/shape-tape/blob/f34d799/src/Shapes.ts#L125)

## Properties

### condition

• `Optional` `Readonly` **condition**: (`object`: `T`[]) => `boolean`

#### Type declaration

▸ (`object`): `boolean`

Contains the value of the `condition` constructor parameter.

##### Parameters

| Name | Type |
| :------ | :------ |
| `object` | `T`[] |

##### Returns

`boolean`

#### Defined in

[src/Shapes.ts:119](https://github.com/paulbarmstrong/shape-tape/blob/f34d799/src/Shapes.ts#L119)

___

### elementShape

• `Readonly` **elementShape**: `T`

Contains the value of the `elementShape` constructor parameter.

#### Defined in

[src/Shapes.ts:117](https://github.com/paulbarmstrong/shape-tape/blob/f34d799/src/Shapes.ts#L117)
