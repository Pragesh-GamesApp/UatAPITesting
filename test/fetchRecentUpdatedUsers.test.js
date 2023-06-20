let chai = require('chai') 
let expect = chai.expect
require('dotenv').config()

let data = {
    "data": [
    {
    "userId": 263086,
    "state": 0,
    "serverAddress": "",
    "tableType": -1,
    "entryFee": -1,
    "time": "2023-06-05T11:56:51.430Z"
    },
    {
    "userId": 230963,
    "state": 0,
    "serverAddress": "",
    "tableType": -1,
    "entryFee": -1,
    "time": "2023-06-05T09:38:52.370Z"
    },
    {
    "userId": 230999,
    "state": 0,
    "serverAddress": "",
    "tableType": -1,
    "entryFee": -1,
    "time": "2023-06-05T08:13:28.270Z"
    }
    ]
}

async function fetchRecentUpdatedUsers(){
    let url = process.env.FETCHRECENTUPDATEDUSERSAPI
    let response = await fetch(url,{
        method: "GET",
        headers: {
            "Content-Type": "text",
            "x-api-key": (undefined !== undefined)?undefined : process.env.RECENTUPDATEUSERSAPIKEY
        }
    })
    return response
}


describe("Recent Updated Users", ()=>{

    describe(`Get ${process.env.FETCHRECENTUPDATEDUSERSAPI}`, ()=>{
        let data
        let response
        before(async()=>{
            response= await fetchRecentUpdatedUsers()
            data = await JSON.parse(JSON.stringify(response))
            // console.log(data.data[0], "ID Data")
        })
        it(" Response should have status 200",()=>{
            expect(response.status).to.be.eq(200)
        })

        it(`Data should have property userId and its value should be Number`,()=>{
            expect(data.data[0]).to.have.property('userId')
            expect(data.data[0].userId).to.be.a('number')

        })

        it(`Data should have property state and its value should be String`,()=>{
            expect(data.data[0]).to.have.property('state')
            expect(data.data[0].state).to.be.a('number')
        })

        it(`Data should have property serverAddress and its value should be String`,()=>{
            expect(data.data[0]).to.have.property('serverAddress')
            expect(data.data[0].serverAddress).to.be.a('string')
        })

        it(`Data should have property tableType and its value should be Number`,()=>{
            expect(data.data[0]).to.have.property('tableType')
            expect(data.data[0].tableType).to.be.a('number')
        })
        it(`Data Should have property entryFee and value should be Number`,()=>{
            expect(data.data[0]).to.have.property('entryFee')
            expect(data.data[0].entryFee).to.be.a('number')
        })
        it(`Data Should have property time and value should be Success`,()=>{
            expect(data.data[0]).to.have.property('time')
            expect(data.data[0].time).to.be.a('string')
        })
    })
})

