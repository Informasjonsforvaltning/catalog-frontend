import { AccessDenied, useSession } from "@catalog-frontend/auth"

const ProtectedPage = () => {
    const { data: session } = useSession();

    return (
        <div className="wrapper">
            <div className="container">
                <div id="welcome">
                    <div className="auth">
                        {session ? (
                            <h1>
                                You have access to this protected page!
                            </h1>
                        ): <AccessDenied />}
                    </div>
                </div>
            </div>
        </div>);    
}
export default ProtectedPage;
