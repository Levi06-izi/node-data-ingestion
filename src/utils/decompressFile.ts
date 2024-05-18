import * as fs from 'fs';
import * as zlib from 'zlib';
import * as tar from 'tar';

// Helper function to decompress a GZIP file
export async function decompressFile(source: string, destination: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const gzip = fs.createReadStream(source);
      const gunzip = zlib.createGunzip();
      const extractStream = tar.extract({ cwd: destination });
  
      gzip.pipe(gunzip).pipe(extractStream);
  
      extractStream.on('finish', () => {
        resolve();
      });
  
      extractStream.on('error', (error) => {
        reject(error);
      });
    });
  }