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
        fetchJson(apiUrl + `/hf_stakeholders/?filter={"company_id":"${request.params.id}"}`)
    ]).then(([companiesData, stakeholdersData]) => {
        response.render('vragenlijst-gegevens', {
            sdgs: sdgData.data,
            companies: companiesData.data
        })
    })
})

app.get('/klant-toevoegen-sdgs/:id', function (request, response) {  
    Promise.all([
        fetchJson(apiUrl + '/hf_companies/' + request.params.id + '/?fields=*,logo.id,logo.height,logo.width'),
        fetchJson(apiUrl + `/hf_stakeholders/?filter={"company_id":"${request.params.id}"}`)
    ]).then(([companiesData, stakeholdersData]) => {
        response.render('vragenlijst-sdgs', {
            sdgs: sdgData.data,
            companies: companiesData.data
        })
    })
})

app.get('/klant-toevoegen-scores/:id', function (request, response) {  
    Promise.all([
        fetchJson(apiUrl + '/hf_companies/' + request.params.id + '/?fields=*,logo.id,logo.height,logo.width'),
        fetchJson(apiUrl + `/hf_stakeholders/?filter={"company_id":"${request.params.id}"}`)
    ]).then(([companiesData, stakeholdersData]) => {
        response.render('vragenlijst-scores', {
            sdgs: sdgData.data,
            companies: companiesData.data
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