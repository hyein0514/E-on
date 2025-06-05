const ParticipatingChallenge = require('../models/ParticipatingChallenge');
const Challenge = require('../models/Challenge');

// 챌린지 신청
exports.join = async(req, res, next) => {
    try{
        const challengeId = req.params.id;
        const userId = req.body.user_id;

        //중복 신청 방지
        let exists = await ParticipatingChallenge.findOne({
            where:{challenge_id: challengeId, user_id: userId}
        });
        console.log('참여 존재?', exists && exists.participating_state);

        if (exists) {
          if (exists.participating_state === '취소') {
            exists.participating_state = '신청';
            await exists.save();
            // **여기서 반드시 다시 조회!**
            exists = await ParticipatingChallenge.findOne({
                where:{challenge_id: challengeId, user_id: userId}
            });
            return res.status(200).json(exists);
          }
          return res.status(409).json({error:'이미 신청한 챌린지'});
        }

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

//챌린지 참여 조회
exports.getOne = async (req, res, next) => {
  try {
    const id = req.params.id;
    const row = await ParticipatingChallenge.findByPk(id);
    if (!row) {
      return res.status(404).json({ error: '참여 기록 없음' });
    }
    res.json(row);
  } catch (err) {
    next(err);
  }
};

// 유저ID + 챌린지ID로 참여 상태 조회
exports.getParticipationByUserAndChallenge = async (req, res, next) => {
  try {
    const challengeId = Number(req.params.challengeId); // URL param 예: /participations/challenge/:challengeId/user/:userId
    const userId = Number(req.params.userId);

    const participation = await ParticipatingChallenge.findOne({
      where: {
        challenge_id: challengeId,
        user_id: userId,
      },
    });

    if (!participation) {
      return res.status(404).json({ error: '참여 기록 없음' });
    }
    res.json(participation);
  } catch (err) {
    next(err);
  }
};


