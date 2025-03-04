import Memberlist from "./members/memberlist";
import Memberpages from "./members/memberpages";
import { useState } from "react";

const MembersPage = () => {
  const [selectedMember, setSelectedMember] = useState("memberlist");

  const handleSwitch = (member: string) => {
    setSelectedMember(member); // update local state when a button is clicked
  };

  return (
    <div className={"centered " + selectedMember}>
      <h1>Our Members</h1>
      <br />
      {"memberlist" === selectedMember && <Memberlist onClick={handleSwitch} />}
      {"Wurdle" === selectedMember && <Memberpages member={selectedMember} />}
      {"Zilver" === selectedMember && <Memberpages member={selectedMember} />}
      {"Pipari" === selectedMember && <Memberpages member={selectedMember} />}
      {"Kai" === selectedMember && <Memberpages member={selectedMember} />}
      {"Kenma" === selectedMember && <Memberpages member={selectedMember} />}
      <br />
      <p className="gone">.</p>
    </div>
  );
};

export default MembersPage;
