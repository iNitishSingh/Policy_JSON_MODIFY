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
            email: "vinay@gmail.com",
            mpwd: "4330cb723a3b5aa67296997f62443583"
        })
    });
    const resp = await response.json();
   return resp.data.token
}

 export default token;