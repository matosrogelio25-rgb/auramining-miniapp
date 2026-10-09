const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Se corrigió agregando el operador || para usar el respaldo si process.env.MONGO_URI no está definido
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://saucebtb:saucebtb1/?appName=Cluster0';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ ¡Conectado a MongoDB Atlas exitosamente!'))
  .catch(err => console.error('❌ Error conectando a MongoDB:', err));

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
      // Se agregaron los operadores || correctamente para los valores por defecto
      user = new User({ 
        telegramId, 
        username: username || 'Sin username', 
        firstName: firstName || 'Minero' 
      });
      await user.save();
    }
    res.json(user);
  } catch (error) {
    console.error('Error en /api/user:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

app.post('/api/user/update', async (req, res) => {
  try {
    const { telegramId, balance, activePlans, miningEarningsHistory, withdrawalHistory } = req.body;
    if (!telegramId) return res.status(400).json({ error: 'Falta el telegramId' });

    // Construimos dinámicamente el objeto de actualización para no sobreescribir con undefined
    const updateData = {};
    if (balance !== undefined) updateData.balance = balance;
    if (activePlans !== undefined) updateData.activePlans = activePlans;
    if (miningEarningsHistory !== undefined) updateData.miningEarningsHistory = miningEarningsHistory;
    if (withdrawalHistory !== undefined) updateData.withdrawalHistory = withdrawalHistory;

    // Usamos upsert: true para que si el usuario no existe por cualquier motivo, se cree automáticamente
    const updatedUser = await User.findOneAndUpdate(
      { telegramId },
      { $set: updateData },
      { new: true, upsert: true }
    );

    res.json(updatedUser);
  } catch (error) {
    console.error('Error en /api/user/update:', error);
    res.status(500).json({ error: 'Error al actualizar' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en el puerto ${PORT}`);
});
