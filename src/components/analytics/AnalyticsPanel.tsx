'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaChartLine,
  FaUsers,
  FaClock,
  FaMousePointer,
  FaArrowUp,
  FaArrowDown,
  FaSpinner
} from 'react-icons/fa';
import styles from './AnalyticsPanel.module.css';

interface StatProps {
  label: string;
  value: string | number;
  trend: number;
  icon: React.ReactNode;
}

function StatCard({ label, value, trend, icon }: StatProps) {
  const isPositive = trend >= 0;
  return (
    <div className={styles.statCard}>
      <div className={styles.statHeader}>
        <div className={styles.statIcon}>{icon}</div>
        <div className={`${styles.trend} ${isPositive ? styles.trendUp : styles.trendDown}`}>
          {isPositive ? <FaArrowUp /> : <FaArrowDown />}
          <span>{Math.abs(trend)}%</span>
        </div>
      </div>
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

export default function AnalyticsPanel() {
  const [loading, setLoading] = useState(true);
  const [magazines, setMagazines] = useState<any[]>([]);
  const [selectedMagId, setSelectedMagId] = useState<string>('');
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    // Fetch all magazines to populate selector
    fetch('/api/magazines')
      .then(res => res.json())
      .then(data => {
        setMagazines(data);
        if (data.length > 0) {
          setSelectedMagId(data[0].id);
        } else {
          setLoading(false);
        }
      })
      .catch(err => {
        console.error("Failed to fetch magazines for analytics:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!selectedMagId) return;

    setLoading(true);
    fetch(`/api/magazines/${selectedMagId}/analytics`)
      .then(res => res.json())
      .then(data => {
        setAnalytics(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch analytics:", err);
        setLoading(false);
      });
  }, [selectedMagId]);

  if (loading && magazines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-zinc-500 gap-4">
        <FaSpinner className="animate-spin text-3xl text-emerald-500" />
        <p className="font-mono text-sm tracking-widest uppercase">Initializing Intelligence Core...</p>
      </div>
    );
  }

  if (magazines.length === 0) {
    return (
      <div className="p-8 text-center bg-[#0A0A0A] rounded-3xl border border-white/5">
        <h3 className="text-xl font-bold text-white mb-2">No Publications Found</h3>
        <p className="text-zinc-500 mb-6 text-sm">Upload your first PDF to see analytics data.</p>
        <button 
          onClick={() => window.location.href = '/publish'}
          className="bg-[#00c896] text-white px-6 py-2 rounded-full font-bold text-sm"
        >
          Go to Publisher Studio
        </button>
      </div>
    );
  }

  const stats = analytics?.stats || [
    { label: 'Total Readers', value: '0', trend: 0, icon: <FaUsers /> },
    { label: 'Avg. Read Time', value: '0m', trend: 0, icon: <FaClock /> },
    { label: 'Link Clicks', value: '0', trend: 0, icon: <FaMousePointer /> },
    { label: 'Podcast Plays', value: '0', trend: 0, icon: <FaChartLine /> },
  ];

  const topPages = analytics?.topPages || [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className="flex flex-col">
          <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">Publication Analytics</h2>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Real-time readership metrics</p>
        </div>
        <div className="flex gap-3">
          <select 
            className={`${styles.dateSelector} bg-[#0A0A0A] border-white/10 text-xs`}
            value={selectedMagId}
            onChange={(e) => setSelectedMagId(e.target.value)}
          >
            {magazines.map(m => (
              <option key={m.id} value={m.id}>{m.title}</option>
            ))}
          </select>
          <select className={`${styles.dateSelector} bg-[#0A0A0A] border-white/10 text-xs`}>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Quarter</option>
            <option>All Time</option>
          </select>
        </div>
      </div>

      <div className={styles.statsGrid}>
        {stats.map((stat: any, i: number) => (
          <StatCard 
            key={i} 
            label={stat.label}
            value={stat.value}
            trend={stat.trend}
            icon={stat.label.includes('Readers') ? <FaUsers /> : stat.label.includes('Time') ? <FaClock /> : stat.label.includes('Clicks') ? <FaMousePointer /> : <FaChartLine />}
          />
        ))}
      </div>

      <div className={styles.panels}>
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h3>Page Performance</h3>
          </div>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Page</th>
                  <th>Title</th>
                  <th>Views</th>
                  <th>Retention</th>
                </tr>
              </thead>
              <tbody>
                {topPages.map((row: any, i: number) => (
                  <tr key={i}>
                    <td>{row.page}</td>
                    <td>{row.title}</td>
                    <td>{row.views.toLocaleString()}</td>
                    <td>
                      <div className={styles.barChart}>
                        <div 
                          className={styles.barFill} 
                          style={{ width: `${(row.views / (topPages[0]?.views || 1)) * 100}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h3>Audience Intelligence</h3>
          </div>
          <div className={styles.deviceStats}>
            {[
              { label: 'Mobile', value: analytics?.devices?.mobile || 65, color: '#00c896' },
              { label: 'Desktop', value: analytics?.devices?.desktop || 25, color: '#3b82f6' },
              { label: 'Tablet', value: analytics?.devices?.tablet || 10, color: '#8b5cf6' }
            ].map((d, i) => (
              <div key={i} className={styles.deviceItem}>
                <div className={styles.deviceLabel}>{d.label}</div>
                <div className={styles.deviceBarContainer}>
                  <div className={styles.deviceBar} style={{ width: `${d.value}%`, backgroundColor: d.color }}></div>
                </div>
                <div className={styles.deviceValue}>{d.value}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
