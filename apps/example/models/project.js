// ==========================================================================
// Project:   Example.Project
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Example */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
Example.Project = SC.Record.extend(
/** @scope Example.Project.prototype */ {

  name: SC.Record.attr(String),
  products: SC.Record.toMany('Example.Product')
}) ;
