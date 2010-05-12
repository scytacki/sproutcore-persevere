// ==========================================================================
// Project:   Persevere
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Persevere */

/** @namespace

  My cool new framework.  Describe your framework.
  
  @extends SC.Object
*/
Persevere = SC.Object.create(
  /** @scope Persevere.prototype */ {

  NAMESPACE: 'Persevere',
  VERSION: '0.1.0',

  // TODO: Add global constants or singleton objects needed by your app here.

}) ;

// Set the default id of the records to reduce the translation between persevere and sproutcore
SC.Record.prototype.set('primaryKey', 'id');
