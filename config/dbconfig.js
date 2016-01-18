
var users = [
    { username:'blog_reader', pwd:'1L0v3t0r3AdBl0g5'},
    { username:'blog_writter', pwd:'1hAt3WrItTIngBl0g5'}
];

var reader_url = 'mongodb://'+ users[0].username + ':' + users[0].pwd + '@localhost:27017/blog-of-death';
var writter_url = 'mongodb://'+ users[1].username + ':' + users[1].pwd + '@localhost:27017/blog-of-death';

module.exports.reader = reader_url;
module.exports.writter = writter_url;
