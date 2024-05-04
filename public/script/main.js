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