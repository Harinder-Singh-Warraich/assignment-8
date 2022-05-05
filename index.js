const express=require('express');
const app=express();
const mongoose=require('mongoose');
const path=require('path');
const Data=require('./models/dat');
const methodOverride=require('method-override');



mongoose.connect('mongodb://localhost:27017/reception-db')
.then(()=>{
    console.log("DB CONNECTED")
})
.catch((err)=>{
    console.log(err)
})
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'/views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')))


app.get('/home',async (req,res)=>{
    const data=await Data.find({});
    res.render('home',{data});
})
app.get('/home/enter',(req,res)=>{
    res.render('enter');
})
app.post('/home',async(req,res)=>{
    const {name,email,phone}=req.body;
    let date=new Date();
    let cinh=date.getHours();
    let cinm=date.getMinutes();
    sendemail(email,cinh,cinm);
    await Data.create({name,email,phone,cinh,cinm});
    res.redirect('/home');
})
app.get('/home/:id',async(req,res)=>{
    const {id}=req.params;
    const d=await Data.findById(id);
    res.render('exit',{d});
})
app.put('/home/:id',async(req,res)=>{
    const {id}=req.params;
    let date2=new Date();
    let couth=date2.getHours();
    let coutm=date2.getMinutes();
    const oh=couth;
    const om=coutm;
    const d=await Data.findById(id)
    sendexmail(d.email,oh,om)
    await Data.findByIdAndUpdate(id,{$set:{status:"Checked Out",couth:oh,coutm,om}});
    res.redirect('/home');
})
app.delete('/home/:id',async (req,res)=>{
    const {id}=req.params;
    await Data.findByIdAndDelete(id);
    res.redirect('/home');
})


function sendemail(email,cinh,cinm){
    const sgMail=require('@sendgrid/mail');
   const  sendgrid='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';
  sgMail.setApiKey(sendgrid);
  const msg={
      to: email,
      from: "harinder1414.cse19@chitkara.edu.in",
      subject:"Entering building",
      text:`Hi you entered the building at ${cinh}:${cinm}`
  };
  sgMail.send(msg)
  .then((res)=>console.log("SENT"))
  .catch((error)=>console.log(error.message))
}

function sendexmail(email,couth,coutm){
    const sgMail=require('@sendgrid/mail');
   const  sendgrid='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';
  sgMail.setApiKey(sendgrid);
  const msg={
      to: email,
      from: "harinder1414.cse19@chitkara.edu.in",
      subject:"Checking out",
      text:`Hi you checked out at ${couth}:${coutm}`
  };
  sgMail.send(msg)
  .then((res)=>console.log("SENT"))
  .catch((error)=>console.log(error.message))
}

app.listen(2323,(req,res)=>{
    console.log("UP AT 2323");
})