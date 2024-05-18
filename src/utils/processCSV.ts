import * as fs from 'fs'
import csv from 'csv-parser';
import path from 'path';
import { createTableIfNotExists } from './createTable';
import { batchData } from './batchingData';

function isProperCsvFile(filePath: string): boolean {
  const fileName = path.basename(filePath); // Get filename without path
  const parts = fileName.split('.');

  // Check if there's only one dot (excluding leading/trailing dots)
  if (parts.length !== 2 || parts[0].length === 0 || parts[1].length === 0) {
    return false;
  }

  const fileExtension = parts[1].toLowerCase();
  return fileExtension === 'csv';
}

// Helper function to process a CSV file and insert data into the database
export async function processCsvFile(filePath: string, tableName: string): Promise<void> {
  try {
    if(!isProperCsvFile(filePath)){
      console.warn('Unsupported file format:', filePath);
      return;
    }

    const csvStream = fs.createReadStream(filePath);
    const csvParser = csv({ headers: true });
    
    let firstline: object|null  = null
    let dataBuffer: object[] = [];
    const batchSize = 100

    csvStream.pipe(csvParser)
      .on('data',  async (row: any) => {
        if(!firstline) {
          firstline = row;
          console.log(typeof(firstline),firstline)
          const columns: string[]  = Object.values(row)
          await createTableIfNotExists(tableName, columns)
        } else {
          const mappedData: any={}
          for (const [headerKey, columnName] of Object.entries(firstline)) {
            mappedData[columnName] = row[headerKey]; // Map data object keys to column names
          }
          dataBuffer.push(mappedData)
        }
      })
      .on('end', async () => {
        if(!firstline) {
          console.warn("Empty CSV file or missing first line with column names:", filePath);
          return;
        }
        console.log("total rows = ", dataBuffer.length)
        /**
         * inserting data in batches
         */
        await batchData(dataBuffer, batchSize, tableName);
        console.log('Data inserted successfully.');
      })
  } catch (error) {
    console.error('Error processing CSV or inserting data:', error);
    //TODO: Handle the error appropriately (e.g., log to a file, retry)
  }
}
