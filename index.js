//import policy_json from './5190009379.json' assert { type: "json" };
import node_fetch from 'node-fetch'
import fs from 'fs-extra';
import  xlsx from "xlsx";
import { json } from 'stream/consumers';
 import ExcelConverter from './excel.js'

const policy_json=fs.readJSONSync("./5190009379.json");
const config = policy_json.data[0];
let workbook=xlsx.readFile("./EC_CLAUSE_MASTER.xlsx");//reading clauses masster
let worksheet=workbook.Sheets[workbook.SheetNames[0]]
let range=xlsx.utils.sheet_to_json(worksheet);

config.proposal.data.location_code="90200";
if (config.proposal.data.channel_mapper_name ==  "Agency"){


    config.policy.broker_code="2123415667";
}
else if(config.proposal.data.channel_mapper_name ==  "Broker"){
    config.policy.broker_code="9890248138";   
}
else if(config.proposal.data.channel_mapper_name ==  "Banca"){
    config.policy.broker_code="9977137677"; 
}

else{
    console.log(config.policy.broker_code+"-"+ config.proposal.data.broker_name+"Not present")
}
if(config.proposal.data.employeeDetails == undefined ){

    employeeDetails=[];
    clausesMaster=[];

    var count=0;

    let tradeObj=[]

 
 //console.log(config.proposal.data[`trade_catg_${1}`]);

// for(let i=1;i<10;i++){
//     if(config.proposal.data[`trade_catg_${i}`] == ""){
//         break
//     }
//     else{

//         count++;
//         tradeObj.push({
//             grouping:config.proposal.data[`trade_catg_${i}`],
//             trade_code_name:config.proposal.data[`trade_catg_code_${i}`]
//         })

//     }
// }
// console.log(tradeObj)
// console.log(tradeObj[0].trade_code_name)
// console.log(count)

//console.log(config.quote.data.worker_detail_count)

for(let i=1;i<=Number(config.quote.data.worker_detail_count);i++){

    // let k;
    // for(j=0;j<count;j++){
    //     if(tradeObj[j].trade_code_name==config.quote.data[`work_trade_catg_${i}`]){
    //         k=tradeObj[j].grouping
    //         break;
    //     }
    // }
    // console.log("k="+k)
    employeeDetails.push({
        tradeCategory:config.quote.data[`work_trade_catg_${i}`],
        monthlyWages:config.quote.data[`monthly_wages_${i}`],
        numOfWorkers:config.quote.data[`no_of_worker_${i}`],
        typeOfWorkers:config.quote.data[`work_catg_${i}`],
        totalWages:config.quote.data[`total_wages_${i}`],
        ecRate:config.quote.data[`worker_rate_${i}`],
        grouping:config.quote.data[`work_trade_catg_group_${i}`]
    })

}

let premiumDetails=[]

for(let i=0;i<config.quote.data[`trade_category_details`].length;i++){
    premiumDetails.push(
        {
            trade_category_code:config.quote.data.trade_category_details[i].length_increase.slice(0,4),
            trade_category_name:config.quote.data.trade_category_details[i].length_increase,
            statutory_prem:config.proposal.data[`statutory_prem_${i+1}`],
            od_prem:config.proposal.data[`od_prem_${i+1}`],
            medex_prem:config.proposal.data[`medex_prem_${i+1}`]
        }
    )
}
for(let i=1;i<15;i++){
    if(config.proposal.data[`clause_${i}_appl`]=="yes"){
        let k;

        for(let j=0;j<range.length;j++){
            if(config.proposal.data[`clause_${i}`]==range[j].CLAUSE_DESCRIPTION){
                k=range[j].CLAUSE_CODE;
            }
        }
        clausesMaster.push({
            clauseflag:config.proposal.data[`clause_${i}_appl`],
            clauseDesc:config.proposal.data[`clause_${i}`],
            clauseCode:k==undefined ? Math.floor(Math.random()*90000) + 10000 : k
    })
}
}

config.proposal.data['employeeDetails']= employeeDetails;
config.proposal.data['premiumDetails']=premiumDetails;
config.proposal.data['clausesMaster']=clausesMaster
}

else{
    console.log("required")
}

fs.writeFile('policy.json',JSON.stringify(config),(error)=>{
    if(error){
        console.log(error)
        return;
    }
    else{
        console.log("done")
    }
})

const auth={
    email: "uw",
    mpwd: "098f6bcd4621d373cade4e832627b4f6"
}
const header = new Headers({
    'Content-Type': 'application/json'
});

let authresp;

const response = await node_fetch('https://uatis2.cloware.in/api/v1/auth',{
    method:"POST",
    headers:header,
    body:JSON.stringify(auth)
});
const resp = await response.json();

const token = resp.data.token;

console.log(token)
 let twig =fs.readFileSync('./Ecproposal.twig','utf8',function(error,data){
    console.log(error)
 })

 header.append("Authorization",`Bearer ${token}`);

 const ec_request_obj={

    json:JSON.stringify(config),
    twig:twig

 }

 const ec_request=await node_fetch('https://uatis2.cloware.in/api/v1/twigtest',{
    method:"POST",
    headers:header,
    body:JSON.stringify(ec_request_obj)
})
let ec_re =await ec_request.json();

const Ecproposal=await node_fetch('https://connectbeta.tataaiginsurance.in/integration/PACERestService/webServiceEC',{
    method:"POST",
    headers:header,
    body:ec_re.data.data
})
 const Ecproposal_resp =await Ecproposal.json();

 console.log(Ecproposal_resp.errorLog.errorLog[0])
console.log(fs.existsSync('./policy_response.json'))

 if(fs.existsSync('./policy_response.json')){
    let a = fs.readJSONSync('./policy_response.json');
     a.push(Ecproposal_resp.errorLog.errorLog[0])
     fs.writeJsonSync('./policy_response.json',a)

     //console.log(ExcelConverter)
 }
else{
    let a =[]
     a.push(Ecproposal_resp.errorLog.errorLog[0])
     fs.writeJsonSync('./policy_response.json',a)

     //console.log(ExcelConverter)
}