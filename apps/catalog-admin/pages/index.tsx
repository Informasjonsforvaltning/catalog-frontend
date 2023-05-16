import styled from 'styled-components';
import {Card} from '@catalog-frontend/ui';

const StyledPage = styled.div`
  .page {
  }
`;

export function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.styled-components file.
   */
  return (
    <StyledPage>
      <div>
        <Card
          title='Generelt'
          body='Oversikt over beskrivelser av datasett, begrep, apier og informasjonmodeller. Innholdet blir levert av ulike virksomheter, offentlige og private.'
        />
        <Card
          title='Begrepskatalog'
          body='Formålet med begrepskatalogen er å gjøre dataene mer forståelige. Like begreper kan brukes på forskjellige måter i ulik kontekster.'
        />
      </div>
    </StyledPage>
  );
}

export default Index;
