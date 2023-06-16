const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const cors = require('cors');

const urlLocal = `mongodb://localhost:27017/GMDB`;
const app = express();

app.use(cors({
    origin: '*'
}));

app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.send('Server started')
})

//Per Docker
mongoose.connect(`mongodb://mongodb:27017/docker`, {
    useNewUrlParser: true
}).then(() => console.log('connected to mongoDb'));

//In locale
//mongoose.connect(urlLocal, {
//
//    useNewUrlParser: true
//
//}).then(() => console.log('connected to mongoDb'));

const entertainerSchema = {
    birthdate: String,
    car: Boolean,
    name: String,
    role: String,
    surname: String,
    avaliabilityPercMonthly: Number,
    avaliability: [String]
}

const partySchema = {
    type: String,
    celebratedName: String,
    customerName: String,
    address: String,
    eventDate: String,
    beginningTime: String,
    endTime: String,
    childrenNumber: Number,
    newCustomer: Boolean,
    phone: String,
    address: String,
    note: String,
    entertainersNumber: Number,
    entertainers: [entertainerSchema]
}

const Party = mongoose.model('Party', partySchema);
const Entertainer = mongoose.model('Entertainer', entertainerSchema);

app.get('/parties', (req, res) => {
    Party.find().then(resp => {
        res.send(resp)
    })
})

app.get('/entertainers', (req, res) => {
    Entertainer.find().then(resp => {
        res.send(resp)
    })
})

app.get('/entertainers/:id', (req, res) => {
    const idEntertainer = req.params.id;
    Entertainer.findOne({ _id: idEntertainer }).then(resp => {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();
        const monthStart = new Date(currentYear, currentMonth, 1);
        const monthEnd = new Date(currentYear, currentMonth + 1, 1);
        const monthLength = (monthEnd - monthStart) / (1000 * 60 * 60 * 24);
        const avaliabilityMonthly = resp.avaliability.filter(el => el.split('-')[1] == currentMonth + 1);
        const avaliabilityPercMonthly = (100 * avaliabilityMonthly.length / monthLength).toFixed(2);
        resp.avaliabilityPercMonthly = avaliabilityPercMonthly
        res.send(resp)
    })
})

app.post('/parties', (req, res) => {
    const party = new Party(req.body);
    party.save().then(resp => res.send(resp))
})

app.post('/entertainers', (req, res) => {
    const entertainer = new Entertainer(req.body);
    entertainer.save().then(resp => res.send(resp))
})

app.put('/parties', (req, res) => {
    Party.updateOne({ _id: req.body.id }, req.body).then(resp => res.send(resp))
})

app.put('/entertainers', (req, res) => {
    console.log(req.body)
    Entertainer.updateOne({ _id: req.body.id }, req.body).then(resp => res.send(resp))
})

app.delete('/entertainers/:id', (req, res) => {
    Entertainer.deleteOne({ _id: req.params.id }).then(resp => res.send(resp))
})



//TODO

app.listen(80, function () {
    console.log("Server started on port 3000");
});