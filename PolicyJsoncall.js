import node_fetch from 'node-fetch'
const Policydata =async function(token,policyNo)
    {

    const header = new Headers({
        'Content-Type': 'application/json',
        'in-auth-token':`${token}`
    });

    const response = await node_fetch(`https://uatipds2.cloware.in/api/v1/policy?policy_no=${policyNo}`,{
    method:"GET",
    headers:header,
    });
    const resp = await response.json();
    
   return resp.data
}

export default Policydata;