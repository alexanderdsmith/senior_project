angular.module('profileServices', [])

.factory('Profile', function($http) {
    var profileFactory = {};

    profileFactory.sendFile = function(file) {
        var fd = new FormData();
        fd.append('file', file);
        console.log(fd);
        return $http.post('/api/uploadAuthList', fd);
    };

    return profileFactory;
});