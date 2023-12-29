[shape-tape](../index.md) / DictionaryShape

# Class: DictionaryShape\<T\>

Shape representing a regular JavaScript `object` with keys and values.

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Object` |

## Table of contents

### Constructors

- [constructor](DictionaryShape.md#constructor)

### Properties

- [condition](DictionaryShape.md#condition)
- [dictionary](DictionaryShape.md#dictionary)

## Constructors

### constructor

• **new DictionaryShape**\<`T`\>(`dictionary`, `options?`): [`DictionaryShape`](DictionaryShape.md)\<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Object` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `dictionary` | `T` | A dictionary where the keys are the keys of the dictionary the Shape should represent, and the values are the Shapes of the values the Shape should represent. |
| `options?` | `Object` | Optional parameters for the Shape. |
| `options.condition?` | (`object`: `T`) => `boolean` | Adds a customizable constraint. |

#### Returns

[`DictionaryShape`](DictionaryShape.md)\<`T`\>

#### Defined in

[src/Shapes.ts:103](https://github.com/paulbarmstrong/shape-tape/blob/f34d799/src/Shapes.ts#L103)

## Properties

### condition

• `Optional` `Readonly` **condition**: (`object`: `T`) => `boolean`

#### Type declaration

▸ (`object`): `boolean`

Contains the value of the `condition` constructor option.

##### Parameters

| Name | Type |
| :------ | :------ |
| `object` | `T` |

##### Returns

`boolean`

#### Defined in

[src/Shapes.ts:97](https://github.com/paulbarmstrong/shape-tape/blob/f34d799/src/Shapes.ts#L97)

___

### dictionary

• `Readonly` **dictionary**: `T`

Contains the value of the `dictionary` constructor parameter.

#### Defined in

[src/Shapes.ts:95](https://github.com/paulbarmstrong/shape-tape/blob/f34d799/src/Shapes.ts#L95)
