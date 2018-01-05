if(process.env.NODE_ENV === 'production'){
    module.exports = {
        mongoURI: 'mongodb://santhosprabahar:sandyprabuq123@ds237967.mlab.com:37967/node_demo' }
}
else{
    module.exports = {
        mongoURI: 'mongodb://localhost/videojot'
    }
}