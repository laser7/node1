
const http = require('http');
const fs = require('fs');
const { parse } = require('querystring');
const buf = new Buffer.alloc(1024);
const readline = require('readline');
const hostname = '127.0.0.1';
const port = 3003;

const server = http.createServer((req, res) => {

    res.statusCode = 200;
    res.setHeader("content-type", "text/html");

    

    switch(req.url){
        case '/' :
            res.write(`
            <h2>Thank you for visiting the Welcome Page !</h2>
            <form action="/create-player" method="POST">
                <label for="player_name">Add a player:</label>
              <input id ="player_name" type="text" name="player" value="playername">
              <input type="submit" name ="add" value="ADD">
            </form>
         
            `);
            res.end();
            
           
            break;
        case '/players' :
           
      
            const rl = readline.createInterface({
                input:  fs.createReadStream('players.txt')
            });
            rl.on('line', (line) => {

                function intervalRead(line){
                    if(line!=''){
                        res.write(
                            `<form action="/players" method = "POST">
                            <ul>
                            <li> ${line} <button  id="${line}" name ="delete" value = "${line}">DELETE</button></li>
                            
                            </ul>
                            </form>`
                            
                            );
                        }
                }

                setInterval(intervalRead, 1000,line);
            });
          
 
            if(req.method === 'POST'){
                let button = '';
                req.on('data', chunk=> {
                    button += chunk.toString();
                    console.log(button);
                   
                });
                req.on('end', ()=> {
                    let state = parse(button);
                    res.write(`player ${state.delete} will be deleted`);
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

                    res.end(`player ${name.player} is in the list`);
                   
                });
            break;
        
        default:
            res.end('sorry, page not found!')
    }

});

    function addList(line){
        res.write(
            `<form action="/players" method = "POST">
            <ul>
            <li> ${line} <button  id="${line}" name ="delete" value = "${line}">DELETE</button></li>
            
            </ul>
            </form>`
            
            );
    }
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
})





