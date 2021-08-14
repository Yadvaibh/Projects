let constraint = { video:true};
let videoElement = document.querySelector("video");
let mediarecorder;
let recorderbutton = document.querySelector("#record") ;
let capturebutton = document.querySelector("#capture");
let gallerybtn = document.querySelector(".gallery-btn");
let recorderbuttonstate = false;
let filters = document.querySelectorAll(".filter");
let isFilterSelected = false;
let currentFilter = "";
let maxZoom = 3;
let minZoom = 1;
let currentZoom = 1; 

gallerybtn.addEventListener("click",function(e)
{
    window.location.assign("gallery.html");
})

document.querySelector(".zoomIn").addEventListener("click",function(e)
{
    if(currentZoom+0.1>maxZoom)
    {
        return ;
    }
    currentZoom = currentZoom + 0.1;
    videoElement.style.transform= `scale(${currentZoom})`;
})
document.querySelector(".zoomOut").addEventListener("click",function(e){
    if(currentZoom-0.1 <= minZoom)
    {
        return ;
    }
    currentZoom = currentZoom - 0.1;
    videoElement.style.transform= `scale(${currentZoom})`;
})

for(let i = 0 ; i<filters.length;i++)
{
    filters[i].addEventListener("click",onFilterSelected);
    
}
function onFilterSelected(e)
{   let bgcolor = e.target.style.backgroundColor;
    if(currentFilter == bgcolor)
    {
        return;
    }
    currentFilter = bgcolor;

    let filterdiv = document.createElement("div");
        filterdiv.classList.add("filter-div");
        filterdiv.style.backgroundColor=bgcolor;
       
   
    if(isFilterSelected){
        let currentFilter = document.querySelector(".filter-div");
        currentFilter.remove();
        document.body.append(filterdiv);
        }
else{
    
    document.body.append(filterdiv);
    isFilterSelected = true;
}
    
}
navigator.mediaDevices.getUserMedia(constraint).then(function(mediastream){
videoElement.srcObject = mediastream;
 mediarecorder = new MediaRecorder(mediastream);
 console.log(mediarecorder);
 mediarecorder.onstart = function(){

 };
 mediarecorder.onstop = function(){

 };
 mediarecorder.ondataavailable = function(e){
    let videoObject = new Blob([e.data],{type:"video/mp4"});
    // let videoURL = URL.createObjectURL(videoObject);
    // let aTag = document.createElement("a");
    // aTag.download = `video${Date.now()}`;
    // aTag.href = videoURL;
    // aTag.click();
    addMedia(videoObject,"video");

 };
});
recorderbutton.addEventListener("click",function(){
    if(recorderbuttonstate)
    {
        
        mediarecorder.stop();
        //recorderbutton.innerHTML = "record";
        recorderbuttonstate = false;

    }
    else{
        
        mediarecorder.start();
        //recorderbutton.innerHTML = "recording";
        recorderbuttonstate = true;
    }
});
capturebutton.addEventListener("click",function(){
    let canvas = document.createElement("canvas");
   
    canvas.width = 640; //video width
    canvas.height = 480; // video height

    let ctx = canvas.getContext("2d");
    ctx.translate(canvas.width/2,canvas.height/2);
    ctx.scale(currentZoom,currentZoom);
    ctx.translate(-canvas.width/2,-canvas.height/2);

    ctx.drawImage(videoElement, 0, 0);
    if(currentFilter!=""){
        ctx.fillStyle = currentFilter;
        ctx.fillRect(0,0,canvas.width,canvas.height);
    }
    //to store media in db
    let photoUrl = canvas.toDataURL("image/jpg");

    addMedia(photoUrl,"photo");
    
});

function addMedia(mediaUrl , mediaType)
{
    let txnObj = db.transaction("Media","readwrite");
    let mediaStore = txnObj.objectStore("Media");
    mediaStore.add({mid:Date.now(),type:mediaType,url:mediaUrl});
    txnObj.onerror = function(e)
    {
        alert('transaction failed');
    }
}