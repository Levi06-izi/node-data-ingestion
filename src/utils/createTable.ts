import { knexInstance } from "../db/knexFile";

export async function createTableIfNotExists(tableName: string, columns: string[]): Promise<void> {
    if(!columns)return;
    console.log(columns, "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
    const tableExists = await knexInstance.schema.hasTable(tableName);
    if (!tableExists) {
      
      await knexInstance.schema.createTable(tableName, (table: any) => {
        // table.increments('id').primary();
        columns.forEach(columnName => {
          table.string(columnName).notNullable(); // Assuming all columns are strings
        });
      });
  
      console.log(`Table "${tableName}" created successfully.`);
    }
    return;
  }