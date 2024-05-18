import * as https from 'https';
import * as fs from 'fs';

export async function extractFile(url: string, destination: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = https.get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download file: ${response.statusCode}`));
          return;
        }
  
        const fileStream = fs.createWriteStream(destination);
        response.pipe(fileStream);
  
        fileStream.on('finish', () => {
          resolve();
        });
  
        fileStream.on('error', (error) => {
          reject(error);
        });
      });
  
      request.on('error', (error) => {
        reject(error);
      });
    });
  }