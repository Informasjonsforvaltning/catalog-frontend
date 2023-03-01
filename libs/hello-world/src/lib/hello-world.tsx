




  import styled from 'styled-components';
  

/* eslint-disable-next-line */
export interface HelloWorldProps {
}


const StyledHelloWorld = styled.div`
  color: pink;
`;


export function HelloWorld(props: HelloWorldProps) {
  return (
    <StyledHelloWorld>
      
      <h1>Welcome to HelloWorld component as library! Hei Terje!</h1>
      
    </StyledHelloWorld>
  );
};


export default HelloWorld;


