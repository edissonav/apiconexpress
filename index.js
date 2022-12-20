const express = require('express');
const path= require('path');
const fs= require('fs/promises');

const app= express();

app.use(express.json());

const jsonPath= path.resolve('./files/tasks.json');

app.post('/tasks', async (req, res)=>{
    const taskposting= req.body;
    const tasksArray= JSON.parse(await fs.readFile (jsonPath, 'utf-8' ));
   
   
    const lastindex = tasksArray.length - 1;

    const newid = tasksArray[lastindex].id + 1;

    tasksArray.push({...taskposting, id: newid });

    await fs.writeFile(jsonPath, JSON.stringify(tasksArray) );
    res.end();

});

app.get('/tasks', async (req, res)=>{
    const tasksArray= JSON.parse(await fs.readFile(jsonPath, 'utf-8'));

    res.send(tasksArray);
});

app.put('/tasks', async(req, res)=>{

const {status, id}=req.body;
 const tasksArray= JSON.parse(await fs.readFile(jsonPath, 'utf-8'));

 const indexofstatus= tasksArray.findIndex( task=> task.id === id);

 if(indexofstatus >= 0 ){
    tasksArray[indexofstatus].status = status
 }

 await fs.writeFile(jsonPath,  JSON.stringify(tasksArray));
res.send('task update succesfully');

});

app.delete('/tasks', async (req, res)=>{

     const {id}= req.body;
     const tasksArray= JSON.parse(await fs.readFile(jsonPath, 'utf-8'));

     const indexoftasktodelete=tasksArray.findIndex(task => task.id === id);
     if(indexoftasktodelete >= 0){
        tasksArray.splice(indexoftasktodelete, 1);
     };
     await fs.writeFile(jsonPath, JSON.stringify(tasksArray));

     res.send('task deleted succesfully');

});



const PORT= 2000;
app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
});