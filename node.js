
const http = require('http');
const fs = require('fs');
const { parse } = require('querystring');
//const buf = new Buffer.alloc(1024);
const readline = require('readline');
const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {

    res.statusCode = 200;
    res.setHeader("content-type", "text/html");
    const welcome = `
    <h2>Thank you for visiting the Welcome Page !</h2>
    <form action="/create-player" method="POST">
        <label for="player_name">Add a player:</label>
      <input id ="player_name" type="text" name="player" value="playername">
      <input type="submit" name ="add" value="ADD">
    </form>
 
    `;


    switch(req.url){
        case '/' :
            res.write(welcome);
            res.end();
            
           
            break;
        case '/players' :
           
            function intervalRead(){
            const rl = readline.createInterface({
                input:  fs.createReadStream('players.txt')
            });
            rl.on('line', (line) => {

               
                    if(line!=''){
                        res.write( `
                        <form action="/players" method = "POST">
                       <ul>
                       <li> ${line} <button  id="${line}" name ="delete" value = "${line}">DELETE</button></li>
                       
                       </ul>
                       </form>
                    `);
                          
                        }
                

               
            });
        }
      setTimeout(intervalRead, 1000);
      
            if(req.url==="/players" && req.method === "POST"){
                let button = '';
                req.on('data', chunk=> {
                    button += chunk.toString();
                    console.log(button);
                   
                });
                req.on('end', ()=> {
                    
                    let state = parse(button);
                    res.writeHead(302, { Location:"/"});
                    res.write(`
                    <a href="/"> welcome page</a> </br> </br>
                    <h2>player ${state.delete} had deleted</h2>
                    `);
                    fs.readFile('players.txt','utf-8', function(err,files){
                        
                        var result = files.replace(state.delete,'');
                        fs.writeFile('players.txt', result, 'utf-8', function(err){
                            if(err){
                                console.log(err);
                            }
                        });
                    });
                });
            }
            break;

        case '/create-player':
                let players = '';
                req.on('data', chunk => {
                    players += chunk.toString(); // convert Buffer to string
                  
                });
                req.on('end', () => {

                    let name = parse(players);
                    console.log(name);
          
                    fs.appendFile('players.txt', name.player+"\n", function(err, ret){
                        if(err){
                            throw err;
                        }
                        console.log('player add successful');
                    })
                    res.write(` </br></br>
                           <h2>player ${name.player} is in the list</h2> </br></br>
                           <a href="/"> welcome page</a> </br></br>
                           <a href="/players"> players page </a>
                    `);
                    res.end();
                   
                });
            break;
        
        default:
            res.end('sorry, page not found!')
    }

});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
})





