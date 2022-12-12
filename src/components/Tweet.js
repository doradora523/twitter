import { dbService, storageService } from "fbase";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Tweet = ({ tweetObj, isOwner }) => {
  // editing 모드인지 확인하는 state
  const [editing, setEditing] = useState(false);
  // input 에 입력된 text 를 업데이트
  const [newTweet, setNewTweet] = useState(tweetObj.text);

  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this tweet?");

    if (ok) {
      try {
        // delete tweet
        await dbService.doc(`tweets/${tweetObj.id}`).delete();
        if (tweetObj.attachmentUrl !== "") {
          // delete attachment
          await storageService.refFromURL(tweetObj.attachmentUrl).delete();
        }
      } catch (error) {
        window.alert("Failed to delete tweet");
      }
    }
  };

  const toggleEditing = () => setEditing((prev) => !prev);

  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.doc(`tweets/${tweetObj.id}`).update({ text: newTweet });
    setEditing(false);
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewTweet(value);
  };

  return (
    <div className="tweet">
      {editing ? (
        <>
          <form onSubmit={onSubmit} className="container tweetEdit">
            <input
              type="text"
              placeholder="Edit your tweet"
              value={newTweet}
              required
              onChange={onChange}
            />
            <input type="submit" value="Update Tweet" className="formBtn" />
          </form>
          <button onClick={toggleEditing} className="formBtn cancelBtn">
            Cancel
          </button>
        </>
      ) : (
        <>
          <h4>{tweetObj.text}</h4>
          {tweetObj.attachmentUrl && (
            <img src={tweetObj.attachmentUrl} alt="attachment" />
          )}
          {isOwner && (
            <div className="tweet__actions">
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Tweet;
