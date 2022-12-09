import Tweet from "components/Tweet";
import { dbService, storageService } from "fbase";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const Home = ({ userObj }) => {
  const [tweet, setTweet] = useState("");
  const [tweets, setTweets] = useState([]);
  const [attachment, setAttachment] = useState("");

  // 오래된 데이터를 가져오는 법/ 변경된 데이터는 새로고침해야 반영된다.
  // const getTweets = async () => {
  //   const dbTweets = await dbService.collection("tweets").get();

  //   dbTweets.forEach((document) => {
  //     const tweetObject = {
  //       ...document.data(),
  //       id: document.id,
  //     };
  //     setTweets((prev) => [tweetObject, ...prev]);
  //   });
  // };

  useEffect(() => {
    // getTweets();

    // realtime database 실시간으로 data를 제공 => onSnapshot()
    dbService.collection("tweets").onSnapshot((snapshot) => {
      const tweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTweets(tweetArray);
    });
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = "";

    if (attachment !== "") {
      // userObj.uid 유저아이디로 폴더 구분 후 랜덤이름으로 attachment 저장
      const attachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuidv4()}`);
      // putString 메서드를 사용하여 data_url 인코딩 문자열을 업로드하여 response에 담아두기
      const response = await attachmentRef.putString(attachment, "data_url");
      // attachment의 URL 받아오기
      attachmentUrl = await response.ref.getDownloadURL();
    }

    const tweetObj = {
      text: tweet,
      createAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };
    await dbService.collection("tweets").add(tweetObj);
    setTweet("");
    setAttachment("");
  };

  const onTextChange = (event) => {
    const {
      target: { value },
    } = event;
    setTweet(value);
  };

  const onFileChange = (event) => {
    // event로 부터 파일을 얻음
    const {
      target: { files },
    } = event;
    // 하나의 파일만 추가하므로 첫번째 파일만 가져오기
    const theFile = files[0];

    // file을 읽어오는 api 함수 reader 생성
    const reader = new FileReader();
    // 파일 로딩이 끝나면 finishedEvent를 갖게됨
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    // 데이터를 얻음
    reader.readAsDataURL(theFile);
  };

  const onClearAttachment = () => setAttachment("");

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={tweet}
          onChange={onTextChange}
          placeholder="What's on your mind?"
          maxLength={120}
        />

        {/* file input 에 eventListener(onChange)를 추가 */}
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="tweet" />
        {attachment && (
          <div>
            <img src={attachment} alt="attachment" width="50ox" height="50px" />
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )}
      </form>
      <div>
        {tweets.map((tweet) => (
          <Tweet
            key={tweet.id}
            tweetObj={tweet}
            isOwner={tweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
