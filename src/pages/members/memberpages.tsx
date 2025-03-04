interface Props {
  member: string;
}

const Memberpages = ({ member }: Props) => {
  return (
    <div className={"centered " + member}>
      <br />
      <h2>{member}</h2>
      {"Wurdle" === member && (
        <p>
          Creator of this website! <br />
          <br />
          Silly goober interested in tech <br />
          <br />
          Horrible at jousting <br />
          <br />
          Flemish 🇧🇪
          <br />
          <br />
          <br />
          Written by: Wurdle
        </p>
      )}
      {"Zilver" === member && (
        <p>
          {" "}
          Zilver also known as ZilverLining, the founder of the goobers group{" "}
          <br />
          <br />
          currently and always malding and seething <br />
          <br />
          is a certified ladder goblin <br />
          <br />
          Professional shitposter and dumbass <br />
          <br />
          Finnish 🇫🇮
          <br />
          <br />
          <br />
          Written by: Zilver
        </p>
      )}
      {"Pipari" === member && (
        <>
          <p>
            {" "}
            Absolute Finnish guy <br />
            <br />
            I mayhap get a little too silly sometimes <br />
            <br />
            Beat Sans Undertale on the second try <br />
            <br />
            boom <br />
            <br />
            Finnish 🇫🇮
            <br />
            <br />
            <br />
            Written by: N/A
          </p>
        </>
      )}
      {"Kai" === member && (
        <p>
          {" "}
          I'm a professional dumbass. <br />
          <br />
          I'm American and it shows. <br />
          <br />
          American 🇺🇸
          <br />
          <br />
          <br />
          Written by: Kai
        </p>
      )}
      {"Kenma" === member && (
        <p>
          {" "}
          Kenma, gender fluid (he/they) <br />
          <br />
          Studying game art <br />
          <br />
          Makes art for the community
          <br />
          <br />
          Favourite colour is pink
          <br />
          <br />
          Favourite game to play in the group is Lethal Company <br />
          <br />
          Actual Midget
          <br />
          <br />
          German 🇩🇪
          <br />
          <br />
          <br />
          Written by: Kenma
        </p>
      )}
    </div>
  );
};

export default Memberpages;
