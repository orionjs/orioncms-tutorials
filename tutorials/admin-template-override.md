## Admin template override
### Introduction
Orion comes with default templates for all your collections. These templates are defined within the admin interface that you've chosen to import, namely **[orionjs:bootstrap](https://github.com/orionjs/orion/tree/master/packages/bootstrap)** or **[orionjs:materialize](https://github.com/orionjs/orion/tree/master/packages/materialize)** for the official ones.

When you need to add some special behavior for a given collection, you can override the default template with your own one. This is made possible thanks to **[nicolaslopezj:reactive-templates](https://atmospherejs.com/nicolaslopezj/reactive-templates)**.

### Template inheritance
In this tutorial, we are going to add a button for exporting a collection in a CSV file.

> For conciseness, all code samples are provided either in CoffeeScript or in Jade.

Our collection is named `subscribers` and we are going to extend its index.
We start by creating a template file that displays the usual title, a tabular table
and an additional button used for the CSV export.

```html
<!-- File: subscribersIndex.jade -->

<template name='subscribersIndex'>
  {{#Layout template='orionCpTitle'}}
    {{ collection.title }}
    {{#if collection.canShowCreate}}
      <a href="{{ collection.createPath }}">
        <i class="fa fa-plus"></i>
      </a>
    {{/if}}
  {{/Layout}}
  {{#Layout template='orionCpContentContainer'}}
    {{#if collection.canIndex}}
      {{#if showTable}}
        {{> tabular table=collection.tabularTable class='table index-table'}}
      {{/if}}
      {{!-- This is our additional button --}}
      <button class='import-csv'>CSV export</button>
    {{/if}}
  {{/Layout}}
</template>
```

Now we set the logic in:

```js
ReactiveTemplates.set('collections.subscribers.index', 'subscribersIndex');

if (Meteor.isClient) {
  Template.subscribersIndex.onCreated(function() {
    appLog.info('subscribersIndex created');
    this.subscribersIndex_showTable = new ReactiveVar;
    return this.subscribersIndex_showTable.set(false);
  });
  Template.subscribersIndex.onRendered(function() {
    return this.autorun((function(_this) {
      return function() {
        Template.currentData();
        _this.subscribersIndex_showTable.set(false);
        return Meteor.defer(function() {
          return _this.subscribersIndex_showTable.set(true);
        });
      };
    })(this));
  });
  Template.subscribersIndex.helpers({
    showTable: function() {
      return Template.instance().subscribersIndex_showTable.get();
    }
  });
  Template.subscribersIndex.events({
    'click tr': function(e, t) {
      var collection, dataTable, path, rowData;
      if (!$(event.target).is('td')) {
        return;
      }
      collection = Template.currentData().collection;
      dataTable = $(e.target).closest('table').DataTable();
      rowData = dataTable.row(e.currentTarget).data();
      if (rowData != null ? rowData.canShowUpdate() : void 0) {
        path = collection.updatePath(rowData);
        return RouterLayer.go(path);
      }
    },
    'click button.import-csv': function(e, t) {
      var csvButton, subscription;
      csvButton = t.$('button.import-csv');
      csvButton.addClass('disabled');
      return subscription = Meteor.subscribe('allSubscribers', {
        onReady: function() {
          var csv, data, i, len, sub;
          data = Subscribers.find({}, {
            name: 1,
            forname: 1,
            _id: 0
          }).fetch();
          csv = (_.keys(data[0])).join(';');
          for (i = 0, len = data.length; i < len; i++) {
            sub = data[i];
            csv += '\n' + (_.values(sub)).join(';');
          }
          blobDownload(csv, 'subscribers.csv', 'text/csv');
          return csvButton.removeClass('disabled');
        },
        onError: function(err) {
          sAlert.warning('CSV subscription failed');
          appLog.warn('CSV subscription failed', err);
          return csvButton.removeClass('disabled');
        }
      });
    }
  });
}

if (Meteor.isServer) {
  Meteor.publish('allSubscribers', function() {
    return Subscribers.find();
  });
}
```

### Tip
When you're creating your overridden templates, you should start from copying
the ones from the official provided templates in **[orionjs:bootstrap](https://github.com/orionjs/orion/tree/master/packages/bootstrap)** or **[orionjs:materialize](https://github.com/orionjs/orion/tree/master/packages/materialize)**. They provide a nice starting point for adding your extended behavior.
