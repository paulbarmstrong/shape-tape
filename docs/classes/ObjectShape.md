[shape-tape](../index.md) / ObjectShape

# Class: ObjectShape\<T, AEP\>

Shape representing a regular JavaScript `object` having keys and values.

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Object` |
| `AEP` | extends `boolean` = ``false`` |

## Table of contents

### Constructors

- [constructor](ObjectShape.md#constructor)

### Properties

- [allowExtraProperties](ObjectShape.md#allowextraproperties)
- [condition](ObjectShape.md#condition)
- [propertyShapes](ObjectShape.md#propertyshapes)

## Constructors

### constructor

• **new ObjectShape**\<`T`, `AEP`\>(`propertyShapes`, `options?`): [`ObjectShape`](ObjectShape.md)\<`T`, `AEP`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Object` |
| `AEP` | extends `boolean` = ``false`` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `propertyShapes` | `T` | An object where the keys are the keys of the object the Shape should represent, and the values are the Shapes of the values the Shape should represent. |
| `options?` | `Object` | Optional parameters for the Shape. |
| `options.allowExtraProperties?` | `AEP` | Optionally allow properties that aren't defined in propertyShapes. |
| `options.condition?` | (`data`: \{ [K in string \| number \| symbol]: ShapeToType\<T[K]\> } & `DefinitelyTrue`\<`AEP`\> extends ``true`` ? `Record`\<`string`, `any`\> : {}) => `boolean` | Adds a customizable constraint. |

#### Returns

[`ObjectShape`](ObjectShape.md)\<`T`, `AEP`\>

#### Defined in

[src/Shapes.ts:105](https://github.com/paulbarmstrong/shape-tape/blob/main/src/Shapes.ts#L105)

## Properties

### allowExtraProperties

• `Optional` `Readonly` **allowExtraProperties**: `AEP`

Contains the value of the `allowExtraProperties` constructor option.

#### Defined in

[src/Shapes.ts:99](https://github.com/paulbarmstrong/shape-tape/blob/main/src/Shapes.ts#L99)

___

### condition

• `Optional` `Readonly` **condition**: (`data`: \{ [K in string \| number \| symbol]: ShapeToType\<T[K]\> } & `DefinitelyTrue`\<`AEP`\> extends ``true`` ? `Record`\<`string`, `any`\> : {}) => `boolean`

#### Type declaration

▸ (`data`): `boolean`

Contains the value of the `condition` constructor option.

##### Parameters

| Name | Type |
| :------ | :------ |
| `data` | \{ [K in string \| number \| symbol]: ShapeToType\<T[K]\> } & `DefinitelyTrue`\<`AEP`\> extends ``true`` ? `Record`\<`string`, `any`\> : {} |

##### Returns

`boolean`

#### Defined in

[src/Shapes.ts:97](https://github.com/paulbarmstrong/shape-tape/blob/main/src/Shapes.ts#L97)

___

### propertyShapes

• `Readonly` **propertyShapes**: `T`

Contains the value of the `propertyShapes` constructor parameter.

#### Defined in

[src/Shapes.ts:95](https://github.com/paulbarmstrong/shape-tape/blob/main/src/Shapes.ts#L95)
