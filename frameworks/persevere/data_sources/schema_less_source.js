require('data_sources/persevere_server');

// ==========================================================================
// Project:   Persevere.SchemaLessSource
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Persevere */

/** @class

  (Document Your Data Source Here)

  @extends SC.DataSource
*/
Persevere.SchemaLessSource = SC.DataSource.extend(Persevere.ServerMixin,
/** @scope Persevere.SchemaLessSource.prototype */ {

  prsvClassName: 'SCRecord',

  // ..........................................................
  // QUERY SUPPORT
  //

  fetch: function(store, query) {
    // Do some sanity checking first to make sure everything is in order.
    if (!query || !SC.instanceOf(query, SC.Query)) {
      throw 'Error retrieving records: Invalid query.';
    }

    // Get the record type
    var recordType = query.get('recordType');

	// This check was taken from CoreTasks.RemoteDataSource in the Tasks application
    if (!recordType || !SC.typeOf(recordType) === SC.T_FUNCTION || !recordType.toString) {
      throw 'Error retrieving records: Invalid record type.';
    }

    // convert the record type to a string
    var recordTypeStr = SC._object_className(recordType);

    // This doesn't pass the conditions of the query to the server so probably more
    // records than neccessary will be returned. However SproutCore applies these conditions
    // when the RecordArray linked to this query is accessed, so handling the conditions here
    // is an optimization.

    this._getAsync(this.get('prsvClassName'), '[?sc_type="' + recordTypeStr + '"]')
       .notify(this, 'didFetch', recordType, store, query)
       .send();

    return YES;
  },

  didFetch: function(response, recordType, store, query){
    if (SC.ok(response)) {
	    var result = response.get('body');

		// This counts on the records primaryKey property set to 'id' instead of the default 'guid'
		store.loadRecords(recordType, result);
		store.dataSourceDidFetchQuery(query);
		return YES;
    } else {
	  // Need a test for this
	  store.dataSourceDidErrorQuery(query, response);
	  return YES;
	}
  },


  // ..........................................................
  // RECORD SUPPORT
  //

  retrieveRecord: function(store, storeKey) {
    var id         = store.idFor(storeKey);

    // Currently all of the ids are unique for the entire data source
	var response = this._getAsync(this.get('prsvClassName'), id)
	  .notify(this, 'didRetrieveRecord', store, id, storeKey)
	  .send();

    return YES ; 
  },

  didRetrieveRecord: function(response, store, id, storeKey){
	if (!SC.ok(response)) {
		store.dataSourceDidError(storeKey);
		return YES;
	}
	
	var result = response.get('body');

    store.dataSourceDidComplete(storeKey, result, id);
    return YES;
  },

  createRecord: function(store, storeKey) {
    var recordType = SC.Store.recordTypeFor(storeKey);

	// convert the record type to a string
	var recordTypeStr = SC._object_className(recordType);
	var hash = store.readDataHash(storeKey);

    // add the type to the hash
    hash.sc_type = recordTypeStr;

    // send the post with the hash
    var response = this._postAsync(this.get('prsvClassName'))
      .notify(this, 'didCreateRecord', store, storeKey)
      .send(hash);

    return YES;
  },

  didCreateRecord: function(response, store, storeKey) {
    console.log("Post complete: " + response);

    if (!SC.ok(response)) {
      store.dataSourceDidError(storeKey);
      return YES;
    }

    var url = response.header('Location');
    console.log("Location after createRecord: " + url);

    // use the id from the returned hash instead of the location header
    // this id doesn't contain the full url so it will be the correct postfix when updates
    // and deletes are sent.
    store.dataSourceDidComplete(storeKey, null, response.get('body').id); 
    return YES;
  },

  updateRecord: function(store, storeKey) {
    var hash = store.readDataHash(storeKey);
    this._putAsync(this.get('prsvClassName'), store.idFor(storeKey))
       .notify(this, 'didUpdateRecord', store, storeKey)
       .send(hash);

      console.log('update record did a put');

    return YES;
  },

  didUpdateRecord: function(response, store, storeKey) {
	if (!SC.ok(response)) {
		store.dataSourceDidError(storeKey);
		return YES;
    }

	var data = response.get('body');
    store.dataSourceDidComplete(storeKey, data);
    return YES;	
  },

  destroyRecord: function(store, storeKey) {
		
	this._deleteAsync(this.get('prsvClassName'), store.idFor(storeKey))
	  .notify(this, 'didDestroyRecord', store, storeKey)
	  .send();
	
    return YES;
  },

  didDestroyRecord: function(response, store, storeKey) {
	console.log('destroyRecord(me) sent delete response.status: ' + response);

    if(!this._deleteResponseOk(response)){
	  store.dataSourceDidError(storeKey);
	  // Not sure if it make sense to return yes here, but if not then 
	  // this same method gets called again
	  return YES;
    }

    store.dataSourceDidDestroy(storeKey);
    return YES;
  }
}) ;
