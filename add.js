document.querySelector("#addIngredientBtn").addEventListener("click", async () => {
  const recipeName =document.querySelector("#recipeName").value.trim();
  const recipeId =document.querySelector("#recipeId").value.trim();
  if(recipeName!=="" && recipeId!==""){
    try{
      const res=await fetch("/addRecipe", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({recipeId,recipeName})
      });

      const result = await res.json();

      if(!res.ok){
        alert(result.error || "An error occurred");
        return;
      }

      alert(result.message);
      window.location.href=`fillRecipeDetail.html?id=${recipeId}`;
    }catch(error){
      console.error("Error adding recipe:",error);
      alert("Something went wrong while adding the recipe.");
    }
  }else{
    alert("Fill all details first");
  }
});