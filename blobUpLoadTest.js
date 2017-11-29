var fs = require('fs');
var path = require('path');
//var readlineSync = require('readline-sync');
var storage = require('azure-storage');
/*
var util = require('util');
var uuid = require('uuid');
*/

// Create a blob client for interacting with the blob service from connection string
var connectionString = 'DefaultEndpointsProtocol=https;AccountName=cs4fe87546c74cbx40b5x946;AccountKey=vYGAo3BUcdzTsQhqmWQP4J179K3W6OjR/sBmueUpaKOdY/b6cmk6q8+8XurGKKGqDBpiMwnTm29QRu91AjeI5Q==;EndpointSuffix=core.windows.net';
var blobService = storage.createBlobService(connectionString);

/* ローカル設定
// Prepare upload and download file path related variables
var USER_HOME = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
var DOCUMENT_FOLDER = path.join(USER_HOME, 'Documents');
if (!fs.existsSync(DOCUMENT_FOLDER)) {
  fs.mkdirSync(DOCUMENT_FOLDER);
}

var LOCAL_FILE_TO_UPLOAD = 'HelloWorld by osamu.txt';
var LOCAL_FILE_PATH = path.join(DOCUMENT_FOLDER, LOCAL_FILE_TO_UPLOAD);
var DOWNLOADED_FILE_NAME = LOCAL_FILE_TO_UPLOAD.replace('.txt', '_DOWNLOADED.txt');
var DOWNLOADED_FILE_PATH = path.join(DOCUMENT_FOLDER, DOWNLOADED_FILE_NAME);
*/

var CONTAINER_NAME = 'container01';
// 書き込むファイル(ブロブ)名 var BLOCK_BLOB_NAME = 'blobcreatetestfile2.txt';

console.log('Azure Storage Node.js Client Library Blobs Quick Start\n');

console.log('1. Creating a container with public access:', CONTAINER_NAME, '\n');
blobService.createContainerIfNotExists(CONTAINER_NAME, { 'publicAccessLevel': 'blob' }, function (error) {
	handleError(error);

//	console.log('*2. Creating a file in ~/Documents folder to test the upload and download\n');

//	console.log('3. Uploading BlockBlob:', BLOCK_BLOB_NAME, '\n');
//	blobService.createBlockBlobFromLocalFile(CONTAINER_NAME, BLOCK_BLOB_NAME, "blobcreatetestfile.txt", function (error) {
//	handleError(error);
//	console.log('   Uploaded Blob URL:', blobService.getUrl(CONTAINER_NAME, BLOCK_BLOB_NAME), '\n');

	console.log('4. Listing blobs in container\n');
	blobService.listBlobsSegmented(CONTAINER_NAME, null, function (error, data) {
		handleError(error);

		for (var i = 0; i < data.entries.length; i++) {
			console.log("name: "+ data.entries[i].name+"blobType: "+ data.entries[i].blobType);
		}
		console.log('\n');

//		console.log('*5. Downloading blob\n');
/*      blobService.getBlobToLocalFile(CONTAINER_NAME, BLOCK_BLOB_NAME, DOWNLOADED_FILE_PATH, function (error) {
        handleError(error);
        console.log('   Downloaded File:', DOWNLOADED_FILE_PATH, '\n');

        console.log('Sample finished running. When you hit <ENTER> key, the temporary files will be deleted and the sample application will exit.');
        readlineSync.question('\n');

        console.log('6. Deleting block Blob\n');
        blobService.deleteBlobIfExists(CONTAINER_NAME, BLOCK_BLOB_NAME, function (error) {
          handleError(error);

          console.log('7. Deleting container\n');
          blobService.deleteContainerIfExists(CONTAINER_NAME, function (error) {
            handleError(error);

            fs.unlinkSync(LOCAL_FILE_PATH);
            fs.unlinkSync(DOWNLOADED_FILE_PATH);
          });
       });
      });
*/
//		});
	});
});

function handleError(error) {
  if (error) {
    console.error('Exception thrown:\n', error);
    process.abort();
  }
}