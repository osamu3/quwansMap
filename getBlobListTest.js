var fs = require('fs');
//var path = require('path');
var storage = require('azure-storage');

// Create a blob client for interacting with the blob service from connection string
var connectionString = 'DefaultEndpointsProtocol=https;AccountName=cs4fe87546c74cbx40b5x946;AccountKey=vYGAo3BUcdzTsQhqmWQP4J179K3W6OjR/sBmueUpaKOdY/b6cmk6q8+8XurGKKGqDBpiMwnTm29QRu91AjeI5Q==;EndpointSuffix=core.windows.net';
var blobService = storage.createBlobService(connectionString);

var CONTAINER_NAME = 'container01';
// 書き込むファイル(ブロブ)名 var BLOCK_BLOB_NAME = 'blobcreatetestfile2.txt';

console.log('\n==============================================================\n');

//console.log('1. Creating a container with public access:', CONTAINER_NAME, '\n');
blobService.createContainerIfNotExists(CONTAINER_NAME, { 'publicAccessLevel': 'blob' }, function (error) {
	handleError(error);

	console.log('4. Listing blobs in container\n');
	blobService.listBlobsSegmented(CONTAINER_NAME, null, function (error, data) {
		handleError(error);

		for (var i = 0; i < data.entries.length; i++) {
			console.log("name: "+ data.entries[i].name+"blobType: "+ data.entries[i].blobType);
		}
		console.log('\n');

	});
});

function handleError(error) {
	if (error) {
		console.error('Exception thrown:\n', error);
		process.abort();
	}
}