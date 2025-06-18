// backend/controllers/user.js
const bcrypt = require("bcrypt");
const { User } = require("../models");

/**
 * [GET] /api/user/me
 *   - 내 정보 조회
 */
exports.getMyInfo = async (req, res, next) => {
    try {
        if (!req.user) {
            return res
                .status(401)
                .json({ success: false, message: "로그인이 필요합니다." });
        }
        const me = await User.findByPk(req.user.user_id, {
            attributes: { exclude: ["pw", "refresh_token"] },
        });
        if (!me) {
            return res
                .status(404)
                .json({ success: false, message: "유저를 찾을 수 없습니다." });
        }
        res.json({ success: true, user: me });
    } catch (err) {
        next(err);
    }
};

/**
 * [PUT] /api/user/me
 * Body: { name, emailNotification, currentPassword }
 *   - 내 정보 업데이트
 */
exports.updateMyInfo = async (req, res, next) => {
    const { name, emailNotification, currentPassword } = req.body;
    if (!currentPassword) {
        return res
            .status(400)
            .json({ message: "현재 비밀번호를 입력해주세요." });
    }
    const nameRegex = /^[가-힣a-zA-Z ]{2,10}$/;
    if (name && !nameRegex.test(name)) {
        return res
            .status(400)
            .json({ message: "이름은 2~10자 한글 또는 영문만 가능합니다." });
    }

    try {
        const user = await User.scope("withPassword").findByPk(
            req.user.user_id
        );
        if (!user) {
            return res
                .status(404)
                .json({ message: "사용자를 찾을 수 없습니다." });
        }
        const match = await bcrypt.compare(currentPassword, user.password);
        if (!match) {
            return res
                .status(400)
                .json({ message: "현재 비밀번호가 일치하지 않습니다." });
        }
        console.log("[1] 비밀번호 확인 완료");
        // 🛠️ 정보 업데이트
        await User.update(
            {
                ...(name && { name }),
                emailNotification:
                    emailNotification === undefined
                        ? user.emailNotification
                        : emailNotification,
            },
            { where: { user_id: req.user.user_id } }
        );
        console.log("[2] 사용자 정보 업데이트 완료");
        return res.json({
            success: true,
            message: "회원 정보가 수정되었습니다.",
        });
    } catch (err) {
        console.error("[❌ 서버 오류]", err);
        return res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
};

/**
 * [PUT] /api/user/me/password
 * Body: { currentPassword, newPassword }
 *   - 비밀번호 변경
 */
exports.changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "필수 입력값 누락" });
    }

    const user = await User.scope("withPassword").findByPk(req.user.user_id);
    console.log("User:", user.password);
    if (!user || !user.password) {
        return res
            .status(404)
            .json({ message: "사용자 정보 없음 또는 비밀번호 설정 안됨" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password); // 여기서 오류났던 것
    if (!isMatch) {
        return res
            .status(403)
            .json({ message: "현재 비밀번호가 일치하지 않습니다." });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: "비밀번호가 변경되었습니다." });
};

/**
 * [DELETE] /api/user/me
 *   - 계정 탈퇴(soft-delete)
 */
exports.deactivateAccount = async (req, res, next) => {
    try {
        await User.update(
            { accountStatus: "inactive", deactivatedAt: new Date() },
            { where: { user_id: req.user.user_id } }
        );
        req.logout(() => {}); // 세션 종료
        res.json({ success: true, message: "계정이 비활성화되었습니다." });
    } catch (err) {
        next(err);
    }
};
