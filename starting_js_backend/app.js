import express from 'express';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();
import Task from './models/Task.js';//몽고 DB 스키마
import cors from 'cors';

mongoose.connect(process.env.DATABASE_URL).then(() => console.log('Connected to DB'));
const app = express();
app.use(cors());
app.use(express.json());

function asyncHandler(handler){
    return async function(req, res){
        try{
            await handler(req,res);
        }catch(e){
            if(e.name==='ValidationError'){
                res.status(400).send({message: e.message});
            }else if(e.name =='CastError'){
                res.status(404).send({message: 'Cannot find given id.'});
            }else{
                res.status(500).send({message: e.message});
            }
        }
    }
}

app.get('/tasks', asyncHandler(async (req,res)=>{
    const sort = req.query.sort;
    const count = Number(req.query.count)|| 0; //count파라미터가 없거나 숫자가 아닌 경우 count를 0으로 설정해준다
    const sortOption = {createdAt: sort === 'oldest'? 'asc': 'desc'}; //프로퍼티 이름은 정렬 기준 필드(createdAt), 프로퍼티 값은 오름차순 asc , 내림차순 desc
    const tasks = await Task.find().sort(sortOption).limit(count);  //인자에 따라 여러 객체를 가져옴, 이것은 모두 가져오는 것
    res.send(tasks);
}));

app.get('/tasks/:id',asyncHandler(async (req,res)=>{
    const id = req.params.id;
    const task = await Task.findById(id);
    if(task){
        res.send(task);
    }else{
        res.status(404).send({message: 'cannot find given id'})
    }
}));

app.post('/tasks',asyncHandler(async (req,res)=>{
    const newTask = await Task.create(req.body);
    res.status(201).send(newTask);
}));

app.patch('/tasks/:id',asyncHandler(async (req,res)=>{
    const id = req.params.id;
    const task = await Task.findById(id);
    if(task){
        Object.keys(req.body).forEach((key)=>{
            task[key] = req.body[key];
        })
        await task.save();
        res.send(task);
    }else{
        res.status(404).send({message: 'cannot find given id'})
    }
}));
app.delete('/tasks/:id',asyncHandler(async (req,res)=>{
    const id = req.params.id;
    const task = await Task.findByIdAndDelete(id); //객체를 찾고 삭제까지 해줌
    if(task){
        res.sendStatus(204);
    }else{
        res.status(404).send({message: 'cannot find given id'})
    }
}));

app.listen(process.env.PORT || 3000, () => console.log('Server Started'));
