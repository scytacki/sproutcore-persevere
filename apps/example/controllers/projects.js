// ==========================================================================
// Project:   Example.projectsController
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Example */

sc_require('models/project');
sc_require('controllers/records');

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
Example.projectsController = Example.RecordsController.create(
/** @scope Example.projectsController.prototype */ {
  recordType: Example.Project,
  recordName: 'project',
  recordListViewPath: 'mainPane.projectsView.projectListView'
}) ;
