import { EduroSurveyApi, ParticipantPreview, SurveyUser, School } from "./src/eduroapi";
import fs from 'fs';



interface Credentials {
    "birthday": string,
    "studentName": string,
    "schoolName": string,
    "schoolType": string,
    "province": string
}



function readCredentials() : Credentials[] {
    let data = fs.readFileSync('credentials.json');
    let json = JSON.parse(data.toString());
    return Array.isArray(json) ? json : [json];
}



async function dosurvey(credentials: Credentials) {
    
    console.log('로그인 정보: {\n' + 
        `    생일: ${credentials.birthday},\n` + 
        `    이름: ${credentials.studentName},\n\n` + 

        `    행정 구역: ${credentials.province},\n` + 
        `    학교급: ${credentials.schoolType},\n` + 
        `    학교: ${credentials.schoolName},\n` + 
    '}\n');


    process.stdout.write('학교 정보 구하는 중... ');
    let schools : School[];
    try {
        schools = (await EduroSurveyApi.searchSchool(credentials.province, credentials.schoolType, credentials.schoolName)).schulList;
        if(schools.length == 0) throw '학교 검색결과가 없습니다.';
    } catch(e) {
        console.log(`❌,\n${e}`);
        return;
    }
    console.log('✔️')


    process.stdout.write('로그인 중... ');
    let user : SurveyUser;
    try {
        user = await EduroSurveyApi.findUser({
            birthday: credentials.birthday,
            loginType: 'school',
            name: credentials.studentName,
            orgCode: schools[0].orgCode,
            stdntPNo: null
        });

        /* Turns out that the password is not needed.
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
    

    process.stdout.write(`자가진단하는 중... `);
    try {
        let pinfo = await participant.getParticipantInfo();
        await pinfo.doSurvey();
    } catch(e) {
        console.log('❌');
        return;
    }
    console.log('✔️')
}

(async function a() {
    for(let cre of readCredentials()) {
        await dosurvey(cre);
    }
})().then(console.log);