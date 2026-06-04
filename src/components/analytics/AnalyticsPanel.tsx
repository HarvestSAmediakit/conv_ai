'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  FaChartLine,
  FaUsers,
  FaClock,
  FaMousePointer,
  FaArrowUp,
  FaArrowDown
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
  // Mock data for the analytics dashboard
  const stats = [
    { label: 'Total Readers', value: '24.5K', trend: 12.5, icon: <FaUsers /> },
    { label: 'Avg. Read Time', value: '14m 20s', trend: 5.2, icon: <FaClock /> },
    { label: 'Link Clicks', value: '8.2K', trend: -2.4, icon: <FaMousePointer /> },
    { label: 'Podcast Plays', value: '12.4K', trend: 18.1, icon: <FaChartLine /> },
  ];

  const topPages = [
    { page: 1, views: 24500, title: 'Cover' },
    { page: 4, views: 18200, title: 'Featured Article' },
    { page: 8, views: 15400, title: 'Advertiser Spread' },
    { page: 12, views: 12100, title: 'Interview' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Publication Analytics</h2>
        <select className={styles.dateSelector}>
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>This Quarter</option>
          <option>All Time</option>
        </select>
      </div>

      <div className={styles.statsGrid}>
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
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
                  <th>% of Total</th>
                </tr>
              </thead>
              <tbody>
                {topPages.map((row, i) => (
                  <tr key={i}>
                    <td>{row.page}</td>
                    <td>{row.title}</td>
                    <td>{row.views.toLocaleString()}</td>
                    <td>
                      <div className={styles.barChart}>
                        <div 
                          className={styles.barFill} 
                          style={{ width: `${(row.views / 24500) * 100}%` }}
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
            <h3>Audience Devices</h3>
          </div>
          <div className={styles.deviceStats}>
            <div className={styles.deviceItem}>
              <div className={styles.deviceLabel}>Mobile</div>
              <div className={styles.deviceBarContainer}>
                <div className={styles.deviceBar} style={{ width: '65%', backgroundColor: '#667eea' }}></div>
              </div>
              <div className={styles.deviceValue}>65%</div>
            </div>
            <div className={styles.deviceItem}>
              <div className={styles.deviceLabel}>Desktop</div>
              <div className={styles.deviceBarContainer}>
                <div className={styles.deviceBar} style={{ width: '25%', backgroundColor: '#76e4b8' }}></div>
              </div>
              <div className={styles.deviceValue}>25%</div>
            </div>
            <div className={styles.deviceItem}>
              <div className={styles.deviceLabel}>Tablet</div>
              <div className={styles.deviceBarContainer}>
                <div className={styles.deviceBar} style={{ width: '10%', backgroundColor: '#f9a8d4' }}></div>
              </div>
              <div className={styles.deviceValue}>10%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
