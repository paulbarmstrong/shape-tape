[shape-tape](../index.md) / NumberShape

# Class: NumberShape

Shape representing JavaScript `number`.

## Table of contents

### Constructors

- [constructor](NumberShape.md#constructor)

### Properties

- [condition](NumberShape.md#condition)
- [integer](NumberShape.md#integer)
- [max](NumberShape.md#max)
- [min](NumberShape.md#min)

## Constructors

### constructor

• **new NumberShape**(`options?`): [`NumberShape`](NumberShape.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | `Object` | Optional parameters for the Shape. |
| `options.condition?` | (`data`: `number`) => `boolean` | Adds a customizable constraint. |
| `options.integer?` | `boolean` | Adds a constraint that the number must be an integer. |
| `options.max?` | `number` | Adds a maximum length constraint. |
| `options.min?` | `number` | Adds a minimum length constraint. |

#### Returns

[`NumberShape`](NumberShape.md)

#### Defined in

[src/Shapes.ts:53](https://github.com/paulbarmstrong/shape-tape/blob/e455e38/src/Shapes.ts#L53)

## Properties

### condition

• `Optional` `Readonly` **condition**: (`data`: `number`) => `boolean`

#### Type declaration

▸ (`data`): `boolean`

Contains the value of the `condition` constructor option.

##### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `number` |

##### Returns

`boolean`

#### Defined in

[src/Shapes.ts:50](https://github.com/paulbarmstrong/shape-tape/blob/e455e38/src/Shapes.ts#L50)

___

### integer

• `Optional` `Readonly` **integer**: `boolean`

Contains the value of the `integer` constructor option.

#### Defined in

[src/Shapes.ts:48](https://github.com/paulbarmstrong/shape-tape/blob/e455e38/src/Shapes.ts#L48)

___

### max

• `Optional` `Readonly` **max**: `number`

Contains the value of the `max` constructor option.

#### Defined in

[src/Shapes.ts:46](https://github.com/paulbarmstrong/shape-tape/blob/e455e38/src/Shapes.ts#L46)

___

### min

• `Optional` `Readonly` **min**: `number`

Contains the value of the `min` constructor option.

#### Defined in

[src/Shapes.ts:44](https://github.com/paulbarmstrong/shape-tape/blob/e455e38/src/Shapes.ts#L44)
