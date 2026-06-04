'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaBook, FaCog, FaEdit, FaTrash, FaCheck } from 'react-icons/fa';
import styles from './AdminPanel.module.css';

interface Magazine {
  id: string;
  title: string;
  status: string;
  viewCount: number;
}

export default function AdminPanel() {
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [usersCount, setUsersCount] = useState(124);

  useEffect(() => {
    fetch('/api/magazines')
      .then(res => res.json())
      .then(data => setMagazines(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <h2>ConvoMag Admin</h2>
        <nav>
          <a href="#" className={styles.active}><FaBook /> Publications</a>
          <a href="#"><FaUsers /> Users</a>
          <a href="#"><FaCog /> System Settings</a>
        </nav>
      </aside>

      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Admin Dashboard</h1>
        </div>
        
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <h3>Total Publications</h3>
            <p>{magazines.length}</p>
          </div>
          <div className={styles.statCard}>
            <h3>Active Users</h3>
            <p>{usersCount}</p>
          </div>
          <div className={styles.statCard}>
            <h3>System Status</h3>
            <p className={styles.statusOk}><FaCheck /> Operational</p>
          </div>
        </div>

        <div className={styles.contentTable}>
          <h3>Platform Publications</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Status</th>
                <th>Views</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {magazines.map(mag => (
                <tr key={mag.id}>
                  <td>{mag.id}</td>
                  <td>{mag.title}</td>
                  <td><span className={`${styles.badge} ${styles['badge' + mag.status]}`}>{mag.status}</span></td>
                  <td>{mag.viewCount || 0}</td>
                  <td>
                    <button className={styles.iconBtn}><FaEdit /></button>
                    <button className={`${styles.iconBtn} ${styles.danger}`}><FaTrash /></button>
                  </td>
                </tr>
              ))}
              {magazines.length === 0 && (
                <tr>
                  <td colSpan={5} style={{textAlign: 'center', padding: '20px'}}>No publications found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
