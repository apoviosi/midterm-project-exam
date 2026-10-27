require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require ('cors')

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI)

app.listen(5000, () =>{
    console.log('Server is running on port 5000');
});

const Pokemon = mongoose.model('Pokemon', {
    name: String,
    type: String,
    level: Number,
    nature: String
});

app.post('/api/pokemon', async (req, res)=>{
    const pokemon = new Pokemon(req.body);
    await pokemon.save();
    res.status(201).send(pokemon);
});

app.get('/api/pokemon', async (req, res)=>{
    const list = await Pokemon.find();
    res.send(list);
});

// Update Route
app.put('/api/pokemon/:id', async (req, res) => {
    try {
        const updatedPokemon = await Pokemon.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.send(updatedPokemon);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Delete Route
app.delete('/api/pokemon/:id', async (req, res) => {
    try {
        await Pokemon.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: 'Pokemon deleted successfully' });
    } catch (err) {
        res.status(400).send(err);
    }
});