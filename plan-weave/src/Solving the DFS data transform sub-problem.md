# Solving the DFS schema coercion problem

## The case of a schema that is type object but with primitive fields

Ex: 
schema = Yup.object.shape({
   id: Yup.number(),
   name: Yup.string(),
})

### Working through the logic of Object + primitive fields schema

1. object schemas have a 'fields' property that is iterable
2. yup provides the reach function to access nested schemas
3. we will need to define a general path access function where given a path we can access the data
4. output is accumulated rather than mutated since we can not rely on the original default being the correct shape

=> 
if we have an Object schema
then we convert the fields property into an iterable then begin iterating over them applying dfs to it
we then update the current path to include the key that we are on in the iteration
in the dfs we pass down:
	- input = input[path] // using general path reacher function
	- output = output // the node will add to the output not the recursive case
	- schema = schema.reach(path) // this should get the schema at that point

## The case of a primitive field

Ex:
schema = Yup.number()

### Working through the logic of primitive fields schema

1. Primitive schemas will have undefined as the default if none is provided (but object schemas may not be so easy)
2. We have an enhanced cast function that can properly cast in the expected ways given a schema at that point and the input at that point
3. We can always try to access the input at that point and if it is not possible then we can adjust our behavior

=> 
if we have a Primitive schema
then we can check if the input at that point is both valid and accessible

if the input at that point is accessible and valid
then we can simply return everything unchanged

if the input at that point is inaccessible
then we can try to apply the default at that point if it exists or otherwise we use the type default // use enhanced cast function

if the input at that point is accessible but invalid
then we can try to apply the default at that point if it exists or otherwise we use the type default // use enhanced cast function

After enhanced casting is done, we collect the errors from it and add it to the errors we are accumulating.
Then finally, we add to the output // I am not sure how in general for now...


## How to accumulate an output in general

I think the best way to solve this sub-problem is just by listing many examples then reasoning from there.

### Primitives

Yup.string() => "String value directly or default if applicable"
Yup.number() => 123 or default
...
primitive => directly

### Dictionary / Object type

Yup.object().shape({
   id: Yup.number(),
   name: Yup.string(),
})

=> 

i = 0 : output = undefined
i = 1 : field = id, output = { id: default }
i = 2 : field = name, output = { name: default }

...
object => 
1. output = output || {}
2. output[path] = value

### Array type

Yup.array().of(Yup.string())

=> 

i = 0 : output = undefined
i = 1 : ouput = [default] or []

...
array =>
output = [default] or []


### Putting it together to accumulate output in general

ex: 

schema = Yup.object().shape(
    {
        name: Yup.string(),
        contacts: Yup.array().of(Yup.number()),
        secretIdentities: Yup.object().shape({
            superHero : Yup.string().default('Anonymous')
        })
    }
)

output = undefined
input = null

--

i = 0 : 
	start:
	     type = object, schema = schema, output = undefined, path = [] // input fails verification at this stage
	end: 
	     type = object, schema = schema, output = {}, path = [] // if output is undefined and type is object then output = {}
	// reach(output == undefined, path == [], value == {}) => output = {}
i = 1 : 
	start:
	    type = string, schema = schema.name, output = {}, path = ['name'] // assume we are using general reach functions
	end:
	    type = string, schema = schema.name, output = { name: '' }, path = ['name'] // we used type default for string since no default provided in cast
	// reach(output == {}, path == ['name'], value == '') => output = { name : '' }
i = 2 :
	start:
	    type = array, schema = schema.contacts, output = { name: '' }, path = ['contacts']
	end:
	    type = array, schema = schema.contacts, output = { name: '', contacts: [] }, path = ['contacts'] // we used type default for array since none provided
	// reach(output == { name: ''}, path == ['contacts'], value == []) ==> output = { name : '' , contacts : [] }
i = 3 :
	start:
	    type = object, schema = schema.secretIdentities, output = { name: '', contacts: [] },  path = ['secretIdentities'] // we must make fields iterable and iterate as we did above..
	end:
	    type = object, schema = schema.secretIdentities, output = { name: '', contacts: [], secretIdenties: {} }, path = ['secretIdentities'] // output is appended with empty dict, similar to above
i = 4 :
	start:
	    type = string, schema = schema.secretIdentities.superHero, output = { name: '', contacts: [], secretIdenties: {} }, path = ['secretIdentities.superHero'] // .superHero is appended to the path
	end:
	    type = string, schema = schema.secretIdentities.superHero, output = { name: '', contacts: [], secretIdenties: { superHero: 'Anonymous' } } // the input at this point is invalid so default
i = 5 : 
	We are done iterating, so we return the output which is:
		 { output: { name: '', contacts: [], secretIdenties: { superHero: 'Anonymous' } } , errors: [...errors that were accumulated]}


### Possible code for changing output at any given level (reach function)

```Javascript
const reach = (input, path, value) => {
    const setInPath = (obj, pathArray, value) => {
        if (pathArray.length === 0) return value
        const [head, ...tail] = pathArray
        const nextObj = isNaN(head) ? {} : []
        obj[head] = setInPath(obj[head] || nextObj, tail, value)
        return obj
    }
    const pathArray = Array.isArray(path) ? path : path.split('.')
    return setInPath(input || {}, pathArray, value)
}
```




































