import { useContext } from "react";
import { AppContext } from "../../utils/AppProvider";

export const Home = () => {
  const { userData } = useContext(AppContext);
  return (
    <>
      <div>Welcome, {userData?.mobileNumber}</div>
    </>
  );
};
