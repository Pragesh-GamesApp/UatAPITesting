let chai = require('chai') 
let expect = chai.expect
const { MongoClient } = require('mongodb');
require('dotenv').config()

let gameId = "5hucnN-igPeuJsp";

const DBURI = process.env.DBURI

// // Create Instance of MongoClient for mongodb
const client = new MongoClient(DBURI)
const dbName = "gameDB";
const passedCollectionName = "GsSuccessAPILogs"
const failedCollectionName = "GServerAPILogs"
            // Connect to database
client.connect(DBURI)
    .then(() => console.log('Connected Successfully'))
    .catch(error => console.log('Failed to connect', error))

const db = client.db(dbName)
const PassedCollection= db.collection(passedCollectionName)
const failedCollection = db.collection(failedCollectionName)




async function fetchApiData(endPoint = ''){
    let baseUrl = process.env.FETCHAPIDATAAPI
    let url = baseUrl + endPoint
    // let APIKEY= req.headers.x-api-key
    // if(APIKEY !== "null"){

    // }
    let response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": (undefined !== undefined)?undefined : process.env.APIDATAKEY
        }
    })
    return response
}

describe("FetchApiData", ()=>{
    // let gameId = "5hucnN-igPeuJsp";
    describe(`Get ${process.env.FETCHAPIDATAAPI}${gameId}`, ()=>{
        let data
        let response
        let passed
        let failed
        before(async()=>{
            const passedData = await PassedCollection.find({gameRoundId: gameId}, {projection:{_id:0}}).sort({time: -1}).toArray()
            const failedData = await failedCollection.find({gameRoundId: gameId}, {projection:{_id:0}}).sort({time: -1}).toArray()
            await client.close()
            // const dbData = result.json()

            passed = JSON.parse(JSON.stringify(passedData));
            failed = JSON.parse(JSON.stringify(failedData));
            
            response= await fetchApiData(gameId)
            data = await response.json()
            // console.log(data.data[0], "ID Data")
        })
        it(" Response should have status 200",()=>{
            expect(response.status).to.be.eq(200)
        })

        it("Fetch API Data API Response Should have equal to Data Base response.",()=>{
            expect(data.data.passed).to.deep.eq(passed)
        })

        it("Fetch API Data API Response Should have equal to Data Base response.",()=>{
            expect(data.data.failed).to.deep.eq(failed)
        })

        it(`Data should have property passed and its value should be Array`,()=>{
            expect(data.data).to.have.property('passed')
            expect(data.data.passed).to.be.a('array')
        })

        it(`Data should have property failed and its value should be Array`,()=>{
            expect(data.data).to.have.property('failed')
            expect(data.data.failed).to.be.a('array')
        })

        it(`Data should have property msg and its value should be String`,()=>{
            expect(data).to.have.property('msg')
            expect(data.msg).to.be.a('string')

        })

    })
})