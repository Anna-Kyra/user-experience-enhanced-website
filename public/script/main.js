var checkboxes = document.querySelectorAll('input[type="checkbox"]')
var submit = document.querySelector('button')

checkboxes.forEach(checkbox => {
    this.addEventListener('click', function(){
        let geselecteerdeGoals = document.querySelectorAll('input[type="checkbox"]:checked');
        console.log(geselecteerdeGoals.length)
        if(geselecteerdeGoals.length >= 3) {
            submit.disabled = false
        }else{
            console.log('hi')
            submit.disabled = true
        }
    })
})


let upload = document.querySelector('input[type="file"]')
let profile = document.querySelector('.profile-picture')

upload.addEventListener('change', function(event) {
    const fileUrl = event.target.files[0]
    const objectUrl = window.URL.createObjectURL(fileUrl)
    // console.log(objectUrl)
    profile.style.setProperty('--upload', `url('${objectUrl}')`)
    // profile.style.setProperty('--upload', "blue")
})