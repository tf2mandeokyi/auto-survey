import { EduroSurveyApi } from './src/eduroapi/api';
import * as credentials from './credentials.json';

let api = new EduroSurveyApi();

async function dosurvey() {
    let user = await api.findUser({
        birthday: credentials.birthday,
        loginType: 'school',
        name: credentials.name,
        orgCode: credentials.orgCode,
        stdntPNo: null
    });

    if(await api.hasPassword(user)) {
        await api.validatePassword(user, credentials.password);
    }

    let participant = (await api.getParticipantPreviews(user))[0];
    let pinfo = await api.getParticipantInfo(participant);
    await api.doSurvey(pinfo);
}

dosurvey().then(console.log);