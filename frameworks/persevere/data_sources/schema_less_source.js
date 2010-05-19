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


  _put: function(klass, id, data) {
	return SC.Request.putUrl(this.basePath + "/" + klass + "/" + id).json()
	      .set('isAsynchronous', NO)
		  .header('Accept', 'application/json')
	      .send(data);
  },

  _delete: function(klass, id) {
	return SC.Request.deleteUrl(this.basePath + "/" + klass + "/" + id).json()
		.set('isAsynchronous', NO)
		.header('Accept', 'application/json')
		.send();
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

	// convert the record type to a string
	var recordTypeStr = SC._object_className(recordType);

	// FIXME this needs to check the query

	// FIXME this runs synchronized which makes testing easier but not good for production
	var response = this._get('TestObject', id);
	var result = response.get('body');

    store.dataSourceDidComplete(storeKey, result, id);

    return YES ; // return YES if you handled the storeKey
  },

  createRecord: function(store, storeKey) {
    var recordType = SC.Store.recordTypeFor(storeKey);

	// convert the record type to a string
	var recordTypeStr = SC._object_className(recordType);
	var hash = store.readDataHash(storeKey);

    // add the type to the hash
    hash.sc_type = recordTypeStr;

    // send the post with the hash
    var response = this._post('TestObject', hash);
    console.log("Post complete: " + response);

    if (SC.ok(response)) {
		var url = response.header('Location');
	    console.log("Location after createRecord: " + url);
		store.dataSourceDidComplete(storeKey, null, url); // update id
		return YES;
	}

    return NO ; // return YES if you handled the storeKey
  },

  updateRecord: function(store, storeKey) {
	var hash = store.readDataHash(storeKey);
	var response = this._put('TestObject', store.idFor(storeKey), hash);

    console.log('update record did a put');

	if (SC.ok(response)) {
	  var data = response.get('body');
      store.dataSourceDidComplete(storeKey, data);
      return YES;
    }

    // if we are asynchronous then this should be called in the call back when it fails
    // store.dataSourceDidError(storeKey);
	return NO;
  },

  destroyRecord: function(store, storeKey) {
	var response = this._delete('TestObject', store.idFor(storeKey));

	console.log('destoryRecord sent delete');

    if(this._deleteResponseOk(response)){
      store.dataSourceDidDestroy(storeKey);
	  return YES;
    }

    return NO ; // return YES if you handled the storeKey
  },

  _deleteResponseOk: function(response) {
	// the sproutcore gem proxying code doesn\'t handle delete correctly
	// if this is used with sproutcore master this function can probably
	// be a simple SC.ok(response);
	return response.status === 500 || response.status === 404;
  }

}) ;
