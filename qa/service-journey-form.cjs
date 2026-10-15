const assert=require('node:assert/strict');
const api=require('../business/assets/form-client.js');
const value={name:'TEST ONLY',email:'test@example.invalid',challenge:'Synthetic enquiry test, no real delivery.',consent:true};
(async()=>{
 const payloads=[];
 const client=api.create({fetch:async(url,request)=>{payloads.push(JSON.parse(request.body));return {ok:true,json:async()=>({success:true})};}});
 assert.equal((await client.submit({...value,industry:'5',service:'replies',need:'3'})).state,'success');
 assert.equal(payloads[0].industry,'Hospitality & travel');assert.equal(payloads[0].service,'Customer enquiries');assert.equal(payloads[0].need,'AI automation');
 assert.equal((await client.submit({...value,industry:'5',service:'replies',need:'3'})).duplicate,true);assert.equal(payloads.length,1);
 await client.submit({...value,industry:'5',service:'operations',need:'3'});assert.equal(payloads.length,2);
 await client.submit({...value,industry:'999',service:'<script>',need:'99'});assert.equal(payloads[2].industry,'');assert.equal(payloads[2].service,'');assert.equal(payloads[2].need,'');
 await client.submit({...value,name:'LEGACY TEST'});assert.equal(payloads[3].industry,'');assert.equal(payloads[3].service,'');
 console.log('PASS: optional context, payload mapping, duplicate context, changed service, invalid context, legacy enquiry. Mock requests only.');
})().catch(e=>{console.error(e);process.exitCode=1;});
