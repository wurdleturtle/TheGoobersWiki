interface Props {
  onClick: (member: string) => void;
}

const Memberlist = ({ onClick }: Props) => {
  return (
    <div className="centered">
      <br />
      <button className="wurdlebutton" onClick={() => onClick("Wurdle")}>
        Wurdle
      </button>
      <br />
      <br />
      <br />

      <button className="zilverbutton" onClick={() => onClick("Zilver")}>
        Zilver
      </button>
      <br />
      <br />
      <br />

      <button className="pipaributton" onClick={() => onClick("Pipari")}>
        Pipari
      </button>
      <br />
      <br />
      <br />
      <button className="kaibutton" onClick={() => onClick("Kai")}>
        Kai
      </button>
      <br />
      <br />
      <br />
      <button className="kenmabutton" onClick={() => onClick("Kenma")}>
        Kenma
      </button>
      <br />
      <br />
      <br />
    </div>
  );
};
export default Memberlist;
