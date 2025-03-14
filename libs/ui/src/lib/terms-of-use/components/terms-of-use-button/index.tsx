'use client';

import { localization } from "@catalog-frontend/utils";
import { Button } from "@digdir/designsystemet-react";
import { useRouter } from "next/navigation";

type TermsOfUseButtonProps = {
    url: string;
  };

export const TermsOfUseButton = ({ url }: TermsOfUseButtonProps) => {
    const router = useRouter();
    
    const handleGotoTermsOfUse = () => {
        router.push(url);
      };

    return (
        <Button
          size='sm'
          onClick={handleGotoTermsOfUse}
        >
          {localization.termsOfUse.gotoTermsOfUse}
        </Button>
    )
}