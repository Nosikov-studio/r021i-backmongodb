//const mysql = require("mysql2");
const express = require("express");
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient; // 
const app = express();
const urlencodedParser = express.urlencoded({extended: false});
// const pool = mysql.createPool({
//     connectionLimit: 5,
//     host: "localhost",
//     user: "root",
//     database: "expo",
//     password: "password"
// });

//const URL = 'mongodb://localhost:27017/expom';

app.use(cors());
//app.use(express.json());

app.set("view engine", "hbs");
// подключение к mongoDB с использованием колбэков

// MongoClient.connect(URL, (err, client) => {
//   if (err) {
//     return console.log('Ошибка подключения к MongoDB:', err);
//   }
//   console.log('Подключение к MongoDB установлено');

//   const db = client.db('expom'); // база expom из URL
//   app.locals.collection = db.collection('colltab');

//   app.use(express.json());

//   app.get('/', (req, res) => {
//     res.send('Express и MongoDB подключены');
//   });

//   // Запускаем сервер только после успешного подключения к БД
//   app.listen(40444, () => {
//     console.log('Сервер запущен на http://localhost:40444');
//   });
// });


const mongoClient = new MongoClient("mongodb://127.0.0.1:27017/");
async function run() {
    try {
         // Подключаемся к серверу MongoDB
    await mongoClient.connect();
    console.log("Подключение установлено");

    // Получаем базу данных и коллекцию
    const db = mongoClient.db("expom");
    const collection = db.collection('colltab');

    app.locals.collection = collection;

    app.use(express.json());
    app.use(cors()); // если нужен CORS

//************** */ получаем все данные в шаблон*****************
        app.get('/', async (req, res) => {
      try {
        // Получаем все документы из коллекции
        const us = await collection.find().toArray();
        // res.status(200).json(us);
        res.render("index.hbs", {
        users: us  });

      } catch (err) {
        res.status(500).json({ message: "Ошибка при получении данных", error: err });
      }
    });
//************** */ Вставляем запись из шаблона*****************
        app.post('/create', urlencodedParser, async (req, res) => {
      try {
         const name = req.body.name;
         const age = req.body.age;
         const newUser = { name, age };
        // Получаем все документы из коллекции
        result = await collection.insertOne(newUser);
        // res.status(200).json(us);
        res.redirect("/");

      } catch (err) {
        res.status(500).json({ message: "Ошибка", error: err });
      }
    });
//************** */ получаем все данные по API (json)*****************
        app.get('/api', async (req, res) => {
      try {
        // Получаем все документы из коллекции
        const us = await collection.find().toArray();
        res.status(200).json(us);
        

      } catch (err) {
        res.status(500).json({ message: "Ошибка при получении данных", error: err });
      }
    });

 //************** */ получаем один документ по API (json)*****************
        app.get('/api/:id', async (req, res) => {
      try {
        const id=req.params.id;
        const u = await collection.findOne({_id: id});
        res.status(200).json(u);
        

      } catch (err) {
        res.status(500).json({ message: "Ошибка при получении данных", error: err });
      }
    });
   

// Запускаем сервер только после успешного подключения к БД
        app.listen(40444, () => {
        console.log('Сервер запущен на http://localhost:40444');
        });

    }catch(err) {
        console.log(err);
    } 
    // finally {
    //     // Закрываем подключение при завершении работы или при ошибке
    //     await mongoClient.close();
    //     console.log("Подключение закрыто");
    // }
}
run().catch(console.log);


// // *****************************работа с шаблонизатором***********************
// // получение списка пользователей
// app.get("/", function(req, res){
//     pool.query("SELECT * FROM tab1", function(err, data) {
//         if(err) return console.log(err);
//         res.render("index.hbs", {
//             users: data
//         });
//     });
// });

// // получаем данные и добавляем их в БД 
// app.post("/create", urlencodedParser, function (req, res) {
//     if(!req.body) return res.sendStatus(400);
//     const name = req.body.name;
//     const age = req.body.age;
//     pool.query("INSERT INTO tab1 (name, age) VALUES (?,?)", [name, age], function(err, data) {
//         if(err) return console.log(err);
//         res.redirect("/");
//     });
// });
// //******************************работа с API*************************************
// // получаем  все данные по api 
// app.get("/api", function(req, res){
//     pool.query("SELECT * FROM tab1", function(err, data) { 

//         res.json(data);
//     });
// });
// // получаем  данные одной записи по api
// app.get("/api/:id", function(req, res){
//     const id=req.params.id;
//     pool.query("SELECT * FROM tab1 WHERE id=?", [id], function(err, data) { 

//         res.json(data);
//     });
// });
// // добавляем данные по api
// app.post("/api", urlencodedParser, function (req, res) {
//     if(!req.body) return res.sendStatus(400);
//     const name = req.body.name;
//     const age = req.body.age;
//     console.log('from backblabla');
//     pool.query("INSERT INTO tab1 (name, age) VALUES (?,?)", [name, age], function(err, data) {
//         if(err) return console.log(err);
//         console.log('from back'+data);
//         res.json(data);
//     });
// });


// // редактируем конкретную запись (id) по api
// app.post("/api/edit", urlencodedParser, function (req, res) {
//     const name = req.body.name;
//     const age = req.body.age;
//     const id = req.body.id;
//     pool.query("UPDATE tab1 SET name=?, age=? WHERE id=?", [name, age, id], function(err, data) {
//         res.json(data);
//     });
// });


// // удаление конкретной записи (id) по api
// app.post("/delete/:id", function(req, res){
//     const id = req.params.id;
//     pool.query("DELETE FROM tab1 WHERE id=?", [id], function(err, data) {
        
//         res.json(data);
//     });
// });

// //***********************включение сервера*******************************************

// app.listen(30333, function(){
//     console.log("Сервер ожидает подключения...");
// });