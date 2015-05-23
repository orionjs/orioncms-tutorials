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

### Updating Entities

Entities changed completely and the they are named Orion Collections.
Orion Collection look a lot like normal Meteor Collections, the api is 
the same.

Also, publications are not made automatically, so you must make it yoursef.

> You don't need to delete the database to upgrade, but you need to do a lot of changes in the code.


Before:

```js
orion.addEntity('posts', {
  title: {
    type: String,
    label: "Title",
  },
  image: orion.attribute('file', {
      label: 'Image',
      optional: true
  }),
  body: orion.attribute('froala', {
      label: 'Body',
      optional: true
  }),
},  {
  icon: 'bookmark',
  sidebarName: 'Posts',
  pluralName: 'Posts',
  singularName: 'Post',
  tableColumns: [
    { data:'title', title: 'Title' },
    orion.attributeColumn('file', 'image', 'Image'),
    orion.attributeColumn('froala', 'body', 'Preview')
  ]
});
```

After:

```js
/**
 * We declare the collection just like meteor default way
 * but changing Meteor.Collection to orion.collection.
 *
 * We can set options to that new collection, like which fields 
 * we will show in the index of the collection in the admin
 */
Posts = new orion.collection('posts', {
  singularName: 'post', // The name of one of this items
  pluralName: 'posts', // The name of more than one of this items
  link: {
    /**
     * The text that you want to show in the sidebar.
     * The default value is the name of the collection, so
     * in this case is not necesary, but I will put it here
     * for educational purposes.
     */
    title: 'Posts' 
  },
  /**
   * Tabular settings for this collection
   */
  tabular: {
    columns: [
      { data: "title", title: "Title" },
      orion.attributeColumn('file', 'image', 'Image'),
      orion.attributeColumn('summernote', 'body', 'Content'),
      orion.attributeColumn('createdBy', 'createdBy', 'Created By')
    ]
  }
});

/**
 * Now we will attach the schema for that collection.
 * Orion will automatically create the corresponding form.
 */
Posts.attachSchema(new SimpleSchema({
  title: {
    type: String
  },
  image: orion.attribute('file', {
      label: 'Image',
      optional: true
  }),
  body: orion.attribute('summernote', {
      label: 'Body'
  }),
  /**
   * This attribute sets the user id of the user that created 
   * this post automatically.
   */
  createdBy: orion.attribute('createdBy'),
  /**
   * This attribute sets the created at date automatically to
   * this post.
   */
  createdAt: orion.attribute('createdAt')
}));
```

#### Extras

Other things like config, pages, etc. where re-writed but have the same api.

You can look at the [example blog](https://github.com/orionjs/example-blog) which 
was also upgraded to version ```1.0```. 
