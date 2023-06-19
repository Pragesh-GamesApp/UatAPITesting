let chai = require('chai') 
let expect = chai.expect
const { MongoClient } = require('mongodb');
require('dotenv').config()

const DBURI = process.env.DBURI;

// Create Instance of MongoClient for mongodb
const client = new MongoClient(DBURI)
const dbName = "gameDB";
const collectionName = "GameRoundReports"
// Connect to database
client.connect(DBURI)
    .then(() => console.log('Connected Successfully'))
    .catch(error => console.log('Failed to connect', error))

const db = client.db(dbName)
const collection=  db.collection(collectionName)


async function fetchGameReportData(count, skip){
    let url = `${process.env.FETCHGAMEREPORTAPI}?count=${count}&skip=${skip}`
    const response = await fetch(url,{
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    return response

}


describe("FetchGameReport", ()=>{
    let count = 20
    let skip = 0
    
    describe(`Get ${process.env.FETCHGAMEREPORTAPI}?count=${count}&skip=${skip}`, ()=>{
        let data
        let response
        let test
        before(async()=>{
            const result = await collection.find({}, {projection:{_id:0}}).limit(count).skip(skip).sort({time:-1}).toArray()
            test = JSON.parse(JSON.stringify(result));
            // console.log(test, "collection")
            response= await fetchGameReportData(count, skip)
            data = await response.json()
            // console.log(data, "API Response")
            
        })
        it(" Response should have status 200",()=>{
            expect(response.status).to.be.eq(200)
        })
        
        it("Player Data API Response Should have equal to Data Base response.",()=>{
            expect(data.data).to.deep.eq(test)
        })

        it(`Data should have property report and its value should be Object`,()=>{
            expect(data.data[0]).to.have.property('report')
            expect(data.data[0].report).to.be.a('object')

        })

        it(`Data should have property time and its value should be String`,()=>{
            expect(data.data[0]).to.have.property('time')
            expect(data.data[0].time).to.be.a('string')

        })
        it(`Data should have property serverId and its value should be String`,()=>{
            expect(data.data[0]).to.have.property('serverId')
            expect(data.data[0].serverId).to.be.a('string')

        })
        it(`Data should have property gameRoundId and its value should be String`,()=>{
            expect(data.data[0]).to.have.property('gameRoundId')
            expect(data.data[0].gameRoundId).to.be.a('string')

        })

        it(`Data should have property msg and its value should be String`,()=>{
            expect(data).to.have.property('msg')
            expect(data.msg).to.be.a('string')

        })

        it(`Data should have property count and its value should be Number`,()=>{
            expect(data).to.have.property('count')
            expect(data.count).to.be.a('number')

        })

    })
})

