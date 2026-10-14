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

// Esquema de Usuario Completo (Soporte MiniApp Telegram + Plataforma Web)
const userSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
  username: { type: String, sparse: true },
  email: { type: String, sparse: true },
  password: { type: String }, // Contraseña para la plataforma corporativa web
  firstName: String,
  balance: { type: Number, default: 0.00 },
  activePlans: { type: Array, default: [] },
  miningEarningsHistory: { type: Array, default: [] },
  withdrawalHistory: { type: Array, default: [] },
  depositHistory: { type: Array, default: [] },
  miningStartedAt: { type: Date, default: Date.now },
  referredBy: { type: String, default: null }
});

const User = mongoose.model('User', userSchema);

// Esquema para las solicitudes de retiro
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

// Esquema para los depósitos reportados por usuarios
const depositSchema = new mongoose.Schema({
  telegramId: { type: String, required: true },
  username: String,
  amount: { type: Number, required: true },
  txHash: { type: String, required: true },
  status: { type: String, default: 'Pendiente' }, // Pendiente, Aprobado, Rechazado
  date: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Deposit = mongoose.model('Deposit', depositSchema);

// Esquema para los Anuncios / Promociones Globales (Campanita)
const announcementSchema = new mongoose.Schema({
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Announcement = mongoose.model('Announcement', announcementSchema);

// --- 🔐 RUTAS DE AUTENTICACIÓN (LOGIN & REGISTRO WEB) ---

// Registro de Usuario Web
app.post('/api/auth/register', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Faltan datos requeridos.' });
    }

    const cleanId = identifier.trim().toLowerCase();
    const isEmail = cleanId.includes('@');

    let existing = await User.findOne(isEmail ? { email: cleanId } : { username: cleanId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'El usuario o correo ya está registrado.' });
    }

    const newUserId = 'user_' + Date.now();
    const newUser = new User({
      telegramId: newUserId,
      username: isEmail ? cleanId.split('@')[0] : cleanId,
      email: isEmail ? cleanId : undefined,
      password: password.trim(),
      firstName: cleanId,
      miningStartedAt: new Date()
    });

    await newUser.save();
    res.json({ success: true, user: newUser });
  } catch (err) {
    console.error('Error en /api/auth/register:', err);
    res.status(500).json({ success: false, message: 'Error en el servidor.' });
  }
});

// Inicio de Sesión de Usuario Web
app.post('/api/auth/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Faltan datos.' });
    }

    const cleanId = identifier.trim().toLowerCase();
    const isEmail = cleanId.includes('@');

    let user = await User.findOne(isEmail ? { email: cleanId } : { username: cleanId });
    if (!user) {
      user = await User.findOne({ telegramId: cleanId });
    }

    if (!user || user.password !== password.trim()) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas.' });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error('Error en /api/auth/login:', err);
    res.status(500).json({ success: false, message: 'Error en el servidor.' });
  }
});

// --- RUTAS DE USUARIO GENERAL ---

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

app.post('/api/user/update', async (req, res) => {
  try {
    const { telegramId, balance, activePlans, miningEarningsHistory, withdrawalHistory, depositHistory, miningStartedAt } = req.body;
    if (!telegramId) return res.status(400).json({ error: 'Falta el telegramId' });

    const updateData = {};
    if (balance !== undefined) updateData.balance = balance;
    if (activePlans !== undefined) updateData.activePlans = activePlans;
    if (miningEarningsHistory !== undefined) updateData.miningEarningsHistory = miningEarningsHistory;
    if (withdrawalHistory !== undefined) updateData.withdrawalHistory = withdrawalHistory;
    if (depositHistory !== undefined) updateData.depositHistory = depositHistory;
    
    // Solo actualiza miningStartedAt si se envía explícitamente (ej. al comprar un plan o reclamar)
    if (miningStartedAt !== undefined) {
      updateData.miningStartedAt = miningStartedAt;
    }

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

app.post('/api/user/deposit', async (req, res) => {
  try {
    const { telegramId, username, amount, txHash, date } = req.body;
    if (!telegramId || !amount || !txHash) {
      return res.status(400).json({ success: false, message: 'Faltan datos requeridos.' });
    }

    const newDeposit = new Deposit({
      telegramId,
      username: username || 'Usuario',
      amount: parseFloat(amount),
      txHash,
      date: date || new Date().toLocaleString()
    });

    await newDeposit.save();
    res.json({ success: true, deposit: newDeposit });
  } catch (error) {
    console.error('Error en /api/user/deposit:', error);
    res.status(500).json({ success: false, error: 'Error al registrar el depósito' });
  }
});

// --- RUTAS DE ADMINISTRACIÓN Y CONTROL ---

app.get('/api/admin/withdrawals', async (req, res) => {
  try {
    const requests = await WithdrawalRequest.find().sort({ createdAt: -1 });
    res.json({ success: true, requests });
  } catch (error) {
    console.error('Error en /api/admin/withdrawals:', error);
    res.status(500).json({ success: false, error: 'Error al obtener retiros' });
  }
});

app.post('/api/admin/withdrawal/update', async (req, res) => {
  try {
    const { id, status, telegramId } = req.body;
    
    const updatedRequest = await WithdrawalRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ success: false, message: 'Solicitud no encontrada' });
    }

    const targetTelegramId = telegramId || updatedRequest.telegramId;
    const finalUserStatus = status === 'Aprobado/Pagado' ? 'Exitoso' : status;

    if (targetTelegramId) {
      await User.updateOne(
        { telegramId: targetTelegramId, "withdrawalHistory.status": "Pendiente" },
        { $set: { "withdrawalHistory.$.status": finalUserStatus } }
      );
    }

    res.json({ success: true, updated: updatedRequest });
  } catch (error) {
    console.error('Error en /api/admin/withdrawal/update:', error);
    res.status(500).json({ success: false, error: 'Error al actualizar el estado' });
  }
});

app.get('/api/admin/deposits', async (req, res) => {
  try {
    const deposits = await Deposit.find().sort({ createdAt: -1 });
    res.json({ success: true, deposits });
  } catch (error) {
    console.error('Error en /api/admin/deposits:', error);
    res.status(500).json({ success: false, error: 'Error al obtener depósitos' });
  }
});

app.post('/api/admin/deposit/update', async (req, res) => {
  try {
    const { id, status, telegramId } = req.body;
    
    const updatedDeposit = await Deposit.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedDeposit) {
      return res.status(404).json({ success: false, message: 'Depósito no encontrado' });
    }

    const targetTelegramId = telegramId || updatedDeposit.telegramId;

    if (status === 'Aprobado') {
      const depositAmount = parseFloat(updatedDeposit.amount);

      let depositingUser = await User.findOne({ telegramId: targetTelegramId });
      if (depositingUser && depositingUser.referredBy) {
        let level1User = await User.findOne({ telegramId: depositingUser.referredBy });
        if (level1User) {
          level1User.balance += depositAmount * 0.10;
          await level1User.save();

          if (level1User.referredBy) {
            let level2User = await User.findOne({ telegramId: level1User.referredBy });
            if (level2User) {
              level2User.balance += depositAmount * 0.05;
              await level2User.save();

              if (level2User.referredBy) {
                let level3User = await User.findOne({ telegramId: level2User.referredBy });
                if (level3User) {
                  level3User.balance += depositAmount * 0.02;
                  await level3User.save();
                }
              }
            }
          }
        }
      }
    }

    if (targetTelegramId) {
      await User.updateOne(
        { telegramId: targetTelegramId, "depositHistory.status": "Pendiente" },
        { $set: { "depositHistory.$.status": status } }
      );
    }

    res.json({ success: true, updated: updatedDeposit });
  } catch (error) {
    console.error('Error en /api/admin/deposit/update:', error);
    res.status(500).json({ success: false, error: 'Error al actualizar el depósito' });
  }
});

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
        { username: { $regex: new RegExp(`^${cleanQuery}$`, 'i') } },
        { email: { $regex: new RegExp(`^${cleanQuery}$`, 'i') } }
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

// --- SISTEMA DE ANUNCIOS Y PROMOCIONES (CAMPANITA) ---

app.post('/api/admin/announcement', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'El mensaje es obligatorio' });
    }

    const newAnnouncement = new Announcement({
      message: message.trim(),
      createdAt: new Date()
    });
    await newAnnouncement.save();

    res.json({ success: true, message: 'Anuncio publicado con éxito' });
  } catch (error) {
    console.error('Error al guardar anuncio:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

app.get('/api/announcements', async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 }).limit(10);
    res.json({ success: true, announcements });
  } catch (error) {
    console.error('Error al obtener anuncios:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en el puerto ${PORT}`);
});
