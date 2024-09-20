import React, { createContext, useContext, useState, ReactNode } from "react";

interface GlobalData {
  [key: string]: any;
}

interface DataContextType {
  globalData: GlobalData;
  setGlobalData: React.Dispatch<React.SetStateAction<GlobalData>>;
}

export const DataContext = createContext<DataContextType | null>(null);

export const DataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [globalData, setGlobalData] = useState<GlobalData>({
    mode: "light",
  }); // Initialize global data state

  return (
    <DataContext.Provider value={{ globalData, setGlobalData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
