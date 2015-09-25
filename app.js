var express = require('express')
  , http = require('http')
  , path = require('path')

var app = express();
var clients = {};
// all environments
app.set('port', process.env.PORT || 3008);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser({uploadDir:'c:\\tmp'}));
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function(req,res){
	res.render('gomoku',{
	});	
});
var client={};
var server = http.createServer(app);
var io = require('socket.io').listen(server);

io.sockets.on('connection',function(socket){
	socket.on('online',function(data){
	client[data.from]={
	socket:socket.id
	}
	console.log(data.from);
	console.log(client[data.from].socket);
	});

	//有人查看历史记录
	socket.on('move',function(data){
		console.log(data.move);
		if(client[data.to]){
		console.log(client[data.to].socket);
		 io.sockets.socket(client[data.to].socket).emit('move',{from:data.from,to:data.to,move:data.move});
		}
		
	});

 
  	//掉线，断开链接处理
	socket.on('disconnect',function(){
		
	});
});

server.listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
