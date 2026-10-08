const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://matosrogelio25_db_user:OX2fIEqCab5KpJSz@cluster0.8kxvvf6.mongodb.net/?appName=Cluster0';

mongoose.connect(MONGO_URI)
  .then(() => console.log('? �Conectado a MongoDB Atlas exitosamente!'))
  .catch(err => console.error('? Error conectando a MongoDB:', err));

const userSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
  username: String,
  firstName: String,
  balance: { type: Number, default: 150.00 },
  activePlans: { type: Array, default: [] },
  miningEarningsHistory: { type: Array, default: [] },
  withdrawalHistory: { type: Array, default: [] }
});

const User = mongoose.model('User', userSchema);

app.post('/api/user', async (req, res) => {
  try {
    const { telegramId, username, firstName } = req.body;
    if (!telegramId) return res.status(400).json({ error: 'Falta el telegramId' });
    let user = await User.findOne({ telegramId });
    if (!user) {
      user = new User({ telegramId, username: username || 'Sin username', firstName: firstName || 'Minero' });
      await user.save();
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

app.post('/api/user/update', async (req, res) => {
  try {
    const { telegramId, balance, activePlans, miningEarningsHistory, withdrawalHistory } = req.body;
    const updatedUser = await User.findOneAndUpdate(
      { telegramId },
      { balance, activePlans, miningEarningsHistory, withdrawalHistory },
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log( + '' + ?? Servidor backend corriendo en el puerto  + '' + ));
