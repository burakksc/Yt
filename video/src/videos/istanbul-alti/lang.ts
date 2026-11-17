import { createContext, useContext } from "react";

export const AltiLang = createContext<"en" | "tr">("en");
export const useAltiLang = () => useContext(AltiLang);
