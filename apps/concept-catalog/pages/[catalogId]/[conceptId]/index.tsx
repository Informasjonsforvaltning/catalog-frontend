import { useState } from 'react';
import { InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { getToken } from 'next-auth/jwt';
import Link from 'next/link';
import {
  PageBanner,
  Breadcrumbs,
  BreadcrumbType,
  InfoCard,
  DetailHeading,
  Spinner,
  Tag,
  Select,
} from '@catalog-frontend/ui';
import {
  localization,
  getTranslateText as translate,
  hasOrganizationReadPermission,
  formatISO,
  getUsername,
} from '@catalog-frontend/utils';
import { getConcept, getConceptRevisions, getOrganization } from '@catalog-frontend/data-access';
import { Concept, Comment, Update, Organization } from '@catalog-frontend/types';
import { ChatIcon } from '@navikt/aksel-icons';
import cn from 'classnames';
import { Accordion, Button, Tabs, TextArea } from '@digdir/design-system-react';
import classes from './concept-page.module.css';
import { useCreateComment, useDeleteComment, useGetComments, useUpdateComment } from '../../../hooks/comments';
import { useGetHistory } from '../../../hooks/history';

type MapType = {
  [id: string]: string;
};

export const ConceptPage = ({
  hasPermission,
  username,
  organization,
  concept,
  revisions,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [language, setLanguage] = useState('nb');
  const [newCommentText, setNewCommentText] = useState('');
  const [updateCommentText, setUpdateCommentText] = useState<MapType>({});
  const router = useRouter();
  const catalogId = (router.query.catalogId as string) ?? '';

  const { status: getCommentsStatus, data: getCommentsData } = useGetComments({
    orgNumber: catalogId,
    topicId: concept?.id,
  });

  const createComment = useCreateComment({
    orgNumber: catalogId,
    topicId: concept?.id,
  });

  const updateComment = useUpdateComment({
    orgNumber: catalogId,
    topicId: concept?.id,
  });

  const deleteComment = useDeleteComment({
    orgNumber: catalogId,
    topicId: concept?.id,
  });

  const { status: getHistoryStatus, data: getHistoryData } = useGetHistory({
    catalogId,
    resourceId: concept?.id,
  });

  const pageSubtitle = organization?.name ?? catalogId;

  const languageOptions = [
    { value: 'nb', label: 'Norsk bokmål' },
    { value: 'nn', label: 'Norsk nynorsk' },
    { value: 'en', label: 'English' },
  ];

  const infoData2 = [
    ['ID', concept?.id],
    ['Publiseringsdato', 'N/A'],
    ['Versjon', `${concept?.versjonsnr.major}.${concept?.versjonsnr.minor}.${concept?.versjonsnr.patch}`],
    ['Gyldighet', `Fra/til: ${concept?.gyldigFom} - ${concept?.gyldigTom}`],
    ['Tildelt', 'N/A'],
    ['Sist oppdatert', 'N/A'],
    ['Opprettet', 'N/A'],
    ['Merkelapp', 'N/A'],
    ['Begrepsansvarlig', 'N/A'],
    ['Godkjenner', 'N/A'],
    ['Opprettet av', 'N/A'],
  ];

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
  };

  const handleNewCommentChange = (event) => {
    setNewCommentText(event.target.value);
  };

  const handleUpdateCommentChange = (commentId, event) => {
    setUpdateCommentText({ ...updateCommentText, ...{ [commentId]: event.target.value } });
  };

  const handleCreateComment = () => {
    createComment.mutate(newCommentText, {
      onSuccess: () => {
        setNewCommentText('');
      },
    });
  };

  const handleUpdateComment = ({ id, comment }) => {
    if (updateCommentText[id]) {
      updateComment.mutate(
        { commentId: id, comment: updateCommentText[id] },
        {
          onSuccess: () => {
            //Set comment back in read mode
            setUpdateCommentText(
              Object.keys(updateCommentText)
                .filter((key) => key !== id)
                .reduce((obj, key) => {
                  obj[key] = updateCommentText[key];
                  return obj;
                }, {}),
            );
          },
        },
      );
    } else {
      setUpdateCommentText({ ...updateCommentText, ...{ [id]: comment } });
    }
  };

  const handleDeleteComment = (id, event) => {
    if (window.confirm(localization.comment.confirmDelete)) {
      deleteComment.mutate(id);
    }
  };

  const isCommentInEditMode = (id) => id in updateCommentText;

  const RevisionsTab = () => (
    <InfoCard>
      {revisions?.map((revision) => (
        <InfoCard.Item key={`revision-${revision.id}`}>
          <div className={classes.revision}>
            <div>
              v{revision?.versjonsnr.major}.{revision?.versjonsnr.minor}.{revision?.versjonsnr.patch}
            </div>
            <div>
              <Link
                href={`/${catalogId}/${revision.id}`}
                className={classes.versionTitle}
              >
                {translate(revision?.anbefaltTerm?.navn, language)}
              </Link>
            </div>
            <div className={cn(classes.status)}>
              <Tag>{revision?.status}</Tag>
            </div>
          </div>
        </InfoCard.Item>
      ))}
    </InfoCard>
  );

  const breadcrumbList = catalogId
    ? ([
        {
          href: `/${catalogId}`,
          text: localization.catalogType.concept,
        },
        {
          href: `/${catalogId}/${concept?.id}`,
          text: translate(concept?.anbefaltTerm?.navn, language),
        },
      ] as BreadcrumbType[])
    : [];

  return (
    <>
      <Breadcrumbs breadcrumbList={breadcrumbList} />
      <PageBanner
        title={localization.catalogType.concept}
        subtitle={pageSubtitle}
      />
      <div className='container'>
        {hasPermission ? (
          <>
            <DetailHeading
              className={classes.detailHeading}
              headingTitle={<h2>{translate(concept?.anbefaltTerm?.navn, language)}</h2>}
              subtitle={translate(concept?.fagområde, language)}
            />
            <div className={cn(classes.status)}>
              <Tag>{concept?.status}</Tag>
            </div>
            <div className={classes.languages}>
              <Select
                label={localization.chooseLanguage}
                options={languageOptions}
                onChange={handleLanguageChange}
                value={language}
              />
            </div>
            <div className={classes.definition}>
              <h3>Definisjon:</h3>
              <div>{translate(concept?.definisjon?.tekst ?? '', language)}</div>
              <div className={cn(classes.source)}>
                Kilde: <a href='#'>Basert på Skatteetaten</a>
              </div>
            </div>

            <div className={classes.info}>
              <div>
                <InfoCard>
                  <InfoCard.Item label={`${localization.concept.replacedBy}:`}>
                    <span>Begrep x</span>
                  </InfoCard.Item>
                  <InfoCard.Item label={`${localization.concept.note}:`}>
                    <span>{translate(concept?.merknad, language)}</span>
                  </InfoCard.Item>
                  <InfoCard.Item label={`${localization.concept.example}:`}>
                    <span>{translate(concept?.eksempel, language)}</span>
                  </InfoCard.Item>
                  <InfoCard.Item label={`${localization.concept.simplifiedExplanation}:`}>
                    <span>N/A</span>
                  </InfoCard.Item>
                  <InfoCard.Item label={`${localization.concept.legalExplanation}:`}>
                    <span>N/A</span>
                  </InfoCard.Item>
                  <InfoCard.Item>
                    <div className={classes.termsRow}>
                      <h3>{`${localization.concept.abbreviation}:`}</h3>
                      <span>N/A</span>
                    </div>
                    <div className={classes.termsRow}>
                      <h3>{`${localization.concept.allowedTerm}:`}</h3>
                      <ul>
                        {Array.of(translate(concept?.tillattTerm, language)).map((term, i) => (
                          <li key={`allowedTerm-${i}`}>{term}</li>
                        ))}
                      </ul>
                    </div>
                    <div className={classes.termsRow}>
                      <h3>{`${localization.concept.notRecommendedTerm}:`}</h3>
                      <ul>
                        {Array.of(translate(concept?.frarådetTerm, language)).map((term, i) => (
                          <li key={`notRecommendedTerm-${i}`}>{term}</li>
                        ))}
                      </ul>
                    </div>
                  </InfoCard.Item>
                  <InfoCard.Item label={`${localization.concept.valueDomain}:`}>
                    <span>N/A</span>
                  </InfoCard.Item>
                  <InfoCard.Item label={`${localization.concept.internalField}:`}>
                    <span>N/A</span>
                  </InfoCard.Item>
                </InfoCard>

                <div className={classes.tabs}>
                  <Tabs
                    items={[
                      {
                        content:
                          getCommentsStatus == 'loading' ? (
                            <Spinner size='medium' />
                          ) : getCommentsStatus === 'error' ? (
                            <span>Kommentarer er ikke tilgjengelig. Prøv igjen senere.</span>
                          ) : (
                            <>
                              <div className={classes.bottomSpacingSmall}>
                                <TextArea
                                  resize='vertical'
                                  value={newCommentText}
                                  onChange={handleNewCommentChange}
                                  rows={5}
                                />
                              </div>
                              <div className={classes.bottomSpacingLarge}>
                                <Button
                                  disabled={newCommentText?.length === 0}
                                  onClick={() => handleCreateComment()}
                                >
                                  Legg til kommentar
                                </Button>
                              </div>
                              <div>
                                <div className={classes.commentsHeader}>
                                  <ChatIcon />
                                  Kommentarer ({getCommentsData.length})
                                </div>
                                {getCommentsData.length > 0 &&
                                  getCommentsData.map((comment: Comment, i) => (
                                    <InfoCard
                                      key={`comment-${comment.id}`}
                                      className={classes.comment}
                                    >
                                      <InfoCard.Item>
                                        <div className={classes.commentUser}>
                                          {comment?.user.name}
                                          <span>{formatISO(comment?.createdDate)}</span>
                                        </div>
                                        {isCommentInEditMode(comment?.id) ? (
                                          <TextArea
                                            resize='vertical'
                                            value={updateCommentText[comment?.id]}
                                            onChange={(e) => handleUpdateCommentChange(comment.id, e)}
                                            rows={5}
                                          />
                                        ) : (
                                          <div>
                                            {comment?.comment.split('\n').map((ln, i) => (
                                              <span key={`comment-${comment?.id}-${i}`}>
                                                {ln}
                                                <br />
                                              </span>
                                            ))}
                                          </div>
                                        )}
                                        {comment.user.id === username && (
                                          <div className={classes.commentActions}>
                                            <Button
                                              variant='outline'
                                              onClick={() => handleUpdateComment(comment)}
                                            >
                                              {isCommentInEditMode(comment.id)
                                                ? localization.comment.saveComment
                                                : localization.comment.editComment}
                                            </Button>
                                            <Button
                                              variant='outline'
                                              onClick={(e) => handleDeleteComment(comment.id, e)}
                                            >
                                              {localization.comment.deleteComment}
                                            </Button>
                                          </div>
                                        )}
                                      </InfoCard.Item>
                                    </InfoCard>
                                  ))}
                              </div>
                            </>
                          ),
                        name: localization.comment.comments,
                      },
                      {
                        content:
                          getHistoryStatus == 'loading' ? (
                            <Spinner size='medium' />
                          ) : getHistoryStatus === 'error' ? (
                            <span>Endringslogg er ikke tilgjengelig. Prøv igjen senere.</span>
                          ) : (
                            <Accordion>
                              {getHistoryData.updates?.length > 0 &&
                                getHistoryData.updates.map((update: Update, i) => (
                                  <Accordion.Item key={`history-${update.id}`}>
                                    <Accordion.Header className={classes.historyHeader}>
                                      <span>{update.person.name}</span>
                                      <span>{formatISO(update.datetime)}</span>
                                    </Accordion.Header>
                                    <Accordion.Content>
                                      {update.operations.map((operation, i) => (
                                        <div
                                          key={`operation-${i}`}
                                          className={classes.historyOperation}
                                        >
                                          <div>
                                            {operation.op} - {operation.path}
                                          </div>
                                          <div>{operation.value}</div>
                                        </div>
                                      ))}
                                    </Accordion.Content>
                                  </Accordion.Item>
                                ))}
                            </Accordion>
                          ),
                        name: 'Endringshistorikk',
                      },
                      {
                        content: <RevisionsTab />,
                        name: 'Versjoner',
                      },
                    ]}
                  />
                </div>
              </div>

              <InfoCard size='small'>
                {infoData2.map(([label, value]) => (
                  <InfoCard.Item
                    key={`info-data-${label}`}
                    label={label}
                    labelColor='light'
                  >
                    <span>{value}</span>
                  </InfoCard.Item>
                ))}
              </InfoCard>
            </div>
          </>
        ) : (
          <div>{localization.noAccess}</div>
        )}
      </div>
    </>
  );
};

export async function getServerSideProps({ req, params }) {
  const token = await getToken({ req });
  const { catalogId, conceptId } = params;

  const hasPermission = token && hasOrganizationReadPermission(token.access_token, catalogId);
  const username = token && getUsername(token.id_token);
  const organization: Organization = await getOrganization(catalogId);
  const concept: Concept | null = await getConcept(conceptId, `${token.access_token}`).then(async (response) => {
    return response || null;
  });
  const revisions: Concept[] | null = await getConceptRevisions(conceptId, `${token.access_token}`).then(
    async (response) => {
      return response || null;
    },
  );

  return {
    props: {
      hasPermission,
      username,
      organization,
      concept,
      revisions,
    },
  };
}

export default ConceptPage;
