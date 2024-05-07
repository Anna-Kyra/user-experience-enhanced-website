var checkboxes = document.querySelectorAll('input[type="checkbox"]')
var checkboxOne = document.querySelector('input[type="checkbox"]:nth-of-type(1)')
var submit = document.querySelector('button')
var selecteerDrie = document.querySelector('.selecteer_3')

checkboxes.forEach(checkbox => {
    this.addEventListener('click', function(){
        let geselecteerdeGoals = document.querySelectorAll('input[type="checkbox"]:checked');
        console.log(geselecteerdeGoals.length)

        if(geselecteerdeGoals.length >= 3) {
            selecteerDrie.classList.remove("fat_wiggle")
            console.log('jup')
        }

        submit.addEventListener('click', function(){
            let geselecteerdeGoals = document.querySelectorAll('input[type="checkbox"]:checked');
            console.log(geselecteerdeGoals.length)
            if(geselecteerdeGoals.length < 3) {
                checkboxOne.setCustomValidity("Selecteer minimaal 3 items")
                checkboxOne.reportValidity()
                console.log('lager dan 3')
                selecteerDrie.classList.add("fat_wiggle")
            }else{
                checkboxOne.setCustomValidity("");
                console.log('hoger dan 3')
                // selecteerDrie.classList.remove('fat_wiggle')
            }
        })
    })
})

// submit.forEach(checkbox => {
//     this.addEventListener('click', function(){
//         let geselecteerdeGoals = document.querySelectorAll('input[type="checkbox"]:checked');
//         console.log(geselecteerdeGoals.length)
//         if(geselecteerdeGoals.length >= 3) {
//             checkboxOne.setCustomValidity("This field cannot be left blank")
//         }else{
//             console.log('hi')
//             submit.disabled = true
//         }
//     })
// })

let upload = document.querySelector('input[type="file"]')
let profile = document.querySelector('.profile-picture')

upload.addEventListener('change', function(event) {
    const fileUrl = event.target.files[0]
    const objectUrl = window.URL.createObjectURL(fileUrl)
    // console.log(objectUrl)
    profile.style.setProperty('--upload', `url('${objectUrl}')`)
    // profile.style.setProperty('--upload', "blue")
})