import node_fetch from 'node-fetch'
const token =async function()
    {

    const header = new Headers({
        'Content-Type': 'application/json'
        
    });

    const response = await node_fetch('https://uatis2.cloware.in/api/v1/auth',{
    method:"POST",
    headers:header,
    body:JSON.stringify({
        email: "uw",
        mpwd: "098f6bcd4621d373cade4e832627b4f6"
        })
    });
    const resp = await response.json();
    
   return resp.data.token
}

 export default token;