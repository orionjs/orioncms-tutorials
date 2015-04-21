Adding seed data to your app is easy, we will use a slightly customized worflow of **dburles:factory** and **anti:fake** (clone this repo https://github.com/pociej/meteor-fake instead, original has minor bug ). Create directory "server/seeds" and add a seed.js file. Copy and paste the snippet below into your file and modify accordingly.

```js
Meteor.startup(function() {
  var seeder;
  seeder = [];
  // we identify the entity collection we are seeding
  seeder.posts = orion.entities.posts.collection;
  // We prepare the document
  Factory.define('post', seeder.posts, {
    name: function() {
    // using anti:fake api here to generate content
      return Fake.word();
    },
    description: function() {
      return Fake.paragraph([length]);
    },
    // underscorejs snippet
    rating: function() {
      return _.random(1,4);
    },
    fruit: function() {
      return Fake.fromArray(['apple', 'banana', 'pear']);
    },
    // We are using static data
    domain: 'domainName.com',
    createdBy: 'UrfooooYPKnNoWzTd'
  });
  if (seeder.posts.find({}).count() === 0) {
  // Underscore - we want to post 60 contents
    _(60).times(function(n) {
      Factory.create('post');
    });
  }
});

```

Restart your app. Hopefully in the future we can make it work directly with addEntity
## Done
Congrats your app is now populated
