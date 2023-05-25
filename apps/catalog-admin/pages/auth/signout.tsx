import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const SignOut = () => {
	const router = useRouter();

	useEffect(() => {
		signOut({ redirect: false }).then(() => {
			router.push("/");
		});
	}, [router]);

	return <p>Logger ut...</p>;
}

export default SignOut;
