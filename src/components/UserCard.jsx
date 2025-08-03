import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
// import { removeFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {

  const { _id, firstName, lastName, profilePicture, age, gender, bio } = user;
  const dispatch = useDispatch();

  const handleSendRequest = async (status, userId) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      // dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.log(err)
      console.log(err.message)
    }
  };

  return (
    <div className="card border border-primary bg-base-300 w-96 sm:h-130 sm:w-81 shadow-xl">
      <figure>
        <img src={user.profilePicture} alt="photo" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{firstName + " " + lastName}</h2>
        {age && gender && <p>{age + ", " + gender}</p>}
        <p>{bio}</p>
        <div className="card-actions justify-center my-4">
          <button
            className="btn btn-primary"
            onClick={() => handleSendRequest("ignored", _id)}
          >
            Ignore
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => handleSendRequest("interested", _id)}
          >
            Interested
          </button>
        </div>
      </div>
    </div>
  );
};
export default UserCard;
