'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaStore,
  FaGlobe,
  FaPhone,
  FaEnvelope,
  FaTags,
  FaArrowRight,
  FaTimes,
  FaStar,
  FaMapMarkerAlt
} from 'react-icons/fa';
import styles from './AdvertiserDetail.module.css';

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl?: string;
}

interface Advertiser {
  id: string;
  brand_name: string;
  description: string;
  website: string;
  phone: string;
  email: string;
  address: string;
  rating: number;
  featured_products: Product[];
}

interface AdvertiserDetailProps {
  advertiser: Advertiser;
  onClose?: () => void;
  onNavigateToPage?: (page: number) => void;
}

export default function AdvertiserDetail({
  advertiser,
  onClose,
  onNavigateToPage
}: AdvertiserDetailProps) {
  const [activeTab, setActiveTab] = useState<'about' | 'products' | 'contact'>('about');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.brandIcon}>
            <FaStore />
          </div>
          <div>
            <h2>{advertiser.brand_name}</h2>
            <div className={styles.rating}>
              {Array.from({ length: 5 }).map((_, i) => (
                <FaStar key={i} className={i < advertiser.rating ? styles.starActive : styles.starInactive} />
              ))}
              <span>({advertiser.rating.toFixed(1)}) / Featured Partner</span>
            </div>
          </div>
        </div>
        {onClose && (
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <FaTimes />
          </button>
        )}
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'about' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('about')}
        >
          About Us
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'products' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Featured Offers
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'contact' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('contact')}
        >
          Contact
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'about' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.aboutTab}
          >
            <h3>Our Story</h3>
            <p>{advertiser.description}</p>
            
            <div className={styles.statsGrid}>
              <div className={styles.statBox}>
                <span className={styles.statLabel}>Response Time</span>
                <span className={styles.statValue}>&lt; 2 hours</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statLabel}>Magazine Offers</span>
                <span className={styles.statValue}>{advertiser.featured_products.length} Active</span>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'products' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.productsTab}
          >
            {advertiser.featured_products.length === 0 ? (
              <p className={styles.emptyState}>No special offers available at the moment.</p>
            ) : (
              <div className={styles.productList}>
                {advertiser.featured_products.map((product) => (
                  <div key={product.id} className={styles.productCard}>
                    <div className={styles.productImage}>
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} />
                      ) : (
                        <div className={styles.imagePlaceholder}><FaTags /></div>
                      )}
                    </div>
                    <div className={styles.productInfo}>
                      <h4>{product.name}</h4>
                      <p>{product.description}</p>
                      <div className={styles.productFooter}>
                        <span className={styles.price}>{product.price}</span>
                        <button className={styles.claimBtn}>
                          Claim Offer <FaArrowRight fontSize={10} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'contact' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.contactTab}
          >
            <div className={styles.contactList}>
              <a href={advertiser.website} target="_blank" rel="noopener noreferrer" className={styles.contactItem}>
                <div className={styles.contactIcon}><FaGlobe /></div>
                <div>
                  <span className={styles.contactLabel}>Website</span>
                  <span className={styles.contactValue}>{advertiser.website}</span>
                </div>
              </a>
              <a href={`tel:${advertiser.phone}`} className={styles.contactItem}>
                <div className={styles.contactIcon}><FaPhone /></div>
                <div>
                  <span className={styles.contactLabel}>Phone</span>
                  <span className={styles.contactValue}>{advertiser.phone}</span>
                </div>
              </a>
              <a href={`mailto:${advertiser.email}`} className={styles.contactItem}>
                <div className={styles.contactIcon}><FaEnvelope /></div>
                <div>
                  <span className={styles.contactLabel}>Email</span>
                  <span className={styles.contactValue}>{advertiser.email}</span>
                </div>
              </a>
              <div className={styles.contactItem}>
                <div className={styles.contactIcon}><FaMapMarkerAlt /></div>
                <div>
                  <span className={styles.contactLabel}>Address</span>
                  <span className={styles.contactValue}>{advertiser.address}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
