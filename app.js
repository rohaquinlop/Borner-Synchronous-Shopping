require('dotenv').config()
//const crypto = require('crypto')
const path = require('path')
const express = require('express')
const {shop} = require('./solution.js')
const bodyParser = require('body-parser')

const app = express()
const router = express.Router()
const PORT = process.env.PORT

//console.log(crypto.createHash('sha256').update(VALID_USERNAME).digest('hex'))

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(__dirname))

const VALID_USERNAME = process.env.VALID_USERNAME
const VALID_CHECKSUM = process.env.VALID_CHECKSUM

function isValidSession(username, checksum) {
  return username === VALID_USERNAME && checksum === VALID_CHECKSUM
}

router.get('/', (req, res) => {
  res.status(200)
  res.sendFile(path.join(__dirname+'/src/index.html'))
})

/**
 * Crea una ruta POST en el router con el endpoint '/parser' para procesar la entrada del problema,
 * en este caso la entrada que es un string es convertida a un arreglo de enteros
 * 
 * @param {Object} req - Objeto que contiene la información de la petición.
 * @param {Object} res - Objeto que contiene la información de la respuesta.
 * @returns {String} - Mensaje indicando que se ha enviado correctamente la información al parser.
 */

router.post('/process_form_input', (req, res) => {
  /*
  El input_problem es convertido a un arreglo de enteros, para esto se hacen varios pasos, el primero es quitar los caracteres especiales, tales como '\t', '\n'
  posteriormente se quitan todos los espacios y se separa por espacios. El arreglo de strings resultante es convertido a un arreglo de numberos
  */

  if( isValidSession(req.body.username, req.body.checksum) ) {
    let input_problem = req.body.input_problem.replace(/[^a-zA-Z0-9 ]/g, ' ').replace(/^\s+|\s+$/gm, '').split(' ').filter(num => num.length > 0).map((num) => parseInt(num))

    let n = input_problem[0]
    let m = input_problem[1]
    let k = input_problem[2]
    let i = 3

    let centers = []
    let roads = []

    for(let j = 0; j < n; j++) {
      tmp = []
      t = input_problem[i++]
      tmp.push(t)

      for(let k = 0; k < t; k++) {
        tmp.push(input_problem[i++])
      }

      centers.push(tmp)
    }

    for(let j = 0; j < m; j++) {
      u = input_problem[i++]
      v = input_problem[i++]
      w = input_problem[i++]

      roads.push([u, v, w])
    }

    centers = centers.map( (center) => center.join(" ") )
    const minimumTime = shop(n, k, centers, roads)
    
    res.status(200).send(`${minimumTime}`)

    res.json({minimumTime: minimumTime})
  }
  else {
    res.status(401).send('Nombre de usuario o checksum invalidos')
  }
})

router.post('/api/v1/synchronous_shopping', (req, res) => {

  if ( isValidSession(req.body.username, req.body.checksum) ) {
    let [n, m, k] = req.body.parameters.split(',').map((num) => parseInt(num))

    centers = req.body.shoping_centers.split('-').map( (center) => center.replace(',', ' ') )

    roads = req.body.roads.split('-').map((road) => road.split(','))
    roads = roads.map((road) => road.map((num) => parseInt(num)))

    const minimumTime = shop(n, k, centers, roads)

    res.status(200)
    res.json({minimumTime: minimumTime})
  }
  else {
    res.status(401).send('Nombre de usuario o checksum invalidos')
  }
})

app.use('/', router)

app.listen(PORT, (error) => {
  if(!error)
    console.log("Server is Successfully Running, and App is listening on port " + PORT)
  else
    console.log("Error ocurred, server can't start", error)
})
