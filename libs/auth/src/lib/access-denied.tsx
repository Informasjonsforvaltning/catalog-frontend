import { signIn } from "next-auth/react";

export const AccessDenied = () => {
  return (
    <>
      <h1>Access Denied</h1>
      <p>
        You must be logged in to view this page        
      </p>
      <a className='button-pill rounded shadow'
          href="/api/auth/signin"
          onClick={(e) => {
            e.preventDefault();
            signIn('keycloak');
          }}
        >
            <span>
                You are not logged in
                <span>Log in</span>
            </span>
        </a>
    </>
  );
}

export default AccessDenied;
