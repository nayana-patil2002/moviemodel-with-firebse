 
 let cl=console.log;
 
 const showformBtn=document.getElementById("showformBtn");
 const modelClose= [...document.querySelectorAll(".modelClose")]
 const backdrop=document.getElementById("backdrop");
 const movieModel=document.getElementById("movieModel")
  const movieForm=document.getElementById("movieForm");
  const movieConatiner=document.getElementById("movieConatiner");
  const movieTitleControl=document.getElementById("movieTitle")
  const movieURLControl=document.getElementById("movieURL")
  const movieDescrControl=document.getElementById("movieDescr")
  const movieRatingControl=document.getElementById("movieRating")
  const movieAddBTN=document.getElementById("movieAddBTN");
  const movieupdateBTN=document.getElementById("movieupdateBTN")

  const loader=document.getElementById("loader")

   Base_URL=`https://moviemodel-crud-with-firebase-default-rtdb.firebaseio.com`
   post_URL=`${Base_URL}/posts.json`


     const snackabar= (msg, icon) =>{
             Swal.fire({
                    title: msg,
                    icon: icon,
                    timer:3000,
                    });
     }



     const objToarr= (obj) =>{
        let arr=[]
        for (const key in obj) {
            arr.push({...obj[key], id:key})
        }
        return arr
     }

     const setRating = (rating)=>{
        if(rating>4){
            return "bg-success"
            
        }else if(rating>3 && rating<=4){
            return "bg-warning"
        }else{
             return "bg-danger"
        }
     }


     const onEdit = async(ele)=>{
        editiD=ele.closest(".col-md-3").id;
        cl(editiD);

        localStorage.setItem("editiD", editiD)

        edit_URL=`${Base_URL}/posts/${editiD}.json`

        let res=await makeApIcall(edit_URL, "GET")
        cl(res)
        if(res){
            movieTitleControl.value=res.title;
            movieURLControl.value=res.imgURL;
            movieDescrControl.value=res.description;
            movieRatingControl.value=res.rating;
            movieAddBTN.classList.add("d-none")
            movieupdateBTN.classList.remove("d-none")
        }

         onToggle()
     }


     const onRemove = async (ele) =>{
        let result= await Swal.fire({
            title: "Do you want to Remove This post?",
            showCancelButton: true,
            confirmButtonText: "Remove",
               })
               cl(result)
  
               if(result.isConfirmed){
                       removeID=ele.closest(".col-md-3").id;
                        cl(removeID)

                    remove_URL=`${Base_URL}/posts/${removeID}.json`

                    let res= await makeApIcall(remove_URL, "DELETE")
                    ele.closest(".col-md-3").remove()
                    snackabar(`a movie is ${removeID} id remove successfully`, "success")
               }
         
       
     }





       const crateCards =(arr) =>{
          let result=''
           arr.forEach(ele=>{
               result+=`
                    <div class="col-md-3" id="${ele.id}">
              <figure class="movieCard">
                <img src="${ele.imgURL}"
                 alt="${ele.title}"
                 title="${ele.title}"
                >
                  <figcaption>
                     <div class="ratingInfo">
                         <div class="row">
                             <div class="col-10">
                                <h5>${ele.title}</h5>
                             </div>
                             <div class="col-md-2">
                                <small class="rating ${setRating(ele.rating)} p-2">${ele.rating}</small>
                             </div>
                         </div>
                     </div>
                     <div class="movieinfo">
                        <h2>${ele.title}</h2>
                        <p class="overView"> ${ele.description}</p>
                     </div>

                     <div class="action">
                        <button type="button" class="btn btn-outline-success" onclick="onEdit(this)">Edit</button>
                      <button type="button" class="btn btn-outline-danger" onClick="onRemove(this)">Remove</button>
                     </div>
                </figcaption>
              </figure>
           </div>
                     
               `
           })

            movieConatiner.innerHTML=result;
       }

   const makeApIcall= async(url, methodName, msgBody)=>{
        try{
            msgBody=msgBody? JSON.stringify(msgBody):null;

            loader.classList.remove("d-none")

            let res= await fetch(url,{
                method:methodName,
                body:msgBody,
                headers:{
                    "content":"applicatin/json",
                    Auth:"token from LS"
                }
            })
            return res.json()
        }catch(err){
            cl(err)
        }finally{
            loader.classList.add("d-none")
        }


   }





   const fetchAllposts = async() =>{
       let res=await makeApIcall(post_URL,"GET")
       cl(res)
        let movieArr=objToarr(res)

        crateCards(movieArr)
        
    }

   fetchAllposts()
 



  const onMovieAdd = async (eve) =>{
     eve.preventDefault();

     movieObj={
           title:movieTitleControl.value,
           imgURL: movieURLControl.value,
           description:movieDescrControl.value,
           rating:movieRatingControl.value,
     }

     cl(movieObj)
     movieForm.reset()

      let res= await makeApIcall( post_URL, "POST",  movieObj )

      //create cards

      let card=document.createElement("div");
      card.className="col-md-3"
      card.id=res.name;
      card.innerHTML=`
                     <figure class="movieCard">
                <img src="${ movieObj.imgURL}"
                 alt="${movieObj.title}"
                 title="${ movieObj.title}"
                >
                  <figcaption>
                     <div class="ratingInfo">
                         <div class="row">
                             <div class="col-10">
                                <h5>${ movieObj.title}</h5>
                             </div>
                             <div class="col-md-2">
                                <small class="rating ${setRating(movieObj.rating)} p-2">${ movieObj.rating}</small>
                             </div>
                         </div>
                     </div>
                     <div class="movieinfo">
                        <h2>${ movieObj.title}</h2>
                        <p class="overView"> ${ movieObj.description}</p>
                     </div>

                     <div class="action">
                        <button type="button" class="btn btn-outline-success" onclick="onEdit(this)">Edit</button>
                      <button type="button" class="btn btn-outline-danger" onClick="onRemove(this)">Remove</button>
                     </div>
                </figcaption>
              </figure>
      
      
      
      `
      movieConatiner.prepend(card)
       onToggle()

        snackabar(`a movie is ${movieObj.title} added successfully`, "success")
  }
   


  const onupdateMovie= async()=>{
    let updateID= localStorage.getItem("editiD")
     updateOBJ={
          title:movieTitleControl.value,
           imgURL: movieURLControl.value,
           description:movieDescrControl.value,
           rating:movieRatingControl.value,
     }
     movieForm.reset()

     update_URL=`${Base_URL}/posts/${updateID}.json`


     let res=await makeApIcall(update_URL, "PATCH", updateOBJ);

      let card=document.getElementById(updateID)
     //now updated indivisual ele

     card.querySelector("img").src=updateOBJ.imgURL;
     card.querySelector("img").alt=updateOBJ.title;
     card.querySelector("img").title=updateOBJ.title;

     card.querySelector("h5").textContent=updateOBJ.title;
     card.querySelector(".rating").textContent=updateOBJ.rating;
      card.querySelector(".rating").classname=`rating ${setRating(updateOBJ.rating)} p-2`;
      card.querySelector(".movieinfo h2").textContent=updateOBJ.title;
      card.querySelector(".movieinfo .overView").textContent=updateOBJ.description;
       movieAddBTN.classList.remove("d-none");
      movieupdateBTN.classList.add("d-none");

       onToggle()
     
      snackabar(`a movie is ${updateID} id updated successfully`, "success")

  }






   

   const onToggle=()=>{
    backdrop.classList.toggle("active");
    movieModel.classList.toggle("active")
   }


 movieupdateBTN.addEventListener("click", onupdateMovie)
  movieForm.addEventListener("submit", onMovieAdd)
 showformBtn.addEventListener("click", onToggle)
 modelClose.forEach(ele=>ele.addEventListener("click", onToggle))