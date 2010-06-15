// ==========================================================================
// Project:   Example.RecordsController
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Example */

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
Example.RecordsController = SC.ArrayController.extend(
/** @scope Example.projectsController.prototype */ {

  recordType: null,
  recordName: null,
  recordListViewPath: null,
  
  // TODO: Add your own code here.
  addRecord: function(){
      var record;

      // I needed to add an empty hash so the createRecord method would generate an id correctly
      record = Example.store.createRecord(this.get('recordType'), {name: 'new ' + this.get('recordName')});

      // select new task in UI
      this.selectObject(record);

      // activate inline editor once UI can repaint
      this.invokeLater(function() {
        var contentIndex = this.indexOf(record);
        var list = Example.mainPage.getPath(this.get('recordListViewPath'));
        var listItem = list.itemViewForContentIndex(contentIndex);
        listItem.beginEditing();
      });
        
      return YES;
    
  }
}) ;
