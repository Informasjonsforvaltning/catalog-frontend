import { FC } from 'react';
import { AcceptChangeRequestButton, EditChangeRequestButton, RejectChangeRequestButton } from '..';
import style from './change-request-page.module.css';

interface Props {
  catalogId: string;
  changeRequestId: string;
  hasWritePermission: boolean;
}

export const ButtonRow: FC<Props> = ({ catalogId, changeRequestId, hasWritePermission }) => {
  return (
    <div className={style.buttonsContainer}>
      {changeRequestId && hasWritePermission && (
        <AcceptChangeRequestButton
          catalogId={catalogId}
          changeRequestId={changeRequestId}
        />
      )}
      {changeRequestId && hasWritePermission && (
        <RejectChangeRequestButton
          catalogId={catalogId}
          changeRequestId={changeRequestId}
        />
      )}
      {changeRequestId && (
        <EditChangeRequestButton
          catalogId={catalogId}
          changeRequestId={changeRequestId}
        />
      )}
    </div>
  );
};
