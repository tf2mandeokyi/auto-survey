# 소개

커맨드 하나로 자동으로 학생 건강상태 자가진단을 해주는 Typescript로 짜여진 레포지토리이다.

⚠️**주의: 이 스크립트는 학생이 건강하다는 조건 하에서 짜여졌으므로, 실행하기 전 반드시 자신의 건강상태를 확인해주시기 바랍니다.**



## 사용 방법

1. 이 레포지토리를 다음 커맨드로 다운로드해준다.

   ```bash
   git clone https://github.com/tf2mandeokyi/auto-survey
   cd auto-survey
   ```

2. `credentials.json`이라는 파일을 새로 만들고, 다음과 같이 작성해준다.

   ```json
   {
       "orgCode": "<학교 코드>",
       "name": "<학생 이름>",
       "birthday": "<생년월일, YYMMDD>"
   }
   ```

3. 현재 레포지토리를 다음 커맨드로 빌드해준다. (한번만 실행)

   ```bash
   # node 빌드
   npm build
   # typescript 설치
   npm install -g typescript
   ```

4. 스크립트를 컴파일해준다.

   ```bash
   # credentials.json이 수정됐을 때 외에는 이 작업은 한번만 해주셔도 됩니다.
   npx tsc
   ```

5. 컴파일된 스크립트를 실행해준다.

   ```
   npm index.js
   ```

   
