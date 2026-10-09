import { useCallback, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { AlertTriangle, Volume2, VolumeX } from 'lucide-react';
import emergencyService from '../services/emergencyService';
import Modal from './common/Modal';
import Button from './common/Button';
import Input from './common/Input';
import SearchFilterSelect from './common/SearchFilterSelect';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
const SOCKET_URL = API_BASE.replace(/\/api\/v\d+\/?$/, '');
const OPTIONS = ['Fire or explosion', 'Gas leakage', 'Chemical spill', 'Electrical hazard', 'Structural danger', 'Other critical threat'];

export default function EmergencyAlerts({ user, dialogOpen, onDialogClose }) {
  const [incidents, setIncidents] = useState([]);
  const [form, setForm] = useState({ type: OPTIONS[0], location: '' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [soundUnavailable, setSoundUnavailable] = useState(false);
  const [soundSilenced, setSoundSilenced] = useState(false);
  const soundSilencedRef = useRef(soundSilenced);
  const audioRef = useRef({ context: null, oscillator: null, gain: null, timer: null, starting: null, active: new Set() });
  const requestIdRef = useRef(null);
  const submittingRef = useRef(false);
  const incidentsRef = useRef(incidents);
  const acknowledgedIdsRef = useRef(new Set());
  const pendingAudioIdsRef = useRef(new Set());
  const startToneRef = useRef(null);
  const stopToneRef = useRef(null);
  const canResolve = user?.role === 'Factory Admin';
  soundSilencedRef.current = soundSilenced;

  const stopTone = useCallback((incidentId) => {
    const audio = audioRef.current;
    if (incidentId) {
      audio.active.delete(String(incidentId));
      pendingAudioIdsRef.current.delete(String(incidentId));
    }
    else audio.active.clear();
    if (!audio.active.size && audio.oscillator) {
      clearInterval(audio.timer);
      try { audio.oscillator.stop(); } catch { /* already stopped */ }
      audio.oscillator = null;
      audio.gain = null;
      audio.timer = null;
    }
  }, []);

  const startTone = useCallback(async (incidentId) => {
    const audio = audioRef.current;
    if (soundSilencedRef.current) return;
    const id = String(incidentId);
    audio.active.add(id);
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) throw new Error('Web Audio is unavailable');
      if (!audio.context) audio.context = new AudioContextClass();
      if (audio.starting) {
        await audio.starting;
      } else if (!audio.oscillator) {
        const startup = (async () => {
          await audio.context.resume();
          if (audio.context.state !== 'running') throw new Error('Browser audio requires user interaction');
          if (soundSilencedRef.current || !audio.active.size) return;
          const oscillator = audio.context.createOscillator();
          const gain = audio.context.createGain();
          oscillator.type = 'sawtooth';
          oscillator.frequency.value = 880;
          gain.gain.value = 0;
          oscillator.connect(gain);
          gain.connect(audio.context.destination);
          oscillator.start();
          audio.oscillator = oscillator;
          audio.gain = gain;
          let audible = false;
          audio.timer = window.setInterval(() => {
            audible = !audible;
            gain.gain.setTargetAtTime(audible ? 0.12 : 0, audio.context.currentTime, 0.025);
            oscillator.frequency.setTargetAtTime(audible ? 880 : 660, audio.context.currentTime, 0.025);
          }, 500);
        })();
        audio.starting = startup;
        try {
          await startup;
        } finally {
          if (audio.starting === startup) audio.starting = null;
        }
      } else {
        await audio.context.resume();
        if (audio.context.state !== 'running') throw new Error('Browser audio requires user interaction');
      }
      if (soundSilencedRef.current || !audio.active.has(id)) return;
      if (!audio.oscillator) throw new Error('Emergency tone could not be started');
      pendingAudioIdsRef.current.delete(id);
      setSoundEnabled(true);
      setSoundUnavailable(false);
    } catch {
      audio.active.delete(id);
      setSoundUnavailable(true);
    }
  }, []);

  incidentsRef.current = incidents;
  startToneRef.current = startTone;
  stopToneRef.current = stopTone;

  useEffect(() => {
    let connected;
    let mounted = true;
    const audio = audioRef.current;
    const stopToneForCleanup = stopToneRef.current;
    const refreshActive = () => emergencyService.getActive().then((data) => {
      if (mounted) setIncidents((data.incidents || []).filter((incident) => !incident.acknowledgedByMe && !acknowledgedIdsRef.current.has(incident._id)));
    }).catch(() => {});
    refreshActive();
    const token = localStorage.getItem('industrial_token');
    if (token) {
      connected = io(SOCKET_URL, { auth: { token }, transports: ['websocket', 'polling'], reconnection: true });
      connected.on('connect', refreshActive);
      connected.on('emergency:created', (incident) => {
        if (!acknowledgedIdsRef.current.has(incident._id)) {
          setIncidents((existing) => existing.some((item) => item._id === incident._id) ? existing : [incident, ...existing]);
          pendingAudioIdsRef.current.add(String(incident._id));
          startToneRef.current(incident._id);
        }
        if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
          try { new Notification(`ACTIVE EMERGENCY: ${incident.type}`, { body: `${incident.location}${incident.description ? ` — ${incident.description}` : ''}`, tag: incident._id, requireInteraction: true }); } catch { /* in-app warning remains available */ }
        }
      });
      connected.on('emergency:updated', (incident) => {
        if (incident.status !== 'ACTIVE') stopToneRef.current(incident._id);
        setIncidents((existing) => incident.status === 'ACTIVE'
          ? existing.map((item) => item._id === incident._id ? { ...incident, acknowledgedByMe: item.acknowledgedByMe } : item)
          : existing.filter((item) => item._id !== incident._id));
      });
    }
    return () => {
      mounted = false;
      connected?.disconnect();
      stopToneForCleanup();
      if (audio.context) audio.context.close().catch(() => {});
      audio.context = null;
    };
  }, []);

  const activateSound = useCallback(async () => {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) throw new Error();
      const context = audioRef.current.context || new AudioContextClass();
      audioRef.current.context = context;
      await context.resume();
      if (context.state !== 'running') throw new Error('Browser audio requires user interaction');
      setSoundEnabled(true);
      setSoundUnavailable(false);
      if (!soundSilencedRef.current) pendingAudioIdsRef.current.forEach((id) => startToneRef.current(id));
    } catch { setSoundUnavailable(true); }
  }, []);

  useEffect(() => {
    const unlockAudio = () => {
      window.removeEventListener('pointerdown', unlockAudio, true);
      window.removeEventListener('keydown', unlockAudio, true);
      activateSound();
    };
    window.addEventListener('pointerdown', unlockAudio, true);
    window.addEventListener('keydown', unlockAudio, true);
    return () => {
      window.removeEventListener('pointerdown', unlockAudio, true);
      window.removeEventListener('keydown', unlockAudio, true);
    };
  }, [activateSound]);

  const submit = async (event) => {
    event.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    setMessage('');
    try {
      requestIdRef.current ||= window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}-request`;
      const data = await emergencyService.create({ ...form, requestId: requestIdRef.current });
      if (data.incident?.status === 'ACTIVE') setIncidents((existing) => existing.some((item) => item._id === data.incident._id) ? existing : [data.incident, ...existing]);
      setForm({ type: OPTIONS[0], location: '' });
      requestIdRef.current = null;
      setMessage('');
      onDialogClose();
    } catch (error) { setMessage(error.message || 'The alert could not be submitted. Please try again.'); }
    finally { submittingRef.current = false; setSubmitting(false); }
  };

  const acknowledge = async (id) => {
    const incident = incidents.find((item) => item._id === id);
    if (!incident) return;
    acknowledgedIdsRef.current.add(id);
    pendingAudioIdsRef.current.delete(id);
    setIncidents((existing) => existing.filter((item) => item._id !== id));
    stopTone(id);
    try {
      await emergencyService.acknowledge(id);
    } catch {
      acknowledgedIdsRef.current.delete(id);
      setIncidents((existing) => existing.some((item) => item._id === id) ? existing : [incident, ...existing]);
      startToneRef.current(id);
    }
  };

  const resolve = async (incident, status) => {
    try {
      await emergencyService.updateStatus(incident._id, status);
      stopTone(incident._id);
      setIncidents((existing) => existing.filter((item) => item._id !== incident._id));
    } catch { /* Keep warning visible when status was not saved. */ }
  };

  const closeDialog = () => {
    if (!submittingRef.current) {
      setMessage('');
      onDialogClose();
    }
  };

  return <>
    {incidents.length > 0 && <aside className="midc-emergency-stack" aria-live="assertive" aria-label="Active emergency alerts">
      {incidents.map((incident, index) => {
          const acknowledged = Boolean(incident.acknowledgedByMe);
        return <article className="midc-emergency-warning" key={incident._id}>
          <div className="midc-emergency-warning-heading"><AlertTriangle size={20} /><strong>ACTIVE EMERGENCY — {incident.type}</strong></div>
          <p><strong>Location:</strong> {incident.location}</p>
          {incident.description && <p>{incident.description}</p>}
          <p><strong>Reported:</strong> {new Date(incident.createdAt).toLocaleString()}</p>
          <p>Follow factory emergency procedures and use designated safe routes when instructed. Browser alerts supplement approved physical alarms and procedures.</p>
          {(!soundEnabled || soundUnavailable || soundSilenced) && <p role="status"><strong>Audible alarm: {soundSilenced ? 'silenced on this device' : soundUnavailable ? 'unavailable; interact with the page to retry' : 'waiting for a page interaction'}.</strong> The visual warning remains active.</p>}
          <div className="midc-emergency-warning-actions">
            <button type="button" onClick={() => acknowledge(incident._id)} disabled={acknowledged}>{acknowledged ? 'Acknowledged' : 'Acknowledge seen'}</button>
            {index === 0 && soundEnabled && <button type="button" onClick={() => {
              const silenced = !soundSilenced;
              soundSilencedRef.current = silenced;
              setSoundSilenced(silenced);
              if (silenced) stopTone();
              else incidentsRef.current.filter((item) => !item.acknowledgedByMe).forEach((item) => startToneRef.current(item._id));
            }}>{soundSilenced ? <Volume2 size={16} /> : <VolumeX size={16} />}{soundSilenced ? 'Resume emergency sound' : 'Silence emergency sound'}</button>}
            {canResolve && <><button type="button" onClick={() => resolve(incident, 'RESOLVED')}>Resolve</button><button type="button" onClick={() => resolve(incident, 'CANCELLED')}>Cancel alert</button></>}
          </div>
        </article>;
      })}
    </aside>}
    <Modal isOpen={dialogOpen} onClose={closeDialog} title="Confirm factory emergency alert" maxWidth="max-w-xl" dialogClassName="emergency-create-dialog" footer={(
      <>
        <Button variant="secondary" disabled={submitting} className="!border !border-[#dedede] !bg-white !text-[#111] !shadow-none hover:!bg-[#f8f8f8]" onClick={closeDialog}>Cancel</Button>
        <Button type="submit" form="midc-emergency-create-form" disabled={submitting} loading={submitting} className="!bg-[#111111] !text-white !shadow-none hover:!bg-[#2b2b2b]">{submitting ? 'Sending…' : 'Confirm emergency alert'}</Button>
      </>
    )}>
      <form id="midc-emergency-create-form" onSubmit={submit} className="space-y-4">
        <p className="text-sm text-[#555]">Use only for a serious threat requiring immediate response. This will alert authenticated workers associated with your factory. It supplements approved physical alarms and emergency procedures.</p>
        <SearchFilterSelect label="Emergency type" formField name="type" value={form.type} onValueChange={(value) => setForm({ ...form, type: value })} options={OPTIONS} required allowClear={false} />
        <Input label="Incident location" name="location" value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} placeholder="Building, line, zone or area" maxLength={160} required />
        {message && <p role="alert" className="text-sm text-red-600">{message}</p>}
      </form>
    </Modal>
    <style>{`
      .emergency-create-dialog {
        display: flex !important;
        flex-direction: column !important;
        width: 100%;
        height: auto !important;
        min-height: 0 !important;
        max-height: calc(100dvh - 32px) !important;
        border: 1px solid #e1e4e8 !important;
        background: #fff !important;
        box-shadow: 0 16px 40px rgba(17, 17, 17, .12) !important;
      }
      .fixed.inset-0.z-50:has(.emergency-create-dialog) > .fixed.top-0.left-0.w-screen.h-screen {
        background: rgba(17, 17, 17, .32) !important;
        backdrop-filter: none !important;
      }
      .emergency-create-dialog > div:first-child {
        flex: 0 0 auto;
        border-bottom-color: #e1e4e8 !important;
        background: #fff !important;
      }
      .emergency-create-dialog > div:first-child h3 {
        color: #111 !important;
        font-weight: 600;
      }
      .emergency-create-dialog > div:first-child button {
        color: #62666b !important;
      }
      .emergency-create-dialog > div:first-child button:hover {
        background: #f3f4f5 !important;
        color: #111 !important;
      }
      .emergency-create-dialog > div:nth-child(2) {
        flex: 0 1 auto;
        min-height: 0;
        max-height: calc(100dvh - 200px) !important;
        overflow-y: auto !important;
      }
      .emergency-create-dialog > div:last-child {
        flex: 0 0 auto;
        border-top: 1px solid #e1e4e8 !important;
        background: #fff !important;
      }
      .emergency-create-dialog label {
        color: #292929 !important;
        font-size: 13px !important;
        font-weight: 500 !important;
        text-transform: none !important;
        letter-spacing: normal !important;
      }
      .emergency-create-dialog label span {
        color: #E87532 !important;
      }
      .emergency-create-dialog input {
        border: 1px solid #dedede !important;
        border-radius: 8px !important;
        background: #fff !important;
        color: #111 !important;
        font-size: 14px !important;
        box-shadow: none !important;
      }
      .emergency-create-dialog input::placeholder {
        color: #858b92 !important;
        opacity: 1;
      }
      .emergency-create-dialog .dialog-search-filter-trigger {
        border-color: #dedede !important;
        border-radius: 8px !important;
        background: #fff !important;
        color: #111 !important;
        font-size: 14px !important;
      }
      .emergency-create-dialog .dialog-search-filter-trigger:focus-visible {
        border-color: #d1a184 !important;
        outline: none !important;
        box-shadow: 0 0 0 2px rgba(232, 117, 50, .12) !important;
      }
      html body .emergency-create-dialog input:focus,
      html body .emergency-create-dialog input:focus-visible {
        border-color: #d1a184 !important;
        outline: none !important;
        box-shadow: 0 0 0 2px rgba(232, 117, 50, .12) !important;
      }
      .emergency-create-dialog > div:last-child button {
        min-height: 40px;
        border-radius: 8px !important;
        font-weight: 500;
      }
      .midc-emergency-warning-actions button { display: inline-flex; align-items: center; justify-content: center; gap: 6px; border: 1px solid #d6d6d6; border-radius: 6px; background: #fff; color: #171717; padding: 8px 11px; font-size: 13px; font-weight: 600; cursor: pointer; }
      .midc-emergency-stack { position: fixed; z-index: 60; top: 12px; left: 50%; transform: translateX(-50%); width: min(620px, calc(100vw - 24px)); max-height: min(75vh, 720px); overflow-y: auto; display: grid; gap: 10px; }
      .midc-emergency-warning { position: relative; border: 2px solid #b42318; border-radius: 9px; background: #fff5f3; color: #2b100d; padding: 16px; box-shadow: 0 8px 26px #0003; }
      .midc-emergency-warning-heading { display: flex; align-items: center; gap: 8px; color: #a31810; font-size: 16px; padding-right: 24px; }
      .midc-emergency-warning p { margin: 8px 0 0; font-size: 14px; line-height: 1.45; }
      .midc-emergency-warning-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
      .midc-emergency-warning-actions button:disabled { opacity: .65; cursor: default; }
    `}</style>
  </>;
}
