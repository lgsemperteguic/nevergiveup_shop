document.addEventListener("DOMContentLoaded", function(){
 
    if("indexedDB" in window) {
        console.log("YES!!! I CAN DO IT!!! WOOT!!!");
    } else {
        console.log("I has a sad.");
    }
 
},false);