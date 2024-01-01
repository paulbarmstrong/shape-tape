[shape-tape](../index.md) / ObjectShape

# Class: ObjectShape\<T\>

Shape representing a regular JavaScript `object` having keys and values.

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Object` |

## Table of contents

### Constructors

- [constructor](ObjectShape.md#constructor)

### Properties

- [condition](ObjectShape.md#condition)
- [object](ObjectShape.md#object)

## Constructors

### constructor

• **new ObjectShape**\<`T`\>(`object`, `options?`): [`ObjectShape`](ObjectShape.md)\<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Object` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `object` | `T` | An object where the keys are the keys of the object the Shape should represent, and the values are the Shapes of the values the Shape should represent. |
| `options?` | `Object` | Optional parameters for the Shape. |
| `options.condition?` | (`data`: `T`) => `boolean` | Adds a customizable constraint. |

#### Returns

[`ObjectShape`](ObjectShape.md)\<`T`\>

#### Defined in

[src/Shapes.ts:103](https://github.com/paulbarmstrong/shape-tape/blob/main/src/Shapes.ts#L103)

## Properties

### condition

• `Optional` `Readonly` **condition**: (`data`: `T`) => `boolean`

#### Type declaration

▸ (`data`): `boolean`

Contains the value of the `condition` constructor option.

##### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `T` |

##### Returns

`boolean`

#### Defined in

[src/Shapes.ts:97](https://github.com/paulbarmstrong/shape-tape/blob/main/src/Shapes.ts#L97)

___

### object

• `Readonly` **object**: `T`

Contains the value of the `object` constructor parameter.

#### Defined in

[src/Shapes.ts:95](https://github.com/paulbarmstrong/shape-tape/blob/main/src/Shapes.ts#L95)
