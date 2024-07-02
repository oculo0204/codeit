import mongoose from 'mongoose';
import data from './mock.js';
import Task from '../models/Task.js';
import * as dotenv from 'dotenv';
dotenv.config();

mongoose.connect(DATABASE_URL);

await Task.deleteMany({}); //빈 객체가 전달되기 때문에 모든 데이터가 조건을 만족해서 지워짐
await Task.insertMany(data);  //비동기라는 사실을 잊지 말 것!

mongoose.connect(process.env.DATABASE_URL); //서버 프로그램은 보통 계속 실행되어 있기 때문에 connection을 종료하지 않지만 여기서는 test이므로 그냥 처리