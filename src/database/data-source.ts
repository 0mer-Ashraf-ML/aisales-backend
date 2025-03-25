// import { DataSource } from 'typeorm';
// import 'dotenv/config';

// const HOST: string =
//   process.env.DB_HOST || 'ep-fancy-frog-a5uymbao.us-east-2.aws.neon.tech';
// const PORT: number = Number(process.env.DB_PORT) || 5432;
// const USERNAME: string = process.env.DB_USERNAME || 'neondb_owner';
// const PASSWORD: string = process.env.DB_PASSWORD || 'npg_xfe1qFWQZV6I';
// const DATABASE: string = process.env.DB_NAME || 'neondb';

// export const AppDataSource = new DataSource({
//   type: 'postgres',
//   host: HOST,
//   port: PORT,
//   username: USERNAME,
//   password: PASSWORD,
//   database: DATABASE,
//   entities: [__dirname + '/../**/*.entity{.ts,.js}'],
//   migrations: [__dirname + '/migrations/*{.ts,.js}'],
//   synchronize: false,
//   logging: false,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

import { DataSource } from 'typeorm';
import 'dotenv/config';

const HOST: string = process.env.DB_HOST || 'localhost';
const PORT: number = Number(process.env.DB_PORT) || 5432;
const USERNAME: string = process.env.DB_USERNAME || 'postgres';
const PASSWORD: string = process.env.DB_PASSWORD || 'postgres';
const DATABASE: string = process.env.DB_NAME || 'ai_sales';
const isSSL: boolean = process.env.isSSL === 'true';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: HOST,
  port: PORT,
  username: USERNAME,
  password: PASSWORD,
  database: DATABASE,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: false,
  ssl: isSSL
    ? {
        rejectUnauthorized: false,
      }
    : false,
});
