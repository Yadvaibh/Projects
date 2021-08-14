let dbopenRequest = indexedDB.open("Gallery",1);
let db;

dbopenRequest.onsuccess = function(e){

    db = e.target.result;
    fetchMedia();

}
dbopenRequest.onupgradeneeded = function (e) {
    alert("Inside on upgrade needed !!");
    db = e.target.result;
    db.createObjectStore("Media", { keyPath: "mid" });
  };
  dbopenRequest.onerror = function(e)
  {
      console.log("error");
  }
document.querySelector(".back-btn").addEventListener("click",function(e){
    window.location.assign("./index.html");
})

function fetchMedia()
{
    let txnObj = db.transaction("Media","readonly");
    let mediaStore = txnObj.objectStore("Media");

    mediaStore.openCursor().onsuccess = function(e)
    {
        let cursor = e.target.result;
        if(cursor)
        {
            let mediaObj = cursor.value;
            if(mediaObj.type == "photo")
            {
                appendPhoto(mediaObj);
            }
            else{
                appendVideo(mediaObj);
            }
            cursor.continue();
        }
    };

}

function appendPhoto(mediaObj)
{
    let mediaDiv = document.createElement("div");
    mediaDiv.classList.add("media-div");
    mediaDiv.innerHTML = ` <img src="${mediaObj.url}" class = "media-img" alt="">
    <div class="options">
        <div class="download">Download</div>
        <div class="delete">Delete</div>
    </div>`;
    document.querySelector(".gallery").append(mediaDiv);
    mediaDiv.querySelector(".download").addEventListener("click",function(){
        downloadmedia(mediaObj);
    });
    mediaDiv.querySelector(".delete").addEventListener("click",function(){
        deletemedia(mediaObj,mediaDiv);
    });

}
function appendVideo(mediaObj)
{
    let mediaDiv = document.createElement("div");
    mediaDiv.classList.add("media-div");
    mediaDiv.innerHTML = ` <video src="${URL.createObjectURL(mediaObj.url)}"  controls autoplay loop class = "media-vid" ></video>
    <div class="options">
        <div class="download">Download</div>
        <div class="delete">Delete</div>
    </div>`;
    document.querySelector(".gallery").append(mediaDiv);
    
    mediaDiv.querySelector(".download").addEventListener("click",function(){
        downloadmedia(mediaObj);
    });
    mediaDiv.querySelector(".delete").addEventListener("click",function(){
        deletemedia(mediaObj,mediaDiv);
    });

}
function downloadmedia(mediaObj)
{   let aTag = document.createElement("a");
    
    if(mediaObj.type == "photo")
    {
        aTag.download = mediaObj.mid+".jpg"
        aTag.href = mediaObj.url;
    }
    else{
        aTag.download = mediaObj.mid+".mp4"
        aTag.href =URL.createObjectURL(mediaObj.url);
    }
    aTag.click();
}

function deletemedia(mediaObj,mediaDiv)
{
    let mid = mediaObj.mid;
    let txnObj = db.transaction("Media","readwrite");
    let mediaStore = txnObj.objectStore("Media");
    mediaStore.delete(mid);
    mediaDiv.remove();
}