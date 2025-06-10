const Attachment = require('../models/Attachment');
const Challenge  = require('../models/Challenge');
const fs         = require('fs');
const path       = require('path');

exports.add = async (req, res, next) => {
  try {
    const challengeId = req.params.id;
    const photosArr   = req.files.photos   || [];
    const consentsArr = req.files.consents || [];
    console.log("▶ [첨부파일 추가] req.params.id:", challengeId);
    console.log("▶ [첨부파일 추가] req.files:", req.files);
    

    // 1) 챌린지 존재 확인
    const challenge = await Challenge.findByPk(challengeId);
    if (!challenge) return res.status(404).json({ error: '챌린지 없음' });

    // 2) 업로드할 파일이 하나도 없으면 400 에러
    if (photosArr.length === 0 && consentsArr.length === 0) {
      return res.status(400).json({ error: '업로드할 파일이 없습니다.' });
    }

    // 3) DB 삽입용 레코드 배열 준비
    const rows = [];

    // 3-1) photosArr → attachment_type: '이미지'
    photosArr.forEach((f) => {
      rows.push({
        challenge_id:    challengeId,
        attachment_name: f.originalname,
        url:             `/uploads/${f.filename}`,
        attachment_type: '이미지'
      });
    });

    // 3-2) consentsArr → attachment_type: '동의서'
    consentsArr.forEach((f) => {
      rows.push({
        challenge_id:    challengeId,
        attachment_name: f.originalname,
        url:             `/uploads/${f.filename}`,
        attachment_type: '문서'
      });
    });

    // 4) 한꺼번에 Bulk Insert
    const created = await Attachment.bulkCreate(rows);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const challengeId = req.params.id;

    const items = await Attachment.findAll({
      where: { challenge_id: challengeId },
      order: [['attachment_id', 'ASC']]
    });
    res.json(items);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const id = req.params.id;
    const file = await Attachment.findByPk(id);
    if (!file) return res.status(404).json({ error: '첨부파일 없음' });

    // (선택) 물리 파일 삭제
    const filepath = path.join(__dirname, '..', 'uploads', path.basename(file.url));
    fs.unlink(filepath, () => { /* ignore errors */ });

    // DB 레코드 삭제
    await Attachment.destroy({ where: { attachment_id: id } });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
