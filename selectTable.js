import sqlite from "aa-sqlite";

// SQLite DB 파일 열기
const dbPath = "./license.info";

const tables = [
  "e5ef0b4a135c3baa9e308d434563d4a4",
  "e5ef0b4a135c3baa9e308d434563d4a4",
];

const getQueryAndInsert = async () => {
  await sqlite.open(dbPath);
  for await (const table of tables) {
    const query = `
      SELECT *
      FROM "${table}"
    `;

    const getTables = await sqlite.get_all(query, []);
    const test = Object.values(getTables.data).map((values) => {
      // delete values.id;
      // values["소유자_주소"] = values["소유자 주소"];
      // delete values["소유자 주소"];
      // values["HASHED_TABLE"] = `'${table}'`;
      delete values.id; // id 컬럼 제거
      values["HASHED_TABLE"] = `${table}`;
      values["소유자_주소"] = values["소유자 주소"]; // "소유자 주소" 컬럼을 "소유자_주소"로 변경
      delete values["소유자 주소"]; // 기존 "소유자 주소" 컬럼 제거

      const columns = Object.keys(values)
        .map((key) => `"${key}"`)
        .join(", ");
      const rows = Object.values(values)
        .map((value) => {
          // 문자열인 경우 SQL 쿼리에 맞게 '로 감싸주기
          return typeof value === "string"
            ? `'${value.replace(/'/g, "''")}'`
            : value;
        })
        .join(", ");

      const insertQuery = `INSERT INTO "PENALTY_TARGETS" (${columns}) VALUES (${rows})`;
      console.log(insertQuery); // 생성된 INSERT 쿼리를 확인

      return values;
    });
  }
};

getQueryAndInsert();
