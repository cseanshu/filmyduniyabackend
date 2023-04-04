const app=require('express')()
const shortid=require('shortid')
const http=require('http')
const server=http.createServer(app)
const path=require('path')
const Razorpay = require('razorpay')
const cors=require('cors')
const bodyParser=require('body-parser')
const { json } = require('express')
app.use(cors())
app.use(bodyParser.json())
const razorpay=new Razorpay({
    key_id:"rzp_test_AhMoTIp09GbOPh",
    key_secret:"l211g0oMj0RftLoZYBTDh3AX",
});
app.get('/logo.svg',(req,res)=>{
    res.sendFile(path.join(__dirname,'logo.svg'))
  })
  app.post('/verification',(req,res)=>{
  //verification karege
  //webhooks secret
  const SECRET="anshumanmishra2003";
  console.log(req.body);
  const crypto=require('crypto');
  const shasum=crypto.createHmac('sha256',SECRET)
  shasum.update(JSON.stringify(req.body))
  const digest=shasum.digest('hex');
  console.log(digest,req.headers['x-razorpay-signature'])
  if(digest==req.headers['x-razorpay-signature']){
    console.log('request is legit')
    require('fs').writeFileSync('payment1.json',JSON.stringify(req.body,null,4))
  }
  else{
    //pass it
  }
    res.json({status:'ok'})
  })
  app.post('/razorpay', async (req,res)=>{
    // const {razorpay_order_id,razorpay_payment_id,razorpay_signature}=req.body;
    console.log(req.body.razorpay_order_id);

   const  payment_capture=1;
    const amount=498;
    const currency='INR'
    const options={
        amount:(amount*100).toString(),
        currency, 
        receipt:shortid.generate(),
        // receipt,
        payment_capture
        // razorpay_payment_id
    }
    try{
   const response= await razorpay.orders.create(options)
   console.log(response)
//    res.send('OK')
// console.log(razorpay_payment_id)
// console.log(response.razorpay_order_id)
// console.log("response.razorpay_signature")

res.json({
    id:response.id,
    currency:response.currency,
    amount:response.amount,
    // razorpay_payment_id
   })
    }catch(error){
        console.log(error);
    }
  })
  server.listen(1337,()=>{console.log("listen on 1337")})
// app.listen(1337, 'localhost'); // or server.listen(3001, '0.0.0.0'); for all interfaces
// app.on('listening', function() {
//     console.log('Express server started on port %s at %s', app.address().port, app.address().address);
// });

