import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export interface StorageProvider {
  uploadFile(file: Buffer, fileName: string, mimeType: string, tenantId: string): Promise<{ url: string; path: string }>;
  deleteFile(path: string): Promise<void>;
  getSignedUrl(path: string): Promise<string>;
}

export class LocalStorageProvider implements StorageProvider {
  private baseDir: string;

  constructor() {
    this.baseDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  async uploadFile(file: Buffer, fileName: string, mimeType: string, tenantId: string): Promise<{ url: string; path: string }> {
    const tenantDir = path.join(this.baseDir, tenantId);
    if (!fs.existsSync(tenantDir)) {
      fs.mkdirSync(tenantDir, { recursive: true });
    }

    const uniqueName = `${uuidv4().substring(0, 8)}-${fileName}`;
    const filePath = path.join(tenantId, uniqueName);
    const fullPath = path.join(this.baseDir, filePath);

    fs.writeFileSync(fullPath, file);
    
    // In local dev, URL is served via /uploads static route
    return {
      url: `/uploads/${filePath}`,
      path: filePath
    };
  }

  async deleteFile(filePath: string): Promise<void> {
    const fullPath = path.join(this.baseDir, filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }

  async getSignedUrl(filePath: string): Promise<string> {
    // Local storage doesn't support temp signed URLs easily, return static URL
    return `/uploads/${filePath}`;
  }
}

// Global storage factory
let currentProvider: StorageProvider | null = null;

export function getStorageProvider(): StorageProvider {
  if (!currentProvider) {
    // This can be easily switched to S3StorageProvider when configured
    currentProvider = new LocalStorageProvider();
  }
  return currentProvider;
}
