import Dash_users from "../components/Dash_users";
import ListUsers from "../components/ListUsers";

function Dashboard() {
  return (
    <div className="pt-20">
      {/* <Test/> */}
      <Dash_users />
      <ListUsers />
    </div>
  );
}

export default Dashboard;
