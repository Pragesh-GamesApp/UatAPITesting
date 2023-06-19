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




// const db = client.db(dbName)
// const collection = db.collection(collectionName)


async function getPastGameApis(gameId){
    let url = process.env.GETPASTAPIS
    const response = await fetch(url,{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify({
            gameId: gameId
        })
    });
    return response

}


describe("Get Past API", ()=>{
    
    describe(`Post ${process.env.GETPASTAPIS}${gameId}`, ()=>{
        let data
        let response
        let passed
        let failed
        before(async()=>{
            const passedData = await PassedCollection.find({gameRoundId: gameId}, {projection:{_id:0}}).sort({time: -1}).toArray()
            const failedData = await failedCollection.find({gameRoundId: gameId}, {projection:{_id:0}}).sort({time: -1}).toArray()
            // const dbData = result.json()
            passed = JSON.parse(JSON.stringify(passedData));
            failed = JSON.parse(JSON.stringify(failedData));

            // console.log(passed, "DataBase Passed Response")
            // console.log(failed, "DataBase Failed Response")
            response= await getPastGameApis(gameId)
            data = await response.json()
            // console.log(data.data[0], "ID Data")
        })
        it(" Response should have status 200",()=>{
            expect(response.status).to.be.eq(200)
        })

        it("Get Past API Data API Response Should have equal to Data Base response.",()=>{
            expect(data.data.passed).to.deep.eq(passed)
        })

        it("Get Past API Data API Response Should have equal to Data Base response.",()=>{
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