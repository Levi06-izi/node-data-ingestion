
import { knexInstance } from "../db/knexFile";

export const batchData = async (dataBuffer: object[], batchSize: number, tableName: string) => { 
        /**
         * using for loop here out of trying a lot of things my hands went on, so what was I facing issue with -
         * When a lot of insert functions being awaited they were storing a new reference each time being called
         * which accumulated to straight on for heap memory overflow 
         * why so I needed to make sure all these insertion works in a sequence along with making sure these get called 
         * after the last one finishes, which is why using try block here creates a block space which results for the required 
         * operation.
         */
        for (let i = 0; i < dataBuffer.length; i += batchSize) {
            const batch = dataBuffer.slice(i, i + batchSize);
            try{
                await knexInstance(tableName).insert(batch);
            }
            catch(error){
                console.log("Error in inserting the data into database:", error)
            }
            
        }
  }