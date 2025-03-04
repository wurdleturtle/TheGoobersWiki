import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  isDismissable?: string;
  onClick?: () => void;
}

const Alert = ({ children, isDismissable, onClick }: Props) => {
  return (
    <div
      className={
        isDismissable === "true"
          ? "alert alert-warning alert-dismissible fade show"
          : "alert alert-warning alert-dismissible"
      }
    >
      {children}{" "}
      {isDismissable === "true" && (
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="alert"
          aria-label="Close"
          onClick={onClick}
        />
      )}
    </div>
  );
};
export default Alert;
1221212.1212;

1221;
