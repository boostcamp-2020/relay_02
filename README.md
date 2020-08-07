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

## DB
DB 확인용 스크립트
```
node db/dbtest.js # 반드시 위치여야합니다!
```
### Wiki: [Link로 이동하기](https://github.com/boostcamp-2020/relay_02/wiki/DB-%EA%B0%80%EC%9D%B4%EB%93%9C)


## Chat App

|Filename|Desc|Docs|
|--|--|--|
|`server.js`|서버 파일| https://github.com/boostcamp-2020/relay_02/issues/6|
|`main.js`|채팅 클라이언트 파일|https://github.com/boostcamp-2020/relay_02/issues/7|
|`index.html` `chat.html` | 웹사이트 파일 |https://github.com/boostcamp-2020/relay_02/issues/8|


## 기능 A. 대화 패턴 긍정도 분석
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

### dataset

[네이버 영화 리뷰 데이터]([https://github.com/e9t/nsmc/](https://github.com/e9t/nsmc/))

![](https://lh4.googleusercontent.com/MlW1Tt2PLMIBDRTSEkRoWS1jgJwrvdzHSxD6Um7n9eF3eTtobmv2hdds0YjhH0EhATsTYrnufSYrdtZFTta4mn0uazNdu8bPv1kB4u4iWNI3q9KB5R_FvdBLRDZuY7EYv2s3t-vM)


- 이 데이터셋은 네이버 영화의 리뷰 중 영화당 100개의 리뷰를 모아 총 200,000개의 리뷰(train: 15만, test: 5만)로 이루어져있다.
- 1 ~ 10점까지의 평점 중에서 중립적인 평점(5 ~ 8점)은 제외하고 1 ~ 4점을 긍정으로, 9 ~ 10점을 부정으로 동일한 비율로 데이터에 포함되었다.

- 데이터는 다음과 같이 id, document, label 세 개의 열로 이루어져있다.
- id는 리뷰의 고유한 key 값이고, document는 리뷰의 내용, label은 긍정(0)인지 부정(1)인지를 나타냅니다.

![](https://lh4.googleusercontent.com/8Llw4q-RwHCUPAuCTTT1jB1jvy50BY6zzqnhb1XIvQ_B5bSqqeED81OZ2wpAKLaNdIOBdYz0zqhpgsdodbf1-r4-gJHUnYDKRNMUJwt4G3F7qhqW4DLJxHZ_3FwqNKybaXNvQ0jz)

### 정리

![](https://camo.githubusercontent.com/4b69c861c9481006274fe7e9d6e6833425c73305/68747470733a2f2f77696b69646f63732e6e65742f696d616765732f706167652f34343234392f6e617665726d6f766965312e504e47)

모델은 앞서 설명한 데이터셋을 기반으로 tensorflow를 활용하여 text를 학습시킨 후 긍/부정을 예측하는 알고리즘을 만들었다.
![](https://camo.githubusercontent.com/5cfa951e5899f03731476268bbc2761f0b23d46c/68747470733a2f2f73332e75732d776573742d322e616d617a6f6e6177732e636f6d2f7365637572652e6e6f74696f6e2d7374617469632e636f6d2f30646634623861622d646635332d343236332d383439312d6631373434306364346534642f556e7469746c65642e706e673f582d416d7a2d416c676f726974686d3d415753342d484d41432d53484132353626582d416d7a2d43726564656e7469616c3d414b49415437334c324734354f334b5335325935253246323032303038303725324675732d776573742d322532467333253246617773345f7265717565737426582d416d7a2d446174653d3230323030383037543130313832335a26582d416d7a2d457870697265733d383634303026582d416d7a2d5369676e61747572653d3932373033353330313839643639376136363236666538646463643465643062343739646238343764313436633366663464323438313663393833376662653326582d416d7a2d5369676e6564486561646572733d686f737426726573706f6e73652d636f6e74656e742d646973706f736974696f6e3d66696c656e616d65253230253344253232556e7469746c65642e706e67253232)


채팅방의 대화 내용을 DB에 저장하고, 주기적으로(주 1회) 유저들의 점수에 반영한다.
이 때, 채팅 내용은 학습이 된 모델을 통해 유저의 대화 패턴 긍정도와 부정도를 파악한다. 언행 점수는 DB에 저장되고, 추후 점수가 비슷한 사용자들끼리 매칭 서비스에 이용될 것이다.


## 기능 B.


## 기능 C.



## Contributing
네이버 커넥트재단 부스트캠프에 참여하신 모든 분들의 참여 기다립니다.



## License
[MIT](https://choosealicense.com/licenses/mit/)
