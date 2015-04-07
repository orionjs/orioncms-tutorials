# Using custom templates for entities
By defualt Orion uses autoform - quickform https://github.com/aldeed/meteor-autoform/#quickform. If your needs are basic, quickform more than meets your insert/update requirements - you can stop reading. However if your forms are complex or have requirements where a single form look and feel is not enough then you will need to override the defualt quickform and use the individual field components of "autoform" e.g afQuickField, afObjectField instead.

##Overriding quickform
Lets say you have two entity types 'post' and "schedule" and you want to use http://autoform.meteor.com/fieldvalues to make certian field dependent on others. You start by creating a new template instance for this form lets call them "adminPostsCreate and adminPostsUpdate". While you are on it, go ahead and create the update forms too **"adminScheduleCreate and adminScheduleUpdate"**.

Now addd a new entity type or update an old one; insert the custom template names after the *singularName* property

```
orion.addEntity('posts', {
    title: {
        type: String,
        label: "Title"
    },
}, {
    icon: 'bookmark',
    sidebarName: 'Posts',
    pluralName: 'Posts',
    singularName: 'Post',
   ## createTemplate:'adminPostsCreate',
  ##  updateTemplate:'adminPostsUpdate',
    tableColumns: [
        { data:'title', title: 'Title' },
    ]
});

Do the samme for schedule


orion.addEntity('schedule', {
    title: {
        type: String,
        label: "Title"
    },
}, {
    icon: 'bookmark',
    sidebarName: 'Schedule',
    pluralName: 'Schedule',
    singularName: 'Schedule',
   ## createTemplate:'adminScheduleCreate',
  ##  updateTemplate:'adminScheduleUpdate',
    tableColumns: [
        { data:'title', title: 'Title' },
    ]
});
```

## Make sure to create the templates 
Orion will use defual template if you forget to create the various templatets i.e your **update and create templates**
