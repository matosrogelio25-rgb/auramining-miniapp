import React, { useState, useEffect, useRef } from 'react';
import { 
  Cpu, Users, ShieldCheck, Wallet, 
  Globe, Copy, Sparkles, Zap, ArrowRight, Clock, Award, TrendingUp, History, CheckCircle2, AlertCircle, ShieldAlert, Check, X, PlusCircle, Gift, Layers 
} from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || 'https://auramining-miniapp.onrender.com';

const ADMIN_TELEGRAM_ID = '6062598843';

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
    rechargeDesc: "Transfiere USDT a nuestra dirección oficial de Binance y reporta tu pago aquí para acreditar tu saldo.",
    officialAddress: "Dirección Oficial (TRC20):",
    sentAmount: "Monto Enviado (USDT)",
    txHash: "Hash de la Transacción (TXID)",
    reportDeposit: "📤 Reportar Depósito a Binance",
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
    farmsDesc: "Nuestras operaciones se extienden a lo largo del Reino Unido y Europa. Diseñamos y operamos granjas de servidores ASIC de última generación impulsadas en su totalidad por energía solar, parques eólicos y fuentes 100% verdes, garantizando un modelo ecológico, sostenible y con un bajo costo operativo energético.",
    globalCapacity: "Capacidad Operativa Global:",
    auditTitle: "Certificación Financiera AAA",
    auditDesc: "Contamos con la prestigiosa Certificación AAA otorgada por auditores internacionales independientes, avalando nuestra sólida solvencia, reservas en activos digitales y la estabilidad total de nuestros planes de minería en la nube.",
    fsRating: "Calificación FSK",
    blockchainAudit: "Auditoría Blockchain",
    manualRechargeTitle: "Recarga Manual de Saldo (Dueño)",
    manualRechargeDesc: "Suma saldo directamente al usuario tras verificar su comprobante o pago externo.",
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
    rechargeDesc: "Transfer USDT to our official Binance address and report your payment here to credit your balance.",
    officialAddress: "Official Address (TRC20):",
    sentAmount: "Amount Sent (USDT)",
    txHash: "Transaction Hash (TXID)",
    reportDeposit: "📤 Report Deposit to Binance",
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
    farmsDesc: "Our operations extend throughout the UK and Europe. We design and operate state-of-the-art ASIC server farms powered entirely by solar energy, wind parks, and 100% green sources, ensuring an ecological, sustainable model with low energy operating costs.",
    globalCapacity: "Global Operational Capacity:",
    auditTitle: "AAA Financial Certification",
    auditDesc: "We hold the prestigious AAA Certification granted by independent international auditors, endorsing our solid solvency, digital asset reserves, and total stability of our cloud mining plans.",
    fsRating: "FSK Rating",
    blockchainAudit: "Blockchain Audit",
    manualRechargeTitle: "Manual Balance Recharge (Owner)",
    manualRechargeDesc: "Add balance directly to the user after verifying their receipt or external payment.",
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
    rechargeDesc: "Transfira USDT para nosso endereço oficial da Binance e informe seu pagamento aqui.",
    officialAddress: "Endereço Oficial (TRC20):",
    sentAmount: "Valor Enviado (USDT)",
    txHash: "Hash da Transação (TXID)",
    reportDeposit: "📤 Reportar Depósito para Binance",
    depositHistory: "Histórico de Depósitos",
    noDeposits: "Nenhum depósito registrado ainda.",
    withdrawTitle: "Retirar Fundos (USDT)",
    withdrawMin: "Retirada mínima: 15 USDT (Rede TRC20).",
    withdrawAmountLabel: "Valor a Retirar (USDT)",
    walletAddressLabel: "Endereço da Carteira (TRC20)",
    requestWithdrawBtn: "🚀 SOLICITAR RETIRADA IMEDIATA",
    withdrawHistory: "Histórico de Retiradas",
    noWithdrawals: "Nenhuma retirada registrada ainda.",
    companyAbout: "Somos uma corporação global especializada em mineração de criptomoedas de alto desempenho e computação distribuída.",
    legalName: "Razão Social:",
    officialReg: "Registro Oficial (UK):",
    headquarters: "Sede Central:",
    supportEmail: "E-mail de Suporte:",
    farmsTitle: "Fazendas de Mineração & Energia Renovável",
    farmsDesc: "Nossas operações se estendem por todo o Reino Unido e Europa, utilizando fontes 100% verdes.",
    globalCapacity: "Capacidade Operacional Global:",
    auditTitle: "Certificação Financeira AAA",
    auditDesc: "Possuímos a prestigiosa Certificação AAA concedida por auditores internacionais independentes.",
    fsRating: "Classificação FSK",
    blockchainAudit: "Auditoria Blockchain",
    manualRechargeTitle: "Recarga Manual de Saldo (Dono)",
    manualRechargeDesc: "Adicione saldo diretamente ao usuário após verificar o comprovante.",
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
    referralDesc: "Invitez des amis et générez des commissions automatiques selon leur activité.",
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
    rechargeDesc: "Transférez des USDT sur notre adresse officielle Binance et signalez votre paiement ici.",
    officialAddress: "Adresse Officielle (TRC20):",
    sentAmount: "Montant Envoyé (USDT)",
    txHash: "Hash de la Transaction (TXID)",
    reportDeposit: "📤 Signaler le Dépôt à Binance",
    depositHistory: "Historique des Dépôts",
    noDeposits: "Aucun dépôt enregistré.",
    withdrawTitle: "Retirer des Fonds (USDT)",
    withdrawMin: "Retrait minimum : 15 USDT (Réseau TRC20).",
    withdrawAmountLabel: "Montant à Retirer (USDT)",
    walletAddressLabel: "Adresse du Portefeuille (TRC20)",
    requestWithdrawBtn: "🚀 DEMANDER UN RETRAIT IMMÉDIAT",
    withdrawHistory: "Historique des Retraits",
    noWithdrawals: "Aucun retrait enregistré.",
    companyAbout: "Nous sommes une entreprise mondiale spécialisée dans le minage haute performance.",
    legalName: "Raison Sociale :",
    officialReg: "Enregistrement (UK) :",
    headquarters: "Siège Social :",
    supportEmail: "E-mail de Support :",
    farmsTitle: "Fermes de Minage & Énergie Verte",
    farmsDesc: "Nos opérations s'étendent à travers le Royaume-Uni et l'Europe avec 100% d'énergie verte.",
    globalCapacity: "Capacité Opérationnelle Globale :",
    auditTitle: "Certification Financière AAA",
    auditDesc: "Nous détenons la prestigieuse Certification AAA accordée par des auditeurs indépendants.",
    fsRating: "Note FSK",
    blockchainAudit: "Audit Blockchain",
    manualRechargeTitle: "Recharge Manuelle du Solde (Propriétaire)",
    manualRechargeDesc: "Ajoutez du solde directement à l'utilisateur après vérification.",
    telegramIdLabel: "ID ou Nom d'utilisateur Telegram",
    amountToAddLabel: "Montant à Ajouter (USDT)",
    creditBalanceBtn: "➕ CRÉDITER LE SOLDE",
    adminDepositsTitle: "Dépôts Signalés par les Utilisateurs (Admin)",
    noPendingDeposits: "Aucun dépôt en attente.",
    approve: "Approuver",
    reject: "Rejeter",
    adminWithdrawalsTitle: "Demandes de Retrait (Admin)",
    noPendingWithdrawals: "Aucune demande de retrait.",
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
    miningDescReady: "✨ 24h Zyklus abgeschlossen! Tippen Sie auf den Beutel, um Ihre Gewinne einzufordern.",
    miningDescWait: "Generiere akkumuliert",
    miningDescEmpty: "Erwerben Sie unten einen oder mehrere Pläne, um das Mining zu starten",
    myRigs: "Meine aktiven Mining Rigs",
    active: "Aktiv",
    earningsTx: "Verdiensttransaktionen (Auszahlungen)",
    noEarnings: "Sie haben noch keine Einnahmen gesammelt.",
    credited: "Gutgeschrieben",
    buyPlansTitle: "✨ Neue Pläne erwerben (Kumulativ)",
    daily: "Täglich",
    tabMining: "Mining",
    tabTeam: "Team",
    tabWallet: "Brieftasche",
    tabCompany: "Unternehmen",
    tabAdmin: "Admin",
    referralTitle: "Empfehlungsprogramm",
    referralDesc: "Laden Sie Freunde ein und generieren Sie automatische Provisionen.",
    inviteLink: "Ihr Einladungslink",
    copy: "Kopieren",
    copied: "Kopiert!",
    teamPerformance: "Stufenleistung",
    level1: "Stufe 1 (Direkt)",
    level2: "Stufe 2",
    level3: "Stufe 3",
    generated: "Generiert",
    activeTotal: "Aktiv / Gesamt",
    rechargeTitle: "Guthaben aufladen (USDT - TRC20)",
    rechargeDesc: "Überweisen Sie USDT an unsere offizielle Binance-Adresse und melden Sie Ihre Zahlung hier.",
    officialAddress: "Offizielle Adresse (TRC20):",
    sentAmount: "Gesendeter Betrag (USDT)",
    txHash: "Transaktions-Hash (TXID)",
    reportDeposit: "📤 Einzahlung bei Binance melden",
    depositHistory: "Einzahlungshistorie",
    noDeposits: "Noch keine Einzahlungen registriert.",
    withdrawTitle: "Guthaben abheben (USDT)",
    withdrawMin: "Mindestabhebung: 15 USDT (TRC20 Netzwerk).",
    withdrawAmountLabel: "Auszahlungsbetrag (USDT)",
    walletAddressLabel: "Wallet-Adresse (TRC20)",
    requestWithdrawBtn: "🚀 SOFORTIGE AUSZAHLUNG ANFORDERN",
    withdrawHistory: "Auszahlungshistorie",
    noWithdrawals: "Noch keine Auszahlungen registriert.",
    companyAbout: "Wir sind ein globales Unternehmen für Hochleistungs-Kryptowährungs-Mining.",
    legalName: "Firmenname:",
    officialReg: "Offizielle Registrierung (UK):",
    headquarters: "Hauptsitz:",
    supportEmail: "Support-E-Mail:",
    farmsTitle: "Mining-Farmen & Erneuerbare Energien",
    farmsDesc: "Unsere Betriebe erstrecken sich über ganz Großbritannien und Europa mit 100% grünem Strom.",
    globalCapacity: "Globale Betriebskapazität:",
    auditTitle: "AAA Finanzzertifizierung",
    auditDesc: "Wir besitzen die renommierte AAA-Zertifizierung unabhängiger internationaler Prüfer.",
    fsRating: "FSK-Bewertung",
    blockchainAudit: "Blockchain-Prüfung",
    manualRechargeTitle: "Manuelle Guthabenaufladung (Besitzer)",
    manualRechargeDesc: "Fügen Sie dem Benutzer nach Belegprüfung direkt Guthaben hinzu.",
    telegramIdLabel: "Telegram-ID oder Benutzername",
    amountToAddLabel: "Hinzuzufügender Betrag (USDT)",
    creditBalanceBtn: "➕ GUTHABEN GUTSCHREIBEN",
    adminDepositsTitle: "Gemeldete Einzahlungen der Benutzer (Admin)",
    noPendingDeposits: "Keine ausstehenden Einzahlungen.",
    approve: "Genehmigen",
    reject: "Ablehnen",
    adminWithdrawalsTitle: "Auszahlungsanträge (Admin)",
    noPendingWithdrawals: "Keine Auszahlungsanträge in der Datenbank.",
    payApprove: "Bezahlen / Genehmigen",
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
    miningActive: "Rig di Mining Attivi",
    systemStandby: "SISTEMA IN ATTESA",
    miningDescReady: "✨ Ciclo di 24h completato! Tocca il sacchetto per riscuotere i guadagni.",
    miningDescWait: "Generazione accumulata",
    miningDescEmpty: "Acquista uno o più piani sotto per iniziare il mining",
    myRigs: "I miei Rig di Mining Attivi",
    active: "Attivo",
    earningsTx: "Transazioni di Guadagno (Prelievi)",
    noEarnings: "Non hai ancora raccolto guadagni.",
    credited: "Accreditato",
    buyPlansTitle: "✨ Acquista Nuovi Piani (Cumulativi)",
    daily: "Giornaliero",
    tabMining: "Mining",
    tabTeam: "Team",
    tabWallet: "Portafoglio",
    tabCompany: "Azienda",
    tabAdmin: "Admin",
    referralTitle: "Programma Referral",
    referralDesc: "Invita gli amici e genera commissioni automatiche in base alla loro attività.",
    inviteLink: "Il tuo Link di Invito",
    copy: "Copia",
    copied: "Copiato!",
    teamPerformance: "Prestazioni per Livelli",
    level1: "Livello 1 (Diretti)",
    level2: "Livello 2",
    level3: "Livello 3",
    generated: "Generato",
    activeTotal: "Attivi / Totale",
    rechargeTitle: "Ricarica Saldo (USDT - TRC20)",
    rechargeDesc: "Trasferisci USDT al nostro indirizzo ufficiale Binance e segnala il pagamento qui.",
    officialAddress: "Indirizzo Ufficiale (TRC20):",
    sentAmount: "Importo Inviato (USDT)",
    txHash: "Hash della Transazione (TXID)",
    reportDeposit: "📤 Segnala Deposito a Binance",
    depositHistory: "Cronologia Depositi",
    noDeposits: "Nessun deposito registrato.",
    withdrawTitle: "Preleva Fondi (USDT)",
    withdrawMin: "Prelievo minimo: 15 USDT (Rete TRC20).",
    withdrawAmountLabel: "Importo da Prelevare (USDT)",
    walletAddressLabel: "Indirizzo Portafoglio (TRC20)",
    requestWithdrawBtn: "🚀 RICHIEDI PRELIEVO IMMEDIATO",
    withdrawHistory: "Cronologia Prelievi",
    noWithdrawals: "Nessun prelievo registrato.",
    companyAbout: "Siamo una corporazione globale specializzata nel mining di criptovalute ad alte prestazioni.",
    legalName: "Ragione Sociale:",
    officialReg: "Registrazione Ufficiale (UK):",
    headquarters: "Sede Centrale:",
    supportEmail: "Email di Supporto:",
    farmsTitle: "Farm di Mining & Energia Rinnovabile",
    farmsDesc: "Le nostre operazioni si estendono nel Regno Unito e in Europa con energia 100% verde.",
    globalCapacity: "Capacità Operativa Globale:",
    auditTitle: "Certificazione Finanziaria AAA",
    auditDesc: "Possediamo la prestigiosa Certificazione AAA rilasciata da revisori indipendenti.",
    fsRating: "Valutazione FSK",
    blockchainAudit: "Audit Blockchain",
    manualRechargeTitle: "Ricarica Manuale Saldo (Proprietario)",
    manualRechargeDesc: "Aggiungi saldo direttamente all'utente dopo aver verificato la ricevuta.",
    telegramIdLabel: "ID o Username Telegram",
    amountToAddLabel: "Importo da Aggiungere (USDT)",
    creditBalanceBtn: "➕ ACCREDITA SALDO UTENTE",
    adminDepositsTitle: "Depositi Segnalati dagli Utenti (Admin)",
    noPendingDeposits: "Nessun deposito in sospeso.",
    approve: "Approva",
    reject: "Rifiuta",
    adminWithdrawalsTitle: "Richieste di Prelievo (Admin)",
    noPendingWithdrawals: "Nessuna richiesta di prelievo.",
    payApprove: "Paga / Approva",
    deny: "Nega",
    update: "Aggiorna",
    statusPending: "In attesa",
    statusApproved: "Approvato",
    statusRejected: "Rifiutato",
    statusSuccess: "Riuscito"
  },
  ru: {
    activePlans: "Активные планы",
    performance24h: "Доход за 24ч",
    noPlan: "НЕТ ПЛАНА",
    claim: "ЗАБРАТЬ!",
    miningActive: "Майнинг активен",
    systemStandby: "РЕЖИМ ОЖИДАНИЯ",
    miningDescReady: "✨ Цикл 24ч завершен! Нажмите на мешок, чтобы получить прибыль.",
    miningDescWait: "Генерация накопленной",
    miningDescEmpty: "Приобретите один или несколько планов ниже, чтобы начать майнинг",
    myRigs: "Мои активные майнинг-риги",
    active: "Активный",
    earningsTx: "История начислений (Выплаты)",
    noEarnings: "Вы еще не собирали прибыль.",
    credited: "Зачислено",
    buyPlansTitle: "✨ Купить новые планы (Накопительные)",
    daily: "Ежедневно",
    tabMining: "Майнинг",
    tabTeam: "Команда",
    tabWallet: "Кошелек",
    tabCompany: "Компания",
    tabAdmin: "Админ",
    referralTitle: "Реферальная программа",
    referralDesc: "Приглашайте друзей и получайте автоматические комиссии за их активность.",
    inviteLink: "Ваша реферальная ссылка",
    copy: "Копировать",
    copied: "Скопировано!",
    teamPerformance: "Доход по уровням",
    level1: "Уровень 1 (Прямые)",
    level2: "Уровень 2",
    level3: "Уровень 3",
    generated: "Заработано",
    activeTotal: "Активных / Всего",
    rechargeTitle: "Пополнить баланс (USDT - TRC20)",
    rechargeDesc: "Переведите USDT на наш официальный адрес Binance и сообщите платеж здесь.",
    officialAddress: "Официальный адрес (TRC20):",
    sentAmount: "Отправленная сумма (USDT)",
    txHash: "Хэш транзакции (TXID)",
    reportDeposit: "📤 Сообщить о депозите в Binance",
    depositHistory: "История депозитов",
    noDeposits: "Депозитов пока нет.",
    withdrawTitle: "Вывод средств (USDT)",
    withdrawMin: "Минимум для вывода: 15 USDT (сеть TRC20).",
    withdrawAmountLabel: "Сумма вывода (USDT)",
    walletAddressLabel: "Адрес кошелька (TRC20)",
    requestWithdrawBtn: "🚀 ЗАПРОСИТЬ ВЫВОД СРЕДСТВ",
    withdrawalHistory: "История выводов",
    withdrawHistory: "История выводов",
    noWithdrawals: "Выводов пока нет.",
    companyAbout: "Мы — глобальная корпорация, специализирующаяся на высокопроизводительном майнинге криптовалют.",
    legalName: "Юридическое название:",
    officialReg: "Официальная регистрация (UK):",
    headquarters: "Штаб-квартира:",
    supportEmail: "Email поддержки:",
    farmsTitle: "Майнинг-фермы и возобновляемая энергия",
    farmsDesc: "Наши операции простираются по всей Великобритании и Европе на 100% зеленой энергии.",
    globalCapacity: "Глобальная мощность:",
    auditTitle: "Финансовый сертификат AAA",
    auditDesc: "У нас престижный сертификат AAA, выданный независимыми аудиторами.",
    fsRating: "Рейтинг FSK",
    blockchainAudit: "Блокчейн-аудит",
    manualRechargeTitle: "Ручное пополнение баланса (Владелец)",
    manualRechargeDesc: "Пополните баланс пользователя напрямую после проверки чека.",
    telegramIdLabel: "ID или Username в Telegram",
    amountToAddLabel: "Сумма пополнения (USDT)",
    creditBalanceBtn: "➕ ПОПОЛНИТЬ БАЛАНС ПОЛЬЗОВАТЕЛЯ",
    adminDepositsTitle: "Депозиты от пользователей (Админ)",
    noPendingDeposits: "Нет ожидающих депозитов.",
    approve: "Одобрить",
    reject: "Отклонить",
    adminWithdrawalsTitle: "Запросы на вывод (Админ)",
    noPendingWithdrawals: "Нет запросов на вывод в базе.",
    payApprove: "Оплатить / Одобрить",
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
    systemStandby: "系统待命",
    miningDescReady: "✨ 24小时周期已完成！点击钱包领取您的收益。",
    miningDescWait: "正在生成累积收益",
    miningDescEmpty: "请在下方购买一个或多个计划以开始挖矿",
    myRigs: "我的活动矿机",
    active: "活动中",
    earningsTx: "收益交易记录（提现）",
    noEarnings: "您还没有收集收益。",
    credited: "已入账",
    buyPlansTitle: "✨ 购买新计划（累积型）",
    daily: "每日",
    tabMining: "挖矿",
    tabTeam: "团队",
    tabWallet: "钱包",
    tabCompany: "公司",
    tabAdmin: "管理",
    referralTitle: "推荐计划",
    referralDesc: "邀请好友并根据其网络活动赚取自动佣金。",
    inviteLink: "您的邀请链接",
    copy: "复制",
    copied: "已复制！",
    teamPerformance: "层级业绩",
    level1: "一级 (直接推荐)",
    level2: "二级",
    level3: "三级",
    generated: "已赚取",
    activeTotal: "活跃 / 总计",
    rechargeTitle: "充值余额 (USDT - TRC20)",
    rechargeDesc: "将USDT转入我们的官方币安地址并在下方报告您的支付。",
    officialAddress: "官方地址 (TRC20):",
    sentAmount: "发送金额 (USDT)",
    txHash: "交易哈希 (TXID)",
    reportDeposit: "📤 向币安报告充值",
    depositHistory: "充值历史",
    noDeposits: "暂无充值记录。",
    withdrawTitle: "提现资金 (USDT)",
    withdrawMin: "最低提现：15 USDT (TRC20 网络)。",
    withdrawAmountLabel: "提现金额 (USDT)",
    walletAddressLabel: "钱包地址 (TRC20)",
    requestWithdrawBtn: "🚀 申请立即提现",
    withdrawHistory: "提现历史",
    noWithdrawals: "暂无提现记录。",
    companyAbout: "我们是一家专注于高性能加密货币挖矿和分布式计算的全球性公司。",
    legalName: "公司名称：",
    officialReg: "官方注册号 (UK)：",
    headquarters: "总部所在地：",
    supportEmail: "支持邮箱：",
    farmsTitle: "矿场与可再生能源",
    farmsDesc: "我们的业务遍及英国和欧洲，100%采用绿色环保能源运行。",
    globalCapacity: "全球算力容量：",
    auditTitle: "AAA 财务认证",
    auditDesc: "我们持有独立国际审计机构颁发的声誉卓著的AAA认证。",
    fsRating: "FSK 评级",
    blockchainAudit: "区块链审计",
    manualRechargeTitle: "手动充值余额 (所有者)",
    manualRechargeDesc: "核实收据后直接向用户充值余额。",
    telegramIdLabel: "Telegram ID 或用户名",
    amountToAddLabel: "增加金额 (USDT)",
    creditBalanceBtn: "➕ 给用户充值余额",
    adminDepositsTitle: "用户报告的充值 (管理员)",
    noPendingDeposits: "没有待处理的充值。",
    approve: "批准",
    reject: "拒绝",
    adminWithdrawalsTitle: "提现请求 (管理员)",
    noPendingWithdrawals: "数据库中没有提现请求。",
    payApprove: "支付 / 批准",
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
    systemStandby: "النظام في وضع الاستعداد",
    miningDescReady: "✨ اكتملت دورة 24 ساعة! انقر فوق الحقيبة لتحصيل أرباحك.",
    miningDescWait: "جارٍ توليد الرصيد المتراكم",
    miningDescEmpty: "اشتري خطة واحدة أو أكثر أدناه لبدء التعدين",
    myRigs: "منصات التعدين النشطة الخاصة بي",
    active: "نشط",
    earningsTx: "معاملات الأرباح (السحوبات)",
    noEarnings: "لم تقم بجمع أي أرباح بعد.",
    credited: "تم الاعتماد",
    buyPlansTitle: "✨ الحصول على خطط جديدة (تراكمية)",
    daily: "يومي",
    tabMining: "التعدين",
    tabTeam: "الفريق",
    tabWallet: "المحفظة",
    tabCompany: "الشركة",
    tabAdmin: "المشرف",
    referralTitle: "برنامج الإحالة",
    referralDesc: "ادع أصدقاءك واكسب عمولات تلقائية بناءً على نشاط شبكتهم.",
    inviteLink: "رابط الدعوة الخاص بك",
    copy: "نسخ",
    copied: "تم النسخ!",
    teamPerformance: "أداء المستويات",
    level1: "المستوى 1 (المباشرون)",
    level2: "المستوى 2",
    level3: "المستوى 3",
    generated: "المكتسب",
    activeTotal: "النشط / الإجمالي",
    rechargeTitle: "إعادة شحن الرصيد (USDT - TRC20)",
    rechargeDesc: "قم بتحويل USDT إلى عنوان Binance الرسمى وأبلغ عن الدفع هنا.",
    officialAddress: "العنوان الرسمي (TRC20):",
    sentAmount: "المبلغ المرسل (USDT)",
    txHash: "هاش المعاملة (TXID)",
    reportDeposit: "📤 الإبلاغ عن الإيداع لـ Binance",
    depositHistory: "سجل الإيداعات",
    noDeposits: "لا توجد إيداعات مسجلة حتى الآن.",
    withdrawTitle: "سحب الأموال (USDT)",
    withdrawMin: "الحد الأدنى للسحب: 15 USDT (شبكة TRC20).",
    withdrawAmountLabel: "المبلغ المراد سحبه (USDT)",
    walletAddressLabel: "عنوان المحفظة (TRC20)",
    requestWithdrawBtn: "🚀 طلب سحب فوري",
    withdrawHistory: "سجل السحوبات",
    noWithdrawals: "لا توجد سحوبات مسجلة حتى الآن.",
    companyAbout: "نحن شركة عالمية متخصصة في تعدين العملات الرقمية والحوسبة الموزعة.",
    legalName: "الاسم القانوني:",
    officialReg: "التسجيل الرسمي (UK):",
    headquarters: "المقر الرئيسي:",
    supportEmail: "البريد الإلكتروني للدعم:",
    farmsTitle: "مزارع التعدين والطاقة المتجددة",
    farmsDesc: "تمتد عملياتنا في جميع أنحاء المملكة المتحدة وأوروبا بالطاقة الخضراء 100%.",
    globalCapacity: "القدرة التشغيلية العالمية:",
    auditTitle: "شهادة AAA المالية",
    auditDesc: "نحن نحمل شهادة AAA المرموقة الممنوحة من مدققين دوليين مستقلين.",
    fsRating: "تصنيف FSK",
    blockchainAudit: "تدقيق البلوكشين",
    manualRechargeTitle: "شحن الرصيد اليدوي (المالك)",
    manualRechargeDesc: "أضف رصيدًا مباشرة للمستخدم بعد التحقق من الإيصال.",
    telegramIdLabel: "معرف تيليجرام أو اسم المستخدم",
    amountToAddLabel: "المبلغ المراد إضافته (USDT)",
    creditBalanceBtn: "➕ إضافة رصيد للمستخدم",
    adminDepositsTitle: "الإيداعات المبلغ عنها من المستخدمين (المشرف)",
    noPendingDeposits: "لا توجد إيداعات معلقة.",
    approve: "موافقة",
    reject: "رفض",
    adminWithdrawalsTitle: "طلبات السحب (المشرف)",
    noPendingWithdrawals: "لا توجد طلبات سحب في قاعدة البيانات.",
    payApprove: "دفع / موافقة",
    deny: "رفض",
    update: "تحديث",
    statusPending: "قيد الانتظار",
    statusApproved: "تم الموافقة",
    statusRejected: "مرفوض",
    statusSuccess: "ناجح"
  },
  tr: {
    activePlans: "Aktif Planlar",
    performance24h: "24 Saatlik Verim",
    noPlan: "PLAN YOK",
    claim: "TOPLA!",
    miningActive: "Madencilik Aktif",
    systemStandby: "SİSTEM BEKlemede",
    miningDescReady: "✨ 24 saatlik döngü tamamlandı! Kazancınızı toplamak için torbaya dokunun.",
    miningDescWait: "Biriken oluşturuluyor",
    miningDescEmpty: "Madenciliğe başlamak için aşağıdan bir veya daha fazla plan satın alın",
    myRigs: "Aktif Madencilik Rinklerim",
    active: "Aktif",
    earningsTx: "Kazanç İşlemleri (Çekimler)",
    noEarnings: "Henüz kazanç toplamadınız.",
    credited: "Yüklendi",
    buyPlansTitle: "✨ Yeni Planlar Satın Al (Kümülatif)",
    daily: "Günlük",
    tabMining: "Madencilik",
    tabTeam: "Takım",
    tabWallet: "Cüzdan",
    tabCompany: "Şirket",
    tabAdmin: "Yönetici",
    referralTitle: "Yönlendirme Programı",
    referralDesc: "Arkadaşlarınızı davet edin ve ağ aktivitelerine göre otomatik komisyonlar kazanın.",
    inviteLink: "Davet Bağlantınız",
    copy: "Kopyala",
    copied: "Kopyalandı!",
    teamPerformance: "Seviye Performansı",
    level1: "Seviye 1 (Doğrudan)",
    level2: "Seviye 2",
    level3: "Seviye 3",
    generated: "Üretilen",
    activeTotal: "Aktif / Toplam",
    rechargeTitle: "Bakiye Yükle (USDT - TRC20)",
    rechargeDesc: "USDT'yi resmi Binance adresimize aktarın ve ödemenizi buraya bildirin.",
    officialAddress: "Resmi Adres (TRC20):",
    sentAmount: "Gönderilen Tutar (USDT)",
    txHash: "İşlem Hash (TXID)",
    reportDeposit: "📤 Binance'e Yatırım Bildir",
    depositHistory: "Yatırım Geçmişi",
    noDeposits: "Henüz kayıtlı yatırım yok.",
    withdrawTitle: "Fonları Çek (USDT)",
    withdrawMin: "Minimum çekim: 15 USDT (TRC20 Ağı).",
    withdrawAmountLabel: "Çekilecek Tutar (USDT)",
    walletAddressLabel: "Cüzdan Adresi (TRC20)",
    requestWithdrawBtn: "🚀 HEMEN ÇEKİM TALEP ET",
    withdrawHistory: "Çekim Geçmişi",
    noWithdrawals: "Henüz kayıtlı çekim yok.",
    companyAbout: "Yüksek performanslı kripto para madenciliği konusunda uzmanlaşmış küresel bir şirketiz.",
    legalName: "Şirket Ünvanı:",
    officialReg: "Resmi Kayıt (UK):",
    headquarters: "Merkez Ofis:",
    supportEmail: "Destek E-postası:",
    farmsTitle: "Madencilik Çiftlikleri & Yenilenebilir Enerji",
    farmsDesc: "Faaliyetlerimiz İngiltere ve Avrupa genelinde %100 yeşil enerji ile yürütülmektedir.",
    globalCapacity: "Küresel Operasyonel Kapasite:",
    auditTitle: "AAA Finansal Sertifikası",
    auditDesc: "Bağımsız uluslararası denetçiler tarafından verilen prestijli AAA Sertifikasına sahibiz.",
    fsRating: "FSK Derecesi",
    blockchainAudit: "Blok Zinciri Denetimi",
    manualRechargeTitle: "Manuel Bakiye Yükleme (Sahip)",
    manualRechargeDesc: "Makbuzu doğruladıktan sonra kullanıcıya doğrudan bakiye ekleyin.",
    telegramIdLabel: "Telegram ID veya Kullanıcı Adı",
    amountToAddLabel: "Eklenecek Tutar (USDT)",
    creditBalanceBtn: "➕ KULLANICIYA BAKİYE YÜKLE",
    adminDepositsTitle: "Kullanıcıların Bildirdiği Yatırımlar (Yönetici)",
    noPendingDeposits: "Bekleyen yatırım yok.",
    approve: "Onayla",
    reject: "Reddet",
    adminWithdrawalsTitle: "Çekim Talepleri (Yönetici)",
    noPendingWithdrawals: "Veritabanında çekim talebi yok.",
    payApprove: "Öde / Onayla",
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
  const [currentLang, setCurrentLang] = useState('es'); // Idioma por defecto
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const tg = window.Telegram?.WebApp;
    let tId = '6062598843'; 
    let uName = 'BreakThebank66';
    let fName = 'Jose';
    let startParam = null;

    if (tg && tg.initDataUnsafe) {
      if (tg.initDataUnsafe.user) {
        const tgUser = tg.initDataUnsafe.user;
        tId = tgUser.id.toString();
        uName = tgUser.username || 'Sin username';
        fName = tgUser.first_name || 'Minero';
        setTelegramUser(tgUser);
      }
      if (tg.initDataUnsafe.start_param) {
        startParam = tg.initDataUnsafe.start_param;
      }
      if (tg.expand) tg.expand();
    } else {
      setTelegramUser({ id: tId, first_name: fName, username: uName });
    }

    const urlParams = new URLSearchParams(window.location.search);
    const queryStart = urlParams.get('start');
    if (queryStart) {
      startParam = queryStart;
    }

    let referredBy = null;
    if (startParam && startParam.startsWith('ref_')) {
      referredBy = startParam.replace('ref_', '');
    }

    telegramIdRef.current = tId;

    if (tId === ADMIN_TELEGRAM_ID) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }

    const fetchUserDataFromMongo = async () => {
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

        const teamResponse = await fetch(`${API_URL}/api/user/team`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ telegramId: tId })
        });
        const teamData = await teamResponse.json();
        if (teamResponse.ok && teamData.success && teamData.teamLevels) {
          // Mapeamos para preservar las claves de niveles multidioma
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

    fetchUserDataFromMongo();

    return () => clearInterval(timer);
  }, []);

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

  const handleBuyPlan = (plan) => {
    if (balance < plan.price) {
      alert('⚠️ Saldo insuficiente en tu billetera.');
      return;
    }

    const newBalance = balance - plan.price;
    setBalance(newBalance);

    const newActivePlan = {
      ...plan,
      uniqueId: Date.now() + Math.random(),
      purchasedAt: currentTime.toLocaleDateString()
    };

    const updatedPlans = [...activePlans, newActivePlan];
    setActivePlans(updatedPlans);
    alert(`🎉 ¡Plan ${plan.name} adquirido con éxito!`);

    syncToMongo(newBalance, updatedPlans, undefined, undefined, undefined, undefined);
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
      if (isAdmin) {
        fetchAdminWithdrawals();
      }
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
      if (isAdmin) {
        fetchAdminDeposits();
      }
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

  const formattedDate = currentTime.toLocaleDateString();
  const formattedTime = currentTime.toLocaleTimeString();

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
            <h1 style={{ ...styles.headerTitle, fontSize: '26px', fontWeight: '900' }}>
              AURA MINING
            </h1>
            <p style={styles.headerSubtitle}>
              {telegramUser ? `ID: @${telegramUser.username || telegramUser.first_name}` : '⚡ AI CLOUD MINING'}
            </p>
          </div>
          
          <div style={styles.headerRight}>
            {/* SELECTOR DE IDIOMAS CON ICONO DE MUNDO */}
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

            <div style={styles.walletPill}>
              <Wallet size={14} color="#34d399" />
              <span style={{ fontSize: '12px', fontWeight: '800', color: '#34d399' }}>{balance.toFixed(2)} USDT</span>
            </div>
          </div>
        </header>

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
                  <span style={{ fontSize: '15px', fontWeight: '900', color: '#34d399' }}>
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
                  <button onClick={fetchAdminDeposits} style={{ fontSize: '10px', backgroundColor: '#1e293b', color: '#38bdf8', border: 'none', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                    🔄 {t.update}
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
                  <button onClick={fetchAdminWithdrawals} style={{ fontSize: '10px', backgroundColor: '#1e293b', color: '#38bdf8', border: 'none', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                    🔄 {t.update}
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
    gap: '4px',
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
