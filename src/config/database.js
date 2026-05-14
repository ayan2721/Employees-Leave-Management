const sql = require('mssql');

const config = {
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT) || 1433,

    options: {
        encrypt: true,
        trustServerCertificate: false,
    },

    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
    },
};

// Validate required environment variables
const requiredEnvVars = [
    'DB_SERVER',
    'DB_NAME',
    'DB_USER',
    'DB_PASSWORD',
];

const missingVars = requiredEnvVars.filter(
    (key) => !process.env[key]
);

if (missingVars.length > 0) {
    console.warn('⚠️ Missing environment variables:');
    missingVars.forEach((key) => {
        console.warn(`- ${key}`);
    });
}

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then((pool) => {
        console.log('✅ Connected to Azure SQL Database');
        return pool;
    })
    .catch((err) => {
        console.error('❌ Database Connection Failed!');
        console.error(err.message);

        console.warn('Check the following:');
        console.warn('1. Azure SQL server is running');
        console.warn('2. Firewall allows your IP');
        console.warn('3. Correct username/password');
        console.warn('4. Correct database name');
        console.warn('5. DB_PORT is 1433');
    });

module.exports = {
    sql,
    poolPromise,
};