import { EduroSurveyApi } from './src/eduroapi/api';
import * as credentials from './credentials.json';

async function dosurvey() {
    let user = await EduroSurveyApi.findUser({
        birthday: credentials.birthday,
        loginType: 'school',
        name: credentials.name,
        orgCode: credentials.orgCode,
        stdntPNo: null
    });

    if(await user.hasPassword()) {
        await user.validatePassword(credentials.password);
    }

    let participant = (await user.getParticipantPreviews())[0];
    let pinfo = await participant.getParticipantInfo();
    await pinfo.doSurvey();
}

dosurvey().then(console.log);