'use client';

import React, { useState } from 'react';
import { FaCode, FaCopy, FaCheck } from 'react-icons/fa';
import styles from './EmbedGenerator.module.css';

export default function EmbedGenerator({ magazineId }: { magazineId: string }) {
  const [copied, setCopied] = useState(false);
  const [width, setWidth] = useState('100%');
  const [height, setHeight] = useState('600px');
  const [theme, setTheme] = useState('light');

  const embedCode = `<iframe 
  src="${window.location.origin}/reader?mag=${magazineId}&embed=true&theme=${theme}" 
  width="${width}" 
  height="${height}" 
  frameborder="0" 
  allowfullscreen="true" 
  allow="autoplay; microphone"
></iframe>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <FaCode className={styles.icon} />
        <h2>Generate Embed Code</h2>
      </div>

      <div className={styles.controls}>
        <div className={styles.inputGroup}>
          <label>Width</label>
          <input type="text" value={width} onChange={e => setWidth(e.target.value)} />
        </div>
        <div className={styles.inputGroup}>
          <label>Height</label>
          <input type="text" value={height} onChange={e => setHeight(e.target.value)} />
        </div>
        <div className={styles.inputGroup}>
          <label>Theme</label>
          <select value={theme} onChange={e => setTheme(e.target.value)}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="transparent">Transparent</option>
          </select>
        </div>
      </div>

      <div className={styles.codeOutput}>
        <pre>{embedCode}</pre>
        <button className={styles.copyBtn} onClick={handleCopy}>
          {copied ? <><FaCheck /> Copied</> : <><FaCopy /> Copy Code</>}
        </button>
      </div>
    </div>
  );
}
