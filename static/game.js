var socket = io();


var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height =600;
var context = canvas.getContext('2d');
var neprobiha=true;
socket.on('mouse', function(data) {
      function checkFlag() {
    if(isDrawing == true) {
       window.setTimeout(checkFlag, 100); /* this checks the flag every 100 milliseconds*/
    } else {
      /* do something*/
      context.strokeStyle = data.barva;
          context.beginPath();
          context.moveTo(data.exx,data.exy);
          context.lineTo(data.x,data.y);
          context.stroke();
          console.log("rec");
    }
}
checkFlag();
             
});   
socket.on("souradnice", function(data){
 for(var i=0; i<data.x.length;i++)
 {
    //console.log("x "+data.x[i]+" y "+data.y[i]);
    context.beginPath();
    context.moveTo(data.exx[i],data.exy[i]);
    context.lineTo(data.x[i],data.y[i]);
    context.stroke();  
 }
});
/*var mouseDown = false;

document.body.onmousedown = function() { 
  mouseDown=true;
}
document.body.onmouseup = function() {
  mouseDown=false;
}

function getMousePos(canvas, evt) {
    if(mouseDown)
    {
      var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
    }
           
}    */

var vykreslit = {
            x: 0,
            y: 0,
            exx:0,
            exy:0,
            barva:"black"            
};
var isDrawing;
canvas.onmousedown = function(e) {
  isDrawing = true;
  var rect = canvas.getBoundingClientRect();
  var mx=e.clientX - rect.left;
  var my=e.clientY - rect.top;
  vykreslit.exx=mx;
  vykreslit.exy=my;
  context.beginPath();
  context.moveTo(mx,my);
  
};
canvas.onmousemove = function(e) {
  if (isDrawing) {
    var rect = canvas.getBoundingClientRect();
    var mx=e.clientX - rect.left;
    var my=e.clientY - rect.top;
    
    vykreslit.x=mx;
    vykreslit.y=my;
    socket.emit("vykreslit", vykreslit);
    vykreslit.exx=mx;
    vykreslit.exy=my;
    
    context.strokeStyle = vykreslit.barva;
    context.lineTo(mx,my);
    context.stroke();

  }
};
canvas.onmouseup = function(e) {
  var rect = canvas.getBoundingClientRect();
    var mx=e.clientX - rect.left;
    var my=e.clientY - rect.top;
   vykreslit.x=mx;
    vykreslit.y=my;
    vykreslit.exx=mx;
    vykreslit.exy=my;
  socket.emit("vykreslit", vykreslit);
  isDrawing = false;
};

canvas.addEventListener("touchstart", handleStart, false);
canvas.addEventListener("touchend", handleEnd, false);
canvas.addEventListener("touchmove", handleMove, false);
var touchX,touchY;
function getTouchPos(e) {
        if (!e)
            var e = event;

        if (e.touches) {
            if (e.touches.length == 1) { // Only deal with one finger
                var touch = e.touches[0]; // Get the information for finger #1
                touchX=touch.pageX-touch.target.offsetLeft;
                touchY=touch.pageY-touch.target.offsetTop;
            }
        }
    }

function handleStart(e){
  isDrawing = true;
  getTouchPos(e);
  var mx=touchX;
  var my=touchY;
  vykreslit.exx=touchX;
  vykreslit.exy=touchY;
  
   context.strokeStyle = vykreslit.barva;
   context.beginPath();
  context.moveTo(mx,my);
  
  e.preventDefault();
}

function handleMove(e){
    if (isDrawing) {
    getTouchPos(e);
    var mx=touchX;
    var my=touchY;
    vykreslit.x=mx;
    vykreslit.y=my;
    socket.emit("vykreslit", vykreslit);
    vykreslit.exx=mx;
    vykreslit.exy=my;
    context.lineTo(mx,my);
    context.stroke();
    e.preventDefault();

  }
}

function handleEnd(e){
  isDrawing = false;
  getTouchPos(e);
    var mx=touchX;
    var my=touchY;
  vykreslit.x=mx;
    vykreslit.y=my;
    vykreslit.exx=mx;
    vykreslit.exy=my;
  socket.emit("vykreslit", vykreslit);
  e.preventDefault();
}

function vymazat()
{
  context.clearRect(0,0,canvas.width,canvas.height); 
  socket.emit("vymazat");
}

socket.on("vymazat", function(){
  context.clearRect(0,0,canvas.width,canvas.height); 
});