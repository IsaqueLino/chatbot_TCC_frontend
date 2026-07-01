'use client';
import React, { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { fetchAllSensorData } from './dashboard.action';
import styles from './dashboard.module.css';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const COLORS = ['#32A041', '#1d6fa4', '#e67e22', '#9b59b6', '#e74c3c', '#16a085'];

function formatTime(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  return d.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

function MetricCard({ label, value, unit, color }) {
  return (
    <div className={styles.metricCard} style={{ borderTop: `4px solid ${color}` }}>
      <span className={styles.metricLabel}>{label}</span>
      <span className={styles.metricValue} style={{ color }}>
        {value !== null && value !== undefined ? Number(value).toFixed(1) : '—'}
        <span className={styles.metricUnit}>{unit}</span>
      </span>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState(null);

  useEffect(() => {
    fetchAllSensorData(200).then((rows) => {
      setData(rows);
      if (rows.length > 0 && !selectedDevice) {
        setSelectedDevice(rows[0].device_id);
      }
      setLoading(false);
    });
  }, []);

  const devices = useMemo(() => [...new Set(data.map((r) => r.device_id))], [data]);

  const deviceData = useMemo(() => {
    if (!selectedDevice) return [];
    return data
      .filter((r) => r.device_id === selectedDevice)
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      .slice(-50)
      .map((r) => ({
        time: formatTime(r.created_at),
        Temperatura: r.temperature,
        'Umid. Ar': r.air_humidity,
        'Umid. Solo': r.soil_moisture,
        pH: r.ph,
      }));
  }, [data, selectedDevice]);

  const latest = useMemo(() => {
    if (!selectedDevice) return null;
    const rows = data.filter((r) => r.device_id === selectedDevice);
    return rows.length ? rows.reduce((a, b) => (new Date(a.created_at) > new Date(b.created_at) ? a : b)) : null;
  }, [data, selectedDevice]);

  const radarTraces = useMemo(() => {
    return devices.map((dev, i) => {
      const rows = data.filter((r) => r.device_id === dev);
      if (!rows.length) return null;
      const last = rows.reduce((a, b) => (new Date(a.created_at) > new Date(b.created_at) ? a : b));
      const normTemp = Math.min(100, Math.max(0, ((last.temperature - 0) / 60) * 100));
      const normAir = last.air_humidity;
      const normSoil = last.soil_moisture;
      const normPh = Math.min(100, Math.max(0, ((last.ph - 0) / 14) * 100));
      return {
        type: 'scatterpolar',
        r: [normTemp, normAir, normSoil, normPh, normTemp],
        theta: ['Temperatura', 'Umid. Ar', 'Umid. Solo', 'pH', 'Temperatura'],
        fill: 'toself',
        name: dev,
        line: { color: COLORS[i % COLORS.length] },
        fillcolor: COLORS[i % COLORS.length] + '33',
      };
    }).filter(Boolean);
  }, [devices, data]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Carregando dados dos sensores…</p>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className={styles.emptyState}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#32A041" strokeWidth="1.5">
          <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
        </svg>
        <h3>Nenhum dado de sensor encontrado</h3>
        <p>Conecte um dispositivo IoT para começar a monitorar sua plantação.</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h2 className={styles.title}>Dashboard de Monitoramento</h2>
        {devices.length > 1 && (
          <div className={styles.deviceSelector}>
            <label className={styles.deviceLabel}>Dispositivo:</label>
            <select
              className={styles.deviceSelect}
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value)}
            >
              {devices.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {latest && (
        <div className={styles.metricsRow}>
          <MetricCard label="Temperatura" value={latest.temperature} unit="°C" color="#e74c3c" />
          <MetricCard label="Umid. do Ar" value={latest.air_humidity} unit="%" color="#1d6fa4" />
          <MetricCard label="Umid. Solo" value={latest.soil_moisture} unit="%" color="#32A041" />
          <MetricCard label="pH" value={latest.ph} unit="" color="#9b59b6" />
        </div>
      )}

      <div className={styles.chartsGrid}>
        <div className={`${styles.chartCard} ${styles.chartLarge}`}>
          <h3 className={styles.chartTitle}>Temperatura e Umidade do Ar</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={deviceData}>
              <defs>
                <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e74c3c" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#e74c3c" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="humGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1d6fa4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#1d6fa4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="Temperatura" stroke="#e74c3c" fill="url(#tempGrad)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="Umid. Ar" stroke="#1d6fa4" fill="url(#humGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className={`${styles.chartCard} ${styles.chartLarge}`}>
          <h3 className={styles.chartTitle}>Umidade do Solo e pH</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={deviceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Umid. Solo" stroke="#32A041" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="pH" stroke="#9b59b6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {radarTraces.length > 0 && (
        <div className={`${styles.chartCard} ${styles.chartWide}`}>
          <h3 className={styles.chartTitle}>Comparação de Métricas por Dispositivo (normalizado 0–100%)</h3>
          <Plot
            data={radarTraces}
            layout={{
              polar: { radialaxis: { visible: true, range: [0, 100] } },
              showlegend: true,
              margin: { t: 20, b: 20, l: 20, r: 20 },
              height: 300,
              paper_bgcolor: 'transparent',
              plot_bgcolor: 'transparent',
              font: { family: 'system-ui, sans-serif', size: 12 },
            }}
            config={{ displayModeBar: false, responsive: true }}
            style={{ width: '100%' }}
          />
        </div>
      )}
    </div>
  );
}
