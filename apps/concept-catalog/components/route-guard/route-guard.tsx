import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FC, PropsWithChildren, useEffect } from "react";

const RouteGuard: FC<PropsWithChildren> = ({children}) => {  
  const router = useRouter();
  const {data: session, status} = useSession();

  const allowed = !!session?.user;
  
  useEffect(() => {
    if ((session?.error === "RefreshAccessTokenError" || status === 'unauthenticated') 
      && router.pathname !== '/auth/signout') {
      signIn('keycloak'); 
    } 
  }, [session, status, router]);

  if (allowed) {
    return <>{children}</>;
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return <></>;
};

export default RouteGuard;
