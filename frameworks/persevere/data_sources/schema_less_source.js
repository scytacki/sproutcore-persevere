// ==========================================================================
// Project:   Persevere.SchemaLessSource
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Persevere */

/** @class

  (Document Your Data Source Here)

  @extends SC.DataSource
*/
Persevere.SchemaLessSource = SC.DataSource.extend(
/** @scope Persevere.SchemaLessSource.prototype */ {

  basePath: "/testserver",

  _get: function(klass, query) {
	    if(!query) var query = '';

		return SC.Request.getUrl(this.basePath + "/" + klass + "/" + query).set('isAsynchronous', NO).json()
		    .header('Accept', 'application/json')
			.send();
  },

  _post: function(klass, data) {
		return SC.Request.postUrl(this.basePath + "/" + klass + "/").json()
			.set('isAsynchronous', NO)
			.header('Accept', 'application/json')
			.send(data);
  },

  // ..........................................................
  // QUERY SUPPORT
  // 

  fetch: function(store, query) {

    // Get the record type
    var recordType = query.get('recordType');

	// This check was taken from CoreTasks.RemoteDataSource in the Tasks application
    if (!recordType || !SC.typeOf(recordType) === SC.T_FUNCTION || !recordType.toString) {
      throw 'Error retrieving records: Invalid record type.';
    }

	// convert the record type to a string
	var recordTypeStr = SC._object_className(recordType);

	// FIXME this needs to check the query 

	// FIXME this runs synchronized which makes testing easier but not good for production
	var response = this._get('TestObject', '[?sc_type="' + recordTypeStr + '"]');
    var result = response.get('body');

	// This counts on the records primaryKey property set to 'id' instead of the default 'guid'
	store.loadRecords(recordType, result);
	store.dataSourceDidFetchQuery(query);
	return YES;
  },

  // ..........................................................
  // RECORD SUPPORT
  // 
  
  retrieveRecord: function(store, storeKey) {
    var recordType = SC.Store.recordTypeFor(storeKey),
        id         = store.idFor(storeKey),
        hash       = {name: "First record name"};

 
    store.dataSourceDidComplete(storeKey, hash, id);
    
    // TODO: Add handlers to retrieve an individual record's contents
    // call store.dataSourceDidComplete(storeKey) when done.
    
    return YES ; // return YES if you handled the storeKey
  },
  
  createRecord: function(store, storeKey) {
    
    // TODO: Add handlers to submit new records to the data source.
    // call store.dataSourceDidComplete(storeKey) when done.
    
    return NO ; // return YES if you handled the storeKey
  },
  
  updateRecord: function(store, storeKey) {
    
    // TODO: Add handlers to submit modified record to the data source
    // call store.dataSourceDidComplete(storeKey) when done.

    return NO ; // return YES if you handled the storeKey
  },
  
  destroyRecord: function(store, storeKey) {
    
    // TODO: Add handlers to destroy records on the data source.
    // call store.dataSourceDidDestroy(storeKey) when done
    
    return NO ; // return YES if you handled the storeKey
  }
  
}) ;
