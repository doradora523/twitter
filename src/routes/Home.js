import Tweet from "components/Tweet";
import TweetFactory from "components/TweetFactory";
import { dbService } from "fbase";
import React, { useEffect, useState } from "react";

const Home = ({ userObj }) => {
  const [tweets, setTweets] = useState([]);

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

  return (
    <div className="container">
      <TweetFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
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
