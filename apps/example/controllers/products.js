// ==========================================================================
// Project:   Example.productsController
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Example */

sc_require('models/product');
sc_require('controllers/records');

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
Example.productsController = Example.RecordsController.create(
/** @scope Example.productsController.prototype */ {
  recordType: Example.Product,
  recordName: 'product',
  recordListViewPath: 'mainPane.productsView.productListView'  
}) ;
