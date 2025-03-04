import Alert from "./Alert";
import Button from "./Button";
import { useState } from "react";

interface Props {
  children: string;
  AlertMessage: string;
}

function AlertButton({ children, AlertMessage }: Props) {
  const [AlertVisible, setAlertVisibility] = useState(false);
  return (
    <>
      {AlertVisible && (
        <Alert isDismissable="true" onClick={() => setAlertVisibility(false)}>
          {AlertMessage}
        </Alert>
      )}
      <Button onClick={() => setAlertVisibility(true)}>{children}</Button>
    </>
  );
}

export default AlertButton;
