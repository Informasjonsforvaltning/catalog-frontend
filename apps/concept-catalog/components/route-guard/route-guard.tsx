import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FC, PropsWithChildren, useEffect } from "react";


const RouteGuard: FC<PropsWithChildren> = ({children}) => {
  const router = useRouter();
  const {data: session, status} = useSession();
  const isUser = !!session?.user;

  useEffect(() => {
    if (typeof window !== 'undefined' && status === 'loading') return;
    if (!isUser) {
      signIn('keycloak');
    }
  }, [isUser, status, router]);

  if (isUser) {
    return <>{children}</>;
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return <></>;
};

export default RouteGuard;
