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

```jade
// File: subscribersIndex.jade

template(name='subscribersIndex')
  // subscribersIndex
  +Layout template='orionCpTitle'
    | {{ collection.title }}
    if collection.canShowCreate
      a(href="{{ collection.createPath }}"): i.fa.fa-plus
  +Layout template='orionCpContentContainer'
    if collection.canIndex
      if showTable
        +tabular table=collection.tabularTable class='table index-table'
      // This is our additional button
      button.import-csv CSV export
```

Now we set the logic in:

```coffee
# File: subscribersIndex.coffee

# Here we ask Orion to replace the basic index for the subscriber with our
#  freshly created new template subscribersIndex. This addition is done
#  client side and server side.
ReactiveTemplates.set 'collections.subscribers.index', 'subscribersIndex'

# Now, client side, we set the default logic.
if Meteor.isClient
  Template.subscribersIndex.onCreated ->
    appLog.info 'subscribersIndex created'
    @subscribersIndex_showTable = new ReactiveVar
    @subscribersIndex_showTable.set false

  Template.subscribersIndex.onRendered ->
    @autorun =>
      Template.currentData()
      @subscribersIndex_showTable.set false
      Meteor.defer =>
        @subscribersIndex_showTable.set true

  Template.subscribersIndex.helpers
    showTable: ->
      Template.instance().subscribersIndex_showTable.get()

  Template.subscribersIndex.events
    'click tr': (e, t) ->
      return unless $(event.target).is 'td'
      collection = Template.currentData().collection
      dataTable = $(e.target).closest('table').DataTable()
      rowData = dataTable.row(e.currentTarget).data()
      if rowData?.canShowUpdate()
        path = collection.updatePath rowData
        RouterLayer.go path

    # Here we create the behavior for the new button
    'click button.import-csv': (e, t) ->
      # Prevent further actions
      csvButton = t.$ 'button.import-csv'
      csvButton.addClass 'disabled'
      subscription = Meteor.subscribe 'allSubscribers',
        onReady: ->
          data = Subscribers.find({},{name: 1, forname: 1, _id: 0}).fetch()
          # Create the header
          csv = (_.keys data[0]).join ';'
          for sub in data
            csv += '\n' + (_.values sub).join ';'
          # Automatic download of the CSV as a Blob file
          blobDownload csv, 'subscribers.csv', 'text/csv'
          # Allow further extracts
          csvButton.removeClass 'disabled'
        onError: (err) ->
          sAlert.warning 'CSV subscription failed'
          appLog.warn 'CSV subscription failed', err
          # Allow further extracts
          csvButton.removeClass 'disabled'

if Meteor.isServer
  Meteor.publish 'allSubscribers', -> Subscribers.find()
```

### Tip
When you're creating your overridden templates, you should start from copying
the ones from the official provided templates in **[orionjs:bootstrap](https://github.com/orionjs/orion/tree/master/packages/bootstrap)** or **[orionjs:materialize](https://github.com/orionjs/orion/tree/master/packages/materialize)**. They provide a nice starting point for adding your extended behavior.
