import sqlite from "aa-sqlite";

// SQLite DB 파일 열기
const dbPath = "./license.info";

const selectTables = async () => {
  await sqlite.open(dbPath);
  const query = `
  SELECT name 
  FROM sqlite_master WHERE type='table'
  `;

  const getAll = await sqlite.get_all(query, []);
  console.log("🚀 ~ selectTables ~ getAll:", getAll);
};

selectTables();
