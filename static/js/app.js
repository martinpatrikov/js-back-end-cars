const container = document.getElementById('card-container');

container.addEventListener('click', onClick);

function onClick(ev){
    if(ev.target.className == 'see-more'){
        const description = ev.target.parentNode.querySelector('.description');
        console.log(description)
        if(description.style.display == 'none' || description.style.display == ''){
            description.style.display = 'block';
            ev.target.innerText = 'Hide';
        }else{
            description.style.display = 'none';
            ev.target.innerText = 'Show more';
        }
    }
}