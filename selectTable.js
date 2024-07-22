import sqlite from "aa-sqlite";
import fs from "fs/promises"; // 파일 시스템 모듈 불러오기

// SQLite DB 파일 열기
const dbPath = "./license.info";

const tables = [
  '08b6afa7c8edcf6ceafa26469ded8b50',
  '6a735f12c986168a9517a42712cddd7c',
  'ce49f2e9b24e63e3c6bcf286dde823a3',
  'def25d34b52dfe0cee0e69ad536f5f47',
  '726bf6b740805b161ea165e7e933b2df',
  '41d844a140801e12016823e19f5351cb',
  '831c6977bf46c47e89b4efca6e343120',
  '31cd8db1629fc520cb80d1409aff43cc',
  '6aaabfd89fcc598ae092052c1d396f0a',
  '5151c82352d90857e4dddee2f102646d',
  'e04c727c01aa8dbde26fe6fa5dd7ae97',
  '018d34afb7c7cfc5ee36fb1504ab6ae0',
  '5c8858a2f74db4561900a50e4dcea93d',
  'e0b90911859289fa03c5b798d22e45c4',
  '62a9eaa9fe733571bd7dc47e2354a553',
  'f49ed5e30fcf6a609692876af9fd6716',
  'e782e090c7e5dea23cf47a2a2945efb4',
  '2254c2176ada414f13556686c56d2d84',
  '042aef89cd9c174ff18d0ab71fb97c3e',
  '98ed617a202bd0567599213d64c5dede',
  'd3574d6f67d3828e0d7dc1fde56c6070',
  '73b0e554b4dd73a5867149c240c9fe78',
  '4fcc239475d39161839135a8bfe6bdb8',
  '46f60e43fcbbe39a852d66fc0a65b0ff',
  '9038eb37a3e25a4f2ea5c99ce8c52402',
  'b2e8609d4c6038ef7d18c3d0d112f6d1',
  'b21154ba33545355f47ec9eb66e0e6d0',
  'b5cafbf09cb48bed13a20cf856255ec0',
  '7dd9c1a2430b2f6a766814e2e465dca3',
  '31aa9fadd730321283878fc07dcd000a',
  'b2a9bd2e9ba75b180b48fa76aae5bd5c',
  '3d5733e5b54c27db60f07174eb2d9f0d',
  '345efb8822ab38ded3d881bd0f0ead1b',
  'd480946af27eb8e251b9e435114acd7b',
  '9f05b05a158c13344251daefc9d43efe',
  '03c297879bebaf28c63b20ea7030ac0c',
  'f8e00671b9ad3819ad43492177aa6040',
  'ff7ac52ab149559932f179172675082b',
  '963fc93a4946e7bb8c4b84a73047ddc3',
  '304c1306044988d8db583e2e266de6da',
  'd818195f97636e76d74cecb62d4e4f72',
  '86032123337ca50fdac12a007f69796e',
  'a983a0c08b74a41aeee22c5175d5bac4',
  'fd6f5382f201252fd32f4280850ec602',
  '70f1ff145cf446b4819216aaecbb9ff2',
  'f3c7658dd9263d29343db421ca2a4644',
  '085afe854373bdf403e62e512aa883a4',
  '7893f54a4d7accd01a04b41a47b809ed',
  '9a7ceb4899751a2e05520e1426ebef5f',
  '54a6d5cb48183ffb4d79d30acc2d2d35',
  'ea54c7a31a5c5abe2df05e3325ac5de7',
  'd1929693fc42e9f11f135f52073904e0',
  'e8f60d22d93cc273db385eeeb5195297',
  '956121f00e74da6496de704d4ef316e7',
  '5ad4b6f80ed31fef8bde516ce2eba2fb',
  '9fabad8368f278fc1125d9537116732a',
  '8efb1cab0fa78aa21e963a15b13f0e0c',
  'c39636bb99bfb1476309f18b5e2a246d',
  'af87b34b0636511949ff7ece8f2a47c5',
  'c361b7e103334988ec524a16fb9d6008',
  'b683cc5afd3d23b79d3d728556525f4c',
  'c835e0e94554ddd325fd4e59c6367299',
  '4d1a89ca486c334fa4275e969b911421',
  '8768c407311bafad8760e9a7b8d6c378',
  '1b71507422c343a392bde61cd32df5d3',
  'b23cf99674e10bc4078fab5f66533283',
  '79b2cc88465915ae532df3c1fd4b56f5',
  '916265fd5acc1e0a1a84ed57d7aa2978',
  'b5723210ae72b608ea2e62de46f74e65',
  '6ba88ffb5a126bca8a0e9b71e5552f56',
  '1414e692afb8e401cbd466b4e90bb962',
  'bcb2741a36b402adfb52e9b01ac66971',
  'be17088c8d75163b3ac587dacaa4eec5',
  'ed88705675924a4d17c1a10453818769',
  '1a427f29068c0a99a7afd561e799bcb5',
  '853ff0205b340ea68b7b86f89e3ce584',
  '46ee4eadc9233c3e95109cb60e3634ce',
  '2cc769e83c985c23180111a64fadaadc',
  '55022b1c44fb284306714f27fb8b8eff',
  'b72cdfecc8bfff451eedf91ada94d0f9',
  '1865dec1d2f95ff1ffd4ae69fd18d17a',
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
