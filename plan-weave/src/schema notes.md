# General Schema Notes

## What Schemas have

- __type__ : like 'string' 
- __transforms__ : like ???
- __spec__ : object with many properties including default and other
- __default()__ : returns default value
- __describe()__ : returns object with properties like optional, nullable, default, type, tests, ...etc

# Schema transform matrix (Iterables ignored)

	Format is schema(y).cast(x) = castedValue

## Example of schema transformation format

	schema(String).cast(Number) = isNaN(castedValue) ? schema default : castedValue
	default = d
	castedValue = c
	conforms to schema ? c : d = C

|              | Null | Undefined | Boolean | Number | BigInt | String | Symbol | Date  |
---------------| ---- | --------- | ------- | ------ | ------ | ------ | ------ | ----- |
|	__Null__   | c    | Undefined |  false  |   d    |   d    |   d    |   d    |   d   |
| __Undefined__| Null |     c     |  false  |   d    |   d    |   d    |   d    |   d   |
|  __Boolean__ | Null | Undefined |    C    | 0 or 1 | 0 or 1 | f?d:t  |   d    |   d   |
|   __Number__ | Null | Undefined |  falsey?|   C    |   C    |   C    |   d    |Date(i)|
|   __BigInt__ | Null | Undefined |  falsey?|   C    |   C    |   C    |   d    |Date(I)|
|   __String__ | Null | Undefined |  falsey?| NaN?d:C|NaN?d:C |   C    |   d    |Date(s)|
|   _Symbol_   | Null | Undefined |  falsey?|   d    |   d    |   d    |   C    |   d   |
|	 __Date__  | Null | Undefined |  falsey?| millis | millis |ISO CST |   d    |   C   |

__NOTE__: Null and Undefined don't have a schema other than mixed, so they are always default.

__NOTE__: I removed support for Symbol, but added support for mixed which is always default

# Requires Custom Transformation Logic 

Legend: _(R = Requires it, X = Does not Require it, N = needs nullable)_

|              | Null | Undefined | Boolean | Number | BigInt | String | Symbol | Date  |
---------------| ---- | --------- | ------- | ------ | ------ | ------ | ------ | ----- |
|	__Null__   | NX   |     NR    |    NR   |   NR   |   NR   |   NX   |   NR   |   NR  |
|__Undefined__ | NX   |     NX    |    NR   |   NR   |   NR   |   NX   |   NR   |   NR  |
|  __Boolean__ | R    |     R     |    X    |   R    |   R    |   X    |   R    |   X   |
|   __Number__ | R    |     R     |    R    |   X    |   X    |   X    |   R    |   X   |
|   __BigInt__ | R    |     R     |    R    |   X    |   X    |   X    |   R    |   X   |
|   __String__ | R    |     R     |    R    |   R    |   R    |   X    |   R    |   R   |
|   _Symbol_   | R    |     R     |    R    |   R    |   R    |   X    |   X    |   R   |
|	 __Date__  | R    |     R     |    R    |   R    |   R    |   X    |   R    |   X   |