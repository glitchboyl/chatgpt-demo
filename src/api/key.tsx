import {
  useState,
  useCallback,
  createContext,
  useContext,
  type FC,
  type PropsWithChildren,
} from "react";

const STORAGE_KEY_ID = "chatgpt-demo-liluo-api-key";

export const ApiKeyContext = createContext<[string, (key: string) => void]>([
  "",
  () => {},
]);
export const useApiKey = () => useContext(ApiKeyContext);

export const ApiKeyContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [key, setKey] = useState(localStorage.getItem(STORAGE_KEY_ID) || "");
  const changeKey = useCallback((newKey: string) => {
    setKey(newKey);
    localStorage.setItem(STORAGE_KEY_ID, newKey);
  }, []);
  return (
    <ApiKeyContext.Provider value={[key, changeKey]}>
      {children}
    </ApiKeyContext.Provider>
  );
};
