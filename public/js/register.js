let foto_btn = document.getElementById('foto');
let chosen_image = document.getElementById('chosen_image');

foto_btn.addEventListener('change', ()=> {  
  let reader = new FileReader();
  reader.readAsDataURL(foto_btn.files[0]); 
  reader.onload = ()=>{
    chosen_image.setAttribute('src', reader.result); 
  }
})


