import React, { createContext, useContext, useState } from 'react';

type TabsContextValue = {
  value: string;
  onValueChange: (value: string) => void;
};

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  children,
  className = '',
  ...props
}: {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  const [tabValue, setTabValue] = useState(defaultValue || '');
  
  const contextValue = {
    value: value !== undefined ? value : tabValue,
    onValueChange: onValueChange || setTabValue,
  };

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={className} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`inline-flex items-center justify-center rounded-md bg-gray-100 p-1 ${className}`}>
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  children,
  className = '',
  ...props
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const context = useContext(TabsContext);
  
  if (!context) {
    throw new Error('TabsTrigger must be used within a Tabs component');
  }
  
  const { value: selectedValue, onValueChange } = context;
  const isSelected = selectedValue === value;

  return (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
        isSelected
          ? 'bg-white text-gray-900 shadow-sm'
          : 'text-gray-500 hover:text-gray-900'
      } ${className}`}
      onClick={() => onValueChange(value)}
      {...props}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  children,
  className = '',
  ...props
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const context = useContext(TabsContext);
  
  if (!context) {
    throw new Error('TabsContent must be used within a Tabs component');
  }
  
  const { value: selectedValue } = context;
  
  if (selectedValue !== value) {
    return null;
  }

  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}