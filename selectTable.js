import sqlite from "aa-sqlite";
import fs from "fs/promises"; // 파일 시스템 모듈 불러오기

// SQLite DB 파일 열기
const dbPath = "./license.info";

const tables = [
  "e5ef0b4a135c3baa9e308d434563d4a4",
  "e5ef0b4a135c3baa9e308d434563d4a4",
];

const getQueryAndInsert = async () => {
  await sqlite.open(dbPath);
  let allInsertQueries = ""; // 모든 Insert 쿼리를 저장할 변수 초기화
  for await (const table of tables) {
    const query = `
      SELECT *
      FROM "${table}"
    `;

    const getTables = await sqlite.get_all(query, []);
    const test = Object.values(getTables.data).map((values) => {
      delete values.id;
      values["HASHED_TABLE"] = `${table}`;
      values["소유자_주소"] = values["소유자 주소"];
      delete values["소유자 주소"];

      const columns = Object.keys(values)
        .map((key) => `"${key}"`)
        .join(", ");
      const rows = Object.values(values)
        .map((value) => {
          // null 값 처리 추가
          if (value === null) {
            return "NULL";
          }
          // 문자열인 경우 SQL 쿼리에 맞게 '로 감싸주기
          return typeof value === "string"
            ? `'${value.replace(/'/g, "''")}'`
            : value;
        })
        .join(", ");

      const insertQuery = `INSERT INTO "PENALTY_TARGETS" (${columns}) VALUES (${rows});`;
      console.log(insertQuery); // 생성된 INSERT 쿼리를 확인

      allInsertQueries += insertQuery + "\n"; // 쿼리 뒤에 줄바꿈 추가하여 allInsertQueries에 추가
      return values;
    });
  }
  await fs.writeFile("./insertQueries.txt", allInsertQueries); // 모든 쿼리를 포함하는 문자열을 파일에 쓰기
};

getQueryAndInsert();
