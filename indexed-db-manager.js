(function(window, document, undefined) {
    'use strict';

    function IndexDBManager(dbName, dbVersion) {
        this.database = this.request = null;

        this.dbName = (undefined === dbName) ? 'testDB' : dbName;
        this.dbVersion = (undefined === dbVersion) ? 1 : dbVersion;
    }

    IndexDBManager.prototype.init = function(dbName, dbVersion) {
        this.dbName = (undefined === dbName) ? this.dbName : dbName;
        this.dbVersion = (undefined === dbVersion) ? this.dbVersion : dbVersion;
    };

    IndexDBManager.prototype.openDatabase = function(successCallback, errorCallback, upgradeCallback) {
        this.request = window.indexedDB.open(this.dbName, this.dbVersion);

        this.request.onsuccess = successCallback;
        this.request.onerror = errorCallback;
        this.request.onupgradeneeded = upgradeCallback;
    };

    IndexDBManager.prototype.getDatabase = function(objStore, task) {
        var _that,
            args = Array.prototype.slice.call(arguments).slice(2);

        if (!this.database) {
            _that = this;
            this.openDatabase(function(event) {
                _that.database = event.target.result;
                task.apply(_that, args);
            }, function(event) {
                console.log(event.target.errorCode);
            }, function(event) {
                var db = event.target.result;
                var objectStore = db.createObjectStore(objStore, { keyPath: "id", autoIncrement: true });
            });
        } else {
            task.apply(this, args);
        }
    };

    IndexDBManager.prototype.save = function(objectToSave, objStore, successCallback, errorCallback) {

        if (undefined === successCallback) {
            successCallback = function() {};
        }

        if (undefined === errorCallback) {
            errorCallback = function() {};
        }

        var doSaveOperation = function() {
            var transaction = this.database.transaction([objStore], "readwrite");
            var objectStore = transaction.objectStore(objStore);
            var saveRequest = objectStore.put(objectToSave);

            saveRequest.onsuccess = successCallback;
            saveRequest.onerror = errorCallback;
        };

        this.getDatabase(objStore, doSaveOperation);
    };

    IndexDBManager.prototype.read = function(idOrFilter, objStore, successCallback, errorCallback) {
        var filter;

        if (undefined === successCallback) {
            successCallback = function() {};
        }

        if (undefined === errorCallback) {
            errorCallback = function() {};
        }

        if ('function' === typeof(idOrFilter)) {
            // Filter provided
            filter = idOrFilter;
        } else {
            filter = function(object) {
                return object.id == idOrFilter;
            };
        }

        var doReadOperation = function() {
            var transaction = this.database.transaction([objStore], "readwrite");
            var objectStore = transaction.objectStore(objStore);
            var readRequest = objectStore.openCursor();
            var objects = [];

            readRequest.onsuccess = function(event) {
                var cursor = event.target.result;
                if (cursor) {
                    if (!idOrFilter || filter.call(null, cursor.value)) {
                        objects.push(cursor.value);
                    }
                    cursor.continue();
                } else {
                    successCallback.call(null, objects);
                }
            };

            readRequest.onerror = errorCallback;
        };

        this.getDatabase(objStore, doReadOperation);
    };

    IndexDBManager.prototype.update = function(id, update, objStore, successCallback, errorCallback) {
        var updateHandler, _that;

        if (undefined === successCallback) {
            successCallback = function() {};
        }

        if (undefined === errorCallback) {
            errorCallback = function() {};
        }

        if ('function' === typeof(update)) {
            // Update handle callback provided
            updateHandler = update;
        } else {
            updateHandler = function(object) {
                var prop;

                for (prop in update) {
                    if (update.hasOwnProperty(prop)) {
                        object[prop] = update[prop];
                    }
                }

                return object;
            };
        }

        var doUpdateOperation = function(objectToUpdate) {
            var transaction = this.database.transaction([objStore], "readwrite");
            var objectStore = transaction.objectStore(objStore);
            var saveRequest = objectStore.put(updateHandler.call(null, objectToUpdate));

            saveRequest.onsuccess = successCallback;
            saveRequest.onerror = errorCallback;
        };

        _that = this;
        this.read(id, objStore, function(objects) {
            if (objects.length) {
                _that.getDatabase(objStore, doUpdateOperation, objects[0]);
            }
        }, errorCallback);
    };

    IndexDBManager.prototype.delete = function(objectToDelete, objStore, successCallback, errorCallback) {
        var deletingId;

        if (undefined === successCallback) {
            successCallback = function() {};
        }

        if (undefined === errorCallback) {
            errorCallback = function() {};
        }

        if (Object.prototype.toString.call(objectToDelete) === "[object Object]") {
            deletingId = objectToDelete.id;
        } else {
            deletingId = objectToDelete;
        }

        var doDeleteOperation = function() {
            var transaction = this.database.transaction([objStore], "readwrite");
            var objectStore = transaction.objectStore(objStore);
            var deleteRequest = objectStore.delete(deletingId);

            deleteRequest.onsuccess = successCallback;
            deleteRequest.onerror = errorCallback;
        };

        this.getDatabase(objStore, doDeleteOperation);
    };

    window.IndexDBManager = new IndexDBManager();
})(window, document);