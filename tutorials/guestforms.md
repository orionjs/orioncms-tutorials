# Forms accessible by guests (non-login users)
To add contact, survey forms guest can access in the front end and stores data securely for admin to view at the backend. You will have to start by creating a entity to hold the schema. create a new js filein your 'both' or 'orion' folder (it go anywhere) and add something like this in there. 

```js
orion.addEntity('contacts', {
  fullName: {
    type: String,
    label: "Full Name"
  },
   phone:{
    type: String,
    optional: true,
    label: "Phone",
  },
  email:{
    type: String,
    optional: true,
    label: "Email",
  },
  comment:{
    type: Number,
    optional: true,
    label: "Comment",
  },
}, {
  icon: 'bookmark',
  sidebarName: 'Contacts',
  pluralName: 'Contacts',
  singularName: 'Contact',
  //Optional - Only if your need to override the generic template
  createTemplate:'contactsCreate',
  updateTemplate:'contactsUpdate',
  tableColumns: [
      { data:'fullname', title: 'Full Name' },
  ]
});

```

Then go to your server folder and add to your method.js file
```js
Meteor.methods({
  insertMethod: function (doc) {
    check(doc, orion.entities.yourentity.schema);
    return orion.entities.yourentity.collection.insert(doc);
  }
});

//yourentity is the name of the entity your create earlier ('contacts')
```

after that create a new template to show the form
```html
<template name="contact">
  {{> quickForm schema='orion.entities.yourentity.schema' id="myForm" type="method" meteormethod="insertMethod" }}
  <!-- yourentity is the name of the entity your create earlier ('contacts') -->
</template>
```

## Done
Congrats you know have as guest accessible form
