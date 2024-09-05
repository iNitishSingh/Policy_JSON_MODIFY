import node_fetch from 'node-fetch'
const token =async function()
    {

    const header = new Headers({
        'Content-Type': 'application/json'
    });

    const response = await node_fetch('https://uatipds2.cloware.in/api/v1/auth',{
    method:"POST",
    headers:header,
    body:JSON.stringify({
        email: "abhishek1.qualitykiosk@tataaig.com",
        pwd: "539139"
    })
    });
    const resp = await response.json();
    
   return resp.data.token
}

 export default token;