document.querySelector("#btn").addEventListener("click",()=>{
    if(document.querySelector("#roleInput").value==="Operator"){
        window.location.href = "signin.html";
    }
    else{
        alert("Please select Operator");
    }
});