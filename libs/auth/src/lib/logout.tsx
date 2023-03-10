import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const Logout = () => {
	const router = useRouter();

	useEffect(() => {
		signOut({ redirect: false }).then(() => {
			router.push("/");
		});
	}, [router]);

	return <p>Logging out...</p>;
}

export default Logout;
