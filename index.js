import node_fetch from 'node-fetch'
import fs from 'fs-extra';
import  xlsx from "xlsx";
import { json } from 'stream/consumers';
 import ExcelConverter from './excel.js'
import Twig from 'twig';
import tokenGeneration from './insyncToken.js'
import insllionToken from './InsiilionToken.js'
import Policydata from './PolicyJsoncall.js';

//Generating Token using tokengeneration function
 let token = await tokenGeneration();
 let uat2Token= await insllionToken();

//Reading clause master of EC
let workbook=xlsx.readFile("./EC_CLAUSE_MASTER.xlsx");
let worksheet=workbook.Sheets[workbook.SheetNames[0]]
let range=xlsx.utils.sheet_to_json(worksheet);

let pending_sync=[
5190001160,
5190001082,
5190001080,
5190001076,
5190001031,
5190001025,
5190001022,
5190001021,
5190001020,
5190001016,
5190001015,
5190001014,
5190001002,
5190000957,
5190000947,
5190000907,
5190000903,
5190000901,
5190001189,
5190001188,
5190001184,
5190001177,
5190001174,
5190001172,
5190001170,
5190001164,
5190001151,
5190001149,
5190001148,
5190001147,
5190001146,
5190001145,
5190001144,
5190001143,
5190001142,
5190001102,
5190001072,
5190001069,
5190001051,
5190001000,
5190000937,
5190000928,
5190000927,
5190000926,
5190000925,
5190000921,
5190000920,
5190000913,
5190000909,
5190000895,
5190001216,
5190001215,
5190001214,

]

for(let i=0;i<pending_sync.length;i++){
    const policy_json=await Policydata(uat2Token,pending_sync[i]);
   // console.log(policy_json)
    await Ec_proposalGeneration(policy_json,token,range)
}


async function Ec_proposalGeneration(policy_json,token,range){
    let config;
    if(policy_json==undefined){
        config=policy_json[0];
    }
    else{
        config = policy_json[0];
    }

    //Modifying UAT data 
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
    
    config.proposal.quote_id=`NKS${Math.floor(100000000 + Math.random() * 90000000)}`
    // adding arrays if not present in JSON
    if(config.proposal.data.employeeDetails == undefined ){

        let  employeeDetails=[];
        let  clausesMaster=[];
        let premiumDetails=[]

        for(let i=1;i<=Number(config.quote.data.worker_detail_count);i++){
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
        console.log("Not required")
    }


    let twig =fs.readFileSync('./Ecproposal.twig','utf8',function(error,data){
        console.log(error)
    })

    const header = new Headers({
        'Content-Type': 'application/json'
    });

    
    
    header.append("Authorization",`Bearer ${token}`);
    
    const ec_request=await node_fetch('https://uatis2.cloware.in/api/v1/twigtest',{
        method:"POST",
        headers:header,
        body:JSON.stringify({
            json:JSON.stringify(config),
            twig:twig
        })
    })
    let ec_re =await ec_request.json();

    const Ecproposal=await node_fetch('https://connectbeta.tataaiginsurance.in/integration/PACERestService/webServiceEC',{
        method:"POST",
        headers:header,
        body:ec_re.data.data
    })
    const Ecproposal_resp = await Ecproposal.json();



    //fs.writeJsonSync('./policy_sub.json',Ecproposal_resp.errorLog.errorLog[0])


    // const subrecipt_json={
    //     source:"TATA-AIG",
    //     medium:"IPDSV2_UAT",
    //     campaign:"IPDSV2_UAT",
    //     Amount:config.quote.data.total_premium,
    //     Application_No:Ecproposal_resp.errorLog.errorLog[0].applicationNo,
    //     receiptNo:Ecproposal_resp.errorLog.errorLog[0].receiptNo,
    //     customerId:Ecproposal_resp.errorLog.errorLog[0].customerId,
    //     workflowId:Ecproposal_resp.errorLog.errorLog[0].workflowId,
    //     product_code:config.quote.data.gc_product_code,
    //     lob_code:config.quote.data.gc_product_code.toString().slice(0,2),
    //     proposal_no:Ecproposal_resp.errorLog.errorLog[0].proposalNo,
    //     office_code:config.proposal.data.location_code
    // }

    if(fs.existsSync('./policy_response.json')){
        let a = fs.readJSONSync('./policy_response.json');
        a.push(Ecproposal_resp.errorLog.errorLog[0])
        fs.writeJsonSync('./policy_response.json',a)

        console.log(ExcelConverter(a))
    }
    else{
        let a =[]
        a.push(Ecproposal_resp.errorLog.errorLog[0])
        fs.writeJsonSync('./policy_response.json',a)

        //console.log(ExcelConverter)
    }
}