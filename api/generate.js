export default async function handler(req, res) {
    const { type, eduCode, schoolName, schoolCode, ymd, ym } = req.query;
    // GEMINI_API_KEY 환경변수 안전하게 참조
    const apiKey = process.env.GEMINI_API_KEY || '';

    let targetUrl = '';

    if (type === 'schoolInfo') {
        targetUrl = `https://open.neis.go.kr/hub/schoolInfo?Type=json&pIndex=1&pSize=5&ATPT_OFCDC_SC_CODE=${eduCode}&SCHUL_NM=${encodeURIComponent(schoolName)}`;
    } else if (type === 'meal') {
        targetUrl = `https://open.neis.go.kr/hub/mealServiceDietInfo?Type=json&pIndex=1&pSize=7&ATPT_OFCDC_SC_CODE=${eduCode}&SD_SCHUL_CODE=${schoolCode}&MLS_YMD=${ymd}`;
    } else if (type === 'schedule') {
        targetUrl = `https://open.neis.go.kr/hub/SchoolSchedule?Type=json&pIndex=1&pSize=100&ATPT_OFCDC_SC_CODE=${eduCode}&SD_SCHUL_CODE=${schoolCode}&AA_YMD=${ym}`;
    } else {
        return res.status(400).json({ error: '잘못된 요청 유형입니다.' });
    }

    try {
        const response = await fetch(targetUrl);
        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: '외부 데이터 연동에 실패했습니다.' });
    }
}