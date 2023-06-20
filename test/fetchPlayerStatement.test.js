let chai = require('chai') 
let expect = chai.expect
const { MongoClient } = require('mongodb');
require('dotenv').config()

let userId = "226303"
// Create Instance of MongoClient for mongodb
const DBURI = process.env.DBLKURI
const client = new MongoClient(DBURI)
const dbName = "LogsUat";
const collectionName = "statementlog_"+Math.floor(userId/10000)
// console.log(collectionName)
client.connect(DBURI)
.then(() => console.log('Database Connected Successfully'))
.catch(error => console.log('Failed to connect', error))
const db =  client.db(dbName)
const collection=  db.collection(collectionName)
// let count = await collection.countDocuments()



async function fetchPlayerStatement(endPoint = ''){
    let baseUrl = process.env.FETCHPLAYERSTATEMENTAPI
    let url = baseUrl + endPoint
    let response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": (undefined !== undefined)?undefined : process.env.PLAYERSTATEMENTAPIKEY
        }
    })
    
    return response
}


// fetch Player Statement API Testing (Check Object Property)

describe("Fetch Player Statement API", ()=>{

    // let endPoint = "229710"
    describe(`Get ${process.env.FETCHPLAYERSTATEMENTAPI}${userId}`, ()=>{
        let data
        let response
        let test
        before(async()=>{
            const result = await collection.find({playerId: userId}, {projection:{_id:0}}).toArray()
            await client.close()
            // const dbData = result.json()
            test = JSON.parse(JSON.stringify(result));
            // console.log(test, "test Data")

            response= await fetchPlayerStatement(userId)
            data = await response.json()
            // console.log(data.data[0], "ID Data")
        })
        it(" Response should have status 200",()=>{
            expect(response.status).to.be.eq(200)
        })

        it("Fetch Player Statement API Response Should have equal to Data Base response.",()=>{
            expect(data.data).to.deep.eq(test)
        })


        it(`Data should have property playerId and its value should be String`,()=>{
            expect(data.data[0]).to.have.property('playerId')
            expect(data.data[0].playerId).to.be.a('string')
        })

        it(`Data should have property statements and its value should be Array`,()=>{
            expect(data.data[0]).to.have.property('statements')
            expect(data.data[0].statements).to.be.a('array')
        })

        it(`Data Should have property msg and value should be Success`,()=>{
            expect(data).to.have.property('msg')
            expect(data.msg).to.be.a('string')
        })
    })
})

