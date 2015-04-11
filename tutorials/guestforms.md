# Forms accessible by guests (non-login users)
To add contact, survey forms guest can access in the front end and stores data securely for admin to view at the backend. You will have to start by creating a entity to hold the schema. create a new js filein your 'both' or 'orion' folder (it go anywhere) and add something like this in there. 

```
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
```
Meteor.methods({
  insertMethod: function (doc) {
    check(doc, orion.entities.yourentity.schema);
    return orion.entities.yourentity.collection.insert(doc);
  }
});

//yourentity is the name of the entity your create earlier ('contacts')
```

after that create a new client side js file i.e in client/views/contactform.js
```
{{> quickForm schema='orion.entities.yourentity.schema' id="myForm" type="method" meteormethod="insertMethod" }}

//yourentity is the name of the entity your create earlier ('contacts')
```

## Done
Congrats you know have as guest accessible form
