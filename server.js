const   express = require('express'),
        session = require('express-session'),
        path = require('path'),
        app = express(),
        bodyParser = require('body-parser'),
        server = app.listen(8000),
        io = require("socket.io")(server),
        request = require('request-promise');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }))

app.use(session({secret: "mylittlesecret"}));
app.use(express.static(__dirname + "/static"));

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.get('/', function(req,res){
    res.render('index');
})
/*
app.get('/postdatatoFlask', async function (req, res) {
    var data = { // this variable contains the data you want to send
        x_value: 1.1
    }
 
    var options = {
        method: 'POST',
        uri: 'http://localhost:5000/postdata',
        body: data,
        json: true // Automatically stringifies the body to JSON
    };
    
    var returndata;
    var sendrequest = await request(options)
    .then(function (parsedBody) {
        console.log(parsedBody); // parsedBody contains the data sent back from the Flask server
        returndata = parsedBody; // do something with this data, here I'm assigning it to a variable.
    })
    .catch(function (err) {
        console.log(err);
    });
    
    res.send(returndata);
});*/


var counter = 0;

var chartDataSet = {
    labels: ['0'],
    datasets: [{
        label: "My First dataset",
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: [0],
    }]
}




io.on('connection', function(socket){
    socket.emit('givePointData', chartDataSet);

    socket.on('giveMeMoreData', function(data){
        

        dataToChange = data.dataObject

        counter+= 0.12
        

        newDataPoint = Math.sin(counter);
        
        if(dataToChange.labels.length < 100){
            dataToChange.labels.push((counter%1).toString());
            dataToChange.datasets[0].data.push(newDataPoint);         
            socket.emit('givePointData', dataToChange);    
        }else{
            dataToChange.labels.shift();
            dataToChange.datasets[0].data.shift();
            dataToChange.labels.push((counter%1).toString());
            dataToChange.datasets[0].data.push(newDataPoint);
            socket.emit('givePointData', dataToChange);

        }
        
        
    })
});