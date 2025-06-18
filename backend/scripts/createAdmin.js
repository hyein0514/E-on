// backend/scripts/createAdmin.js
// 관리자 계정을 생성하는 스크립트
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { sequelize } = require("../database/db");

(async () => {
    try {
        await sequelize.sync(); // 연결 보장

        const adminEmail = "admin@example.com";
        const existingAdmin = await User.scope("withPassword").findOne({
            where: { email: adminEmail },
        });

        if (existingAdmin) {
            console.log("⚠️ Admin already exists.");
            process.exit();
        }

        const plainPassword = "admin";
        const hashedPassword = await bcrypt.hash(plainPassword, 12); // 기본 사용자 생성과 맞춰 12로 설정

        const admin = User.build({
            name: "관리자",
            age: 30,
            email: adminEmail,
            password: hashedPassword, // 직접 해시된 값
            type: "admin",
            agreements: {},
        });

        // 이중 해시 방지를 위해 hooks 잠시 비활성화
        await admin.save({ hooks: false });

        console.log("✅ Admin created.");
        process.exit();
    } catch (err) {
        console.error("❌ Error:", err);
        process.exit(1);
    }
})();
