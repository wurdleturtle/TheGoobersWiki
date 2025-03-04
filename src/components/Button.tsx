import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
  onClick: () => void;
  colour?: "primary" | "secondary" | "danger";
}

const Button = ({ children, onClick, colour = "primary" }: Props) => {
  return (
    <>
      <div className="AlertButton">
        <button
          type="button"
          className={"btn btn-" + colour}
          onClick={onClick}
          id="liveAlertBtn"
        >
          {children}
        </button>
      </div>
    </>
  );
};

export default Button;
