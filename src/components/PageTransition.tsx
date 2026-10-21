import React, { useEffect, useState } from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
  activeKey: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, activeKey }) => {
  const [displayChildren, setDisplayChildren] = useState(children);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    // Quick 300ms GPU opacity fade transition
    setOpacity(0);
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setOpacity(1);
    }, 150);

    return () => clearTimeout(timer);
  }, [activeKey, children]);

  return (
    <div
      className="transition-opacity duration-300 ease-in-out"
      style={{ opacity, willChange: 'opacity' }}
    >
      {displayChildren}
    </div>
  );
};
