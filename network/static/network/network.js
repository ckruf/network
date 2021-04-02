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
});
