[shape-tape](../index.md) / UnionShape

# Class: UnionShape\<T\>

Shape representing a union of Shapes. It represents a structure which is allowed to take the form of
any of its member shapes. It's the Shape version of TypeScript's union.

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Shape`](../index.md#shape)[] |

## Table of contents

### Constructors

- [constructor](UnionShape.md#constructor)

### Properties

- [members](UnionShape.md#members)

## Constructors

### constructor

• **new UnionShape**\<`T`\>(`members`): [`UnionShape`](UnionShape.md)\<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Shape`](../index.md#shape)[] |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `members` | `T` | An array of the Shapes being unioned. |

#### Returns

[`UnionShape`](UnionShape.md)\<`T`\>

#### Defined in

[src/Shapes.ts:142](https://github.com/paulbarmstrong/shape-tape/blob/f34d799/src/Shapes.ts#L142)

## Properties

### members

• `Readonly` **members**: `T`

Contains the value of the `members` constructor parameter.

#### Defined in

[src/Shapes.ts:140](https://github.com/paulbarmstrong/shape-tape/blob/f34d799/src/Shapes.ts#L140)
