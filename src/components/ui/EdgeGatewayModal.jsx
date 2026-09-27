import { useState } from 'react';
import {
  Zap,
  Wifi,
  WifiOff,
  Server,
  HardDrive,
  Database,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  X,
  Lock,
} from 'lucide-react';
import Button from './Button';
import StatusBadge from './StatusBadge';

export default function EdgeGatewayModal({
  isOpen,
  onClose,
  isOfflineSimulated,
  setIsOfflineSimulated,
}) {
  const [syncing, setSyncing] = useState(false);
  const [bufferedCount, setBufferedCount] = useState(3);
  const [lastFlushed, setLastFlushed] = useState('2 mins ago');

  const handleToggleOffline = () => {
    if (!isOfflineSimulated) {
      // Switching to offline
      setIsOfflineSimulated(true);
      setBufferedCount((prev) => prev + 1);
    } else {
      // Reconnecting -> sync
      setSyncing(true);
      setTimeout(() => {
        setIsOfflineSimulated(false);
        setBufferedCount(0);
        setLastFlushed('Just now');
        setSyncing(false);
      }, 900);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-[#0D111A] border border-[#243046] rounded-[16px] shadow-2xl overflow-hidden font-mono z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-[#0A0D14] border-b border-[#1C2536] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-[8px] ${
                isOfflineSimulated
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'bg-emerald-500/20 text-emerald-400'
              }`}
            >
              {isOfflineSimulated ? (
                <WifiOff className="w-5 h-5 animate-pulse" />
              ) : (
                <Zap className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  In-Pit Edge Gateway & Offline Sync
                </h3>
                <StatusBadge
                  status={isOfflineSimulated ? 'warning' : 'healthy'}
                  label={isOfflineSimulated ? 'OFFLINE • BUFFERING' : 'ONLINE • SYNCED'}
                  size="xs"
                />
              </div>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                NVIDIA Jetson In-Pit Rugged Node • DGMS Autonomous Safety Ledger
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-[6px] text-slate-400 hover:text-white hover:bg-[#121824] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Simulation Toggle Banner */}
          <div
            className={`p-4 rounded-[12px] border ${
              isOfflineSimulated
                ? 'bg-amber-500/10 border-amber-500/30'
                : 'bg-emerald-500/10 border-emerald-500/30'
            } flex items-center justify-between gap-4`}
          >
            <div>
              <div className="text-xs font-bold text-white uppercase flex items-center gap-1.5">
                {isOfflineSimulated ? (
                  <>
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>In-Pit Comm Dropout Active</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>High-Speed Optical Telemetry Linked</span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-slate-300 font-sans mt-1">
                {isOfflineSimulated
                  ? 'Simulating deep shaft / bench signal loss. Edge gateway is buffering audit events locally to SQLite store.'
                  : 'Direct WAN link to MOIL Central Command is active. Telematics streaming at sub-20ms latency.'}
              </p>
            </div>

            <Button
              variant={isOfflineSimulated ? 'primary' : 'secondary'}
              size="sm"
              onClick={handleToggleOffline}
              disabled={syncing}
              className="shrink-0 text-xs font-mono"
            >
              {syncing ? (
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Flushing...</span>
                </span>
              ) : isOfflineSimulated ? (
                'Restore Connection'
              ) : (
                'Simulate Dropout'
              )}
            </Button>
          </div>

          {/* Edge Architecture Parameters */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#0A0D14] border border-[#1C2536] p-3 rounded-[10px] space-y-1">
              <span className="text-[10px] text-slate-500 uppercase block">Local Compute Node</span>
              <span className="text-white font-bold text-xs block">NVIDIA Jetson Orin Nano</span>
              <span className="text-[10px] text-emerald-400">IP67 In-Pit Enclosure</span>
            </div>

            <div className="bg-[#0A0D14] border border-[#1C2536] p-3 rounded-[10px] space-y-1">
              <span className="text-[10px] text-slate-500 uppercase block">Store-and-Forward Ledger</span>
              <span className="text-white font-bold text-xs block">
                {bufferedCount} Cached Packets
              </span>
              <span className="text-[10px] text-slate-400">
                {bufferedCount > 0 ? 'Pending Flush to Cloud' : 'All Events Synced'}
              </span>
            </div>
          </div>

          {/* Active In-Pit CAN-bus Sensors */}
          <div className="bg-[#0A0D14] border border-[#1C2536] p-3.5 rounded-[12px] space-y-2.5">
            <span className="text-xs font-bold text-white uppercase block">
              Active In-Pit Telemetry Channels
            </span>

            <div className="space-y-1.5">
              {[
                { name: 'Excavator EX-04 CAN-Bus', status: 'BUFFERED_LOCAL', rate: '50 Hz' },
                { name: 'Haul Dumper TRK-12 IMU', status: 'BUFFERED_LOCAL', rate: '20 Hz' },
                { name: 'InSAR Bench Extensometer #3', status: 'BUFFERED_LOCAL', rate: '1 Hz' },
                { name: 'Blast Exclusion Geofence Siren Gate', status: 'LOCAL_INTERLOCKED', rate: 'Event' },
              ].map((chan) => (
                <div
                  key={chan.name}
                  className="flex items-center justify-between p-2 rounded-[6px] bg-[#121824] border border-[#1C2536] text-[11px]"
                >
                  <span className="text-slate-300 font-medium">{chan.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-[10px]">{chan.rate}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        isOfflineSimulated
                          ? 'bg-amber-400/20 text-amber-400'
                          : 'bg-emerald-400/20 text-emerald-400'
                      }`}
                    >
                      {isOfflineSimulated ? 'LOCAL LEDGER' : 'CLOUD STREAM'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cryptographic Compliance Assurance */}
          <div className="p-3 bg-[#121824] rounded-[8px] border border-[#1C2536] flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>SHA-256 Tamper-Proof Audit Hashing Active</span>
            </div>
            <span className="text-slate-500 text-[10px]">DGMS Form IV</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-[#0A0D14] border-t border-[#1C2536] flex items-center justify-between">
          <div className="text-[10px] text-slate-500">
            Last central sync: <strong>{lastFlushed}</strong>
          </div>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close Window
          </Button>
        </div>
      </div>
    </div>
  );
}
