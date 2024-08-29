import { ServiceMessageEntity } from '@catalog-frontend/data-access';
import { Alert, Heading, Link, Paragraph } from '@digdir/designsystemet-react';
import styles from './service-messages.module.css';
import { localization } from '@catalog-frontend/utils';

type Severity = 'success' | 'danger' | 'info' | 'warning';

interface ServiceMessagesProps {
  serviceMessages: ServiceMessageEntity[];
}

const isValidDateRange = (validFrom: string, validTo: string): boolean => {
  const now = new Date();
  const fromDate = new Date(validFrom);
  const toDate = new Date(validTo);
  return now >= fromDate && now <= toDate;
};

export const ServiceMessages = ({ serviceMessages }: ServiceMessagesProps) => {
  const getSeverity = (messageType?: string): Severity | undefined => {
    const severityMap: Record<string, Severity> = {
      INFO: 'info',
      WARNING: 'warning',
      ERROR: 'danger',
      SUCCESS: 'success',
    };
    return messageType ? severityMap[messageType] : undefined;
  };

  return (
    <div className={styles.container}>
      {serviceMessages?.map((message) => {
        const { valid_from, valid_to, message_type, title, short_description, description } = message.attributes || {};

        if (!valid_from || !valid_to || !isValidDateRange(valid_from, valid_to)) {
          return null;
        }

        return (
          <Alert
            severity={getSeverity(message_type)}
            key={message.id}
          >
            <Heading
              level={2}
              size='xs'
              spacing
            >
              {title}
            </Heading>
            <Paragraph>
              <span>
                {`${short_description} ${description} `}
                <Link href={`${process.env.FDK_BASE_URI}/publishing/service-messages/${message.id}`}>
                  {localization.serviceMessageSeeMore}
                </Link>
              </span>
            </Paragraph>
          </Alert>
        );
      })}
    </div>
  );
};
