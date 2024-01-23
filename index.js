const fs = require('fs');
const http = require('http');
const url = require('url')

// Blocking code
// const fileIn = fs.readFileSync('./txt/input.txt','utf-8');
// console.log(fileIn);

// const fileOut = `Hi imn adding this text to check fileoutput along with the previous file ${fileIn}`;
// fs.writeFileSync('./txt/output.txt', fileOut);

// Non Blocking code
// fs.readFile('./txt/start.txt','utf-8', (err, data) => {
//     console.log(data)
// })

// Basic server
// const server = http.createServer((req, res) => {
//     res.end("Hii this is my first server");
// })

// Routing 
const tempOverview = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8');

const replacePlaceholders = (temp, product) => {
    let output = temp.replace(/{%image%}/g, product.image);
    output = output.replace(/{%productName%}/g, product.productName);
    output = output.replace(/{%price%}/g, product.price);
    output = output.replace(/{%from%}/g, product.from);
    output = output.replace(/{%nutrients%}/g, product.nutrients);
    output = output.replace(/{%quantity%}/g, product.quantity);
    output = output.replace(/{%description%}/g, product.description);
    output = output.replace(/{%id%}/g, product.id);

    if(!product.organic) output = output.replace(/{%notOrganic%}/g, 'not-organic');
    return output;
}

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const devData = JSON.parse(data);

const server = http.createServer((req, res) => {
    const {pathname, query} = url.parse(req.url, true);

    if(pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {'Content-type': 'text/html'});

        const cardsHtml = devData.map((elem) => replacePlaceholders(tempCard, elem)).join('');
        const output = tempOverview.replace('{%card%}', cardsHtml);
        res.end(output);

    } else if(pathname === '/product') {
        res.writeHead(200, {'Content-type': 'text/html'});
        let prodWithId;

        for(let i=0; i<devData.length; i++) {
            if(devData[i].id == query.id) {
                prodWithId = devData[i];
                break;
            }
            
        }
        const output = replacePlaceholders(tempProduct,prodWithId);
        res.end(output);

    } else if(pathname === '/api') {
        res.writeHead(200, {
            'content-type':'application/json'
        })
        res.end(data);
        
    } else {
        res.writeHead(404, {
            'content-type' : 'text/html'
        })
        res.end('<h1> Page Not Found </h1>')
    }
})








server.listen(4000, () => {
    console.log("Server is listening to port 4000");
})
