import React, { useState, useEffect } from 'react';
import { 
  Cpu, Users, ShieldCheck, Wallet, 
  Globe, Copy, Sparkles, Zap, ArrowRight, Clock, Award, TrendingUp, History, CheckCircle2, AlertCircle, ShieldAlert, Check, X, PlusCircle, Gift, Layers 
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('mining');
  const [telegramUser, setTelegramUser] = useState(null);
  
  // 1. Balance persistente con validación de Dueño (@BreakThebank66 / ID: 6062598843)
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem('aura_balance');
    if (saved !== null) return JSON.parse(saved);
    
    // Si es el dueño, inicia con 150.00 USDT; para cualquier otro usuario inicia en 0.00
    const tg = window.Telegram?.WebApp;
    const user = tg?.initDataUnsafe?.user;
    const isOwner = user && (user.id === 6062598843 || user.username === 'BreakThebank66');
    
    return isOwner ? 150.00 : 0.00;
  }); 
  
  // 2. Planes activos persistentes
  const [activePlans, setActivePlans] = useState(() => {
    const saved = localStorage.getItem('aura_activePlans');
    return saved !== null ? JSON.parse(saved) : [];
  }); 

  const [copied, setCopied] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawWallet, setWithdrawWallet] = useState('');
  const [withdrawStatus, setWithdrawStatus] = useState(null);

  // Depósitos de Usuario y Admin
  const [depositAmount, setDepositAmount] = useState('');
  const [depositTxHash, setDepositTxHash] = useState('');
  const [depositStatus, setDepositStatus] = useState(null);
  
  const [adminDeposits, setAdminDeposits] = useState(() => {
    const saved = localStorage.getItem('aura_adminDeposits');
    return saved !== null ? JSON.parse(saved) : [
      { id: 201, user: '@pedro_crypto', userId: '112233', amount: '50.00', txHash: '0x8f9a...3e21', date: '07 Oct - 18:10', status: 'Pendiente' }
    ];
  });
  
  const [currentTime, setCurrentTime] = useState(new Date());

  const [miningSecondsLeft, setMiningSecondsLeft] = useState(86400); 
  const [isMiningReady, setIsMiningReady] = useState(false);
  const [miningEarningsHistory, setMiningEarningsHistory] = useState([
    { id: 1, amount: '1.20', date: '06 Oct 2026', time: '14:32' },
  ]);

  const [simulatedCryptoHash, setSimulatedCryptoHash] = useState('0.000000');

  const [teamLevels, setTeamLevels] = useState([
    { level: 'Nivel 1 (Directos)', activeUsers: 3, totalUsers: 5, commission: '10%', earned: '15.00' },
    { level: 'Nivel 2', activeUsers: 0, totalUsers: 0, commission: '5%', earned: '0.00' },
    { level: 'Nivel 3', activeUsers: 0, totalUsers: 0, commission: '2%', earned: '0.00' },
  ]);

  // 3. Historial de retiros persistente
  const [withdrawalHistory, setWithdrawalHistory] = useState(() => {
    const saved = localStorage.getItem('aura_withdrawalHistory');
    return saved !== null ? JSON.parse(saved) : [
      { id: 1, amount: '25.00', date: '06 Oct 2026', time: '14:32', status: 'Exitoso' },
      { id: 2, amount: '15.50', date: '04 Oct 2026', time: '09:15', status: 'Pendiente' },
    ];
  });

  // 4. Retiros de admin persistentes
  const [adminWithdrawals, setAdminWithdrawals] = useState(() => {
    const saved = localStorage.getItem('aura_adminWithdrawals');
    return saved !== null ? JSON.parse(saved) : [
      { id: 101, user: '@crypto_carlos', userId: '998877', amount: '30.00', wallet: 'TXYZ...abc99', date: '07 Oct - 16:20', status: 'Pendiente' },
      { id: 102, user: '@lucia_minera', userId: '445566', amount: '15.00', wallet: 'TLMN...xyz12', date: '07 Oct - 17:05', status: 'Aprobado/Pagado' },
    ];
  });

  const [manualRechargeUser, setManualRechargeUser] = useState('');
  const [manualRechargeAmount, setManualRechargeAmount] = useState('');
  const [adminMsg, setAdminMsg] = useState(null);

  useEffect(() => {
    localStorage.setItem('aura_balance', JSON.stringify(balance));
  }, [balance]);

  useEffect(() => {
    localStorage.setItem('aura_activePlans', JSON.stringify(activePlans));
  }, [activePlans]);

  useEffect(() => {
    localStorage.setItem('aura_withdrawalHistory', JSON.stringify(withdrawalHistory));
  }, [withdrawalHistory]);

  useEffect(() => {
    localStorage.setItem('aura_adminWithdrawals', JSON.stringify(adminWithdrawals));
  }, [adminWithdrawals]);

  useEffect(() => {
    localStorage.setItem('aura_adminDeposits', JSON.stringify(adminDeposits));
  }, [adminDeposits]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const tg = window.Telegram?.WebApp;
    if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
      setTelegramUser(tg.initDataUnsafe.user);
    } else {
      // Si estás probando localmente en navegador, puedes cambiar esto temporalmente para simular el dueño o un usuario normal
      setTelegramUser({ id: 6062598843, first_name: "Jose", username: "BreakThebank66" });
    }

    if (tg && tg.expand) {
      tg.expand();
    }

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let interval = null;
    let hashInterval = null;

    if (activePlans.length > 0 && !isMiningReady) {
      interval = setInterval(() => {
        setMiningSecondsLeft(prev => {
          if (prev <= 1) {
            setIsMiningReady(true);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      hashInterval = setInterval(() => {
        const randomHash = (Math.random() * 9.9999).toFixed(4);
        setSimulatedCryptoHash(randomHash);
      }, 120);
    }

    return () => {
      clearInterval(interval);
      clearInterval(hashInterval);
    };
  }, [activePlans.length, isMiningReady]);

  const formatTimeLeft = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getTotalRewardAmount = () => {
    return activePlans.reduce((acc, plan) => acc + plan.dailyReward, 0);
  };

  const handleClaimMining = () => {
    if (!isMiningReady || activePlans.length === 0) return;

    const totalReward = getTotalRewardAmount();
    setBalance(prev => prev + totalReward);

    const newRecord = {
      id: Date.now(),
      amount: totalReward.toFixed(2),
      date: currentTime.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: currentTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    };
    setMiningEarningsHistory([newRecord, ...miningEarningsHistory]);

    setIsMiningReady(false);
    setMiningSecondsLeft(86400);
  };

  const plans = [
    { id: 1, name: 'LEV 1 - Inicial', price: 10, dailyReward: 0.12, dailyPct: '1.2%', duration: '5 Meses (150 Días)' },
    { id: 2, name: 'LEV 2 - Avanzado', price: 50, dailyReward: 0.75, dailyPct: '1.5%', duration: '4.5 Meses (135 Días)' },
    { id: 3, name: 'LEV 3 - Pro', price: 100, dailyReward: 1.80, dailyPct: '1.8%', duration: '4 Meses (120 Días)' },
    { id: 4, name: 'LEV 4 - Élite', price: 500, dailyReward: 11.00, dailyPct: '2.2%', duration: '4 Meses (120 Días)' },
  ];

  const handleBuyPlan = (plan) => {
    if (balance < plan.price) {
      alert('⚠️ Saldo insuficiente en tu billetera para adquirir este plan. ¡Recarga saldo para continuar!');
      return;
    }

    setBalance(prev => prev - plan.price);

    const newActivePlan = {
      ...plan,
      uniqueId: Date.now() + Math.random(),
      purchasedAt: currentTime.toLocaleDateString()
    };

    setActivePlans(prev => [...prev, newActivePlan]);
    alert(`🎉 ¡Plan ${plan.name} adquirido con éxito! Se han descontado ${plan.price} USDT.`);
  };

  const handleCopyLink = () => {
    const refLink = `https://t.me/AuraMiningBot?start=ref_${telegramUser?.id || 'usrmine'}`;
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWithdraw = (e) => {
    e.preventDefault();
    const amountNum = parseFloat(withdrawAmount);
    if (isNaN(amountNum) || amountNum < 15) {
      setWithdrawStatus({ error: true, msg: '⚠️ El retiro mínimo es de 15 USDT.' });
      return;
    }
    if (amountNum > balance) {
      setWithdrawStatus({ error: true, msg: '⚠️ Fondos insuficientes en la billetera.' });
      return;
    }

    const uniqueId = Date.now();
    const formattedDateStr = `${currentTime.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })} - ${currentTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;

    const newRecord = {
      id: uniqueId,
      amount: amountNum.toFixed(2),
      date: currentTime.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: currentTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      status: 'Pendiente'
    };

    const newAdminRequest = {
      id: uniqueId,
      user: telegramUser?.username ? `@${telegramUser.username}` : (telegramUser?.first_name || 'Usuario'),
      userId: telegramUser?.id || '778899',
      amount: amountNum.toFixed(2),
      wallet: withdrawWallet.trim(),
      date: formattedDateStr,
      status: 'Pendiente'
    };

    setWithdrawalHistory([newRecord, ...withdrawalHistory]);
    setAdminWithdrawals(prev => [newAdminRequest, ...prev]);

    setWithdrawStatus({ error: false, msg: '🚀 ¡Retiro solicitado con éxito! Quedó en estado Pendiente.' });
    setBalance(prev => prev - amountNum);
    setWithdrawAmount('');
    setWithdrawWallet('');
  };

  const handleApproveWithdrawal = (id) => {
    setAdminWithdrawals(prev => prev.map(item => item.id === id ? { ...item, status: 'Aprobado/Pagado' } : item));
    setWithdrawalHistory(prev => prev.map(item => item.id === id ? { ...item, status: 'Exitoso' } : item));
  };

  const handleDenyWithdrawal = (id) => {
    setAdminWithdrawals(prev => prev.map(item => item.id === id ? { ...item, status: 'Denegado' } : item));
    setWithdrawalHistory(prev => prev.map(item => item.id === id ? { ...item, status: 'Denegado' } : item));
  };

  // Recarga manual con notificación verde visible por 8 segundos
  const handleManualRechargeSubmit = (e) => {
    e.preventDefault();
    const amountNum = parseFloat(manualRechargeAmount);
    if (!manualRechargeUser || isNaN(amountNum) || amountNum <= 0) {
      setAdminMsg({ error: true, msg: '⚠️ Completa el usuario/ID y un monto válido.' });
      return;
    }

    setBalance(prev => prev + amountNum);

    setAdminMsg({ 
      error: false, 
      msg: `✅ ¡Recarga exitosa! Se acreditaron ${amountNum.toFixed(2)} USDT al usuario ${manualRechargeUser}.` 
    });
    
    setManualRechargeUser('');
    setManualRechargeAmount('');

    setTimeout(() => {
      setAdminMsg(null);
    }, 8000);
  };

  const handleUserDepositRequest = (e) => {
    e.preventDefault();
    const amountNum = parseFloat(depositAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setDepositStatus({ error: true, msg: '⚠️ Ingresa un monto válido.' });
      return;
    }
    if (!depositTxHash.trim()) {
      setDepositStatus({ error: true, msg: '⚠️ Ingresa el Hash (TXID) de la transacción.' });
      return;
    }

    const newDeposit = {
      id: Date.now(),
      user: telegramUser?.username ? `@${telegramUser.username}` : (telegramUser?.first_name || 'Usuario'),
      userId: telegramUser?.id || '778899',
      amount: amountNum.toFixed(2),
      txHash: depositTxHash.trim(),
      date: `${currentTime.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })} - ${currentTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`,
      status: 'Pendiente'
    };

    setAdminDeposits(prev => [newDeposit, ...prev]);
    setDepositStatus({ error: false, msg: '✅ ¡Depósito reportado con éxito! El administrador lo validará en Binance pronto.' });
    setDepositAmount('');
    setDepositTxHash('');
  };

  const handleApproveDeposit = (id) => {
    const depositToApprove = adminDeposits.find(d => d.id === id);
    if (!depositToApprove || depositToApprove.status !== 'Pendiente') return;

    const depositAmountValue = parseFloat(depositToApprove.amount);
    const level1Commission = depositAmountValue * 0.10;

    setBalance(prev => prev + level1Commission);

    setTeamLevels(prevLevels => prevLevels.map((lvl, index) => {
      if (index === 0) {
        const currentEarned = parseFloat(lvl.earned || 0);
        return {
          ...lvl,
          activeUsers: lvl.activeUsers + 1,
          earned: (currentEarned + level1Commission).toFixed(2)
        };
      }
      return lvl;
    }));

    setAdminDeposits(prev => prev.map(item => item.id === id ? { ...item, status: 'Aprobado' } : item));
    alert(`✅ Depósito aprobado. Comisión de ${level1Commission.toFixed(2)} USDT acreditada a tu Nivel 1.`);
  };

  const handleDenyDeposit = (id) => {
    setAdminDeposits(prev => prev.map(item => item.id === id ? { ...item, status: 'Rechazado' } : item));
  };

  const formattedDate = currentTime.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  const formattedTime = currentTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  // Verificación si el usuario actual es el dueño
  const isOwner = telegramUser && (telegramUser.id === 6062598843 || telegramUser.username === 'BreakThebank66');

  return (
    <div style={styles.outerContainer}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
        html, body { 
          background-color: #020617; 
          color: #ffffff; 
          font-family: system-ui, -apple-system, sans-serif; 
          overflow: hidden; 
          width: 100vw;
          height: 100vh;
        }
        ::-webkit-scrollbar { display: none; }
        * { -ms-overflow-style: none; scrollbar-width: none; }

        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 15px rgba(52, 211, 153, 0.2); transform: scale(1); }
          50% { box-shadow: 0 0 30px rgba(52, 211, 153, 0.6); transform: scale(1.03); }
          100% { box-shadow: 0 0 15px rgba(52, 211, 153, 0.2); transform: scale(1); }
        }
        @keyframes spinBorder {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <div style={styles.phoneContainer}>
        
        <div style={styles.bgBlurContainer}>
          <div style={styles.bgImageLayer} />
          <div style={styles.bgDarkOverlay} />
        </div>

        <header style={styles.header}>
          <div>
            <h1 style={{ ...styles.headerTitle, fontSize: '18px', fontWeight: '900' }}>
              AURA MINING
            </h1>
            <p style={styles.headerSubtitle}>
              {telegramUser ? `ID: @${telegramUser.username || telegramUser.first_name}` : '⚡ AI CLOUD MINING'}
            </p>
          </div>
          
          <div style={styles.headerRight}>
            <div style={styles.clockPill}>
              <Clock size={11} color="#38bdf8" />
              <span>{formattedDate} - {formattedTime}</span>
            </div>

            <div style={styles.walletPill}>
              <Wallet size={14} color="#34d399" />
              <span style={{ fontSize: '13px', fontWeight: '800', color: '#34d399' }}>{balance.toFixed(2)} USDT</span>
            </div>
          </div>
        </header>

        <main style={styles.mainContent}>
          
          {activeTab === 'mining' && (
            <>
              <div style={styles.blueCardGrid}>
                <div style={styles.blueMetricCard}>
                  <span style={styles.cardLabel}>Planes Activos</span>
                  <span style={styles.cardValue}>{activePlans.length} Rigs</span>
                </div>
                <div style={styles.blueMetricCard}>
                  <span style={styles.cardLabel}>Rendimiento 24h</span>
                  <span style={{ fontSize: '16px', fontWeight: '900', color: '#34d399' }}>
                    +{getTotalRewardAmount().toFixed(2)} USDT
                  </span>
                </div>
              </div>

              <div style={styles.panelBox}>
                <div 
                  onClick={handleClaimMining}
                  style={{
                    ...styles.progressCircleContainerLarge,
                    cursor: (isMiningReady && activePlans.length > 0) ? 'pointer' : 'default',
                    animation: (isMiningReady && activePlans.length > 0) ? 'pulseGlow 2s infinite' : 'none',
                    borderRadius: '50%',
                    position: 'relative'
                  }}
                >
                  {activePlans.length > 0 && !isMiningReady && (
                    <div style={{
                      position: 'absolute',
                      inset: '-4px',
                      borderRadius: '50%',
                      border: '3px solid transparent',
                      borderTopColor: '#34d399',
                      borderRightColor: '#34d399',
                      animation: 'spinBorder 3s linear infinite',
                      pointerEvents: 'none'
                    }} />
                  )}

                  <div style={{
                    ...styles.progressRingLarge,
                    backgroundColor: (isMiningReady && activePlans.length > 0) ? 'rgba(16, 185, 129, 0.15)' : '#0b1329',
                    border: (isMiningReady && activePlans.length > 0) ? '2px dashed #34d399' : '4px solid #1e293b'
                  }}>
                    <Gift size={32} color={(isMiningReady && activePlans.length > 0) ? '#34d399' : '#94a3b8'} />
                    
                    <span style={{ fontSize: '12px', fontWeight: '900', color: (isMiningReady && activePlans.length > 0) ? '#34d399' : '#fff', marginTop: '4px' }}>
                      {activePlans.length === 0 ? 'SIN PLAN' : (isMiningReady ? '¡RECOGER!' : formatTimeLeft(miningSecondsLeft))}
                    </span>

                    {activePlans.length > 0 && !isMiningReady && (
                      <span style={{ fontSize: '9px', fontWeight: '800', color: '#34d399', fontFamily: 'monospace', letterSpacing: '0.5px', marginTop: '2px', opacity: 0.9 }}>
                        +{simulatedCryptoHash} USDT
                      </span>
                    )}
                  </div>
                </div>

                <h3 style={{ fontSize: '15px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center' }}>
                  {activePlans.length > 0 ? `${activePlans.length} Plan(es) Minando Activos` : '⚡ SISTEMA EN ESPERA'}
                </h3>
                <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px', textAlign: 'center' }}>
                  {activePlans.length > 0 
                    ? (isMiningReady ? '✨ ¡Ciclo de 24h completado! Toca la bolsa para cobrar tus ganancias.' : `Generando acumulado (+${getTotalRewardAmount().toFixed(2)} USDT por ciclo)`) 
                    : 'Adquiere uno o varios planes abajo para iniciar la minería'}
                </p>
              </div>

              {activePlans.length > 0 && (
                <div style={styles.panelBox}>
                  <h3 style={{ fontSize: '14px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#38bdf8' }}>
                    <Layers size={16} /> Mis Rigs de Minería Activos ({activePlans.length})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {activePlans.map((item, idx) => (
                      <div key={item.uniqueId || idx} style={styles.historyCard}>
                        <div>
                          <span style={{ fontSize: '12px', fontWeight: '900', color: '#ffffff' }}>{item.name}</span>
                          <span style={{ fontSize: '10px', color: '#34d399', display: 'block', marginTop: '2px' }}>
                            Genera: +{item.dailyReward} USDT / 24h
                          </span>
                        </div>
                        <span style={{ fontSize: '10px', color: '#38bdf8', backgroundColor: 'rgba(56, 189, 248, 0.1)', padding: '2px 8px', borderRadius: '6px', fontWeight: 'bold' }}>
                          Activo
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={styles.panelBox}>
                <h3 style={{ fontSize: '14px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#34d399' }}>
                  <TrendingUp size={16} /> Transacciones de Ganancias (Cobros)
                </h3>
                {miningEarningsHistory.length === 0 ? (
                  <p style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center', padding: '10px' }}>Aún no has recolectado ganancias.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {miningEarningsHistory.map((item) => (
                      <div key={item.id} style={styles.historyCard}>
                        <div>
                          <span style={{ fontSize: '12px', fontWeight: '900', color: '#34d399', display: 'block' }}>
                            +{item.amount} USDT <span style={{ fontSize: '10px', fontWeight: 'normal', color: '#94a3b8' }}>(Acreditado)</span>
                          </span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '10px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={10} /> {item.date} - {item.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: '800', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  ✨ Adquirir Nuevos Planes (Acumulativos)
                </h3>
                {plans.map(plan => (
                  <div key={plan.id} style={styles.planCard}>
                    <div>
                      <h4 style={{ fontSize: '13px', fontWeight: '900', color: '#fff' }}>{plan.name}</h4>
                      <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                        Diario: <span style={{ color: '#34d399', fontWeight: 'bold' }}>+{plan.dailyReward} USDT</span> ({plan.dailyPct})
                      </p>
                      <p style={{ fontSize: '10px', color: '#38bdf8', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={10} /> Duración: {plan.duration}
                      </p>
                    </div>
                    <button 
                      onClick={() => handleBuyPlan(plan)}
                      style={styles.actionButton}
                    >
                      {plan.price} USDT <ArrowRight size={14} style={{ marginLeft: '4px' }} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'team' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={styles.panelBox}>
                <h3 style={{ fontSize: '15px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Users size={18} color="#34d399" /> Programa de Referidos
                </h3>
                <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.5', marginBottom: '12px' }}>
                  Invita amigos y genera comisiones automáticas según su actividad en la red.
                </p>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#38bdf8', display: 'block', marginBottom: '6px' }}>Tu Enlace de Invitación</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text" 
                    readOnly 
                    value={`https://t.me/AuraMiningBot?start=ref_${telegramUser?.id || 'demo'}`} 
                    style={styles.inputField} 
                  />
                  <button onClick={handleCopyLink} style={styles.actionButton}>
                    <Copy size={14} /> {copied ? '¡Copiado!' : 'Copiar'}
                  </button>
                </div>
              </div>

              <div style={styles.panelBox}>
                <h3 style={{ fontSize: '14px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#38bdf8' }}>
                  <TrendingUp size={16} /> Rendimiento por Niveles
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {teamLevels.map((lvl, index) => (
                    <div key={index} style={styles.levelCard}>
                      <div>
                        <span style={{ fontSize: '12px', fontWeight: '800', color: '#ffffff', display: 'block' }}>{lvl.level}</span>
                        <span style={{ fontSize: '10px', color: '#94a3b8' }}>Comisión de red: {lvl.commission}</span>
                        <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#34d399', display: 'block', marginTop: '4px' }}>
                          Generado: {lvl.earned || '0.00'} USDT
                        </span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={styles.countBadge}>
                          <span style={{ color: '#34d399', fontWeight: '900' }}>{lvl.activeUsers}</span>
                          <span style={{ color: '#64748b' }}> / </span>
                          <span style={{ color: '#ffffff', fontWeight: '700' }}>{lvl.totalUsers}</span>
                        </div>
                        <span style={{ fontSize: '9px', color: '#94a3b8', display: 'block', marginTop: '2px' }}>Activos / Total</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'wallet' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              <div style={{ ...styles.panelBox, border: '1px solid rgba(52, 211, 153, 0.3)' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#34d399' }}>
                  <PlusCircle size={18} /> Recargar Saldo (USDT - TRC20)
                </h3>
                <p style={{ fontSize: '11px', color: '#cbd5e1', marginBottom: '10px' }}>
                  Transfiere USDT a nuestra dirección oficial y reporta tu pago aquí para acreditar tu saldo.
                </p>

                <div style={{ background: '#020617', padding: '10px', borderRadius: '8px', marginBottom: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '2px' }}>Dirección Oficial (TRC20):</span>
                  <strong style={{ fontSize: '11px', color: '#facc15', wordBreak: 'break-all' }}>
                    0x88255a44d0beed90ca4a1ff49711f855e9fe5f19
                  </strong>
                </div>

                {depositStatus && (
                  <div style={{ padding: '8px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', marginBottom: '10px', background: depositStatus.error ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)', color: depositStatus.error ? '#f87171' : '#34d399' }}>
                    {depositStatus.msg}
                  </div>
                )}

                <form onSubmit={handleUserDepositRequest} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#38bdf8', display: 'block', marginBottom: '4px' }}>Monto Enviado (USDT)</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      placeholder="Ej. 50.00" 
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      style={styles.inputField} 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#38bdf8', display: 'block', marginBottom: '4px' }}>Hash de la Transacción (TXID)</label>
                    <input 
                      type="text" 
                      placeholder="Pega aquí el TXID de tu transferencia" 
                      value={depositTxHash}
                      onChange={(e) => setDepositTxHash(e.target.value)}
                      style={styles.inputField} 
                    />
                  </div>
                  <button type="submit" style={{ ...styles.fullWidthButton, backgroundColor: '#10b981' }}>
                    📤 Reportar Depósito
                  </button>
                </form>
              </div>

              <div style={styles.panelBox}>
                <h3 style={{ fontSize: '15px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Wallet size={18} color="#34d399" /> Retirar Fondos (USDT)
                </h3>
                <p style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '12px' }}>Mínimo de retiro: 15 USDT (Red TRC20).</p>
                
                {withdrawStatus && (
                  <div style={{ padding: '10px', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold', marginBottom: '12px', background: withdrawStatus.error ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)', color: withdrawStatus.error ? '#f87171' : '#34d399', border: '1px solid currentColor' }}>
                    {withdrawStatus.msg}
                  </div>
                )}

                <form onSubmit={handleWithdraw} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#38bdf8', display: 'block', marginBottom: '4px' }}>Monto a Retirar (USDT)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      placeholder="15.00" 
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      style={styles.inputField} 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#38bdf8', display: 'block', marginBottom: '4px' }}>Dirección Billetera (TRC20)</label>
                    <input 
                      type="text" 
                      placeholder="T..." 
                      value={withdrawWallet}
                      onChange={(e) => setWithdrawWallet(e.target.value)}
                      style={styles.inputField} 
                    />
                  </div>
                  <button type="submit" style={styles.fullWidthButton}>
                    🚀 SOLICITAR RETIRO INMEDIATO
                  </button>
                </form>
              </div>

              <div style={styles.panelBox}>
                <h3 style={{ fontSize: '14px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#38bdf8' }}>
                  <History size={16} /> Historial de Retiros
                </h3>
                {withdrawalHistory.length === 0 ? (
                  <p style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center', padding: '10px' }}>No hay retiros registrados aún.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {withdrawalHistory.map((item) => {
                      const isSuccess = item.status === 'Exitoso';
                      return (
                        <div key={item.id} style={styles.historyCard}>
                          <div>
                            <span style={{ fontSize: '13px', fontWeight: '900', color: '#ffffff', display: 'block' }}>
                              {item.amount} USDT
                            </span>
                            <span style={{ fontSize: '10px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                              <Clock size={10} /> {item.date} - {item.time}
                            </span>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span style={{ 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              gap: '4px', 
                              fontSize: '11px', 
                              fontWeight: '800', 
                              padding: '3px 8px', 
                              borderRadius: '8px',
                              backgroundColor: isSuccess ? 'rgba(16, 185, 129, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                              color: isSuccess ? '#34d399' : '#facc15',
                              border: `1px solid ${isSuccess ? 'rgba(52, 211, 153, 0.3)' : 'rgba(250, 204, 21, 0.3)'}`
                            }}>
                              {isSuccess ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                              {item.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'company' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={styles.panelBox}>
                <h3 style={{ fontSize: '15px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <Globe size={18} color="#38bdf8" /> AuraMining LTD - Sede Global
                </h3>
                <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.5', marginBottom: '14px' }}>
                  Empresa líder en minería de criptomonedas impulsada por algoritmos de Inteligencia Artificial.
                </p>
                <div style={{ background: '#020617', padding: '14px', borderRadius: '12px', fontSize: '11px', color: '#cbd5e1', lineHeight: '1.6', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p>🏢 <strong>Razón Social:</strong> AuraMining Technologies LTD</p>
                  <p style={{ marginTop: '4px' }}>🏛️ <strong>Registro Mercantil UK:</strong> #14892341</p>
                  <p style={{ marginTop: '4px' }}>📍 <strong>Dirección:</strong> London, UK</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'admin' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {/* SOLO SE MUESTRA EL PANEL DE ADMIN SI ES EL DUEÑO (@BreakThebank66 / 6062598843) */}
              {isOwner ? (
                <>
                  <div style={{ ...styles.panelBox, border: '1px solid rgba(56, 189, 248, 0.4)' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#38bdf8' }}>
                      <PlusCircle size={16} /> Recarga Manual de Saldo (Dueño)
                    </h3>
                    
                    {/* NOTIFICACIÓN VERDE DE RECARGA (Dura 8 segundos) */}
                    {adminMsg && (
                      <div style={{ 
                        padding: '10px 12px', 
                        borderRadius: '8px', 
                        fontSize: '11px', 
                        fontWeight: 'bold', 
                        marginBottom: '10px', 
                        background: adminMsg.error ? 'rgba(239,68,68,0.2)' : 'rgba(16, 185, 129, 0.25)', 
                        color: adminMsg.error ? '#f87171' : '#34d399',
                        border: `1px solid ${adminMsg.error ? 'rgba(239,68,68,0.4)' : 'rgba(16, 185, 129, 0.5)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        {!adminMsg.error && <CheckCircle2 size={16} color="#34d399" />}
                        {adminMsg.msg}
                      </div>
                    )}

                    <form onSubmit={handleManualRechargeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#38bdf8', display: 'block', marginBottom: '4px' }}>ID o Username</label>
                        <input 
                          type="text" 
                          placeholder="@usuario" 
                          value={manualRechargeUser}
                          onChange={(e) => setManualRechargeUser(e.target.value)}
                          style={styles.inputField} 
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#38bdf8', display: 'block', marginBottom: '4px' }}>Monto a Sumar</label>
                        <input 
                          type="number" 
                          step="0.01"
                          placeholder="50.00" 
                          value={manualRechargeAmount}
                          onChange={(e) => setManualRechargeAmount(e.target.value)}
                          style={styles.inputField} 
                        />
                      </div>
                      <button type="submit" style={{ ...styles.fullWidthButton, backgroundColor: '#0ea5e9' }}>
                        ➕ ACREDITAR SALDO
                      </button>
                    </form>
                  </div>

                  <div style={{ ...styles.panelBox, border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#34d399' }}>
                      <Wallet size={16} /> Solicitudes de Depósito (Admin)
                    </h3>
                    {adminDeposits.length === 0 ? (
                      <p style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center', padding: '10px' }}>No hay depósitos pendientes.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {adminDeposits.map((dep) => (
                          <div key={dep.id} style={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                              <div>
                                <span style={{ fontSize: '12px', fontWeight: '900', color: '#ffffff' }}>{dep.user}</span>
                                <span style={{ fontSize: '11px', color: '#34d399', display: 'block', fontWeight: '800' }}>+{dep.amount} USDT</span>
                              </div>
                              <span style={{ fontSize: '10px', color: '#94a3b8' }}>{dep.date}</span>
                            </div>
                            <div style={{ fontSize: '10px', color: '#94a3b8', wordBreak: 'break-all', marginBottom: '8px', background: 'rgba(255,255,255,0.02)', padding: '6px', borderRadius: '6px' }}>
                              <strong>TXID:</strong> {dep.txHash}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '11px', fontWeight: 'bold', color: dep.status === 'Pendiente' ? '#facc15' : dep.status === 'Aprobado' ? '#34d399' : '#f87171' }}>
                                {dep.status}
                              </span>
                              {dep.status === 'Pendiente' && (
                                <div style={{ display: 'flex', gap: '6px' }}>
                                  <button onClick={() => handleApproveDeposit(dep.id)} style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '5px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
                                    Aprobar
                                  </button>
                                  <button onClick={() => handleDenyDeposit(dep.id)} style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '5px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
                                    Rechazar
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ ...styles.panelBox, border: '1px solid rgba(234, 179, 8, 0.4)' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#facc15' }}>
                      <ShieldAlert size={16} /> Solicitudes de Retiro (Admin)
                    </h3>
                    {adminWithdrawals.length === 0 ? (
                      <p style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center', padding: '10px' }}>No hay solicitudes.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {adminWithdrawals.map((req) => (
                          <div key={req.id} style={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                              <div>
                                <span style={{ fontSize: '13px', fontWeight: '900', color: '#ffffff' }}>{req.user} ({req.userId})</span>
                                <span style={{ fontSize: '11px', color: '#34d399', display: 'block', fontWeight: '800', marginTop: '2px' }}>Monto: {req.amount} USDT</span>
                              </div>
                              <span style={{ fontSize: '10px', color: '#94a3b8' }}>{req.date}</span>
                            </div>
                            <div style={{ fontSize: '10px', color: '#94a3b8', wordBreak: 'break-all', marginBottom: '10px', background: 'rgba(255,255,255,0.02)', padding: '6px', borderRadius: '6px' }}>
                              <strong>TRC20:</strong> {req.wallet}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '11px', fontWeight: 'bold', color: req.status === 'Pendiente' ? '#facc15' : req.status === 'Aprobado/Pagado' ? '#34d399' : '#f87171' }}>
                                Estado: {req.status}
                              </span>
                              {req.status === 'Pendiente' && (
                                <div style={{ display: 'flex', gap: '6px' }}>
                                  <button onClick={() => handleApproveWithdrawal(req.id)} style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}>
                                    <Check size={12} /> Pagar
                                  </button>
                                  <button onClick={() => handleDenyWithdrawal(req.id)} style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}>
                                    <X size={12} /> Denegar
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div style={{ ...styles.panelBox, textAlign: 'center', padding: '30px' }}>
                  <ShieldAlert size={32} color="#f87171" style={{ margin: '0 auto 10px auto' }} />
                  <h3 style={{ fontSize: '14px', fontWeight: '900', color: '#f87171' }}>Acceso Restringido</h3>
                  <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>Esta sección es exclusiva para el administrador general de Aura Mining.</p>
                </div>
              )}

            </div>
          )}

        </main>

        <nav style={styles.bottomNav}>
          <button onClick={() => setActiveTab('mining')} style={{ ...styles.navButton, color: activeTab === 'mining' ? '#34d399' : '#94a3b8' }}>
            <Cpu size={18} />
            <span style={styles.navText}>Minería</span>
          </button>
          <button onClick={() => setActiveTab('team')} style={{ ...styles.navButton, color: activeTab === 'team' ? '#34d399' : '#94a3b8' }}>
            <Users size={18} />
            <span style={styles.navText}>Equipo</span>
          </button>
          <button onClick={() => setActiveTab('wallet')} style={{ ...styles.navButton, color: activeTab === 'wallet' ? '#34d399' : '#94a3b8' }}>
            <Wallet size={18} />
            <span style={styles.navText}>Billetera</span>
          </button>
          <button onClick={() => setActiveTab('company')} style={{ ...styles.navButton, color: activeTab === 'company' ? '#34d399' : '#94a3b8' }}>
            <Globe size={18} />
            <span style={styles.navText}>Empresa</span>
          </button>
          {isOwner && (
            <button onClick={() => setActiveTab('admin')} style={{ ...styles.navButton, color: activeTab === 'admin' ? '#38bdf8' : '#94a3b8' }}>
              <ShieldAlert size={18} />
              <span style={styles.navText}>Admin</span>
            </button>
          )}
        </nav>

      </div>
    </div>
  );
}

const styles = {
  outerContainer: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#020617',
    overflow: 'hidden',
  },
  phoneContainer: {
    width: '100%',
    maxWidth: '420px',
    height: '100vh',
    maxHeight: '900px',
    backgroundColor: '#050b18',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 0 50px rgba(0,0,0,0.8)',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  bgBlurContainer: {
    position: 'absolute',
    inset: '0',
    overflow: 'hidden',
    zIndex: '0',
    pointerEvents: 'none',
  },
  bgImageLayer: {
    position: 'absolute',
    inset: '-20px',
    backgroundImage: 'url(/logo.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(40px)',
    opacity: '0.25',
  },
  bgDarkOverlay: {
    position: 'absolute',
    inset: '0',
    backgroundColor: 'rgba(3, 7, 18, 0.88)',
  },
  header: {
    position: 'relative',
    zIndex: '10',
    backgroundColor: 'rgba(5, 11, 24, 0.9)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexShrink: 0,
  },
  headerRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '4px',
  },
  headerTitle: {
    fontSize: '15px',
    fontWeight: '900',
    letterSpacing: '0.5px',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: '10px',
    fontWeight: '700',
    color: '#38bdf8',
    letterSpacing: '0.5px',
    marginTop: '2px',
  },
  clockPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '10px',
    fontWeight: '700',
    color: '#94a3b8',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    padding: '2px 8px',
    borderRadius: '8px',
  },
  walletPill: {
    backgroundColor: '#0b1329',
    border: '1px solid rgba(52, 211, 153, 0.3)',
    padding: '4px 10px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  mainContent: {
    position: 'relative',
    zIndex: '10',
    flex: '1',
    padding: '16px',
    overflowY: 'auto',
    overflowX: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    paddingBottom: '90px',
  },
  blueCardGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  blueMetricCard: {
    backgroundColor: '#1d4ed8',
    borderRadius: '16px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    boxShadow: '0 8px 20px rgba(29, 78, 216, 0.35)',
  },
  cardLabel: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#dbeafe',
    marginBottom: '6px',
  },
  cardValue: {
    fontSize: '18px',
    fontWeight: '900',
    color: '#ffffff',
  },
  panelBox: {
    backgroundColor: '#0b1329',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '18px',
    padding: '20px 18px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
  },
  progressCircleContainerLarge: {
    width: '130px',
    height: '130px',
    margin: '0 auto 14px auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    transition: 'all 0.3s ease',
  },
  progressRingLarge: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 25px rgba(0, 0, 0, 0.3)',
  },
  planCard: {
    backgroundColor: '#0b1329',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    padding: '14px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
  },
  levelCard: {
    backgroundColor: '#020617',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '12px',
    padding: '12px 14px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyCard: {
    backgroundColor: '#020617',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '12px',
    padding: '10px 12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  countBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '3px 10px',
    borderRadius: '8px',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
  },
  actionButton: {
    backgroundColor: '#1d4ed8',
    color: '#ffffff',
    border: 'none',
    padding: '9px 16px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '900',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    boxShadow: '0 4px 12px rgba(29, 78, 216, 0.4)',
  },
  fullWidthButton: {
    width: '100%',
    backgroundColor: '#1d4ed8',
    color: '#ffffff',
    border: 'none',
    padding: '12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '900',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(29, 78, 216, 0.4)',
    marginTop: '6px',
    textTransform: 'uppercase',
  },
  inputField: {
    width: '100%',
    backgroundColor: '#020617',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '12px',
    padding: '10px 12px',
    fontSize: '12px',
    color: '#ffffff',
    outline: 'none',
  },
  bottomNav: {
    position: 'absolute',
    bottom: '0',
    left: '0',
    right: '0',
    backgroundColor: 'rgba(5, 11, 24, 0.95)',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '10px 15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: '50',
    flexShrink: 0,
  },
  navButton: {
    background: 'none',
    border: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
    cursor: 'pointer',
  },
  navText: {
    fontSize: '9px',
    fontWeight: '700',
  },
};

