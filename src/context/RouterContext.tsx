import React, { createContext, useContext, useEffect, useState } from 'react';

interface RouterContextValue {
  path: string;
  navigate: (to: string) => void;
}

const RouterContext = createContext<RouterContextValue>({
  path: '/',
  navigate: () => {},
});

function getNormalizedPath(): string {
  if (typeof window === 'undefined') return '/';

  // Support hash routing fallback if used (#/overview)
  if (window.location.hash && window.location.hash.startsWith('#/')) {
    return window.location.hash.slice(1);
  }

  let pathname = window.location.pathname || '/';
  // Strip repository base path if present on GitHub Pages (e.g. /math104-differential-calculus)
  const repoBase = '/math104-differential-calculus';
  if (pathname.startsWith(repoBase)) {
    pathname = pathname.slice(repoBase.length) || '/';
  }
  return pathname;
}

export const RouterProvider: React.FC<{ children: React.ReactNode; initialPath?: string }> = ({
  children,
  initialPath,
}) => {
  const [path, setPath] = useState<string>(() => {
    if (initialPath) return initialPath;
    return getNormalizedPath();
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handlePopState = () => {
      setPath(getNormalizedPath());
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigate = (to: string) => {
    if (typeof window !== 'undefined') {
      const [pathname, hash] = to.split('#');
      const isGitHubPages = window.location.pathname.startsWith('/math104-differential-calculus');
      const fullTarget = (isGitHubPages ? '/math104-differential-calculus' : '') + to;

      if (pathname && pathname !== getNormalizedPath()) {
        window.history.pushState({}, '', fullTarget);
        setPath(pathname);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash) {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        setPath(to);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      setPath(to.split('#')[0] || '/');
    }
  };

  return <RouterContext.Provider value={{ path, navigate }}>{children}</RouterContext.Provider>;
};

export function useRouter(): RouterContextValue {
  return useContext(RouterContext);
}

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  children: React.ReactNode;
}

export const Link: React.FC<LinkProps> = ({ to, onClick, children, ...rest }) => {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
    if (
      !e.defaultPrevented &&
      e.button === 0 &&
      !e.metaKey &&
      !e.altKey &&
      !e.ctrlKey &&
      !e.shiftKey
    ) {
      e.preventDefault();
      navigate(to);
    }
  };

  return (
    <a href={to} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
};
