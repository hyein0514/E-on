const Attachment = require('../models/Attachment');
const Challenge  = require('../models/Challenge');
const fs         = require('fs');
const path       = require('path');

exports.add = async (req, res, next) => {
  try {
    const challengeId = req.params.id;
    const files       = req.files || [];

    // 1) 챌린지 존재 확인
    const challenge = await Challenge.findByPk(challengeId);
    if (!challenge) return res.status(404).json({ error: '챌린지 없음' });

    if (!files.length) {
      return res.status(400).json({ error: '업로드할 파일이 없습니다.' });
    }

    // 2) DB 삽입 준비
    const rows = files.map(f => ({
      challenge_id    : challengeId,
      attachment_name : f.originalname,
      url             : `/uploads/${f.filename}`,
      attachment_type : f.mimetype.startsWith('image') ? '이미지' : '기타'
    }));

    // 3) bulkCreate
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
