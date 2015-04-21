# Set SEO

Ususally, you'll need a `head.html` file to write `<head></head>` code. However, if you want to change a title or modify your site description, you have to modify your code. Using orionjs dictionary functionality and the `manuelschoebel:ms-seo` package will make the seo process more flexible.

Assuming you have a basic orionjs website working. Let's add [manuelschoebel:ms-seo](https://atmospherejs.com/manuelschoebel/ms-seo) package.

```
meteor add manuelschoebel:ms-seo
```

Then, we can set dictionary.
```js
// In lib/dictionary/seo.js

orion.dictionary.addDefinition('seoTitle', 'seo', {
    type: String,
    label: "Head Site Title"
});

orion.dictionary.addDefinition('seoDescription', 'seo', {
    type: String,
    label: "Head Site Description",
    autoform: {
        type: 'textarea'
    }
});

orion.dictionary.addDefinition('seoFavIcon', 'seo', 
    orion.attribute('file', {
        label: 'Head Site FavIcon',
        optional: true
    })
);

```

Here is a global seo example, which means on every page the title is the same.
```js
// In lib/router.js

var setSEO = function() {
  if (!Meteor.isClient) {
    return;
  }
  SEO.set({
    title: orion.dictionary.get('seoTitle'),
    link: {
      icon: orion.dictionary.get('seoFavIcon.url'),
    },
    meta: {
      'description': orion.dictionary.get('seoDescription')
    }
  });
}

Router.onAfterAction(setSEO);

```

Of course, your can set your dynamic seo data. It means in each route, you'll need to set different `onAfterAction: function() {}`. For more details, please read [manuelschoebel:ms-seo](https://atmospherejs.com/manuelschoebel/ms-seo) documentation.