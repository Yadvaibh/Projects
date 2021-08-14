let dbOpenRequest = window.indexedDB.open("Gallery",1);
let db;

dbOpenRequest.onupgradeneeded = function(e)
{
    db = e.target.result;
    db.createObjectStore("Media",{keyPath:"mid"});
};
dbOpenRequest.onsuccess = function(e)
{
    db = e.target.result;
};
dbOpenRequest.onerror = function(e)
{
    alert("error opening the database");
};

