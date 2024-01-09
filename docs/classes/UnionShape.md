[shape-tape](../index.md) / UnionShape

# Class: UnionShape\<T\>

Shape representing a union of Shapes. It represents a structure which is allowed to 
take the form of any of its member shapes. It's the Shape version of TypeScript's union.

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Shape`](../index.md#shape)[] |

## Table of contents

### Constructors

- [constructor](UnionShape.md#constructor)

### Properties

- [memberShapes](UnionShape.md#membershapes)

## Constructors

### constructor

• **new UnionShape**\<`T`\>(`memberShapes`): [`UnionShape`](UnionShape.md)\<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Shape`](../index.md#shape)[] |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `memberShapes` | `T` | An array of the Shapes being unioned. |

#### Returns

[`UnionShape`](UnionShape.md)\<`T`\>

#### Defined in

[src/Shapes.ts:143](https://github.com/paulbarmstrong/shape-tape/blob/main/src/Shapes.ts#L143)

## Properties

### memberShapes

• `Readonly` **memberShapes**: `T`

Contains the value of the `memberShapes` constructor parameter.

#### Defined in

[src/Shapes.ts:141](https://github.com/paulbarmstrong/shape-tape/blob/main/src/Shapes.ts#L141)
