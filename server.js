const   express = require('express'),
        session = require('express-session'),
        path = require('path'),
        app = express(),
        bodyParser = require('body-parser'),
        server = app.listen(8000),
        io = require("socket.io")(server);

app.use(bodyParser.urlencoded({ extended:true }))
app.use(session({secret: "mylittlesecret"}));
app.use(express.static(__dirname + "/static"));

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.get('/', function(req,res){
    res.render('index');
})


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