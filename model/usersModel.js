const createUserTableQuery = `
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(15) NOT NULL PRIMARY KEY,
    userName VARCHAR(15) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    joinDate DATE NOT NULL,
    isVerified BOOLEAN DEFAULT FALSE,
    CONSTRAINT uc_username UNIQUE (userName),
    CONSTRAINT uc_email UNIQUE (email),
    CHECK (CHAR_LENGTH(userName) >= 6 AND CHAR_LENGTH(userName) <= 15 AND userName REGEXP '^[a-zA-Z0-9]+$'),
    CHECK (CHAR_LENGTH(password) >= 8)
);
`;

module.exports = createUserTableQuery;
