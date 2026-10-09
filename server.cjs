const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const MONGO_URI = "mongodb+srv://adminaura:aura2026@cluster0.8kxvvf6.mongodb.net/auramining?retryWrites=true&w=majority&authSource=admin&appName=Cluster0";

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ ¡Conectado a MongoDB Atlas exitosamente!'))
  .catch(err => console.error('❌ Error conectando a MongoDB:', err));

const userSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
  username: String,
  firstName: String,
  balance: { type: Number, default: 0.00 },
  activePlans: { type: Array, default: [] },
  miningEarningsHistory: { type: Array, default: [] },
  withdrawalHistory: { type: Array, default: [] }
});

const User = mongoose.model('User', userSchema);

// Ruta para obtener o registrar al usuario al abrir la Mini App
app.post('/api/user', async (req, res) => {
  try {
    const { telegramId, username, firstName } = req.body;
    if (!telegramId) return res.status(400).json({ error: 'Falta el telegramId' });
    
    let user = await User.findOne({ telegramId });
    if (!user) {
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

// Ruta para guardar cambios permanentemente
app.post('/api/user/update', async (req, res) => {
  try {
    const { telegramId, balance, activePlans, miningEarningsHistory, withdrawalHistory } = req.body;
    if (!telegramId) return res.status(400).json({ error: 'Falta el telegramId' });

    const updateData = {};
    if (balance !== undefined) updateData.balance = balance;
    if (activePlans !== undefined) updateData.activePlans = activePlans;
    if (miningEarningsHistory !== undefined) updateData.miningEarningsHistory = miningEarningsHistory;
    if (withdrawalHistory !== undefined) updateData.withdrawalHistory = withdrawalHistory;

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

// Ruta backend corregida para la recarga manual de saldo desde el panel de admin
app.post('/api/admin/recharge', async (req, res) => {
  try {
    const { targetUser, amount } = req.body;
    if (!targetUser || !amount) {
      return res.status(400).json({ success: false, message: '⚠️ Faltan datos requeridos.' });
    }
    
    // Limpiamos la cadena de búsqueda eliminando espacios y la arroba si la hubiera
    const cleanQuery = targetUser.toString().trim().replace('@', '');

    // Buscamos si coincide con el telegramId o con el username (ignorando mayúsculas/minúsculas)
    let user = await User.findOne({
      $or: [
        { telegramId: cleanQuery },
        { username: { $regex: new RegExp(`^${cleanQuery}$`, 'i') } }
      ]
    });

    if (!user) {
      return res.status(404).json({ success: false, message: '⚠️ Usuario no encontrado en la base de datos.' });
    }

    user.balance += parseFloat(amount);
    await user.save();

    return res.json({ success: true, newBalance: user.balance });
  } catch (err) {
    console.error('Error en /api/admin/recharge:', err);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en el puerto ${PORT}`);
});
