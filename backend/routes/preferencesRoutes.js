// routes/preferencesRoutes.js

const express = require("express");
const router = express.Router();
const SelectInterests = require('../models/SelectInterests');
const SelectVisions = require('../models/SelectVisions');
const InterestCategory = require('../models/InterestCategory');
const VisionCategory = require('../models/VisionCategory');
const Interests = require('../models/Interests');
const Visions = require('../models/Visions');


// 관심분야 저장
router.post("/interests", async (req, res) => {
  const { userId, interestIds } = req.body;
  try {
    await SelectInterests.destroy({ where: { user_id: userId } });
    const data = interestIds.map(id => ({ user_id: userId, interest_id: id }));
    await SelectInterests.bulkCreate(data);
    res.status(200).json({ message: "관심분야 저장 완료" });
  } catch (error) {
    console.error("관심분야 저장 중 에러 발생:", error);
    res.status(500).json({ message: "오류 발생", error });
  }
});
// 진로희망 저장
router.post("/visions", async (req, res) => {
  const { userId, visionIds } = req.body;
  try {
    await SelectVisions.destroy({ where: { user_id: userId } });
    const data = visionIds.map(id => ({ user_id: userId, vision_id: id }));
    await SelectVisions.bulkCreate(data);
    res.status(200).json({ message: "진로희망 저장 완료" });
  } catch (error) {
    console.error("진로희망 저장 중 에러 발생:", error);
    res.status(500).json({ message: "오류 발생", error });
  }
});

// 관심분야 대분류 조회
router.get("/interests/categories", async (req, res) => {
  try {
    const categories = await InterestCategory.findAll();
    res.status(200).json(categories);
  } catch (error) {
    console.error("관심분야 카테고리 조회 실패:", error);
    res.status(500).json({ message: "서버 에러", error });
  }
});

// 진로희망 대분류 조회
router.get("/visions/categories", async (req, res) => {
  try {
    const categories = await VisionCategory.findAll();
    res.status(200).json(categories);
  } catch (error) {
    console.error("진로희망 카테고리 조회 실패:", error);
    res.status(500).json({ message: "서버 에러", error });
  }
});

router.get("/interests", async (req, res) => {
  const { categoryCode } = req.query;
  try {
    const interests = await Interests.findAll({ where: { category_code: categoryCode } });
    res.status(200).json(interests);
  } catch (error) {
    console.error("관심분야 소분류 조회 실패:", error);
    res.status(500).json({ message: "서버 에러", error });
  }
});

router.get("/visions", async (req, res) => {
  const { categoryCode } = req.query;
  try {
    const visions = await Visions.findAll({ where: { category_code: categoryCode } });
    res.status(200).json(visions);
  } catch (error) {
    console.error("진로희망 소분류 조회 실패:", error);
    res.status(500).json({ message: "서버 에러", error });
  }
});

module.exports = router;
