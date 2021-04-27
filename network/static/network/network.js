document.addEventListener('DOMContentLoaded', function() {
    textarea = document.querySelector('#posttextfield');
    textarea.addEventListener('input', autoResize, false);

    function autoResize() {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    }

    const newpostbtn = document.querySelector('#addnew');
    const newpostarea = document.querySelector('#newpost');
    const submitbtn = document.querySelector('#submitpost');
    const postareastyle = getComputedStyle(newpostarea);

    newpostbtn.onclick = function() {       
        if (postareastyle.height == '0px'){
            console.log("If condition entered");
            newpostarea.style.animationPlayState = 'running';
            newpostbtn.innerHTML = '-';
            textarea.removeAttribute("disabled");
            submitbtn.removeAttribute("disabled");
            textarea.style.cursor = 'text';
            submitbtn.style.cursor = 'pointer';
            newpostarea.addEventListener('animationend', () => {
                newpostarea.style.animationName = 'hidepost';
                newpostarea.style.animationPlayState = 'paused';
            })
        } else {
            console.log("Else condition entered");
            newpostarea.style.animationPlayState = 'running';
            newpostbtn.innerHTML = '+';
            textarea.setAttribute("disabled","");
            submitbtn.setAttribute("disabled", "");
            textarea.style.cursor = 'default';
            submitbtn.style.cursor = 'default';
            newpostarea.addEventListener('animationend', () => {
                newpostarea.style.animationName = 'showpost';
                newpostarea.style.animationPlayState = 'paused';
            });
        }
        }

    const searchbtn = document.querySelector('#searchbtn');
    const searchfield = document.querySelector('#searchfield');
    const fieldstyle = getComputedStyle(searchfield);

    searchbtn.onclick = function() {
        if (fieldstyle.width == '26px'){
            console.log("First if condition entered.");
            searchfield.style.animationPlayState = 'running';
            searchfield.removeAttribute("disabled");
            searchfield.style.cursor = 'text';
            searchbtn.style.borderTopLeftRadius = '0px';
            searchbtn.style.borderBottomLeftRadius = '0px';
            searchfield.addEventListener('animationend', () => {
                searchfield.style.animationName = 'hidebar';
                searchfield.style.animationPlayState = 'paused';
            })
        }
        else if (fieldstyle.width == '250px' && searchfield.value == "") {
            console.log("Second if condition entered.");
            searchfield.style.animationPlayState = 'running';
            searchfield.setAttribute("disabled", "");
            searchfield.style.cursor = 'default';
            searchbtn.style.borderTopLeftRadius = '5px';
            searchbtn.style.borderBottomLeftRadius = '5px';
            searchfield.addEventListener('animationend', () => {
                searchfield.style.animationName = 'showbar';
                searchfield.style.animationPlayState = 'paused';
            })
        }
        else if (fieldstyle.width == '250px' && searchfield.value != "") {
            console.log("Else condition entered.")
        }
    }

    searchfield.addEventListener("keyup", autocomplete);
    searchfield.addEventListener("click", autocomplete);

  function autocomplete(){
      var currentFocus;
        //searchfield.addEventListener("input", function(e) {
            val = this.value;
            if (val == "") {
                closeAllLists();
                return false;
            }
            //if (!val) {return false;}
            closeAllLists();
            currentFocus = -1;
            fetch(`/suggest/${val}`)
            .then(response => response.json())
            .then(suggestions => {
                suggestions.forEach(function (suggestions, index) {
                    var b = document.createElement("a");
                    b.setAttribute("href", `/user/${suggestions.profileURL}`);
                    b.setAttribute("id", `suggestion${index}`);
                    b.classList.add("list-group-item-action");
                    b.classList.add("result");
                    b.style.left = '0';
                    b.style.top = `${38 + (index * 30)}px`
                    b.innerHTML = "<strong>" + suggestions.username.substr(0, val.length) + "</strong>";
                    b.innerHTML += suggestions.username.substr(val.length);
                    //b.innerHTML += "<input type='hidden' value='" + suggestions.username + "'>";
                    document.querySelector('#results').appendChild(b)
                    });
               
            })  
  
    }
    function closeAllLists() {
        document.querySelector('#results').innerHTML = '';
    }

    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });

    var elements = document.getElementsByClassName("like");

    Array.from(elements).forEach(function(element) {
        element.addEventListener('click', function(){
            like(element.id);
        });
    })

    /*The argument passed to the function is the HTML id of the Like, which has the form like1, like2, like3 and so on.
    The number is the ID of the post that the like is associated with - the primary key of the Post in the database.
    We will therefore extract the ID of the post using the substring function and then use it.*/
    function like(id) {
        console.log("Function run");
        //id = id.substr(4);
        var postid = parseInt(id.substr(4));
        const htmllike = document.querySelector(`#${id}`);
        const likecountdiv = document.querySelector(`#likecount${postid}`);
        var likecount = parseInt(likecountdiv.innerHTML.substr(0,1));
        console.log(`id is ${id}, postid is ${postid}`);
        if (htmllike.innerHTML == 'Like') {
            fetch(`/like/${postid}`, {
                method:"POST"
            })
            .then(response => console.log(response))
            .then(result => {
                console.log(result);
            });
            htmllike.innerHTML = 'Unlike';
            likecount = likecount + 1;
        }
        else {
            fetch(`unlike/${postid}`, {
                method:"POST"
            })
            htmllike.innerHTML = 'Like';
            likecount = likecount - 1;
        }
        if (likecount == 1){
            likecountdiv.innerHTML = `${likecount} like`;
        } else {
            likecountdiv.innerHTML = `${likecount} likes`
        }

    }
    
});
