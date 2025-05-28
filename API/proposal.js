import node_fetch from 'node-fetch'

let header = new Headers({
    'Content-Type': 'application/json',
})

async function proposalGeneration(body){
 const Ecproposal=await node_fetch('https://connectbeta.tataaiginsurance.in/integration/PACERestService/webServiceEC',{
        method:"POST",
        headers:header,
        body:body
    })

    if(Ecproposal.status==200){
        return await Ecproposal.json();
    }
    else{
       throw new Error(`Proposal Generation Failed with status code: ${Ecproposal.status}`);
    }
}

export default proposalGeneration;