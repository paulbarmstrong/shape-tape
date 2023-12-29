[shape-tape](../index.md) / ShapeValidationError

# Class: ShapeValidationError

Error that represents an instance of data not matching a Shape.

## Hierarchy

- `Error`

  ↳ **`ShapeValidationError`**

## Table of contents

### Constructors

- [constructor](ShapeValidationError.md#constructor)

### Properties

- [cause](ShapeValidationError.md#cause)
- [data](ShapeValidationError.md#data)
- [message](ShapeValidationError.md#message)
- [name](ShapeValidationError.md#name)
- [path](ShapeValidationError.md#path)
- [shape](ShapeValidationError.md#shape)
- [stack](ShapeValidationError.md#stack)
- [prepareStackTrace](ShapeValidationError.md#preparestacktrace)
- [stackTraceLimit](ShapeValidationError.md#stacktracelimit)

### Methods

- [captureStackTrace](ShapeValidationError.md#capturestacktrace)

## Constructors

### constructor

• **new ShapeValidationError**(`props`): [`ShapeValidationError`](ShapeValidationError.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `Object` |
| `props.data` | `any` |
| `props.path` | (`string` \| `number`)[] |
| `props.shape` | [`Shape`](../index.md#shape) |

#### Returns

[`ShapeValidationError`](ShapeValidationError.md)

#### Overrides

Error.constructor

#### Defined in

[src/ValidationError.ts:15](https://github.com/paulbarmstrong/shape-tape/blob/e455e38/src/ValidationError.ts#L15)

## Properties

### cause

• `Optional` **cause**: `unknown`

#### Inherited from

Error.cause

#### Defined in

node_modules/typescript/lib/lib.es2022.error.d.ts:24

___

### data

• `Readonly` **data**: `any`

The most specific data which was found to not match the corresponding Shape.

#### Defined in

[src/ValidationError.ts:11](https://github.com/paulbarmstrong/shape-tape/blob/e455e38/src/ValidationError.ts#L11)

___

### message

• **message**: `string`

#### Inherited from

Error.message

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1068

___

### name

• **name**: `string` = `"ShapeValidationError"`

#### Overrides

Error.name

#### Defined in

[src/ValidationError.ts:7](https://github.com/paulbarmstrong/shape-tape/blob/e455e38/src/ValidationError.ts#L7)

___

### path

• `Readonly` **path**: (`string` \| `number`)[]

The path to where in the data the error occurred.

#### Defined in

[src/ValidationError.ts:9](https://github.com/paulbarmstrong/shape-tape/blob/e455e38/src/ValidationError.ts#L9)

___

### shape

• `Readonly` **shape**: [`Shape`](../index.md#shape)

The specific Shape which the data did not match.

#### Defined in

[src/ValidationError.ts:13](https://github.com/paulbarmstrong/shape-tape/blob/e455e38/src/ValidationError.ts#L13)

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1069

___

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`: `CallSite`[]) => `any`

#### Type declaration

▸ (`err`, `stackTraces`): `any`

Optional override for formatting stack traces

##### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

##### Returns

`any`

**`See`**

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

Error.prepareStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Defined in

node_modules/@types/node/globals.d.ts:13

## Methods

### captureStackTrace

▸ **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Create .stack property on a target object

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

Error.captureStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:4
