import React from 'react';
import Link from 'next/link';

export function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.styled-components file.
   */
  return (
    <>
      <div>Skal det være noe her?</div>
      <Link href={'/catalogs/910244132'}>Trykk her</Link>
    </>
  );
}

export default Index;
