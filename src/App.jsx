import React, { useState, useEffect, useRef } from 'react';
import { 
  Cpu, Users, ShieldCheck, Wallet, 
  Globe, Copy, Sparkles, Zap, ArrowRight, Clock, Award, TrendingUp, History, CheckCircle2, AlertCircle, ShieldAlert, Check, X, PlusCircle, Gift, Layers, RefreshCw, Bell 
} from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || 'https://auramining-miniapp.onrender.com';

const ADMIN_TELEGRAM_ID = '6062598843';

// Efectos de Sonido HD
const playCashSound = () => {
  const sound = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
  sound.volume = 0.6;
  sound.play().catch(() => {});
};

const playATMRegisterSound = () => {
  const sound = new Audio('https://assets.mixkit.co/active_storage/sfx/888/888-preview.mp3');
  sound.volume = 0.6;
  sound.play().catch(() => {});
};

// Tasas de cambio aproximadas por divisa respecto al USDT
const currencyRates = {
  USDT: { symbol: '$', rate: 1, flag: '🇺🇸', code: 'USDT' },
  COP: { symbol: '$', rate: 4100, flag: '🇨🇴', code: 'COP' },  
  MXN: { symbol: '$', rate: 18.5, flag: '🇲🇽', code: 'MXN' },  
  ARS: { symbol: '$', rate: 1250, flag: '🇦🇷', code: 'ARS' },  
  BRL: { symbol: 'R$', rate: 5.4, flag: '🇧🇷', code: 'BRL' },   
  VES: { symbol: 'Bs', rate: 40.0, flag: '🇻🇪', code: 'VES' },  
  PEN: { symbol: 'S/', rate: 3.75, flag: '🇵🇪', code: 'PEN' },  
  CLP: { symbol: '$', rate: 940, flag: '🇨🇱', code: 'CLP' },   
  EUR: { symbol: '€', rate: 0.92, flag: '🇪🇺', code: 'EUR' },   
  DOP: { symbol: 'RD$', rate: 60.0, flag: '🇩🇴', code: 'DOP' }  
};

// Diccionario de Traducciones para los 10 Idiomas
const translations = {
  es: {
    activePlans: "Planes Activos",
    performance24h: "Rendimiento 24h",
    noPlan: "SIN PLAN",
    claim: "¡RECOGER!",
    miningActive: "Plan(es) Minando Activos",
    systemStandby: "SISTEMA EN ESPERA",
    miningDescReady: "✨ ¡Ciclo de 24h completado! Toca la bolsa para cobrar tus ganancias.",
    miningDescWait: "Generando acumulado",
    miningDescEmpty: "Adquiere uno o varios planes abajo para iniciar la minería",
    myRigs: "Mis Rigs de Minería Activos",
    active: "Activo",
    earningsTx: "Transacciones de Ganancias (Cobros)",
    noEarnings: "Aún no has recolectado ganancias.",
    credited: "Acreditado",
    buyPlansTitle: "✨ Adquirir Nuevos Planes (Acumulativos)",
    daily: "Diario",
    tabMining: "Minería",
    tabTeam: "Equipo",
    tabWallet: "Billetera",
    tabCompany: "Empresa",
    tabAdmin: "Admin",
    referralTitle: "Programa de Referidos",
    referralDesc: "Invita amigos y genera comisiones automáticas según su actividad en la red.",
    inviteLink: "Tu Enlace de Invitación",
    copy: "Copiar",
    copied: "¡Copiado!",
    teamPerformance: "Rendimiento por Niveles",
    level1: "Nivel 1 (Directos)",
    level2: "Nivel 2",
    level3: "Nivel 3",
    generated: "Generado",
    activeTotal: "Activos / Total",
    rechargeTitle: "Recargar Saldo (USDT - TRC20)",
    rechargeDesc: "Transfiere USDT a nuestra dirección oficial y reporta tu pago aquí.",
    officialAddress: "Dirección Oficial (TRC20):",
    sentAmount: "Monto Enviado (USDT)",
    txHash: "Hash de la Transacción (TXID)",
    reportDeposit: "📤 Reportar Depósito",
    depositHistory: "Historial de Depósitos",
    noDeposits: "No hay depósitos registrados aún.",
    withdrawTitle: "Retirar Fondos (USDT)",
    withdrawMin: "Mínimo de retiro: 15 USDT (Red TRC20).",
    withdrawAmountLabel: "Monto a Retirar (USDT)",
    walletAddressLabel: "Dirección Billetera (TRC20)",
    requestWithdrawBtn: "🚀 SOLICITAR RETIRO INMEDIATO",
    withdrawHistory: "Historial de Retiros",
    noWithdrawals: "No hay retiros registrados aún.",
    companyAbout: "Somos una corporación global especializada en minería de criptomonedas de alto rendimiento y computación distribuida, operando bajo estrictos marcos legales y financieros internacionales.",
    legalName: "Razón Social:",
    officialReg: "Registro Oficial (UK):",
    headquarters: "Sede Central:",
    supportEmail: "Correo de Soporte:",
    farmsTitle: "Granjas de Minería & Energía Renovable",
    farmsDesc: "Nuestras operaciones se extienden a lo largo del Reino Unido y Europa. Diseñamos y operamos granjas de servidores ASIC de última generación impulsadas en su totalidad por energía solar, parques eólicos y fuentes 100% verdes, garantizando un modelo ecológico y sostenible.",
    globalCapacity: "Capacidad Operativa Global:",
    auditTitle: "Certificación Financiera AAA",
    auditDesc: "Contamos com la prestigiosa Certificación AAA otorgada por auditores internacionales independientes, avalando nuestra sólida solvencia, reservas en activos digitales y la estabilidad total de nuestros planes de minería en la nube.",
    fsRating: "Calificación FSK",
    blockchainAudit: "Auditoría Blockchain",
    hardwareInfra: "Infraestructura & Hardware",
    hardwareDesc: "Implementación masiva de ASICs Antminer S21 Pro con refrigeración líquida inmersiva para máxima eficiencia energética.",
    manualRechargeTitle: "Recarga Manual de Saldo (Dueño)",
    manualRechargeDesc: "Suma saldo directamente al usuario tras verificar su pago externo.",
    telegramIdLabel: "ID o Username de Telegram",
    amountToAddLabel: "Monto a Sumar (USDT)",
    creditBalanceBtn: "➕ ACREDITAR SALDO AL USUARIO",
    adminDepositsTitle: "Depósitos Reportados por Usuarios (Admin)",
    noPendingDeposits: "No hay depósitos pendientes.",
    approve: "Aprobar",
    reject: "Rechazar",
    adminWithdrawalsTitle: "Solicitudes de Retiro (Admin)",
    noPendingWithdrawals: "No hay solicitudes de retiro en la base de datos.",
    payApprove: "Pagar / Aprobar",
    deny: "Denegar",
    update: "Actualizar",
    statusPending: "Pendiente",
    statusApproved: "Aprobado",
    statusRejected: "Rechazado",
    statusSuccess: "Exitoso"
  },
  en: {
    activePlans: "Active Plans",
    performance24h: "24h Yield",
    noPlan: "NO PLAN",
    claim: "CLAIM!",
    miningActive: "Rig(s) Mining Active",
    systemStandby: "SYSTEM STANDBY",
    miningDescReady: "✨ 24h cycle complete! Tap the pouch to claim your earnings.",
    miningDescWait: "Generating accumulated",
    miningDescEmpty: "Purchase one or more plans below to start mining",
    myRigs: "My Active Mining Rigs",
    active: "Active",
    earningsTx: "Earnings Transactions (Claims)",
    noEarnings: "You haven't collected earnings yet.",
    credited: "Credited",
    buyPlansTitle: "✨ Acquire New Plans (Cumulative)",
    daily: "Daily",
    tabMining: "Mining",
    tabTeam: "Team",
    tabWallet: "Wallet",
    tabCompany: "Company",
    tabAdmin: "Admin",
    referralTitle: "Referral Program",
    referralDesc: "Invite friends and earn automatic commissions based on their network activity.",
    inviteLink: "Your Invitation Link",
    copy: "Copy",
    copied: "Copied!",
    teamPerformance: "Tier Performance",
    level1: "Tier 1 (Directs)",
    level2: "Tier 2",
    level3: "Tier 3",
    generated: "Generated",
    activeTotal: "Active / Total",
    rechargeTitle: "Recharge Balance (USDT - TRC20)",
    rechargeDesc: "Transfer USDT to our official address and report your payment here.",
    officialAddress: "Official Address (TRC20):",
    sentAmount: "Amount Sent (USDT)",
    txHash: "Transaction Hash (TXID)",
    reportDeposit: "📤 Report Deposit",
    depositHistory: "Deposit History",
    noDeposits: "No deposits registered yet.",
    withdrawTitle: "Withdraw Funds (USDT)",
    withdrawMin: "Minimum withdrawal: 15 USDT (TRC20 Network).",
    withdrawAmountLabel: "Amount to Withdraw (USDT)",
    walletAddressLabel: "Wallet Address (TRC20)",
    requestWithdrawBtn: "🚀 REQUEST IMMEDIATE WITHDRAWAL",
    withdrawHistory: "Withdrawal History",
    noWithdrawals: "No withdrawals registered yet.",
    companyAbout: "We are a global corporation specialized in high-performance cryptocurrency mining and distributed computing, operating under strict international legal and financial frameworks.",
    legalName: "Legal Name:",
    officialReg: "Official Registration (UK):",
    headquarters: "Headquarters:",
    supportEmail: "Support Email:",
    farmsTitle: "Mining Farms & Renewable Energy",
    farmsDesc: "Our operations extend throughout the UK and Europe. We design and operate state-of-the-art ASIC server farms powered entirely by 100% green energy.",
    globalCapacity: "Global Operational Capacity:",
    auditTitle: "AAA Financial Certification",
    auditDesc: "We hold the prestigious AAA Certification granted by independent international auditors, endorsing our solid solvency and total stability.",
    fsRating: "FSK Rating",
    blockchainAudit: "Blockchain Audit",
    hardwareInfra: "Infrastructure & Hardware",
    hardwareDesc: "Massive deployment of Antminer S21 Pro ASICs with immersive liquid cooling for maximum energy efficiency.",
    manualRechargeTitle: "Manual Balance Recharge (Owner)",
    manualRechargeDesc: "Add balance directly to the user after verifying their external payment.",
    telegramIdLabel: "Telegram ID or Username",
    amountToAddLabel: "Amount to Add (USDT)",
    creditBalanceBtn: "➕ CREDIT USER BALANCE",
    adminDepositsTitle: "User Reported Deposits (Admin)",
    noPendingDeposits: "No pending deposits.",
    approve: "Approve",
    reject: "Reject",
    adminWithdrawalsTitle: "Withdrawal Requests (Admin)",
    noPendingWithdrawals: "No withdrawal requests in the database.",
    payApprove: "Pay / Approve",
    deny: "Deny",
    update: "Update",
    statusPending: "Pending",
    statusApproved: "Approved",
    statusRejected: "Rejected",
    statusSuccess: "Successful"
  },
  pt: {
    activePlans: "Planos Ativos",
    performance24h: "Rendimento 24h",
    noPlan: "SEM PLANO",
    claim: "RESGATAR!",
    miningActive: "Rig(s) Minerando Ativos",
    systemStandby: "SISTEMA EM ESPERA",
    miningDescReady: "✨ Ciclo de 24h concluído! Toque na bolsa para resgatar seus ganhos.",
    miningDescWait: "Gerando acumulado",
    miningDescEmpty: "Adquira um ou mais planos abaixo para iniciar a mineração",
    myRigs: "Meus Rigs de Mineração Ativos",
    active: "Ativo",
    earningsTx: "Transações de Ganhos (Saques)",
    noEarnings: "Você ainda não coletou ganhos.",
    credited: "Creditado",
    buyPlansTitle: "✨ Adquirir Novos Planos (Acumulativos)",
    daily: "Diário",
    tabMining: "Mineração",
    tabTeam: "Equipe",
    tabWallet: "Carteira",
    tabCompany: "Empresa",
    tabAdmin: "Admin",
    referralTitle: "Programa de Indicações",
    referralDesc: "Convide amigos e gere comissões automáticas com base na atividade deles na rede.",
    inviteLink: "Seu Link de Convite",
    copy: "Copiar",
    copied: "Copiado!",
    teamPerformance: "Desempenho por Níveis",
    level1: "Nível 1 (Diretos)",
    level2: "Nível 2",
    level3: "Nível 3",
    generated: "Gerado",
    activeTotal: "Ativos / Total",
    rechargeTitle: "Recarregar Saldo (USDT - TRC20)",
    rechargeDesc: "Transfira USDT para nosso endereço oficial e informe seu pagamento aqui.",
    officialAddress: "Endereço Oficial (TRC20):",
    sentAmount: "Valor Enviado (USDT)",
    txHash: "Hash da Transação (TXID)",
    reportDeposit: "📤 Reportar Depósito",
    depositHistory: "Histórico de Depósitos",
    noDeposits: "Nenhum depósito registrado ainda.",
    withdrawTitle: "Retirar Fundos (USDT)",
    withdrawMin: "Retirada mínima: 15 USDT (Rede TRC20).",
    withdrawAmountLabel: "Valor a Retirar (USDT)",
    walletAddressLabel: "Endereço da Carteira (TRC20)",
    requestWithdrawBtn: "🚀 SOLICITAR RETIRADA IMEDIATA",
    withdrawHistory: "Histórico de Retiradas",
    noWithdrawals: "Nenhuma retirada registrada ainda.",
    companyAbout: "Somos uma corporação global especializada em mineração de criptomoedas de alto desempenho.",
    legalName: "Razão Social:",
    officialReg: "Registro Oficial (UK):",
    headquarters: "Sede Central:",
    supportEmail: "E-mail de Suporte:",
    farmsTitle: "Fazendas de Mineração & Energia Renovável",
    farmsDesc: "Nossas operações se estendem por todo o Reino Unido e Europa com fontes 100% verdes.",
    globalCapacity: "Capacidade Operacional Global:",
    auditTitle: "Certificação Financeira AAA",
    auditDesc: "Possuímos a prestigiosa Certificação AAA concedida por auditores internacionais independentes.",
    fsRating: "Classificação FSK",
    blockchainAudit: "Auditoria Blockchain",
    hardwareInfra: "Infraestrutura & Hardware",
    hardwareDesc: "Implantação massiva de ASICs Antminer S21 Pro com refrigeração líquida.",
    manualRechargeTitle: "Recarga Manual de Saldo (Dono)",
    manualRechargeDesc: "Adicione saldo diretamente ao usuário após verificar o pagamento.",
    telegramIdLabel: "ID ou Username do Telegram",
    amountToAddLabel: "Valor a Adicionar (USDT)",
    creditBalanceBtn: "➕ CREDITAR SALDO AO USUÁRIO",
    adminDepositsTitle: "Depósitos Reportados por Usuários (Admin)",
    noPendingDeposits: "Não há depósitos pendentes.",
    approve: "Aprovar",
    reject: "Rejeitar",
    adminWithdrawalsTitle: "Solicitações de Retirada (Admin)",
    noPendingWithdrawals: "Não há solicitações de retirada.",
    payApprove: "Pagar / Aprovar",
    deny: "Negar",
    update: "Atualizar",
    statusPending: "Pendente",
    statusApproved: "Aprovado",
    statusRejected: "Rejeitado",
    statusSuccess: "Bem-sucedido"
  },
  fr: {
    activePlans: "Plans Actifs",
    performance24h: "Rendement 24h",
    noPlan: "PAS DE PLAN",
    claim: "RÉCUPÉRER !",
    miningActive: "Rig(s) Minage Actif",
    systemStandby: "SYSTÈMES EN ATTENTE",
    miningDescReady: "✨ Cycle de 24h terminé ! Touchez la poche pour réclamer vos gains.",
    miningDescWait: "Génération cumulée",
    miningDescEmpty: "Achetez un ou plusieurs plans ci-dessous pour lancer le minage",
    myRigs: "Mes Rigs de Minage Actifs",
    active: "Actif",
    earningsTx: "Transactions de Gains (Retraits)",
    noEarnings: "Vous n'avez pas encore récolté de gains.",
    credited: "Crédité",
    buyPlansTitle: "✨ Acquérir de Nouveaux Plans (Cumulatifs)",
    daily: "Quotidien",
    tabMining: "Minage",
    tabTeam: "Équipe",
    tabWallet: "Portefeuille",
    tabCompany: "Société",
    tabAdmin: "Admin",
    referralTitle: "Programme de Parrainage",
    referralDesc: "Invitez des amis et générez des commissions automatiques.",
    inviteLink: "Votre Lien d'Invitation",
    copy: "Copier",
    copied: "Copié !",
    teamPerformance: "Performance par Niveaux",
    level1: "Niveau 1 (Directs)",
    level2: "Niveau 2",
    level3: "Niveau 3",
    generated: "Généré",
    activeTotal: "Actifs / Total",
    rechargeTitle: "Recharger le Solde (USDT - TRC20)",
    rechargeDesc: "Transférez des USDT sur notre adresse officielle.",
    officialAddress: "Adresse Officielle (TRC20):",
    sentAmount: "Montant Envoyé (USDT)",
    txHash: "Hash de la Transaction (TXID)",
    reportDeposit: "📤 Signaler le Dépôt",
    depositHistory: "Historique des Dépôts",
    noDeposits: "Aucun dépôt enregistré.",
    withdrawTitle: "Retirer des Fonds (USDT)",
    withdrawMin: "Retrait minimum : 15 USDT (TRC20).",
    withdrawAmountLabel: "Montant à Retirer (USDT)",
    walletAddressLabel: "Adresse du Portefeuille (TRC20)",
    requestWithdrawBtn: "🚀 DEMANDER UN RETRAIT IMMÉDIAT",
    withdrawHistory: "Historique des Retraits",
    noWithdrawals: "Aucun retrait enregistré.",
    companyAbout: "Entreprise mondiale spécialisée dans le minage haute performance.",
    legalName: "Raison Sociale :",
    officialReg: "Enregistrement (UK) :",
    headquarters: "Siège Social :",
    supportEmail: "E-mail de Support :",
    farmsTitle: "Fermes de Minage & Énergie Verte",
    farmsDesc: "Opérations au Royaume-Uni et en Europe avec 100% d'énergie verte.",
    globalCapacity: "Capacité Opérationnelle Globale :",
    auditTitle: "Certification Financière AAA",
    auditDesc: "Certification AAA accordée par des auditeurs indépendants.",
    fsRating: "Note FSK",
    blockchainAudit: "Audit Blockchain",
    hardwareInfra: "Infrastructure & Matériel",
    hardwareDesc: "Déploiement massif d'ASICs Antminer S21 Pro.",
    manualRechargeTitle: "Recharge Manuelle du Solde (Propriétaire)",
    manualRechargeDesc: "Ajoutez du solde directement à l'utilisateur.",
    telegramIdLabel: "ID ou Nom d'utilisateur Telegram",
    amountToAddLabel: "Montant à Ajouter (USDT)",
    creditBalanceBtn: "➕ CRÉDITER LE SOLDE",
    adminDepositsTitle: "Dépôts Signalés (Admin)",
    noPendingDeposits: "Aucun dépôt en attente.",
    approve: "Approuver",
    reject: "Rejeter",
    adminWithdrawalsTitle: "Demandes de Retrait (Admin)",
    noPendingWithdrawals: "Aucune demande.",
    payApprove: "Payer / Approuver",
    deny: "Refuser",
    update: "Mettre à jour",
    statusPending: "En attente",
    statusApproved: "Approuvé",
    statusRejected: "Rejeté",
    statusSuccess: "Réussi"
  },
  de: {
    activePlans: "Aktive Pläne",
    performance24h: "24h Ertrag",
    noPlan: "KEIN PLAN",
    claim: "ABHOLEN!",
    miningActive: "Rig(s) Mining aktiv",
    systemStandby: "SYSTEM BEREIT",
    miningDescReady: "✨ 24h Zyklus abgeschlossen!",
    miningDescWait: "Generiere akkumuliert",
    miningDescEmpty: "Erwerben Sie unten Pläne",
    myRigs: "Meine aktiven Mining Rigs",
    active: "Aktiv",
    earningsTx: "Verdiensttransaktionen",
    noEarnings: "Keine Einnahmen gesammelt.",
    credited: "Gutgeschrieben",
    buyPlansTitle: "✨ Neue Pläne erwerben",
    daily: "Täglich",
    tabMining: "Mining",
    tabTeam: "Team",
    tabWallet: "Brieftasche",
    tabCompany: "Unternehmen",
    tabAdmin: "Admin",
    referralTitle: "Empfehlungsprogramm",
    referralDesc: "Laden Sie Freunde ein.",
    inviteLink: "Einladungslink",
    copy: "Kopieren",
    copied: "Kopiert!",
    teamPerformance: "Stufenleistung",
    level1: "Stufe 1",
    level2: "Stufe 2",
    level3: "Stufe 3",
    generated: "Generiert",
    activeTotal: "Aktiv / Gesamt",
    rechargeTitle: "Guthaben aufladen",
    rechargeDesc: "Überweisen Sie USDT.",
    officialAddress: "Offizielle Adresse:",
    sentAmount: "Gesendeter Betrag",
    txHash: "Transaktions-Hash",
    reportDeposit: "📤 Einzahlung melden",
    depositHistory: "Einzahlungshistorie",
    noDeposits: "Keine Einzahlungen.",
    withdrawTitle: "Guthaben abheben",
    withdrawMin: "Mindestabhebung: 15 USDT",
    withdrawAmountLabel: "Auszahlungsbetrag",
    walletAddressLabel: "Wallet-Adresse",
    requestWithdrawBtn: "🚀 AUSZAHLUNG ANFORDERN",
    withdrawHistory: "Auszahlungshistorie",
    noWithdrawals: "Keine Auszahlungen.",
    companyAbout: "Globales Unternehmen für Kryptowährungs-Mining.",
    legalName: "Firmenname:",
    officialReg: "Registrierung (UK):",
    headquarters: "Hauptsitz:",
    supportEmail: "Support-E-Mail:",
    farmsTitle: "Mining-Farmen & Erneuerbare Energien",
    farmsDesc: "Betriebe in UK und Europa mit grünem Strom.",
    globalCapacity: "Kapazität:",
    auditTitle: "AAA Finanzzertifizierung",
    auditDesc: "Renommierte AAA-Zertifizierung.",
    fsRating: "FSK-Bewertung",
    blockchainAudit: "Blockchain-Prüfung",
    hardwareInfra: "Infrastruktur & Hardware",
    hardwareDesc: "Einsatz modernster ASICs.",
    manualRechargeTitle: "Manuelle Guthabenaufladung",
    manualRechargeDesc: "Guthaben hinzufügen.",
    telegramIdLabel: "Telegram-ID",
    amountToAddLabel: "Betrag",
    creditBalanceBtn: "➕ GUTSCHREIBEN",
    adminDepositsTitle: "Einzahlungen",
    noPendingDeposits: "Keine.",
    approve: "Genehmigen",
    reject: "Ablehnen",
    adminWithdrawalsTitle: "Auszahlungsanträge",
    noPendingWithdrawals: "Keine.",
    payApprove: "Genehmigen",
    deny: "Verweigern",
    update: "Aktualisieren",
    statusPending: "Ausstehend",
    statusApproved: "Genehmigt",
    statusRejected: "Abgelehnt",
    statusSuccess: "Erfolgreich"
  },
  it: {
    activePlans: "Piani Attivi",
    performance24h: "Rendimento 24h",
    noPlan: "NESSUN PIANO",
    claim: "RISCUOTI!",
    miningActive: "Rig Attivi",
    systemStandby: "IN ATTESA",
    miningDescReady: "✨ Ciclo completato!",
    miningDescWait: "Generazione",
    miningDescEmpty: "Acquista piani",
    myRigs: "I miei Rig",
    active: "Attivo",
    earningsTx: "Transazioni",
    noEarnings: "Nessun guadagno.",
    credited: "Accreditato",
    buyPlansTitle: "✨ Nuovi Piani",
    daily: "Giornaliero",
    tabMining: "Mining",
    tabTeam: "Team",
    tabWallet: "Portafoglio",
    tabCompany: "Azienda",
    tabAdmin: "Admin",
    referralTitle: "Referral",
    referralDesc: "Invita amici.",
    inviteLink: "Link di Invito",
    copy: "Copia",
    copied: "Copiato!",
    teamPerformance: "Livelli",
    level1: "Livello 1",
    level2: "Livello 2",
    level3: "Livello 3",
    generated: "Generato",
    activeTotal: "Attivi / Totale",
    rechargeTitle: "Ricarica Saldo",
    rechargeDesc: "Trasferisci USDT.",
    officialAddress: "Indirizzo Ufficiale:",
    sentAmount: "Importo Inviato",
    txHash: "TXID",
    reportDeposit: "📤 Segnala Deposito",
    depositHistory: "Cronologia",
    noDeposits: "Nessun deposito.",
    withdrawTitle: "Preleva",
    withdrawMin: "Minimo: 15 USDT",
    withdrawAmountLabel: "Importo",
    walletAddressLabel: "Indirizzo",
    requestWithdrawBtn: "🚀 RICHIEDI",
    withdrawHistory: "Prelievi",
    noWithdrawals: "Nessun prelievo.",
    companyAbout: "Corporazione globale di mining.",
    legalName: "Ragione Sociale:",
    officialReg: "Registrazione (UK):",
    headquarters: "Sede:",
    supportEmail: "Email:",
    farmsTitle: "Farm & Energia",
    farmsDesc: "Operazioni con energia verde.",
    globalCapacity: "Capacità:",
    auditTitle: "Certificazione AAA",
    auditDesc: "Certificazione indipendente.",
    fsRating: "FSK",
    blockchainAudit: "Audit",
    hardwareInfra: "Hardware",
    hardwareDesc: "ASIC Antminer.",
    manualRechargeTitle: "Ricarica Manuale",
    manualRechargeDesc: "Aggiungi saldo.",
    telegramIdLabel: "Telegram ID",
    amountToAddLabel: "Importo",
    creditBalanceBtn: "➕ ACCREDITA",
    adminDepositsTitle: "Depositi",
    noPendingDeposits: "Nessuno.",
    approve: "Approva",
    reject: "Rifiuta",
    adminWithdrawalsTitle: "Prelievi",
    noPendingWithdrawals: "Nessuno.",
    payApprove: "Approva",
    deny: "Nega",
    update: "Aggiorna",
    statusPending: "In attesa",
    statusApproved: "Approvato",
    statusRejected: "Rifiutato",
    statusSuccess: "Riuscito"
  },
  ru: {
    activePlans: "Активные планы",
    performance24h: "Доход 24ч",
    noPlan: "НЕТ ПЛАНА",
    claim: "ЗАБРАТЬ!",
    miningActive: "Майнинг активен",
    systemStandby: "ОЖИДАНИЕ",
    miningDescReady: "✨ Цикл завершен!",
    miningDescWait: "Генерация",
    miningDescEmpty: "Купите планы",
    myRigs: "Мои риги",
    active: "Активный",
    earningsTx: "История",
    noEarnings: "Нет прибыли.",
    credited: "Зачислено",
    buyPlansTitle: "✨ Купить планы",
    daily: "Ежедневно",
    tabMining: "Майнинг",
    tabTeam: "Команда",
    tabWallet: "Кошелек",
    tabCompany: "Компания",
    tabAdmin: "Админ",
    referralTitle: "Рефералы",
    referralDesc: "Приглашайте друзей.",
    inviteLink: "Ссылка",
    copy: "Копировать",
    copied: "Скопировано!",
    teamPerformance: "Уровни",
    level1: "Уровень 1",
    level2: "Уровень 2",
    level3: "Уровень 3",
    generated: "Заработано",
    activeTotal: "Активных / Всего",
    rechargeTitle: "Пополнение",
    rechargeDesc: "Переведите USDT.",
    officialAddress: "Адрес:",
    sentAmount: "Сумма",
    txHash: "TXID",
    reportDeposit: "📤 Сообщить",
    depositHistory: "История",
    noDeposits: "Нет.",
    withdrawTitle: "Вывод",
    withdrawMin: "Минимум: 15 USDT",
    withdrawAmountLabel: "Сумма",
    walletAddressLabel: "Адрес",
    requestWithdrawBtn: "🚀 ВЫВЕСТИ",
    withdrawalHistory: "История выводов",
    noWithdrawals: "Нет.",
    companyAbout: "Глобальная корпорация по майнингу.",
    legalName: "Название:",
    officialReg: "Регистрация (UK):",
    headquarters: "Штаб:",
    supportEmail: "Email:",
    farmsTitle: "Фермы",
    farmsDesc: "Зеленая энергия.",
    globalCapacity: "Мощность:",
    auditTitle: "Сертификат AAA",
    auditDesc: "Аудит.",
    fsRating: "FSK",
    blockchainAudit: "Блокчейн",
    hardwareInfra: "Оборудование",
    hardwareDesc: "ASIC майнеры.",
    manualRechargeTitle: "Ручное пополнение",
    manualRechargeDesc: "Пополнить.",
    telegramIdLabel: "Telegram ID",
    amountToAddLabel: "Сумма",
    creditBalanceBtn: "➕ ПОПОЛНИТЬ",
    adminDepositsTitle: "Депозиты",
    noPendingDeposits: "Нет.",
    approve: "Одобрить",
    reject: "Отклонить",
    adminWithdrawalsTitle: "Выводы",
    noPendingWithdrawals: "Нет.",
    payApprove: "Одобрить",
    deny: "Отказать",
    update: "Обновить",
    statusPending: "В ожидании",
    statusApproved: "Одобрено",
    statusRejected: "Отклонено",
    statusSuccess: "Успешно"
  },
  zh: {
    activePlans: "活动计划",
    performance24h: "24小时收益",
    noPlan: "无计划",
    claim: "领取！",
    miningActive: "矿机运行中",
    systemStandby: "待命",
    miningDescReady: "✨ 周期完成！",
    miningDescWait: "生成中",
    miningDescEmpty: "请购买计划",
    myRigs: "我的矿机",
    active: "活跃",
    earningsTx: "交易记录",
    noEarnings: "暂无收益",
    credited: "已入账",
    buyPlansTitle: "✨ 购买新计划",
    daily: "每日",
    tabMining: "挖矿",
    tabTeam: "团队",
    tabWallet: "钱包",
    tabCompany: "公司",
    tabAdmin: "管理",
    referralTitle: "推荐",
    referralDesc: "邀请好友",
    inviteLink: "邀请链接",
    copy: "复制",
    copied: "已复制！",
    teamPerformance: "层级业绩",
    level1: "一级",
    level2: "二级",
    level3: "三级",
    generated: "已赚取",
    activeTotal: "活跃 / 总计",
    rechargeTitle: "充值",
    rechargeDesc: "转入USDT",
    officialAddress: "官方地址：",
    sentAmount: "发送金额",
    txHash: "哈希",
    reportDeposit: "📤 报告充值",
    depositHistory: "历史",
    noDeposits: "暂无",
    withdrawTitle: "提现",
    withdrawMin: "最低：15 USDT",
    withdrawAmountLabel: "金额",
    walletAddressLabel: "地址",
    requestWithdrawBtn: "🚀 申请提现",
    withdrawHistory: "提现历史",
    noWithdrawals: "暂无",
    companyAbout: "专注于高性能加密货币挖矿的全球公司。",
    legalName: "公司名称：",
    officialReg: "注册号 (UK)：",
    headquarters: "总部：",
    supportEmail: "邮箱：",
    farmsTitle: "矿场",
    farmsDesc: "100%绿色能源。",
    globalCapacity: "算力：",
    auditTitle: "AAA认证",
    auditDesc: "独立审计。",
    fsRating: "评级",
    blockchainAudit: "审计",
    hardwareInfra: "硬件设备",
    hardwareDesc: "ASIC服务器",
    manualRechargeTitle: "手动充值",
    manualRechargeDesc: "直接充值",
    telegramIdLabel: "Telegram ID",
    amountToAddLabel: "金额",
    creditBalanceBtn: "➕ 充值",
    adminDepositsTitle: "充值审核",
    noPendingDeposits: "无",
    approve: "批准",
    reject: "拒绝",
    adminWithdrawalsTitle: "提现审核",
    noPendingWithdrawals: "无",
    payApprove: "批准",
    deny: "拒绝",
    update: "更新",
    statusPending: "待处理",
    statusApproved: "已批准",
    statusRejected: "已拒绝",
    statusSuccess: "成功"
  },
  ar: {
    activePlans: "الخطط النشطة",
    performance24h: "عائد 24 ساعة",
    noPlan: "لا توجد خطة",
    claim: "استلام!",
    miningActive: "التعدين نشط",
    systemStandby: "في الانتظار",
    miningDescReady: "✨ اكتملت الدورة!",
    miningDescWait: "توليد",
    miningDescEmpty: "اشتري خطة",
    myRigs: "منصاتي",
    active: "نشط",
    earningsTx: "المعاملات",
    noEarnings: "لا أرباح.",
    credited: "معتمد",
    buyPlansTitle: "✨ خطط جديدة",
    daily: "يومي",
    tabMining: "التعدين",
    tabTeam: "الفريق",
    tabWallet: "المحفظة",
    tabCompany: "الشركة",
    tabAdmin: "المشرف",
    referralTitle: "الإحالات",
    referralDesc: "ادع أصدقاءك",
    inviteLink: "رابط الدعوة",
    copy: "نسخ",
    copied: "تم النسخ!",
    teamPerformance: "المستويات",
    level1: "المستوى 1",
    level2: "المستوى 2",
    level3: "المستوى 3",
    generated: "المكتسب",
    activeTotal: "النشط / الإجمالي",
    rechargeTitle: "شحن الرصيد",
    rechargeDesc: "حول USDT",
    officialAddress: "العنوان:",
    sentAmount: "المبلغ",
    txHash: "TXID",
    reportDeposit: "📤 إبلاغ",
    depositHistory: "السجل",
    noDeposits: "لا توجد.",
    withdrawTitle: "سحب",
    withdrawMin: "الحد الأدنى: 15 USDT",
    withdrawAmountLabel: "المبلغ",
    walletAddressLabel: "العنوان",
    requestWithdrawBtn: "🚀 طلب سحب",
    withdrawHistory: "السجل",
    noWithdrawals: "لا توجد.",
    companyAbout: "شركة عالمية لتعدين العملات الرقمية.",
    legalName: "الاسم القانوني:",
    officialReg: "التسجيل (UK):",
    headquarters: "المقر:",
    supportEmail: "الدعم:",
    farmsTitle: "المزارع",
    farmsDesc: "طاقة خضراء.",
    globalCapacity: "القدرة:",
    auditTitle: "شهادة AAA",
    auditDesc: "تدقيق مالي.",
    fsRating: "FSK",
    blockchainAudit: "البلوكشين",
    hardwareInfra: "البنية التحتية",
    hardwareDesc: "خوادم ASIC.",
    manualRechargeTitle: "شحن يدوي",
    manualRechargeDesc: "إضافة رصيد.",
    telegramIdLabel: "Telegram ID",
    amountToAddLabel: "المبلغ",
    creditBalanceBtn: "➕ إضافة",
    adminDepositsTitle: "الإيداعات",
    noPendingDeposits: "لا توجد.",
    approve: "موافقة",
    reject: "رفض",
    adminWithdrawalsTitle: "السحوبات",
    noPendingWithdrawals: "لا توجد.",
    payApprove: "موافقة",
    deny: "رفض",
    update: "تحديث",
    statusPending: "قيد الانتظار",
    statusApproved: "تم الموافقة",
    statusRejected: "مرفوض",
    statusSuccess: "ناجح"
  },
  tr: {
    activePlans: "Aktif Planlar",
    performance24h: "24 Saat Verim",
    noPlan: "PLAN YOK",
    claim: "TOPLA!",
    miningActive: "Madencilik Aktif",
    systemStandby: "BEKLEMEDE",
    miningDescReady: "✨ Döngü tamamlandı!",
    miningDescWait: "Oluşturuluyor",
    miningDescEmpty: "Plan satın al",
    myRigs: "Rinklerim",
    active: "Aktif",
    earningsTx: "İşlemler",
    noEarnings: "Kazanç yok.",
    credited: "Yüklendi",
    buyPlansTitle: "✨ Yeni Planlar",
    daily: "Günlük",
    tabMining: "Madencilik",
    tabTeam: "Takım",
    tabWallet: "Cüzdan",
    tabCompany: "Şirket",
    tabAdmin: "Yönetici",
    referralTitle: "Yönlendirme",
    referralDesc: "Arkadaş davet et",
    inviteLink: "Davet Linki",
    copy: "Kopyala",
    copied: "Kopyalandı!",
    teamPerformance: "Seviyeler",
    level1: "Seviye 1",
    level2: "Seviye 2",
    level3: "Seviye 3",
    generated: "Üretilen",
    activeTotal: "Aktif / Toplam",
    rechargeTitle: "Bakiye Yükle",
    rechargeDesc: "USDT aktar.",
    officialAddress: "Resmi Adres:",
    sentAmount: "Tutar",
    txHash: "TXID",
    reportDeposit: "📤 Yatırım Bildir",
    depositHistory: "Geçmiş",
    noDeposits: "Yok.",
    withdrawTitle: "Çek",
    withdrawMin: "Minimum: 15 USDT",
    withdrawAmountLabel: "Tutar",
    walletAddressLabel: "Cüzdan",
    requestWithdrawBtn: "🚀 ÇEK",
    withdrawHistory: "Çekim Geçmişi",
    noWithdrawals: "Yok.",
    companyAbout: "Küresel kripto madencilik şirketi.",
    legalName: "Ünvan:",
    officialReg: "Kayıt (UK):",
    headquarters: "Merkez:",
    supportEmail: "E-posta:",
    farmsTitle: "Çiftlikler",
    farmsDesc: "Yeşil enerji.",
    globalCapacity: "Kapasite:",
    auditTitle: "AAA Sertifikası",
    auditDesc: "Denetim.",
    fsRating: "FSK",
    blockchainAudit: "Blok Zinciri",
    hardwareInfra: "Donanım",
    hardwareDesc: "ASIC sunucular.",
    manualRechargeTitle: "Manuel Bakiye",
    manualRechargeDesc: "Bakiye ekle.",
    telegramIdLabel: "Telegram ID",
    amountToAddLabel: "Tutar",
    creditBalanceBtn: "➕ YÜKLE",
    adminDepositsTitle: "Yatırımlar",
    noPendingDeposits: "Yok.",
    approve: "Onayla",
    reject: "Reddet",
    adminWithdrawalsTitle: "Çekimler",
    noPendingWithdrawals: "Yok.",
    payApprove: "Onayla",
    deny: "Reddet",
    update: "Güncelle",
    statusPending: "Beklemede",
    statusApproved: "Onaylandı",
    statusRejected: "Reddedildi",
    statusSuccess: "Başarılı"
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('mining');
  const [currentLang, setCurrentLang] = useState('es'); 
  const [selectedCurrency, setSelectedCurrency] = useState('USDT');
  const t = translations[currentLang] || translations.es;

  const [telegramUser, setTelegramUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const telegramIdRef = useRef('6062598843');
  
  const [balance, setBalance] = useState(0.00); 
  const [activePlans, setActivePlans] = useState([]); 

  const [copied, setCopied] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawWallet, setWithdrawWallet] = useState('');
  const [withdrawStatus, setWithdrawStatus] = useState(null);

  const [depositAmount, setDepositAmount] = useState('');
  const [depositTxHash, setDepositTxHash] = useState('');
  const [depositStatus, setDepositStatus] = useState(null);
  
  const [adminDeposits, setAdminDeposits] = useState([]);
  const [depositHistory, setDepositHistory] = useState([]);
  
  const [currentTime, setCurrentTime] = useState(new Date());

  const [miningSecondsLeft, setMiningSecondsLeft] = useState(86400); 
  const [isMiningReady, setIsMiningReady] = useState(false);
  const [miningEarningsHistory, setMiningEarningsHistory] = useState([]);

  const [simulatedCryptoHash, setSimulatedCryptoHash] = useState('0.000000');

  // Sistema de Notificaciones / Campanita Promo
  const [announcements, setAnnouncements] = useState([]);
  const [unreadAnnouncement, setUnreadAnnouncement] = useState(null);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [adminPromoText, setAdminPromoText] = useState('');
  const [promoMsgStatus, setPromoMsgStatus] = useState(null);

  const [teamLevels, setTeamLevels] = useState([
    { levelKey: 'level1', activeUsers: 0, totalUsers: 0, commission: '10%', earned: '0.00' },
    { levelKey: 'level2', activeUsers: 0, totalUsers: 0, commission: '5%', earned: '0.00' },
    { levelKey: 'level3', activeUsers: 0, totalUsers: 0, commission: '2%', earned: '0.00' },
  ]);

  const [withdrawalHistory, setWithdrawalHistory] = useState([]);
  const [adminWithdrawals, setAdminWithdrawals] = useState([]);

  const [manualRechargeUser, setManualRechargeUser] = useState('');
  const [manualRechargeAmount, setManualRechargeAmount] = useState('');
  const [adminMsg, setAdminMsg] = useState(null);

  // Formateador de Divisa Local
  const formatLocalCurrency = (amountUSDT) => {
    const currencyInfo = currencyRates[selectedCurrency] || currencyRates.USDT;
    if (selectedCurrency === 'USDT') {
      return `${amountUSDT.toFixed(2)} USDT`;
    }
    const converted = (amountUSDT * currencyInfo.rate).toLocaleString('es-ES', {
      maximumFractionDigits: 0
    });
    return `≈ ${currencyInfo.symbol} ${converted} ${currencyInfo.code}`;
  };

  // Reloj inteligente con formato adaptado al idioma/país (12h americano o 24h según región)
  const formatLocalizedClock = (date) => {
    const use12HourFormat = ['en', 'ar'].includes(currentLang);
    return date.toLocaleString(currentLang === 'en' ? 'en-US' : 'es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: use12HourFormat
    });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const initAndFetchUser = async () => {
      const tg = window.Telegram?.WebApp;
      let tId = null;
      let uName = 'Sin username';
      let fName = 'Minero';
      let startParam = null;

      if (tg) {
        if (tg.expand) tg.expand();
        if (tg.initDataUnsafe?.user) {
          tId = tg.initDataUnsafe.user.id.toString();
          uName = tg.initDataUnsafe.user.username || uName;
          fName = tg.initDataUnsafe.user.first_name || fName;
          setTelegramUser(tg.initDataUnsafe.user);
        }
        if (tg.initDataUnsafe?.start_param) {
          startParam = tg.initDataUnsafe.start_param;
        }
      }

      if (!tId) {
        tId = '6062598843';
        setTelegramUser({ id: tId, first_name: fName, username: uName });
      }

      // Captura robusta de start_param desde URL o Telegram WebApp
      const urlParams = new URLSearchParams(window.location.search);
      const queryStart = urlParams.get('start') || urlParams.get('tgWebAppStartParam');
      if (!startParam && queryStart) startParam = queryStart;

      let referredBy = null;
      if (startParam) {
        const cleanParam = startParam.toString().trim();
        referredBy = cleanParam.startsWith('ref_') ? cleanParam.replace('ref_', '') : cleanParam;
      }

      telegramIdRef.current = tId;
      setIsAdmin(tId === ADMIN_TELEGRAM_ID);

      try {
        const response = await fetch(`${API_URL}/api/user`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            telegramId: tId, 
            username: uName, 
            firstName: fName,
            referredBy: referredBy && referredBy !== tId ? referredBy : null 
          })
        });
        const data = await response.json();
        if (response.ok && data) {
          if (data.balance !== undefined) setBalance(data.balance);
          if (data.activePlans) setActivePlans(data.activePlans);
          if (data.miningEarningsHistory) setMiningEarningsHistory(data.miningEarningsHistory);
          if (data.withdrawalHistory) setWithdrawalHistory(data.withdrawalHistory);
          if (data.depositHistory) setDepositHistory(data.depositHistory);
          
          if (data.miningStartedAt) {
            const elapsedSeconds = Math.floor((new Date().getTime() - new Date(data.miningStartedAt).getTime()) / 1000);
            const remaining = 86400 - elapsedSeconds;
            if (remaining <= 0) {
              setIsMiningReady(true);
              setMiningSecondsLeft(0);
            } else {
              setMiningSecondsLeft(remaining);
              setIsMiningReady(false);
            }
          }
        }

        fetchAnnouncements(tId);

        const teamResponse = await fetch(`${API_URL}/api/user/team`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ telegramId: tId })
        });
        const teamData = await teamResponse.json();
        if (teamResponse.ok && teamData.success && teamData.teamLevels) {
          const mappedTeam = teamData.teamLevels.map((lvl, idx) => ({
            ...lvl,
            levelKey: idx === 0 ? 'level1' : idx === 1 ? 'level2' : 'level3'
          }));
          setTeamLevels(mappedTeam);
        }

        if (tId === ADMIN_TELEGRAM_ID) {
          fetchAdminWithdrawals();
          fetchAdminDeposits();
        }

      } catch (error) {
        console.error('Error conectando con MongoDB Atlas:', error);
      }
    };

    initAndFetchUser();

    return () => clearInterval(timer);
  }, []);

  const fetchAnnouncements = async (tId) => {
    try {
      const res = await fetch(`${API_URL}/api/announcements`);
      const data = await res.json();
      if (data.success && data.announcements && data.announcements.length > 0) {
        setAnnouncements(data.announcements);
        const lastReadId = localStorage.getItem(`aura_last_read_promo_${tId}`);
        const latest = data.announcements[0];
        if (!lastReadId || lastReadId !== latest._id) {
          setUnreadAnnouncement(latest);
        }
      }
    } catch (err) {
      console.error('Error al obtener anuncios:', err);
    }
  };

  const handleOpenPromoModal = () => {
    if (announcements.length > 0) {
      setUnreadAnnouncement(announcements[0]);
      setShowPromoModal(true);
      const tId = telegramUser?.id?.toString() || telegramIdRef.current;
      localStorage.setItem(`aura_last_read_promo_${tId}`, announcements[0]._id);
    }
  };

  const handleSendAnnouncement = async (e) => {
    e.preventDefault();
    if (!adminPromoText.trim()) return;

    try {
      const res = await fetch(`${API_URL}/api/admin/announcement`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: adminPromoText.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setPromoMsgStatus({ error: false, msg: '🚀 ¡Anuncio enviado con éxito a todos!' });
        setAdminPromoText('');
        fetchAnnouncements(telegramUser?.id?.toString() || telegramIdRef.current);
      } else {
        setPromoMsgStatus({ error: true, msg: '⚠️ Error al enviar anuncio.' });
      }
    } catch (err) {
      console.error('Error enviando anuncio:', err);
      setPromoMsgStatus({ error: true, msg: '⚠️ Error de red.' });
    }
    setTimeout(() => setPromoMsgStatus(null), 4000);
  };

  const fetchAdminWithdrawals = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/withdrawals`);
      const data = await res.json();
      if (data.success && data.requests) {
        const formatted = data.requests.map(req => ({
          ...req,
          id: req._id,
          user: req.username ? `@${req.username}` : 'Usuario'
        }));
        setAdminWithdrawals(formatted);
      }
    } catch (err) {
      console.error('Error al obtener retiros de admin:', err);
    }
  };

  const fetchAdminDeposits = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/deposits`);
      const data = await res.json();
      if (data.success && data.deposits) {
        const formatted = data.deposits.map(dep => ({
          ...dep,
          id: dep._id,
          user: dep.username ? `@${dep.username}` : 'Usuario'
        }));
        setAdminDeposits(formatted);
      }
    } catch (err) {
      console.error('Error al obtener depósitos de admin:', err);
    }
  };

  const syncToMongo = async (newBalance, newPlans, newMining, newWithdrawals, newDeposits, miningStartedAt) => {
    const currentId = telegramUser?.id?.toString() || telegramIdRef.current;
    if (!currentId) return;

    try {
      await fetch(`${API_URL}/api/user/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telegramId: currentId,
          balance: newBalance !== undefined ? newBalance : balance,
          activePlans: newPlans !== undefined ? newPlans : activePlans,
          miningEarningsHistory: newMining !== undefined ? newMining : miningEarningsHistory,
          withdrawalHistory: newWithdrawals !== undefined ? newWithdrawals : withdrawalHistory,
          depositHistory: newDeposits !== undefined ? newDeposits : depositHistory,
          miningStartedAt: miningStartedAt !== undefined ? miningStartedAt : undefined,
        })
      });
    } catch (error) {
      console.error('Error al guardar en MongoDB Atlas:', error);
    }
  };

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

    playATMRegisterSound(); 

    const totalReward = getTotalRewardAmount();
    const newBalance = balance + totalReward;
    setBalance(newBalance);

    const newRecord = {
      id: Date.now(),
      amount: totalReward.toFixed(2),
      date: currentTime.toLocaleDateString(),
      time: currentTime.toLocaleTimeString()
    };
    const updatedHistory = [newRecord, ...miningEarningsHistory];
    setMiningEarningsHistory(updatedHistory);

    setIsMiningReady(false);
    setMiningSecondsLeft(86400);
    const newStartTime = new Date();

    syncToMongo(newBalance, undefined, updatedHistory, undefined, undefined, newStartTime);
  };

  const plans = [
    { id: 1, name: 'LEV 1 - Inicial', price: 10, dailyReward: 0.12, dailyPct: '1.2%' },
    { id: 2, name: 'LEV 2 - Avanzado', price: 50, dailyReward: 0.75, dailyPct: '1.5%' },
    { id: 3, name: 'LEV 3 - Pro', price: 100, dailyReward: 1.80, dailyPct: '1.8%' },
    { id: 4, name: 'LEV 4 - Élite', price: 500, dailyReward: 11.00, dailyPct: '2.2%' },
  ];

  const handleBuyPlan = async (plan) => {
    if (balance < plan.price) {
      alert('⚠️ Saldo insuficiente en tu billetera.');
      return;
    }

    playCashSound(); 

    const newBalance = balance - plan.price;
    const newActivePlan = {
      ...plan,
      uniqueId: `${plan.id}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      purchasedAt: `${currentTime.toLocaleDateString()} ${currentTime.toLocaleTimeString()}`
    };

    const updatedPlans = [...activePlans, newActivePlan];

    setBalance(newBalance);
    setActivePlans(updatedPlans);
    setIsMiningReady(false);
    setMiningSecondsLeft(86400);
    const newStartTime = new Date();

    alert(`🎉 ¡Rig ${plan.name} adquirido con éxito! Se ha sumado a tus Rigs Activos.`);

    const currentId = telegramUser?.id?.toString() || telegramIdRef.current;
    if (currentId) {
      try {
        await fetch(`${API_URL}/api/user/update`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            telegramId: currentId,
            balance: newBalance,
            activePlans: updatedPlans,
            miningStartedAt: newStartTime
          })
        });
      } catch (error) {
        console.error('Error al guardar el plan acumulativo en MongoDB:', error);
      }
    }
  };

  const handleCopyLink = () => {
    const refLink = `https://t.me/auraminingg_bot?start=ref_${telegramUser?.id || telegramIdRef.current}`;
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWithdraw = async (e) => {
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

    const formattedDateStr = `${currentTime.toLocaleDateString()} - ${currentTime.toLocaleTimeString()}`;

    const newRecord = {
      id: Date.now(),
      amount: amountNum.toFixed(2),
      date: currentTime.toLocaleDateString(),
      time: currentTime.toLocaleTimeString(),
      status: 'Pendiente'
    };

    const updatedWithdrawals = [newRecord, ...withdrawalHistory];
    setWithdrawalHistory(updatedWithdrawals);

    const newBalance = balance - amountNum;
    setBalance(newBalance);
    setWithdrawStatus({ error: false, msg: '🚀 ¡Retiro solicitado con éxito!' });
    setWithdrawAmount('');
    setWithdrawWallet('');

    syncToMongo(newBalance, undefined, undefined, updatedWithdrawals, undefined, undefined);

    try {
      await fetch(`${API_URL}/api/user/withdraw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telegramId: telegramUser?.id?.toString() || telegramIdRef.current,
          username: telegramUser?.username || telegramUser?.first_name || 'Usuario',
          amount: amountNum.toFixed(2),
          wallet: withdrawWallet.trim(),
          date: formattedDateStr
        })
      });
      if (isAdmin) fetchAdminWithdrawals();
    } catch (err) {
      console.error('Error enviando retiro al servidor:', err);
    }
  };

  const handleApproveWithdrawal = async (id, targetTelegramId) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/withdrawal/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'Aprobado/Pagado', telegramId: targetTelegramId })
      });
      const data = await res.json();
      if (data.success) {
        setAdminWithdrawals(prev => prev.map(item => item.id === id ? { ...item, status: 'Aprobado/Pagado' } : item));
      }
    } catch (err) {
      console.error('Error aprobando retiro:', err);
    }
  };

  const handleDenyWithdrawal = async (id, targetTelegramId) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/withdrawal/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'Denegado', telegramId: targetTelegramId })
      });
      const data = await res.json();
      if (data.success) {
        setAdminWithdrawals(prev => prev.map(item => item.id === id ? { ...item, status: 'Denegado' } : item));
      }
    } catch (err) {
      console.error('Error denegando retiro:', err);
    }
  };

  const handleManualRechargeSubmit = async (e) => {
    e.preventDefault();
    if (!manualRechargeUser || !manualRechargeAmount) {
      setAdminMsg({ error: true, msg: '⚠️ Completa el ID o username y el monto.' });
      return;
    }

    const amountToAdd = parseFloat(manualRechargeAmount);
    if (isNaN(amountToAdd) || amountToAdd <= 0) {
      setAdminMsg({ error: true, msg: '⚠️ Ingresa un monto válido.' });
      return;
    }

    const cleanTarget = manualRechargeUser.trim().replace('@', '');

    try {
      const response = await fetch(`${API_URL}/api/admin/recharge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUser: cleanTarget,
          amount: amountToAdd
        })
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setAdminMsg({ error: false, msg: `✅ Se recargaron ${amountToAdd.toFixed(2)} USDT correctamente.` });
        if (cleanTarget === telegramUser?.username || cleanTarget === telegramUser?.id?.toString()) {
          setBalance(data.newBalance);
        }
        setManualRechargeUser('');
        setManualRechargeAmount('');
      } else {
        setAdminMsg({ error: true, msg: data.message || '⚠️ Error al acreditar saldo.' });
      }
    } catch (error) {
      console.error('Error en recarga manual:', error);
      setAdminMsg({ error: true, msg: '⚠️ Error de conexión.' });
    }
    setTimeout(() => setAdminMsg(null), 4000);
  };

  const handleUserDepositRequest = async (e) => {
    e.preventDefault();
    const amountNum = parseFloat(depositAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setDepositStatus({ error: true, msg: '⚠️ Ingresa un monto válido.' });
      return;
    }
    if (!depositTxHash.trim()) {
      setDepositStatus({ error: true, msg: '⚠️ Ingresa el Hash (TXID).' });
      return;
    }

    const formattedDateStr = `${currentTime.toLocaleDateString()} - ${currentTime.toLocaleTimeString()}`;

    const newDepositRecord = {
      id: Date.now(),
      amount: amountNum.toFixed(2),
      txHash: depositTxHash.trim(),
      date: formattedDateStr,
      status: 'Pendiente'
    };

    const updatedDeposits = [newDepositRecord, ...depositHistory];
    setDepositHistory(updatedDeposits);
    setDepositStatus({ error: false, msg: '✅ ¡Depósito reportado con éxito!' });
    setDepositAmount('');
    setDepositTxHash('');

    syncToMongo(undefined, undefined, undefined, undefined, updatedDeposits, undefined);

    try {
      await fetch(`${API_URL}/api/user/deposit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telegramId: telegramUser?.id?.toString() || telegramIdRef.current,
          username: telegramUser?.username || telegramUser?.first_name || 'Usuario',
          amount: amountNum.toFixed(2),
          txHash: depositTxHash.trim(),
          date: formattedDateStr
        })
      });
      if (isAdmin) fetchAdminDeposits();
    } catch (err) {
      console.error('Error enviando depósito al servidor:', err);
    }
  };

  const handleApproveDeposit = async (id, targetTelegramId) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/deposit/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'Aprobado', telegramId: targetTelegramId })
      });
      const data = await res.json();
      if (data.success) {
        setAdminDeposits(prev => prev.map(item => item.id === id ? { ...item, status: 'Aprobado' } : item));
        alert('✅ Depósito aprobado correctamente.');
        fetchAdminDeposits();
      }
    } catch (err) {
      console.error('Error aprobando depósito:', err);
    }
  };

  const handleDenyDeposit = async (id, targetTelegramId) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/deposit/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'Rechazado', telegramId: targetTelegramId })
      });
      const data = await res.json();
      if (data.success) {
        setAdminDeposits(prev => prev.map(item => item.id === id ? { ...item, status: 'Rechazado' } : item));
      }
    } catch (err) {
      console.error('Error rechazando depósito:', err);
    }
  };

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
        @keyframes blinkDot {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.2); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <div style={styles.phoneContainer}>
        <div style={styles.bgBlurContainer}>
          <div style={styles.bgImageLayer} />
          <div style={styles.bgDarkOverlay} />
        </div>

        <header style={styles.header}>
          <div>
            <h1 style={{ ...styles.headerTitle, fontSize: '22px', fontWeight: '900' }}>
              AURA MINING
            </h1>
            <p style={styles.headerSubtitle}>
              {telegramUser ? `ID: @${telegramUser.username || telegramUser.first_name}` : '⚡ AI CLOUD MINING'}
            </p>
            {/* Reloj con formato regional dinámico */}
            <span style={{ fontSize: '9px', color: '#94a3b8', display: 'block', marginTop: '1px', fontFamily: 'monospace' }}>
              {formatLocalizedClock(currentTime)}
            </span>
          </div>
          
          <div style={styles.headerRight}>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              {/* Botón de Moneda */}
              <div style={styles.langSelectorWrapper}>
                <select 
                  value={selectedCurrency} 
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  style={styles.langSelect}
                >
                  {Object.keys(currencyRates).map((curr) => (
                    <option key={curr} value={curr} style={styles.langOption}>
                      {currencyRates[curr].flag} {curr}
                    </option>
                  ))}
                </select>
              </div>

              {/* Botón de Idioma */}
              <div style={styles.langSelectorWrapper}>
                <Globe size={13} color="#38bdf8" />
                <select 
                  value={currentLang} 
                  onChange={(e) => setCurrentLang(e.target.value)}
                  style={styles.langSelect}
                >
                  <option value="es" style={styles.langOption}>🇪🇸 ES</option>
                  <option value="en" style={styles.langOption}>🇬🇧 EN</option>
                  <option value="pt" style={styles.langOption}>🇧🇷 PT</option>
                  <option value="fr" style={styles.langOption}>🇫🇷 FR</option>
                  <option value="de" style={styles.langOption}>🇩🇪 DE</option>
                  <option value="it" style={styles.langOption}>🇮🇹 IT</option>
                  <option value="ru" style={styles.langOption}>🇷🇺 RU</option>
                  <option value="zh" style={styles.langOption}>🇨🇳 ZH</option>
                  <option value="ar" style={styles.langOption}>🇸🇦 AR</option>
                  <option value="tr" style={styles.langOption}>🇹🇷 TR</option>
                </select>
              </div>

              {/* Botón Campanita / Notificaciones */}
              <button 
                onClick={handleOpenPromoModal}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '4px 6px',
                  cursor: 'pointer',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Bell size={15} color="#facc15" />
                {unreadAnnouncement && (
                  <span style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    width: '7px',
                    height: '7px',
                    backgroundColor: '#10b981',
                    borderRadius: '50%',
                    animation: 'blinkDot 1.5s infinite'
                  }} />
                )}
              </button>
            </div>

            <div style={styles.walletPill}>
              <Wallet size={14} color="#34d399" />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#34d399' }}>{balance.toFixed(2)} USDT</span>
                {selectedCurrency !== 'USDT' && (
                  <span style={{ fontSize: '8px', fontWeight: '700', color: '#facc15' }}>{formatLocalCurrency(balance)}</span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Modal de Promociones / Campanita */}
        {showPromoModal && unreadAnnouncement && (
          <div style={{
            position: 'fixed',
            inset: '0',
            backgroundColor: 'rgba(0,0,0,0.8)',
            zIndex: '1000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}>
            <div style={{
              backgroundColor: '#0b1329',
              border: '1px solid rgba(250, 204, 21, 0.4)',
              borderRadius: '20px',
              padding: '22px',
              width: '100%',
              maxWidth: '360px',
              boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Sparkles size={20} color="#facc15" />
                <h3 style={{ fontSize: '15px', fontWeight: '900', color: '#facc15' }}>📢 Anuncio Oficial / Promo</h3>
              </div>
              <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '16px', whiteSpace: 'pre-line' }}>
                {unreadAnnouncement.message}
              </p>
              <span style={{ fontSize: '9px', color: '#64748b', display: 'block', marginBottom: '16px' }}>
                Fecha: {new Date(unreadAnnouncement.createdAt || Date.now()).toLocaleDateString()}
              </span>
              <button 
                onClick={() => setShowPromoModal(false)}
                style={{
                  width: '100%',
                  backgroundColor: '#facc15',
                  color: '#020617',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '900',
                  cursor: 'pointer'
                }}
              >
                ENTENDIDO ¡GRACIAS!
              </button>
            </div>
          </div>
        )}

        <main style={styles.mainContent}>
          {activeTab === 'mining' && (
            <>
              <div style={styles.blueCardGrid}>
                <div style={styles.blueMetricCard}>
                  <span style={styles.cardLabel}>{t.activePlans}</span>
                  <span style={styles.cardValue}>{activePlans.length} Rigs</span>
                </div>
                <div style={styles.blueMetricCard}>
                  <span style={styles.cardLabel}>{t.performance24h}</span>
                  <span style={{ fontSize: '14px', fontWeight: '900', color: '#34d399' }}>
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
                      {activePlans.length === 0 ? t.noPlan : (isMiningReady ? t.claim : formatTimeLeft(miningSecondsLeft))}
                    </span>

                    {activePlans.length > 0 && !isMiningReady && (
                      <span style={{ fontSize: '9px', fontWeight: '800', color: '#34d399', fontFamily: 'monospace', letterSpacing: '0.5px', marginTop: '2px', opacity: 0.9 }}>
                        +{simulatedCryptoHash} USDT
                      </span>
                    )}
                  </div>
                </div>

                <h3 style={{ fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center' }}>
                  {activePlans.length > 0 ? `${activePlans.length} ${t.miningActive}` : t.systemStandby}
                </h3>
                <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px', textAlign: 'center' }}>
                  {activePlans.length > 0 
                    ? (isMiningReady ? t.miningDescReady : `${t.miningDescWait} (+${getTotalRewardAmount().toFixed(2)} USDT)`) 
                    : t.miningDescEmpty}
                </p>
              </div>

              {activePlans.length > 0 && (
                <div style={styles.panelBox}>
                  <h3 style={{ fontSize: '14px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#38bdf8' }}>
                    <Layers size={16} /> {t.myRigs} ({activePlans.length})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {activePlans.map((item, idx) => (
                      <div key={item.uniqueId || idx} style={styles.historyCard}>
                        <div>
                          <span style={{ fontSize: '12px', fontWeight: '900', color: '#ffffff' }}>{item.name}</span>
                          <span style={{ fontSize: '10px', color: '#34d399', display: 'block', marginTop: '2px' }}>
                            +{item.dailyReward} USDT / 24h
                          </span>
                        </div>
                        <span style={{ fontSize: '10px', color: '#38bdf8', backgroundColor: 'rgba(56, 189, 248, 0.1)', padding: '2px 8px', borderRadius: '6px', fontWeight: 'bold' }}>
                          {t.active}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={styles.panelBox}>
                <h3 style={{ fontSize: '14px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#34d399' }}>
                  <TrendingUp size={16} /> {t.earningsTx}
                </h3>
                {miningEarningsHistory.length === 0 ? (
                  <p style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center', padding: '10px' }}>{t.noEarnings}</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {miningEarningsHistory.map((item) => (
                      <div key={item.id} style={styles.historyCard}>
                        <div>
                          <span style={{ fontSize: '12px', fontWeight: '900', color: '#34d399', display: 'block' }}>
                            +{item.amount} USDT <span style={{ fontSize: '10px', fontWeight: 'normal', color: '#94a3b8' }}>({t.credited})</span>
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
                  {t.buyPlansTitle}
                </h3>
                {plans.map(plan => (
                  <div key={plan.id} style={styles.planCard}>
                    <div>
                      <h4 style={{ fontSize: '13px', fontWeight: '900', color: '#fff' }}>{plan.name}</h4>
                      <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                        {t.daily}: <span style={{ color: '#34d399', fontWeight: 'bold' }}>+{plan.dailyReward} USDT</span> ({plan.dailyPct})
                      </p>
                      {selectedCurrency !== 'USDT' && (
                        <span style={{ fontSize: '10px', color: '#facc15', fontWeight: 'bold', display: 'block', marginTop: '2px' }}>
                          {formatLocalCurrency(plan.price)}
                        </span>
                      )}
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
                  <Users size={18} color="#34d399" /> {t.referralTitle}
                </h3>
                <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.5', marginBottom: '12px' }}>
                  {t.referralDesc}
                </p>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#38bdf8', display: 'block', marginBottom: '6px' }}>{t.inviteLink}</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text" 
                    readOnly 
                    value={`https://t.me/auraminingg_bot?start=ref_${telegramUser?.id || telegramIdRef.current}`} 
                    style={styles.inputField} 
                  />
                  <button onClick={handleCopyLink} style={styles.actionButton}>
                    <Copy size={14} /> {copied ? t.copied : t.copy}
                  </button>
                </div>
              </div>

              <div style={styles.panelBox}>
                <h3 style={{ fontSize: '14px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#38bdf8' }}>
                  <TrendingUp size={16} /> {t.teamPerformance}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {teamLevels.map((lvl, index) => (
                    <div key={index} style={styles.levelCard}>
                      <div>
                        <span style={{ fontSize: '12px', fontWeight: '800', color: '#ffffff', display: 'block' }}>
                          {t[lvl.levelKey] || lvl.levelKey}
                        </span>
                        <span style={{ fontSize: '10px', color: '#94a3b8' }}>Comisión: {lvl.commission}</span>
                        <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#34d399', display: 'block', marginTop: '4px' }}>
                          {t.generated}: {lvl.earned || '0.00'} USDT
                        </span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={styles.countBadge}>
                          <span style={{ color: '#34d399', fontWeight: '900' }}>{lvl.activeUsers}</span>
                          <span style={{ color: '#64748b' }}> / </span>
                          <span style={{ color: '#ffffff', fontWeight: '700' }}>{lvl.totalUsers}</span>
                        </div>
                        <span style={{ fontSize: '9px', color: '#94a3b8', display: 'block', marginTop: '2px' }}>{t.activeTotal}</span>
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
                  <PlusCircle size={18} /> {t.rechargeTitle}
                </h3>
                <p style={{ fontSize: '11px', color: '#cbd5e1', marginBottom: '10px' }}>
                  {t.rechargeDesc}
                </p>

                <div style={{ background: '#020617', padding: '10px', borderRadius: '8px', marginBottom: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '2px' }}>{t.officialAddress}</span>
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
                    <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#38bdf8', display: 'block', marginBottom: '4px' }}>{t.sentAmount}</label>
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
                    <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#38bdf8', display: 'block', marginBottom: '4px' }}>{t.txHash}</label>
                    <input 
                      type="text" 
                      placeholder="TXID..." 
                      value={depositTxHash}
                      onChange={(e) => setDepositTxHash(e.target.value)}
                      style={styles.inputField} 
                    />
                  </div>
                  <button type="submit" style={{ ...styles.fullWidthButton, backgroundColor: '#10b981' }}>
                    {t.reportDeposit}
                  </button>
                </form>
              </div>

              <div style={styles.panelBox}>
                <h3 style={{ fontSize: '14px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#38bdf8' }}>
                  <History size={16} /> {t.depositHistory}
                </h3>
                {depositHistory.length === 0 ? (
                  <p style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center', padding: '10px' }}>{t.noDeposits}</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {depositHistory.map((item) => {
                      const isSuccess = item.status === 'Aprobado';
                      const isDenied = item.status === 'Rechazado';
                      return (
                        <div key={item.id} style={styles.historyCard}>
                          <div>
                            <span style={{ fontSize: '13px', fontWeight: '900', color: '#ffffff', display: 'block' }}>
                              {item.amount} USDT
                            </span>
                            <span style={{ fontSize: '10px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                              <Clock size={10} /> {item.date}
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
                              backgroundColor: isSuccess ? 'rgba(16, 185, 129, 0.15)' : isDenied ? 'rgba(239, 68, 68, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                              color: isSuccess ? '#34d399' : isDenied ? '#f87171' : '#facc15',
                              border: `1px solid ${isSuccess ? 'rgba(52, 211, 153, 0.3)' : isDenied ? 'rgba(239, 68, 68, 0.3)' : 'rgba(250, 204, 21, 0.3)'}`
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

              <div style={styles.panelBox}>
                <h3 style={{ fontSize: '15px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Wallet size={18} color="#34d399" /> {t.withdrawTitle}
                </h3>
                <p style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '12px' }}>{t.withdrawMin}</p>
                
                {withdrawStatus && (
                  <div style={{ padding: '10px', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold', marginBottom: '12px', background: withdrawStatus.error ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)', color: withdrawStatus.error ? '#f87171' : '#34d399', border: '1px solid currentColor' }}>
                    {withdrawStatus.msg}
                  </div>
                )}

                <form onSubmit={handleWithdraw} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#38bdf8', display: 'block', marginBottom: '4px' }}>{t.withdrawAmountLabel}</label>
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
                    <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#38bdf8', display: 'block', marginBottom: '4px' }}>{t.walletAddressLabel}</label>
                    <input 
                      type="text" 
                      placeholder="T..." 
                      value={withdrawWallet}
                      onChange={(e) => setWithdrawWallet(e.target.value)}
                      style={styles.inputField} 
                    />
                  </div>
                  <button type="submit" style={styles.fullWidthButton}>
                    {t.requestWithdrawBtn}
                  </button>
                </form>
              </div>

              <div style={styles.panelBox}>
                <h3 style={{ fontSize: '14px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#38bdf8' }}>
                  <History size={16} /> {t.withdrawHistory}
                </h3>
                {withdrawalHistory.length === 0 ? (
                  <p style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center', padding: '10px' }}>{t.noWithdrawals}</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {withdrawalHistory.map((item) => {
                      const isSuccess = item.status === 'Exitoso' || item.status === 'Aprobado/Pagado';
                      const isDenied = item.status === 'Denegado';
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
                              backgroundColor: isSuccess ? 'rgba(16, 185, 129, 0.15)' : isDenied ? 'rgba(239, 68, 68, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                              color: isSuccess ? '#34d399' : isDenied ? '#f87171' : '#facc15',
                              border: `1px solid ${isSuccess ? 'rgba(52, 211, 153, 0.3)' : isDenied ? 'rgba(239, 68, 68, 0.3)' : 'rgba(250, 204, 21, 0.3)'}`
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
                  <Globe size={18} color="#38bdf8" /> AuraMining Technologies Ltd.
                </h3>
                <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.5', marginBottom: '14px' }}>
                  {t.companyAbout}
                </p>
                
                <div style={{ background: '#020617', padding: '14px', borderRadius: '12px', fontSize: '11px', color: '#cbd5e1', lineHeight: '1.6', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p>🏢 <strong>{t.legalName}</strong> AuraMining Technologies Ltd.</p>
                  <p style={{ marginTop: '4px' }}>🏛️ <strong>{t.officialReg}</strong> #14892341</p>
                  <p style={{ marginTop: '4px' }}>📍 <strong>{t.headquarters}</strong> London, UK</p>
                  <p style={{ marginTop: '4px' }}>📧 <strong>{t.supportEmail}</strong> support@auramining.uk</p>
                </div>
              </div>

              <div style={styles.panelBox}>
                <h3 style={{ fontSize: '14px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#38bdf8' }}>
                  <Cpu size={16} /> {t.farmsTitle}
                </h3>
                <p style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: '1.5', marginBottom: '12px' }}>
                  {t.farmsDesc}
                </p>
                <div style={{ background: '#020617', padding: '10px', borderRadius: '10px', fontSize: '11px', color: '#94a3b8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{t.globalCapacity}</span>
                  <strong style={{ color: '#34d399' }}>420 PH/s Hashrate</strong>
                </div>
              </div>

              {/* Nueva sección detallada de Hardware e Infraestructura */}
              <div style={styles.panelBox}>
                <h3 style={{ fontSize: '14px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#facc15' }}>
                  <Zap size={16} /> {t.hardwareInfra}
                </h3>
                <p style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: '1.5' }}>
                  {t.hardwareDesc}
                </p>
              </div>

              <div style={{ ...styles.panelBox, border: '1px solid rgba(52, 211, 153, 0.3)' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#34d399' }}>
                  <ShieldCheck size={16} /> {t.auditTitle}
                </h3>
                <p style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: '1.5', marginBottom: '10px' }}>
                  {t.auditDesc}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '10px' }}>
                  <div style={{ background: '#020617', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
                    <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block' }}>{t.fsRating}</span>
                    <strong style={{ fontSize: '12px', color: '#34d399', display: 'block', marginTop: '2px' }}>AAA</strong>
                  </div>
                  <div style={{ background: '#020617', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
                    <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block' }}>{t.blockchainAudit}</span>
                    <strong style={{ fontSize: '12px', color: '#38bdf8', display: 'block', marginTop: '2px' }}>24/7</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'admin' && isAdmin && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ ...styles.panelBox, border: '1px solid rgba(250, 204, 21, 0.4)' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#facc15' }}>
                  <Bell size={16} /> 📢 Enviar Anuncio / Promo Masiva (Campanita)
                </h3>
                <p style={{ fontSize: '11px', color: '#cbd5e1', marginBottom: '12px' }}>
                  Envía una notificación emergente a la campanita de todos los usuarios conectados.
                </p>

                {promoMsgStatus && (
                  <div style={{ padding: '8px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', marginBottom: '10px', background: promoMsgStatus.error ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)', color: promoMsgStatus.error ? '#f87171' : '#34d399' }}>
                    {promoMsgStatus.msg}
                  </div>
                )}

                <form onSubmit={handleSendAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <textarea 
                      rows="3"
                      placeholder="Escribe el mensaje promocional aquí..." 
                      value={adminPromoText}
                      onChange={(e) => setAdminPromoText(e.target.value)}
                      style={{ ...styles.inputField, resize: 'none' }} 
                    />
                  </div>
                  <button type="submit" style={{ ...styles.fullWidthButton, backgroundColor: '#facc15', color: '#020617' }}>
                    🚀 PUBLICAR ANUNCIO A TODOS
                  </button>
                </form>
              </div>

              <div style={{ ...styles.panelBox, border: '1px solid rgba(56, 189, 248, 0.4)' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#38bdf8' }}>
                  <PlusCircle size={16} /> {t.manualRechargeTitle}
                </h3>
                <p style={{ fontSize: '11px', color: '#cbd5e1', marginBottom: '12px' }}>
                  {t.manualRechargeDesc}
                </p>

                {adminMsg && (
                  <div style={{ padding: '8px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', marginBottom: '10px', background: adminMsg.error ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)', color: adminMsg.error ? '#f87171' : '#34d399' }}>
                    {adminMsg.msg}
                  </div>
                )}

                <form onSubmit={handleManualRechargeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#38bdf8', display: 'block', marginBottom: '4px' }}>{t.telegramIdLabel}</label>
                    <input 
                      type="text" 
                      placeholder="@usuario o ID" 
                      value={manualRechargeUser}
                      onChange={(e) => setManualRechargeUser(e.target.value)}
                      style={styles.inputField} 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#38bdf8', display: 'block', marginBottom: '4px' }}>{t.amountToAddLabel}</label>
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
                    {t.creditBalanceBtn}
                  </button>
                </form>
              </div>

              <div style={{ ...styles.panelBox, border: '1px solid rgba(52, 211, 153, 0.4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399' }}>
                    <ShieldCheck size={16} /> {t.adminDepositsTitle}
                  </h3>
                  <button 
                    onClick={fetchAdminDeposits} 
                    style={{ fontSize: '10px', backgroundColor: '#1e293b', color: '#38bdf8', border: 'none', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <RefreshCw size={13} /> {t.update}
                  </button>
                </div>

                {adminDeposits.length === 0 ? (
                  <p style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center', padding: '10px' }}>{t.noPendingDeposits}</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '320px', overflowY: 'auto', paddingRight: '4px' }}>
                    {adminDeposits.map((dep) => (
                      <div key={dep.id} style={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <div>
                            <span style={{ fontSize: '13px', fontWeight: '900', color: '#ffffff' }}>{dep.user} ({dep.telegramId})</span>
                            <span style={{ fontSize: '11px', color: '#34d399', display: 'block', fontWeight: '800', marginTop: '2px' }}>Monto: {dep.amount} USDT</span>
                          </div>
                          <span style={{ fontSize: '10px', color: '#94a3b8' }}>{dep.date}</span>
                        </div>

                        <div style={{ fontSize: '10px', color: '#94a3b8', wordBreak: 'break-all', marginBottom: '10px', background: 'rgba(255,255,255,0.02)', padding: '6px', borderRadius: '6px' }}>
                          <strong>TXID:</strong> {dep.txHash}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '11px', fontWeight: 'bold', color: dep.status === 'Pendiente' ? '#facc15' : dep.status === 'Aprobado' ? '#34d399' : '#f87171' }}>
                            Estado: {dep.status}
                          </span>

                          {dep.status === 'Pendiente' && (
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button 
                                onClick={() => handleApproveDeposit(dep.id, dep.telegramId)}
                                style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
                              >
                                <Check size={12} /> {t.approve}
                              </button>
                              <button 
                                onClick={() => handleDenyDeposit(dep.id, dep.telegramId)}
                                style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
                              >
                                <X size={12} /> {t.reject}
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px', color: '#facc15' }}>
                    <ShieldAlert size={16} /> {t.adminWithdrawalsTitle}
                  </h3>
                  <button 
                    onClick={fetchAdminWithdrawals} 
                    style={{ fontSize: '10px', backgroundColor: '#1e293b', color: '#38bdf8', border: 'none', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <RefreshCw size={13} /> {t.update}
                  </button>
                </div>

                {adminWithdrawals.length === 0 ? (
                  <p style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center', padding: '10px' }}>{t.noPendingWithdrawals}</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '320px', overflowY: 'auto', paddingRight: '4px' }}>
                    {adminWithdrawals.map((req) => (
                      <div key={req.id} style={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <div>
                            <span style={{ fontSize: '13px', fontWeight: '900', color: '#ffffff' }}>{req.user} ({req.telegramId})</span>
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
                              <button 
                                onClick={() => handleApproveWithdrawal(req.id, req.telegramId)}
                                style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
                              >
                                <Check size={12} /> {t.payApprove}
                              </button>
                              <button 
                                onClick={() => handleDenyWithdrawal(req.id, req.telegramId)}
                                style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
                              >
                                <X size={12} /> {t.deny}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>

        <nav style={styles.bottomNav}>
          <button onClick={() => setActiveTab('mining')} style={{ ...styles.navButton, color: activeTab === 'mining' ? '#34d399' : '#94a3b8' }}>
            <Cpu size={18} />
            <span style={styles.navText}>{t.tabMining}</span>
          </button>
          <button onClick={() => setActiveTab('team')} style={{ ...styles.navButton, color: activeTab === 'team' ? '#34d399' : '#94a3b8' }}>
            <Users size={18} />
            <span style={styles.navText}>{t.tabTeam}</span>
          </button>
          <button onClick={() => setActiveTab('wallet')} style={{ ...styles.navButton, color: activeTab === 'wallet' ? '#34d399' : '#94a3b8' }}>
            <Wallet size={18} />
            <span style={styles.navText}>{t.tabWallet}</span>
          </button>
          <button onClick={() => setActiveTab('company')} style={{ ...styles.navButton, color: activeTab === 'company' ? '#34d399' : '#94a3b8' }}>
            <Globe size={18} />
            <span style={styles.navText}>{t.tabCompany}</span>
          </button>
          {isAdmin && (
            <button onClick={() => setActiveTab('admin')} style={{ ...styles.navButton, color: activeTab === 'admin' ? '#38bdf8' : '#94a3b8' }}>
              <ShieldAlert size={18} />
              <span style={styles.navText}>{t.tabAdmin}</span>
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
    padding: '10px 14px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexShrink: 0,
  },
  headerRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '6px',
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
  langSelectorWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '2px 6px',
    borderRadius: '8px',
  },
  langSelect: {
    background: 'transparent',
    border: 'none',
    color: '#38bdf8',
    fontSize: '10px',
    fontWeight: 'bold',
    outline: 'none',
    cursor: 'pointer',
  },
  langOption: {
    backgroundColor: '#050b18',
    color: '#ffffff',
  },
  walletPill: {
    backgroundColor: '#0b1329',
    border: '1px solid rgba(52, 211, 153, 0.3)',
    padding: '3px 8px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
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
    fontSize: '9px', fontWeight: '700',
  },
};

