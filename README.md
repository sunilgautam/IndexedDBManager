Work with IndexedDB
==================================================

#Usage
```html
<script src="indexed-db-manager.js"></script>
<script>
// Set database
IndexDBManager.init('mydb', 1);

// Save
var user = { name: 'john doe' };
IndexDBManager.save(user, 'users', function() {
    console.info('User saved');
}, function() {
    console.error('User not saved');
});


// Read all
IndexDBManager.read(null, 'users', function(users) {
    console.info(users);
}, function() {
    console.error('Unable to read users');
});


// Read by id
IndexDBManager.read(1, 'users', function(users) {
    console.info(users);
}, function() {
    console.error('Unable to read users');
});


// Read by filter
var userFilter = function(user) { return user.id == 1; };

IndexDBManager.read(userFilter, 'users', function(users) {
    console.info(users);
}, function() {
    console.error('Unable to read users');
});


// Update
IndexDBManager.update(1, { name: 'Foo bar' }, 'users', function() {
    console.info('User updated');
}, function() {
    console.error('User not updated');
});


// Update object in callback
var updateCallBack = function(user) {
    user.name = 'Foo bar';
    return user;
};
IndexDBManager.update(1, updateCallBack, 'users', function() {
    console.info('User updated');
}, function() {
    console.error('User not updated');
});


// Delete
IndexDBManager.delete(1, 'users', function() {
    console.info('User deleted');
}, function() {
    console.error('User not deleted');
});
</script>
```