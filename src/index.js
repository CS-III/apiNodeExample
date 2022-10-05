const http = require('http');
const { bodyParser } = require('./lib/bodyParser')
let database = [

];

function getBeerHandler(req, res) {
    res.writeHead(200, {'Content-Type' : 'application/json'})
    res.write(JSON.stringify(database))
    res.end();
}

async function createBeerHandler(req, res) {
    try {
        await bodyParser(req)
        console.log(req.body)
        database.push(req.body)
        res.writeHead(200, {'Content-Type' : 'application/json'})
        res.write(JSON.stringify({
            message: "Beers stored"
        }));
        res.end();
    } catch (error) {
        res.writeHead(200, {'Content-Type' : 'text/plain'})
        res.write('Internal Error')
        res.end()   
    }
   
}

async function updateBeerHandler(req, res) {

    try {

        const {url} = req;
        let idQuery = url.split('?')[1]
        let idKey = idQuery.split('=')[0]
        let idValue = idQuery.split('=')[1]
        
        if (idKey === 'id') {
            await bodyParser(req)
            database[idValue - 1] = req.body
            res.writeHead(200, {'Content-Type' : 'application/json'})
            res.write(JSON.stringify({
                message: "Beers update with id: "+idValue
            }));
            res.end();
        } else {
            res.writeHead(200, {'Content-Type' : 'text/plain'})
            res.write('Invalid Request')
            res.end()   
        }
    } catch (error) {
        res.writeHead(400, {'Content-Type' : 'text/plain'})
        res.write('Internal Error', error.message)
        res.end() 
    }
}

async function deleteBeerHandler(req, res) {
    try {

        const {url} = req;
        let idQuery = url.split('?')[1]
        let idKey = idQuery.split('=')[0]
        let idValue = idQuery.split('=')[1]
        
        if (idKey === 'id') {
            database.split(idValue - 1, 1)
            res.writeHead(200, {'Content-Type' : 'application/json'})
            res.write(JSON.stringify({
                message: "Beers delete with id: "+idValue
            }));
            res.end();
        } else {
            res.writeHead(200, {'Content-Type' : 'text/plain'})
            res.write('Invalid Request')
            res.end()   
        }
    } catch (error) {
        res.writeHead(400, {'Content-Type' : 'text/plain'})
        res.write('Internal Error', error.message)
        res.end() 
    }
}
const server = http.createServer((req, res) => {

    const { url, method } = req

    //Logger
    console.log(`URL: ${url} - Method: ${method}`)

    //Headers
    //res.writeHead(200, {'Content-Type' : 'text/plain'})
    //
    
    switch(method) {
        case 'GET' :
            if(url === '/') {
                res.writeHead(200, {'Content-Type' : 'application/json'})
                res.write(JSON.stringify({
                    message: "Connected"
                }));
                res.end();
            }
            if(url === '/beers') {
                getBeerHandler(req, res)
            }
        break;
        case 'POST' :
            if(url === '/beers')
            {
                createBeerHandler(req, res)
            }
        break;
        case 'PUT' :
            updateBeerHandler(req, res)

        break;
        case 'DELETE' :
            deleteBeerHandler(req, res)
        break;

        default:
            res.writeHead(404, {'Content-Type' : 'text/plain'})
            res.write('Not Found')
            res.end() 
        break
    }
})

server.listen(3000);
console.log('Server on port ', 3000)