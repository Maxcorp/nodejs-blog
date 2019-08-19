const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const staticAsset = require('static-asset');
const mongoose = require('mongoose');
const config = require('./config');

// database
mongoose.Promise = global.Promise;
mongoose.set('debug', config.IS_PRODUCTION);
mongoose.connection
  .on('error', error => console.log(error))
  .on('close', () => console.log('Database connection closed.'))
  .once('open', () => {
    const info = mongoose.connections[0];
    console.log(`Connected to ${info.host}:${info.port}/${info.name}`);
  });
mongoose.connect(config.MONGO_URL, { useMongoClient: true });

// express
const app = express();

// sets and uses
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(staticAsset(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
    try {
        const posts = await Post.find({});
        res.render('index', { posts:posts });
    } catch(e) {
        console.log('error');
    }
});

app.get('/create', (req, res) => {
    res.render('create');
});

app.post('/create', async (req, res) => {
    //arr.push(req.body.text);
    const {title, body} = req.body;
    
    try {
        const post = await Post.create({
            title: title,
            body: body
        });
    } catch(e) {
        console.log('error');
    }

    /*
    Post.create({
        title: title,
        body: body
    }).then(post => {
        console.log(post);
    });*/

    res.redirect('/');
});

app.listen(config.PORT, () => {
    console.log(`Example app listening on port ${config.PORT}!`)
});