import { createContext, ReactNode } from "react";

enum fileUploadTypeOptions {
  primary = "primary",
  secondary = "secondary",
}

type ContextType = {
  fileUploadType: typeof fileUploadTypeOptions;
};

export const Context = createContext<ContextType>({
  fileUploadType: fileUploadTypeOptions,
});

type props = {
  children: ReactNode;
};

const ContextProvider = ({ children }: props): JSX.Element => {
  return (
    <Context.Provider
      value={{
        fileUploadType: fileUploadTypeOptions,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
