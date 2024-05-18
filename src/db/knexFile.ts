import knex from "knex";

export const knexInstance = knex({
    client: 'sqlite3', // Replace with your database client
    connection: {
      filename: './out/database.sqlite', // Path to your database file
    },
    useNullAsDefault: true, // Might be required depending on your database setup
  });