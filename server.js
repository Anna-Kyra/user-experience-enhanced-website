import express from 'express'
import fetchJson from './helpers/fetch-json.js'

const app = express()
app.set('view engine', 'ejs')
app.set('views', './views')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.use(express.json())

// Basis endpoints
const apiUrl = 'https://fdnd-agency.directus.app/items'
const sdgData = await fetchJson(apiUrl + '/hf_sdgs/?fields=*,icon.id,icon.height,icon.width')

const companiesData = await fetchJson(apiUrl + '/hf_companies/?fields=*,logo.id,logo.height,logo.width')
const stakeholdersData = await fetchJson(apiUrl + '/hf_stakeholders/?fields=*.*') 


// ROUTES
app.get('/', function (request, response) {  
    response.render('index', {
        sdgs: sdgData.data,
        companies: companiesData.data
    })
})

app.get('/profile-edit/:id', function (request, response) {  
    response.render('profile-edit', {
        companies: companiesData.data
    })
})

app.get('/dashboard/:id', function (request, response) {
    Promise.all([
        fetchJson(apiUrl + '/hf_companies/' + request.params.id + '/?fields=*,logo.id,logo.height,logo.width'),
        fetchJson(apiUrl + `/hf_stakeholders/?filter={"company_id":"${request.params.id}"}`)
    ]).then(([companiesData, stakeholdersData]) => {
        response.render('dashboard', {
            sdgs: sdgData.data,
            companies: companiesData.data
        })
    })
})

app.get('/klant-toevoegen-gegevens/:id', function (request, response) {  
    Promise.all([
        fetchJson(apiUrl + '/hf_companies/' + request.params.id + '/?fields=*,logo.id,logo.height,logo.width'),
        fetchJson(apiUrl + `/hf_stakeholders/?filter={"company_id":"${request.params.id}","id":"39"}`)
    ]).then(([companiesData, klantenData]) => {
        response.render('vragenlijst-gegevens', {
            sdgs: sdgData.data,
            companies: companiesData.data,
            klantA: klantenData.data
        })
    })
})

app.get('/klant-toevoegen-sdgs/:id', function (request, response) {  
    Promise.all([
        fetchJson(apiUrl + '/hf_companies/' + request.params.id + '/?fields=*,logo.id,logo.height,logo.width'),
        fetchJson(apiUrl + `/hf_stakeholders/?filter={"company_id":"${request.params.id}","id":"39"}`)
    ]).then(([companiesData, klantenData]) => {
        response.render('vragenlijst-sdgs', {
            sdgs: sdgData.data,
            companies: companiesData.data,
            klantA: klantenData.data
        })
    })
})

app.post('/klant-toevoegen-scores/:id', (request, response) => { //post route naar / met response request
    console.log(request.body); // log request body in console
    const sdgId = request.body.sdg;
    const selectSdgId = request.body.selectSdg; // haal sdg uit request body
    // console.log(sdgId);


    
    if (sdgId) {
        request.body.sdg.forEach(async function(sdg) {
            await fetch('https://fdnd-agency.directus.app/items/hf_scores', {
                method: 'POST',
                body: JSON.stringify({
                sdg_id: sdg,
                stakeholder_id: request.body.stakeholder_id, // <-- Hier wil je iets dynamisch, eigenlijk
                score: 0
                }),
                headers: {
                'Content-type': 'application/json; charset=UTF-8'
                }
            })
        })
        response.redirect(`/klant-toevoegen-scores/${request.params.id}?sdgIds=${sdgId}`); // redirect naar scoreboard net de sdgId
    }
    if (selectSdgId) {
        request.body.selectSdg.forEach(async function(selectSdg) {
            await fetch('https://fdnd-agency.directus.app/items/hf_scores', {
                method: 'POST',
                body: JSON.stringify({
                    sdg_id: request.body.sdg_id,
                    stakeholder_id: request.body.stakeholder_id, // <-- Hier wil je iets dynamisch, eigenlijk
                    score_id: selectSdg
                }),
                headers: {
                'Content-type': 'application/json; charset=UTF-8'
                }
            })
        })
        console.log(request.body.sdg_id)
        console.log(request.body.stakeholder_id)
        console.log(request.body.selectSdg)
        response.redirect(`/klant-toevoegen-scores/${request.params.id}?sdgIds=${request.body.sdg_id}`); // redirect naar scoreboard net de sdgId
    } else {
        response.redirect('/klant-toevoegen-sdgs/:id?error=true'); // brengt error
    }


})

app.get('/klant-toevoegen-scores/:id', function (request, response) {  
    const sdgIds = request.query.sdgIds.split(','); // split sdgIds als een array
    const filteredSdgs = sdgData.data.filter(sdg => sdgIds.includes(sdg.number.toString())); // convert sdg.number to string before checking if it's in sdgIds
    // console.log(sdgData.data)
    Promise.all([
        fetchJson(apiUrl + '/hf_companies/' + request.params.id + '/?fields=*,logo.id,logo.height,logo.width'),
        fetchJson(apiUrl + `/hf_stakeholders/?filter={"company_id":"${request.params.id}","id":"39"}`)
    ]).then(([companiesData, klantenData]) => {
        // console.log(klantenData)
        response.render('vragenlijst-scores', {
            sdgs: filteredSdgs,
            companies: companiesData.data,
            klantA: klantenData.data
        })
    })
})

// Stel het poortnummer in waar express op moet gaan luisteren
app.set('port', process.env.PORT || 8001)

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console en geef het poortnummer door
    console.log(`Application started on http://localhost:${app.get('port')}`)
})