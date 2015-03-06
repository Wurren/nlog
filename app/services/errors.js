/*
|--------------------------------------------------------------------------
| Convert Mongoose Validation Errors
|--------------------------------------------------------------------------
*/

exports.convert = function(errors) {
     var newerrors = [];
     for (var key in errors) {
          var obj = errors[key];
               newerrors.push(obj);
     }
     return newerrors;
}