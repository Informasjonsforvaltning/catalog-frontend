import { FC } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Header as HeaderComponent } from '@catalog-frontend/ui';


const Header: FC = () => {
  const router = useRouter();
  const {data: session} = useSession();

  const handleLogout = () => {
    router.push('/api/auth/logout');
  };  

  return (
    <HeaderComponent
        username={session?.user?.name}
        onLogout={handleLogout}
      />
  );
};

export default Header;
