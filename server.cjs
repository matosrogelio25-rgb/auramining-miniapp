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
  withdrawalHistory: { type: Array, default: [] },
  miningStartedAt: { type: Date, default: Date.now },
  referredBy: { type: String, default: null }
});

const User = mongoose.model('User', userSchema);

// Esquema global para las solicitudes de retiro de la plataforma
const withdrawalRequestSchema = new mongoose.Schema({
  telegramId: { type: String, required: true },
  username: String,
  amount: { type: Number, required: true },
  wallet: { type: String, required: true },
  status: { type: String, default: 'Pendiente' }, // Pendiente, Aprobado/Pagado, Denegado
  date: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const WithdrawalRequest = mongoose.model('WithdrawalRequest', withdrawalRequestSchema);

// Ruta para obtener o registrar al usuario al abrir la Mini App (con soporte de referidos)
app.post('/api/user', async (req, res) => {
  try {
    const { telegramId, username, firstName, referredBy } = req.body;
    if (!telegramId) return res.status(400).json({ error: 'Falta el telegramId' });
    
    let user = await User.findOne({ telegramId });
    if (!user) {
      user = new User({ 
        telegramId, 
        username: username || 'Sin username', 
        firstName: firstName || 'Minero',
        miningStartedAt: new Date(),
        referredBy: referredBy || null
      });
      await user.save();
    } else if (referredBy && !user.referredBy && user.telegramId !== referredBy) {
      user.referredBy = referredBy;
      await user.save();
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error en /api/user:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Ruta para calcular y obtener las estadísticas de referidos por niveles (Nivel 1, 2 y 3)
app.post('/api/user/team', async (req, res) => {
  try {
    const { telegramId } = req.body;
    if (!telegramId) return res.status(400).json({ error: 'Falta el telegramId' });

    const level1Users = await User.find({ referredBy: telegramId.toString() });
    const level1Ids = level1Users.map(u => u.telegramId);

    let level2Users = [];
    if (level1Ids.length > 0) {
      level2Users = await User.find({ referredBy: { $in: level1Ids } });
    }
    const level2Ids = level2Users.map(u => u.telegramId);

    let level3Users = [];
    if (level2Ids.length > 0) {
      level3Users = await User.find({ referredBy: { $in: level2Ids } });
    }

    const countActive = (usersList) => usersList.filter(u => u.activePlans && u.activePlans.length > 0).length;

    const teamData = [
      {
        level: 'Nivel 1 (Directos)',
        activeUsers: countActive(level1Users),
        totalUsers: level1Users.length,
        commission: '10%',
        earned: '0.00'
      },
      {
        level: 'Nivel 2',
        activeUsers: countActive(level2Users),
        totalUsers: level2Users.length,
        commission: '5%',
        earned: '0.00'
      },
      {
        level: 'Nivel 3',
        activeUsers: countActive(level3Users),
        totalUsers: level3Users.length,
        commission: '2%',
        earned: '0.00'
      }
    ];

    res.json({ success: true, teamLevels: teamData });
  } catch (error) {
    console.error('Error en /api/user/team:', error);
    res.status(500).json({ error: 'Error al obtener el equipo' });
  }
});

// Ruta para guardar cambios permanentemente
app.post('/api/user/update', async (req, res) => {
  try {
    const { telegramId, balance, activePlans, miningEarningsHistory, withdrawalHistory, miningStartedAt } = req.body;
    if (!telegramId) return res.status(400).json({ error: 'Falta el telegramId' });

    const updateData = {};
    if (balance !== undefined) updateData.balance = balance;
    if (activePlans !== undefined) updateData.activePlans = activePlans;
    if (miningEarningsHistory !== undefined) updateData.miningEarningsHistory = miningEarningsHistory;
    if (withdrawalHistory !== undefined) updateData.withdrawalHistory = withdrawalHistory;
    if (miningStartedAt !== undefined) updateData.miningStartedAt = miningStartedAt;

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

// Ruta para crear una solicitud de retiro global
app.post('/api/user/withdraw', async (req, res) => {
  try {
    const { telegramId, username, amount, wallet, date } = req.body;
    if (!telegramId || !amount || !wallet) {
      return res.status(400).json({ success: false, message: 'Faltan datos requeridos.' });
    }

    const newRequest = new WithdrawalRequest({
      telegramId,
      username: username || 'Usuario',
      amount,
      wallet,
      date: date || new Date().toLocaleString()
    });

    await newRequest.save();
    res.json({ success: true, request: newRequest });
  } catch (error) {
    console.error('Error en /api/user/withdraw:', error);
    res.status(500).json({ success: false, error: 'Error al registrar el retiro' });
  }
});

// Ruta para que el administrador obtenga todas las solicitudes de retiro globales
app.get('/api/admin/withdrawals', async (req, res) => {
  try {
    const requests = await WithdrawalRequest.find().sort({ createdAt: -1 });
    res.json({ success: true, requests });
  } catch (error) {
    console.error('Error en /api/admin/withdrawals:', error);
    res.status(500).json({ success: false, error: 'Error al obtener retiros' });
  }
});

// Ruta para actualizar el estado de un retiro (Aprobado/Pagado o Denegado) desde el admin
app.post('/api/admin/withdrawal/update', async (req, res) => {
  try {
    const { id, status } = req.body;
    const updated = await WithdrawalRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    res.json({ success: true, updated });
  } catch (error) {
    console.error('Error en /api/admin/withdrawal/update:', error);
    res.status(500).json({ success: false, error: 'Error al actualizar el estado' });
  }
});

// Ruta para la recarga manual de saldo desde el panel de admin
app.post('/api/admin/recharge', async (req, res) => {
  try {
    const { targetUser, amount } = req.body;
    if (!targetUser || !amount) {
      return res.status(400).json({ success: false, message: '⚠️ Faltan datos requeridos.' });
    }
    
    const cleanQuery = targetUser.toString().trim().replace('@', '');

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
