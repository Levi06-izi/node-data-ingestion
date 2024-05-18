/**
 * The entry point function. This will download the given dump file, extract/decompress it,
 * parse the CSVs within, and add the data to a SQLite database.
 * This is the core function you'll need to edit, though you're encouraged to make helper
 * functions!
 */
import * as fs from 'fs'
import { decompressFile } from "./utils/decompressFile";
import { extractFile } from "./utils/extractFile";
import { processCsvFile } from './utils/processCSV';

import { DB_FILE, DOWNLOAD_URL, DUMP_DOWNLOAD_EXTRACTED, DUMP_DOWNLOAD_FILE, DUMP_DOWNLOAD_FOLDER, DUMP_DOWNLOAD_PATH, EXTRACTED_PATH, SQLITE_DB_FOLDER } from './resources';
import {generateDestination } from './utils/generateDestination/generateDestination';

export async function processDataDump() {
  try {
    await generateDestination(DUMP_DOWNLOAD_FOLDER, DUMP_DOWNLOAD_FILE);
    await generateDestination(DUMP_DOWNLOAD_EXTRACTED)
    console.log("Created tmp directory")
    await generateDestination(SQLITE_DB_FOLDER, DB_FILE);
    console.log("Created Database file")
  
    console.log('Downloading file...');
    await extractFile(DOWNLOAD_URL, DUMP_DOWNLOAD_PATH);
    console.log('Decompressing file...');
    await decompressFile(DUMP_DOWNLOAD_PATH, EXTRACTED_PATH);

    const csvFiles = await fs.promises.readdir(EXTRACTED_PATH + '/dump' ); // List CSV files in extracted directory
    for (const csvFile of csvFiles) {
      const filePath = `${EXTRACTED_PATH+'/dump'}/${csvFile}`;
      const tableName = csvFile.split('.')[0]; // Assuming CSV filename matches table name (adjust if needed)

     
      await processCsvFile(filePath, tableName);
    }
    console.log('Data processing complete!');
  } catch (error) {
    console.error('Error during data processing:', error);
  } finally {
    // Optional: Close database connection (if applicable)
    // await knexInstance.destroy();
  }
}
