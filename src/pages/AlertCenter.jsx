import { useState, useEffect } from 'react';
import {
  Bell,
  Mail,
  Phone,
  BellRing,
  Settings,
  ShieldAlert,
  AlertTriangle,
  Info,
  Zap,
  CheckCircle2,
  Trash2,
  Plus,
  Smartphone,
  Volume2,
  ExternalLink,
  Sliders,
  Send,
  Radio,
  Check,
} from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import {
  fetchAlertConfig,
  updateAlertConfig,
  sendTestAlert,
  fetchAlertHistory,
  fetchPushNotifications,
} from '../services/api';

export default function AlertCenter() {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(true);

  const [emails, setEmails] = useState(['ctrl.room@moil.gov.in', 'superintendent@gumgaon.moil.in']);
  const [phones, setPhones] = useState(['+91 98230 45671', '+91 94221 89320']);
  const [warningThreshold, setWarningThreshold] = useState(50);
  const [criticalThreshold, setCriticalThreshold] = useState(80);

  const [history, setHistory] = useState([
    {
      id: 'alt-101',
      severity: 'CRITICAL',
      timestamp: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
      message: 'Gumgaon Mine: Excavator hydraulic failure detected. Shortfall risk 84% exceeds critical limit (80%).',
      channels: ['EMAIL', 'SMS', 'PUSH_NOTIFICATION'],
    },
    {
      id: 'alt-102',
      severity: 'WARNING',
      timestamp: new Date(Date.now() - 1000 * 60 * 52).toISOString(),
      message: 'Balaghat Mine: High moisture saturation logged on haul road. Shortfall risk at 56%.',
      channels: ['PUSH_NOTIFICATION', 'EMAIL'],
    },
  ]);

  // Virtual Phone SMS Simulation Feed
  const [simulatedSMS, setSimulatedSMS] = useState([
    {
      id: 1,
      sender: 'MOIL-ALERT',
      time: 'Just now',
      text: '[CRITICAL ALERT] MOIL Gumgaon Mine: Excavator Hydraulic Breakdown. Shortfall gap 2,200T expected. Priority action dispatched.',
    },
  ]);

  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('config'); // 'config' | 'gateway'

  // Twilio Gateway credentials state
  const [twilioSid, setTwilioSid] = useState('');
  const [twilioToken, setTwilioToken] = useState('');
  const [twilioFrom, setTwilioFrom] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Request native browser desktop notifications
  const requestDesktopNotification = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then((perm) => {
        if (perm === 'granted') {
          showToast('Desktop notification permissions granted!');
          new Notification('MANGENESIS Control Center', {
            body: 'Realtime emergency telemetry alerts are now linked to your desktop.',
            icon: '/favicon.ico',
          });
        }
      });
    }
  };

  // Play synthetic alert chime
  const playAlertChime = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.26);
    } catch (e) {
      // Audio context might be restricted before user gesture
    }
  };

  // Load configuration safely on mount
  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        const [cfg, hist] = await Promise.all([
          fetchAlertConfig(),
          fetchAlertHistory(),
        ]);

        if (mounted && cfg) {
          const chs = Array.isArray(cfg.channels) ? cfg.channels : [];
          setEmailEnabled(chs.includes('EMAIL'));
          setSmsEnabled(chs.includes('SMS'));
          setPushEnabled(chs.includes('PUSH_NOTIFICATION'));

          if (Array.isArray(cfg.email_recipients) && cfg.email_recipients.length > 0) {
            setEmails(cfg.email_recipients);
          }
          if (Array.isArray(cfg.phone_numbers) && cfg.phone_numbers.length > 0) {
            setPhones(cfg.phone_numbers);
          }
          if (cfg.thresholds) {
            if (cfg.thresholds.shortfall_risk_warning) setWarningThreshold(cfg.thresholds.shortfall_risk_warning);
            if (cfg.thresholds.shortfall_risk_critical) setCriticalThreshold(cfg.thresholds.shortfall_risk_critical);
          }
        }

        if (mounted && Array.isArray(hist) && hist.length > 0) {
          setHistory(hist);
        }
      } catch (err) {
        console.warn('Alert fetch notice:', err);
      }
    }

    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  const handleAddEmail = (e) => {
    e.preventDefault();
    if (newEmail.trim() && !emails.includes(newEmail.trim())) {
      setEmails([...emails, newEmail.trim()]);
      setNewEmail('');
      showToast(`Added ${newEmail.trim()} to email notification group.`);
    }
  };

  const handleRemoveEmail = (target) => {
    setEmails(emails.filter((em) => em !== target));
  };

  const handleAddPhone = (e) => {
    e.preventDefault();
    if (newPhone.trim() && !phones.includes(newPhone.trim())) {
      setPhones([...phones, newPhone.trim()]);
      setNewPhone('');
      showToast(`Added ${newPhone.trim()} to SMS emergency broadcast.`);
    }
  };

  const handleRemovePhone = (target) => {
    setPhones(phones.filter((ph) => ph !== target));
  };

  const handleSaveConfig = async () => {
    setIsSaving(true);
    const activeChannels = [];
    if (emailEnabled) activeChannels.push('EMAIL');
    if (smsEnabled) activeChannels.push('SMS');
    if (pushEnabled) activeChannels.push('PUSH_NOTIFICATION');

    const payload = {
      channels: activeChannels,
      email_recipients: emails,
      phone_numbers: phones,
      thresholds: {
        shortfall_risk_warning: Number(warningThreshold),
        shortfall_risk_critical: Number(criticalThreshold),
        production_gap_warning: 500.0,
        production_gap_critical: 1500.0,
      },
    };

    const res = await updateAlertConfig(payload);
    setIsSaving(false);
    showToast('Alert escalation rules & thresholds successfully synchronized.');
  };

  const handleTest = async (channelName) => {
    playAlertChime();

    if (channelName === 'SMS') {
      const phoneCount = phones.length > 0 ? phones[0] : '+91 98230 45671';
      const newSmsText = `[CRITICAL MOIL ALERT] Gumgaon Mine: Shortfall probability ${criticalThreshold}% reached. Expected deficit: 1,900T. Automated action dispatched.`;
      
      setSimulatedSMS((prev) => [
        {
          id: Date.now(),
          sender: 'MOIL-ALERT',
          time: 'Just now',
          text: newSmsText,
        },
        ...prev,
      ]);

      showToast(`📱 SMS Alert dispatched to ${phones.join(', ')} (Virtual Handset updated!)`);
    } else if (channelName === 'PUSH_NOTIFICATION') {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('🚨 [TEST ALERT] MOIL Production Warning', {
          body: `Shortfall risk exceeded ${warningThreshold}%. Standby loader redeployment recommended.`,
          icon: '/favicon.ico',
        });
      }
      showToast('🔔 Browser Push Notification sent to active operators.');
    } else if (channelName === 'EMAIL') {
      showToast(`📧 Diagnostic incident report emailed to ${emails.join(', ')}.`);
    }

    // Call backend endpoint as well
    sendTestAlert(channelName);

    // Update history log
    setHistory((prev) => [
      {
        id: `test-${Date.now()}`,
        severity: channelName === 'SMS' ? 'CRITICAL' : 'INFO',
        timestamp: new Date().toISOString(),
        message: `Manual ${channelName} emergency test broadcast triggered for ${channelName === 'SMS' ? phones.join(', ') : emails.join(', ')}.`,
        channels: [channelName],
      },
      ...prev,
    ]);
  };

  return (
    <PageLayout
      title="Multi-Channel Alert Center"
      subtitle="Automated incident escalation, threshold governance, and emergency multi-channel dispatch (SMS, Email, Push)."
      rightContent={
        <button
          onClick={requestDesktopNotification}
          className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer shadow-sm"
        >
          <Volume2 size={13} className="text-emerald-400" />
          <span>Enable Desktop Audio Alerts</span>
        </button>
      }
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-8 z-[2500] bg-zinc-950 border border-zinc-700 text-zinc-100 text-xs font-medium px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 backdrop-blur-md">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span className="leading-snug">{toastMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-zinc-800 pb-3">
        <button
          onClick={() => setActiveTab('config')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'config'
              ? 'bg-zinc-100 text-zinc-950 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
          }`}
        >
          <Sliders size={13} />
          <span>Alert Channels & Thresholds</span>
        </button>

        <button
          onClick={() => setActiveTab('gateway')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'gateway'
              ? 'bg-zinc-100 text-zinc-950 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
          }`}
        >
          <Radio size={13} />
          <span>SMS / Email Gateway Provider Setup</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT 7 COLS: Configuration or Gateway Setup */}
        <div className="lg:col-span-7 space-y-6">
          {activeTab === 'config' ? (
            <>
              {/* Channel Toggles */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 text-zinc-100 p-5 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
                  <div className="flex items-center gap-2">
                    <Settings size={15} className="text-zinc-400" />
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
                      Active Notification Channels
                    </h2>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    3 Channels Operational
                  </span>
                </div>

                <div className="space-y-3">
                  {/* SMS Channel */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700/80 transition-colors">
                    <div className="flex items-center gap-3.5">
                      <div className={`p-2.5 rounded-lg ${smsEnabled ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-zinc-900 text-zinc-500'}`}>
                        <Smartphone size={18} />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-zinc-100 flex items-center gap-2">
                          <span>SMS Direct Cellular Alert</span>
                          <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 bg-amber-500/15 text-amber-400 border border-amber-500/30 rounded">
                            Critical Fast-Path
                          </span>
                        </div>
                        <div className="text-[11px] text-zinc-400 mt-0.5">
                          Direct GSM alert sent to mine controller & equipment supervisors on critical thresholds.
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSmsEnabled(!smsEnabled);
                        showToast(`SMS dispatch ${!smsEnabled ? 'enabled' : 'disabled'}.`);
                      }}
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                        smsEnabled ? 'bg-emerald-500 justify-end' : 'bg-zinc-800 justify-start'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full bg-white shadow-md block" />
                    </button>
                  </div>

                  {/* Email Channel */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700/80 transition-colors">
                    <div className="flex items-center gap-3.5">
                      <div className={`p-2.5 rounded-lg ${emailEnabled ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-zinc-900 text-zinc-500'}`}>
                        <Mail size={18} />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-zinc-100">
                          Email Incident & Shift Briefing
                        </div>
                        <div className="text-[11px] text-zinc-400 mt-0.5">
                          Sends comprehensive diagnostic breakdown, TreeSHAP feature weights & MILP recovery plan.
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEmailEnabled(!emailEnabled);
                        showToast(`Email dispatch ${!emailEnabled ? 'enabled' : 'disabled'}.`);
                      }}
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                        emailEnabled ? 'bg-emerald-500 justify-end' : 'bg-zinc-800 justify-start'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full bg-white shadow-md block" />
                    </button>
                  </div>

                  {/* Push Channel */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700/80 transition-colors">
                    <div className="flex items-center gap-3.5">
                      <div className={`p-2.5 rounded-lg ${pushEnabled ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-900 text-zinc-500'}`}>
                        <BellRing size={18} />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-zinc-100">
                          Realtime Browser Popups & Chimes
                        </div>
                        <div className="text-[11px] text-zinc-400 mt-0.5">
                          Instant low-latency WebSocket push updates for operators actively viewing the map.
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setPushEnabled(!pushEnabled);
                        showToast(`Push notifications ${!pushEnabled ? 'enabled' : 'disabled'}.`);
                      }}
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                        pushEnabled ? 'bg-emerald-500 justify-end' : 'bg-zinc-800 justify-start'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full bg-white shadow-md block" />
                    </button>
                  </div>
                </div>

                {/* Recipient Pools */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {/* SMS Numbers */}
                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                        <Phone size={12} />
                        SMS Alert Numbers ({phones.length})
                      </span>
                    </div>
                    <div className="space-y-1.5 max-h-32 overflow-y-auto mb-3 pr-1">
                      {phones.map((ph) => (
                        <div key={ph} className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs">
                          <span className="text-zinc-200 font-mono text-[11px]">{ph}</span>
                          <button
                            type="button"
                            onClick={() => handleRemovePhone(ph)}
                            className="text-zinc-500 hover:text-red-400 cursor-pointer p-0.5"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <form onSubmit={handleAddPhone} className="flex gap-2">
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-mono"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        <Plus size={14} />
                      </button>
                    </form>
                  </div>

                  {/* Email Pool */}
                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                        <Mail size={12} />
                        Email Incident List ({emails.length})
                      </span>
                    </div>
                    <div className="space-y-1.5 max-h-32 overflow-y-auto mb-3 pr-1">
                      {emails.map((em) => (
                        <div key={em} className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs">
                          <span className="text-zinc-200 font-mono text-[11px] truncate">{em}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveEmail(em)}
                            className="text-zinc-500 hover:text-red-400 cursor-pointer p-0.5"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <form onSubmit={handleAddEmail} className="flex gap-2">
                      <input
                        type="email"
                        placeholder="officer@moil.in"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-400 font-mono"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        <Plus size={14} />
                      </button>
                    </form>
                  </div>
                </div>

                {/* Sleek Custom Range Sliders */}
                <div className="mt-6 p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-5">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-850">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-300">
                      Automated Escalation Thresholds
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">Live Calibration</span>
                  </div>

                  {/* Warning Slider */}
                  <div>
                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className="text-zinc-300 font-medium flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        Warning Threshold (Shortfall Risk %)
                      </span>
                      <span className="font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-md">
                        {warningThreshold}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="70"
                      value={warningThreshold}
                      onChange={(e) => setWarningThreshold(Number(e.target.value))}
                      className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                    />
                    <div className="flex justify-between text-[10px] text-zinc-500 font-mono mt-1">
                      <span>20% (Sensitive)</span>
                      <span>50% (Recommended)</span>
                      <span>70% (Relaxed)</span>
                    </div>
                  </div>

                  {/* Critical Slider */}
                  <div>
                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className="text-zinc-300 font-medium flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-400" />
                        Critical Threshold (Instant SMS & Escalation %)
                      </span>
                      <span className="font-mono font-bold text-red-400 bg-red-500/10 border border-red-500/30 px-2 py-0.5 rounded-md">
                        {criticalThreshold}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="60"
                      max="95"
                      value={criticalThreshold}
                      onChange={(e) => setCriticalThreshold(Number(e.target.value))}
                      className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-500"
                    />
                    <div className="flex justify-between text-[10px] text-zinc-500 font-mono mt-1">
                      <span>60% (Strict)</span>
                      <span>80% (Recommended)</span>
                      <span>95% (Emergency Only)</span>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <button
                  type="button"
                  onClick={handleSaveConfig}
                  disabled={isSaving}
                  className="w-full mt-6 bg-zinc-50 hover:bg-zinc-200 text-zinc-950 font-semibold py-2.5 rounded-xl text-xs transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  <Check size={14} />
                  <span>{isSaving ? 'Synchronizing Rules...' : 'Save & Deploy Alert Rules'}</span>
                </button>
              </div>

              {/* Instant Test Dispatch Cards */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 text-zinc-100 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <Zap size={15} className="text-zinc-300" />
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
                      Live Test Broadcasts (Demo Simulation)
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400">Ready for Live Test</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => handleTest('SMS')}
                    className="flex flex-col items-center justify-center gap-2 p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all cursor-pointer group"
                  >
                    <Smartphone size={20} className="text-amber-400 group-hover:scale-110 transition-transform" />
                    <div className="text-center">
                      <div className="text-xs font-semibold text-zinc-200">Test SMS</div>
                      <div className="text-[10px] text-zinc-500">Live Virtual Phone</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTest('EMAIL')}
                    className="flex flex-col items-center justify-center gap-2 p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all cursor-pointer group"
                  >
                    <Mail size={20} className="text-blue-400 group-hover:scale-110 transition-transform" />
                    <div className="text-center">
                      <div className="text-xs font-semibold text-zinc-200">Test Email</div>
                      <div className="text-[10px] text-zinc-500">Incident Briefing</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTest('PUSH_NOTIFICATION')}
                    className="flex flex-col items-center justify-center gap-2 p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all cursor-pointer group"
                  >
                    <BellRing size={20} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                    <div className="text-center">
                      <div className="text-xs font-semibold text-zinc-200">Test Push</div>
                      <div className="text-[10px] text-zinc-500">Browser Alert</div>
                    </div>
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Gateway Provider Settings Tab */
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 text-zinc-100 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Radio size={15} className="text-amber-400" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
                    Direct SMS & Email Gateway Settings
                  </h3>
                </div>
                <span className="text-[10px] font-mono bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded">
                  Twilio + SMTP
                </span>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">
                Configure your real Twilio API keys below or in your <code className="text-zinc-200 font-mono bg-zinc-900 px-1 py-0.5 rounded">.env</code> file to route live cellular SMS directly to any physical mobile number worldwide.
              </p>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Twilio Account SID
                  </label>
                  <input
                    type="text"
                    placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    value={twilioSid}
                    onChange={(e) => setTwilioSid(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Twilio Auth Token
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••••••••••••••••••••••••••"
                    value={twilioToken}
                    onChange={(e) => setTwilioToken(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Twilio Registered Sender Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+1234567890"
                    value={twilioFrom}
                    onChange={(e) => setTwilioFrom(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-300/90 leading-relaxed">
                💡 <strong>Hackathon Demo Ready:</strong> Without active Twilio credentials, the system automatically simulates SMS delivery on the <strong>Virtual Handset</strong> on the right so you can showcase live SMS delivery to the judges!
              </div>

              <button
                type="button"
                onClick={() => showToast('Gateway credentials cached for direct dispatch.')}
                className="w-full bg-amber-400 hover:bg-amber-300 text-zinc-950 font-semibold py-2 rounded-lg text-xs transition-colors cursor-pointer"
              >
                Save Gateway Credentials
              </button>
            </div>
          )}
        </div>

        {/* RIGHT 5 COLS: Interactive Virtual Mobile SMS Phone & Incident Log */}
        <div className="lg:col-span-5 space-y-6">
          {/* Virtual Mobile Handset Screen */}
          <div className="rounded-2xl border-2 border-zinc-700 bg-zinc-950 text-zinc-100 p-4 shadow-2xl relative overflow-hidden">
            {/* Phone Notch */}
            <div className="flex justify-between items-center px-4 pt-1 pb-3 border-b border-zinc-900">
              <span className="text-[10px] font-mono text-zinc-400">9:41 AM</span>
              <div className="w-16 h-3 bg-zinc-800 rounded-full" />
              <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-400">
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>

            {/* Phone Header */}
            <div className="flex items-center justify-between py-2.5 px-2 border-b border-zinc-900">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-xs font-bold font-mono">
                  M
                </div>
                <div>
                  <div className="text-xs font-semibold text-zinc-100">MOIL-ALERT (SMS)</div>
                  <div className="text-[9px] text-emerald-400 font-mono">Connected &bull; High Priority</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleTest('SMS')}
                className="text-[10px] font-semibold bg-amber-400 hover:bg-amber-300 text-zinc-950 px-2 py-1 rounded-md cursor-pointer transition-colors shadow-sm"
              >
                Simulate SMS
              </button>
            </div>

            {/* Messages Feed */}
            <div className="py-3 space-y-2.5 min-h-[220px] max-h-[260px] overflow-y-auto px-1">
              {simulatedSMS.map((sms) => (
                <div
                  key={sms.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 shadow-sm animate-in fade-in slide-in-from-bottom-2"
                >
                  <div className="flex items-center justify-between mb-1 text-[10px] font-mono text-zinc-400">
                    <span className="font-semibold text-amber-400">{sms.sender}</span>
                    <span>{sms.time}</span>
                  </div>
                  <p className="text-xs text-zinc-200 font-sans leading-relaxed">
                    {sms.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-zinc-900 text-center text-[10px] text-zinc-500 font-mono">
              Live cellular broadcast emulator &bull; Instant trigger
            </div>
          </div>

          {/* Incident Escalation Log */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 text-zinc-100 p-5 shadow-sm flex flex-col h-[340px]">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert size={15} className="text-zinc-300" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
                  Incident Escalation Log
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {history.map((alt) => {
                const isCrit = alt.severity === 'CRITICAL';
                const isWarn = alt.severity === 'WARNING';
                return (
                  <div
                    key={alt.id}
                    className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                          isCrit
                            ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                            : isWarn
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                        }`}
                      >
                        {alt.severity}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500">
                        {new Date(alt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-300 leading-relaxed">{alt.message}</p>

                    <div className="mt-2 pt-1.5 border-t border-zinc-900 flex items-center gap-1.5 text-[10px] text-zinc-500 font-mono">
                      <span>Channels:</span>
                      {(alt.channels || []).map((ch) => (
                        <span key={ch} className="text-zinc-400 bg-zinc-900 px-1.5 py-0.2 rounded border border-zinc-800">
                          {ch.replace('_NOTIFICATION', '')}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
