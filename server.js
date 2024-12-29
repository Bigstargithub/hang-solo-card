const express = require("express");
const mysql = require("mysql2");
const app = express();
const port = 3001;

// MySQL 연결 설정
const db = mysql.createConnection({
  host: "ec2-3-35-175-80.ap-northeast-2.compute.amazonaws.com", // EC2의 MySQL 서버 호스트 (localhost 또는 퍼블릭 IP)
  user: "root", // MySQL 사용자명
  password: "Rltkd001!", // MySQL 비밀번호
  database: "guestbook", // 방명록 데이터베이스
});

// MySQL 연결 확인
db.connect((err) => {
  if (err) {
    console.error("MySQL 연결 실패:", err);
    return;
  }
  console.log("MySQL에 성공적으로 연결되었습니다.");
});

// 미들웨어 설정
app.use(express.json());

// 방명록 데이터 조회 (GET 요청)
app.get("/entries", (req, res) => {
  db.query("SELECT * FROM entries ORDER BY timestamp DESC", (err, results) => {
    if (err) {
      return res.status(500).send("데이터 조회 오류");
    }
    res.json(results);
  });
});

// 방명록 데이터 추가 (POST 요청)
app.post("/entries", (req, res) => {
  const { name, message } = req.body;

  if (!name || !message) {
    return res.status(400).send("이름과 메시지를 모두 입력해주세요!");
  }

  const timestamp = new Date().toLocaleString();
  const query = "INSERT INTO entries (name, message, timestamp) VALUES (?, ?, ?)";
  db.query(query, [name, message, timestamp], (err, results) => {
    if (err) {
      return res.status(500).send("데이터 추가 오류");
    }
    res.status(201).send("메시지가 추가되었습니다.");
  });
});

// 서버 실행
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});
