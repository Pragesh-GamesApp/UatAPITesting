let chai = require('chai') 
let expect = chai.expect
const { MongoClient } = require('mongodb');
require('dotenv').config()


// Create Instance of MongoClient for mongodb
const DBURI = process.env.DBLKURI
const client = new MongoClient(DBURI)
const dbName = "LogsUat";
const collectionName = "testing"
client.connect(DBURI)
.then(() => console.log('Database Connected Successfully'))
.catch(error => console.log('Failed to connect', error))
const db =  client.db(dbName)
const collection=  db.collection(collectionName)



async function getPlayerData(endPoint = ''){
    let baseUrl = process.env.GETPLAYERDATAAPI
    let url = baseUrl + endPoint
    let response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": (undefined !== undefined)?undefined : process.env.PLAYERDATAAPIKEY
        }
    })
    return response
}

// // Player Data API Testing (Check Object Property)

let PlayerIDs = ["230963","226302"]

describe("Player Data API ", ()=>{

    // let playerId = "226302"

    PlayerIDs.forEach((playerId)=>{

        describe(`Get ${process.env.GETPLAYERDATAAPI}${playerId}`, ()=>{
            let data
            let response
            let test
            before(async()=>{
            
            const result = await collection.find({"request.playerId":playerId}, {projection:{_id:0}}).sort({date: -1}).toArray()
            test = JSON.parse(JSON.stringify(result));
            // console.log(test);
            // console.log({result}, "collection")
            // console.log(result[0]._id.toString());
            response= await getPlayerData(playerId)
            data = await response.json()
            })
            it(" Response should have status 200",()=>{
                expect(response.status).to.be.eq(200)
            })
            
            it("Player Data API Response Should have equal to Data Base response.",()=>{
                expect(data.data).to.deep.eq(test)
            })
    
            it(`Data should have property date and its value should be String`,()=>{
                expect(data.pagedata[0]).to.have.property('date')
                expect(data.pagedata[0].date).to.be.a('string')
            })
    
            it(`Data should have property api and its value should be String`,()=>{
                expect(data.pagedata[0]).to.have.property('api')
                expect(data.pagedata[0].api).to.be.a('string')
            })
    
            it(`Data should have property ip and its value should be String`,()=>{
                expect(data.pagedata[0]).to.have.property('ip')
                expect(data.pagedata[0].date).to.be.a('string')
            })
            it(`Data should have property request and its value should be Object`,()=>{
                expect(data.pagedata[0]).to.have.property('request')
                expect(data.pagedata[0].request).to.be.a('object')
            })
            it(`Data should have property playerId and its value should be String`,()=>{
                expect(data.pagedata[0]).to.have.property('playerId')
                expect(data.pagedata[0].playerId).to.be.a('string')
            })
            it(`Data should have property response and its value should be Object`,()=>{
                expect(data.pagedata[0]).to.have.property('response')
                expect(data.pagedata[0].response).to.be.a('object')
            })
            
            it(`Data Should have property msg and value should be String`,()=>{
                expect(data).to.have.property('msg')
                expect(data.msg).to.be.a('string')
            })
        })
    })
    
})