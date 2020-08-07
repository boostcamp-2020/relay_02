# Skylove Website

스카이러브 채팅 웹사이트입니다. 
LINK: http://49.50.162.241:3000

## 스크린샷

![index](https://user-images.githubusercontent.com/48251136/89639539-b4780c00-d8e8-11ea-8a19-f71b99cad83b.png)<br>

![chat](https://user-images.githubusercontent.com/48251136/89639536-b346df00-d8e8-11ea-8476-b8894b345aec.png)<br>

![match](https://user-images.githubusercontent.com/48251136/89639540-b510a280-d8e8-11ea-9d2f-2933ca1353e3.png)<br>


## 설치 및 실행

```bash
npm install # express moment socket.io sqlite3

npm run dev # start dev-server
npm start # start server
```

## 1. DB
DB 확인용 스크립트
```
node db/dbtest.js # 반드시 위치여야합니다!
```

### Wiki: [Link로 이동하기](https://github.com/boostcamp-2020/relay_02/wiki/DB-%EA%B0%80%EC%9D%B4%EB%93%9C)


## 2. Chat App

|Filename|Desc|Docs|
|--|--|--|
|`server.js`|서버 파일| https://github.com/boostcamp-2020/relay_02/issues/6|
|`main.js`|채팅 클라이언트 파일|https://github.com/boostcamp-2020/relay_02/issues/7|
|`index.html` `chat.html` | 웹사이트 파일 |https://github.com/boostcamp-2020/relay_02/issues/8|


## 3. 기능 A. 대화 패턴 긍정도 분석
> 링크: https://github.com/boostcamp-2020/relay_02/tree/master/NLP

### 설치 및 실행

```
python --version # 3 이상
pip install jupyter
jupyter notebook #jupyter 속에서 NLP/NLP.ipynb 파일 실행
```

필요 라이브러리

|Library|Desc|
|--|--|
|jupyter notebook| jupyter notebook 뷰어 및 편집기 (jupyter-lab 도 가능)|
|konlpy|한국어 정보처리를 위한 파이썬 패키지. Okt를 사용하여 형태소를 분석한국어 정보처리|
|nltk|데이터 전처리 과정을 위한 라이브러리|
|tensorflow|머신러닝 오픈소스|
|matplotlib|시각화 도구|
|numpy|수학 연산(배열, 통계, 행렬)을 위한 패키지|


## 4. 기능 B.


## 5. 기능 C.



## Contributing
네이버 커넥트재단 부스트캠프에 참여하신 모든 분들의 참여 기다립니다.



## License
[MIT](https://choosealicense.com/licenses/mit/)
