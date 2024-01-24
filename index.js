const { error } = require('console');
const config = require('./5190009379.json');
const fs=require('fs');
const { finished } = require('stream');
const  xlsx= require("xlsx");
let workbook=xlsx.readFile("./EC_CLAUSE_MASTER.xlsx");

let worksheet=workbook.Sheets[workbook.SheetNames[0]]
let range=xlsx.utils.sheet_to_json(worksheet);

//console.log(range[0].CLAUSE_DESCRIPTION);

//console.log(workbook);
//console.log(config)

//console.log(config.proposal.data.work_trade_catg_1)

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


for(let i=1;i<Number(config.proposal.data.worker_detail_count);i++){

    // let k;
    // for(j=0;j<count;j++){
    //     if(tradeObj[j].trade_code_name==config.quote.data[`work_trade_catg_${i}`]){
    //         k=tradeObj[j].grouping
    //         break;
    //     }
    // }
    // console.log("k="+k)
    employeeDetails.push({
        tradeCategory:config.quote.data[`work_trade_catg_${1}`],
        monthlyWages:config.proposal.data[`monthly_wages_${i}`],
        numOfWorkers:config.proposal.data[`no_of_worker_${i}`],
        typeOfWorkers:config.proposal.data[`work_catg_${i}`],
        totalWages:config.proposal.data[`total_wages_${i}`],
        ecRate:config.proposal.data[`worker_rate_${i}`],
        grouping:config.proposal.data[`work_trade_catg_group_${i}`]
    })

}

console.log(config.quote.data.trade_category_details[0].length_increase)


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
                //console.log(k)
            }
        }
        clausesMaster.push({
            clauseflag:config.proposal.data[`clause_${i}_appl`],
            clauseDesc:config.proposal.data[`clause_${i}`],
            clauseCode:k==undefined ? Math.floor(Math.random()*90000) + 10000 : k
    })
}
}

// console.log(employeeDetails)
 console.log(premiumDetails)
// console.log(clausesMaster)
//const nks =JSON.parse(JSON.stringify(config));
config.proposal.data['employeeDetails']= employeeDetails;
config.proposal.data['premiumDetails']=premiumDetails;
config.proposal.data['clausesMaster']=clausesMaster

//console.log(config.proposal.data.clausesMaster)
fs.writeFile('policy.json',JSON.stringify(config),(error)=>{
    if(error){
        console.log(error)
        return;
    }
})


