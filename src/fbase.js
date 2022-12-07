import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

//  보안의 개념보다는 (서비스를 위해 빌드하고 웹사이트를 띄우면 create-react-app 은 이 코드들을 실제 값으로 변환시기 때문에 결국에는 key값을 숨길 수 없음) github에 업로드하지 않기 위해 .env 파일을 만들어 key 담아두기

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

firebase.initializeApp(firebaseConfig);

export const authService = firebase.auth();
