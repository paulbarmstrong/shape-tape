[shape-tape](../index.md) / ClassShape

# Class: ClassShape\<T\>

Shape representing a JavaScript class.

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `AnyClassConstructor` |

## Table of contents

### Constructors

- [constructor](ClassShape.md#constructor)

### Properties

- [clazz](ClassShape.md#clazz)
- [condition](ClassShape.md#condition)

## Constructors

### constructor

• **new ClassShape**\<`T`\>(`clazz`, `options?`): [`ClassShape`](ClassShape.md)\<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `AnyClassConstructor` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `clazz` | `T` | The class that the Shape should represent. |
| `options?` | `Object` | Optional parameters for the Shape. |
| `options.condition?` | (`data`: `InstanceType`\<`T`\>) => `boolean` | Adds a customizable constraint. |

#### Returns

[`ClassShape`](ClassShape.md)\<`T`\>

#### Defined in

[src/Shapes.ts:159](https://github.com/paulbarmstrong/shape-tape/blob/e455e38/src/Shapes.ts#L159)

## Properties

### clazz

• `Readonly` **clazz**: `T`

Contains the value of the `clazz` constructor parameter.

#### Defined in

[src/Shapes.ts:152](https://github.com/paulbarmstrong/shape-tape/blob/e455e38/src/Shapes.ts#L152)

___

### condition

• `Optional` `Readonly` **condition**: (`data`: `InstanceType`\<`T`\>) => `boolean`

#### Type declaration

▸ (`data`): `boolean`

Contains the value of the `clazz` constructor option.

##### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `InstanceType`\<`T`\> |

##### Returns

`boolean`

#### Defined in

[src/Shapes.ts:154](https://github.com/paulbarmstrong/shape-tape/blob/e455e38/src/Shapes.ts#L154)
