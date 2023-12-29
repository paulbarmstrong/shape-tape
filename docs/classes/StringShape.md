[shape-tape](../index.md) / StringShape

# Class: StringShape

Shape representing JavaScript `string`.

## Table of contents

### Constructors

- [constructor](StringShape.md#constructor)

### Properties

- [condition](StringShape.md#condition)
- [maxLength](StringShape.md#maxlength)
- [minLength](StringShape.md#minlength)
- [pattern](StringShape.md#pattern)

## Constructors

### constructor

• **new StringShape**(`options?`): [`StringShape`](StringShape.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | `Object` | Optional parameters for the Shape. |
| `options.condition?` | (`object`: `string`) => `boolean` | Adds a customizable constraint. |
| `options.length?` | `number` | Adds a certain length constraint. |
| `options.maxLength?` | `number` | Adds a maximum length constraint. Cannot be included if `length` is included. |
| `options.minLength?` | `number` | Adds a minimum length constraint. Cannot be included if `length` is included. |
| `options.pattern?` | `RegExp` | Adds a regular expression constraint. |

#### Returns

[`StringShape`](StringShape.md)

#### Defined in

[src/Shapes.ts:18](https://github.com/paulbarmstrong/shape-tape/blob/f34d799/src/Shapes.ts#L18)

## Properties

### condition

• `Optional` `Readonly` **condition**: (`object`: `string`) => `boolean`

#### Type declaration

▸ (`object`): `boolean`

Contains the value of the `condition` constructor option.

##### Parameters

| Name | Type |
| :------ | :------ |
| `object` | `string` |

##### Returns

`boolean`

#### Defined in

[src/Shapes.ts:15](https://github.com/paulbarmstrong/shape-tape/blob/f34d799/src/Shapes.ts#L15)

___

### maxLength

• `Optional` `Readonly` **maxLength**: `number`

Contains the value of the `maxLength` constructor option or length constructor option if specified.

#### Defined in

[src/Shapes.ts:11](https://github.com/paulbarmstrong/shape-tape/blob/f34d799/src/Shapes.ts#L11)

___

### minLength

• `Optional` `Readonly` **minLength**: `number`

Contains the value of the `minLength` constructor option or length constructor option if specified.

#### Defined in

[src/Shapes.ts:9](https://github.com/paulbarmstrong/shape-tape/blob/f34d799/src/Shapes.ts#L9)

___

### pattern

• `Optional` `Readonly` **pattern**: `RegExp`

Contains the value of the `pattern` constructor option.

#### Defined in

[src/Shapes.ts:13](https://github.com/paulbarmstrong/shape-tape/blob/f34d799/src/Shapes.ts#L13)
