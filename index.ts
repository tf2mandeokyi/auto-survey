import { EduroSurveyApi, ParticipantPreview, SurveyUser } from './src/eduroapi/api';
import * as credentials from './credentials.json';

async function dosurvey() {
    console.log('로그인 정보: {\n' + 
        `    생일: ${credentials.birthday},\n` + 
        `    이름: ${credentials.name},\n` + 
        `    학교코드: ${credentials.orgCode},\n` + 
        `    비밀번호: ${''.padStart(credentials.password.length, '*')},\n` + 
    '}\n');

    process.stdout.write('로그인 중... ');
    let user : SurveyUser;
    try {
        user = await EduroSurveyApi.findUser({
            birthday: credentials.birthday,
            loginType: 'school',
            name: credentials.name,
            orgCode: credentials.orgCode,
            stdntPNo: null
        });

        /* Turns out that the password is not necessary.
        if(await user.hasPassword()) {
            await user.validatePassword(credentials.password);
        }
        */
    } catch(e) {
        console.log('❌');
        return;
    }
    console.log('✔️')

    process.stdout.write('참여자 정보 구하는 중... ');
    let participant : ParticipantPreview;
    try {
        participant = (await user.getParticipantPreviews())[0];
    } catch(e) {
        console.log('❌');
        return;
    }
    console.log('✔️')
    
    process.stdout.write(`참여자 "${participant.userNameEncpt}" 자가진단하는 중... `);
    try {
        let pinfo = await participant.getParticipantInfo();
        await pinfo.doSurvey();
    } catch(e) {
        console.log('❌');
        return;
    }
    console.log('✔️')
}

dosurvey().then(console.log);