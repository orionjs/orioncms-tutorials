Orion had a complete rewrite of its code base and some things are not 
compatible with old code, learn here what do you need to change.

### Updating Dictionary

The dictionary has some underground changes.
The only change in the api is that now to access a definition
you must ask for ```category.name```

For Example:

```js
orion.dictionary.addDefinition('description', 'site', {
    type: String,
    label: "Description"
});
```

Before:

```html
<template name="example">
  {{ dict 'description' 'No description' }}
</template>
```

After:

```html
<template name="example">
  {{ dict 'site.description' 'No description' }}
</template>
```

