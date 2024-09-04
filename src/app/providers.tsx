import { UmiContextProvider } from "@/contexts/UmiContext";
import React from "react";
import { Toaster } from "react-hot-toast";

// Default styles that can be overridden by your app

interface Props {
  children: React.ReactNode;
}

const Providers: React.FC<Props> = ({ children }) => {
  return (
    <div>
      <UmiContextProvider>{children}</UmiContextProvider>
      <Toaster
        position="bottom-right"
        toastOptions={{ style: { marginBottom: "30px" } }}
      />
    </div>
  );
};

export default Providers;
