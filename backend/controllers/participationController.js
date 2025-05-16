const ParticipatingChallenge = require('../models/ParticipatingChallenge');
const Challenge = require('../models/Challenge');

// 챌린지 신청
exports.join = async(req, res, next) => {
    try{
        const challengeId = req.params.id;
        const userId = req.body.user_id;

        //중복 신청 방지
        const exists = await ParticipatingChallenge.findOne({
            where:{challenge_id: challengeId, user_id: userId}
        });
        if (exists) return res.status(409).json({error:'이미 신청한 챌린지'});

        /* (선택) 정원, 마감일 체크 */
        const challenge = await Challenge.findByPk(challengeId);
        if (!challenge) return res.status(404).json({ error:'챌린지 없음' });
        if (challenge.challenge_state !== 'ACTIVE')
        return res.status(400).json({ error:'모집중이 아닙니다.' });

        const row = await ParticipatingChallenge.create({
            challenge_id: challengeId,
            user_id: userId,
            participating_state: '신청'
        });
        res.status(201).json(row);
    } catch(err){
        next(err);
    }
};
//참여 취소
exports.cancel = async (req, res, next) => {
    try {
      const id = req.params.id;                      // participating_id
      const row = await ParticipatingChallenge.findByPk(id);
      if (!row) return res.status(404).json({ error:'참여 기록 없음' });
  
      row.participating_state = '취소';
      await row.save();
      res.json(row);
    } catch (err) { next(err); }
  };

