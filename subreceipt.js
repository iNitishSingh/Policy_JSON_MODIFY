import fs from 'fs'
import node_fetch from 'node-fetch'
import xml2js from 'xml2js'

let twig_subreciept = fs.readFileSync('./subreceipt.twig', 'utf8', function (error, data) {
    console.log(error)
})

let token ="ou/Oubsbd4zSoFg+SYOEH5UBcTNW9bQqccV2TLNQvQjAEO1PgXy1mtpqG5jNSeA=";

const header = new Headers({
    'Content-Type': 'application/json'
});

header.append("Authorization",`Bearer ${token}`);

const subreceiptjson = { "source": "TATA-AIG", "medium": "IPDSV2_UAT", "campaign": "IPDSV2_UAT", "Amount": 7081, "Application_No": " ", "receiptNo": "", "customerId": "1000909610", "workflowId": " ", "product_code": 1409, "lob_code": "14", "proposal_no": "", "office_code": "90200" }


//console.log(JSON.stringify(twig_subreciept))

// const sub_request={
//     json:subreceiptjson,
//     twig:twig_subreciept

// }

// console.log(sub_request)



const header1  = new Headers({
    'Content-Type': 'application/xml'
});

//header1.append("Authorization",`Bearer ${token}`);

const ec_request= await node_fetch('https://uatis2.cloware.in/api/v1/twigtest',{
    method:"POST",
    headers:header,
    body:JSON.stringify({
        json:JSON.stringify(subreceiptjson),
        twig:twig_subreciept
    })
})
const ec_response= await ec_request.json();

console.log(ec_response.data.data)



const subreceipt_call= await node_fetch('http://172.20.251.126:8182/cxf/Account/AccountConfServices',{
    method:'POST',
    headers:header1,
    body:ec_response.data.data

})

let subreceipt_resp= await subreceipt_call.text()


