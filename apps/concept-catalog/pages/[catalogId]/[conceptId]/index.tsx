import { useId, useState } from 'react';
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
  Button,
  ToggleButtonGroup,
} from '@catalog-frontend/ui';
import {
  localization,
  getTranslateText as translate,
  hasOrganizationReadPermission,
  formatISO,
  getUsername,
  validOrganizationNumber,
  validUUID,
  hasSystemAdminPermission,
  hasOrganizationWritePermission,
} from '@catalog-frontend/utils';
import {
  getConcept,
  getConceptRevisions,
  getOrganization,
  searchConceptsByIdentifiers,
} from '@catalog-frontend/data-access';
import { Concept, Comment, Update, Organization } from '@catalog-frontend/types';
import { ChatIcon } from '@navikt/aksel-icons';
import cn from 'classnames';
import { Accordion, Tabs, TextArea } from '@digdir/design-system-react';
import classes from './concept-page.module.css';
import { useCreateComment, useDeleteComment, useGetComments, useUpdateComment } from '../../../hooks/comments';
import { useGetHistory } from '../../../hooks/history';
import { useDeleteConcept } from '../../../hooks/concepts';
import { authOptions } from '../../api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import { useCatalogDesign } from '../../../context/catalog-design';

type MapType = {
  [id: string]: string;
};

export const ConceptPage = ({
  username,
  organization,
  concept,
  revisions,
  replacedConcepts,
  hasWritePermission,
  FDK_REGISTRATION_BASE_URI,
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

  const deleteConcept = useDeleteConcept(catalogId);

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
    [
      localization.publicationState.state,
      concept?.erPublisert
        ? `${localization.publicationState.publishedInFDK} ${formatISO(concept?.publiseringsTidspunkt, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}`
        : localization.publicationState.unpublished,
    ],
    ['Versjon', `${concept?.versjonsnr.major}.${concept?.versjonsnr.minor}.${concept?.versjonsnr.patch}`],
    ['Gyldighet', `Fra/til: ${concept?.gyldigFom} - ${concept?.gyldigTom}`],
    [
      'Sist oppdatert',
      formatISO(concept?.endringslogelement?.endringstidspunkt, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }) ?? '',
    ],
    [
      'Opprettet',
      formatISO(concept?.opprettet, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }) ?? '',
    ],
    ['Opprettet av', concept?.opprettetAv ?? ''],
    ['Tildelt', 'TODO (interne felt)'],
    ['Begrepsansvarlig', 'TODO (interne felt)'],
    ['Godkjenner', 'TODO (interne felt)'],
    ['Merkelapp', 'TODO (interne felt)'],
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

  const handleEditConcept = () => {
    const revision = revisions?.find((revision) => !revision.erPublisert);
    const id = revision ? revision.id : concept?.id;
    if (validOrganizationNumber(catalogId) && validUUID(id)) {
      router
        .push(`/${catalogId}/${id}/edit`)
        .catch((err) => console.error('Failed to navigate to concept edit page: ', err));
    }
  };

  const handleDeleteConcept = () => {
    if (window.confirm(localization.concept.confirmDelete)) {
      const revision = revisions?.find((revision) => !revision.erPublisert);
      if (revision) {
        deleteConcept.mutate(revision.id);
      }
    }
  };

  const design = useCatalogDesign();
  const getTitle = (text: string | string[]) => (text ? text : localization.concept.noName);

  const newCommentButtonId = useId();
  const isCommentInEditMode = (id) => id in updateCommentText;

  const RevisionsTab = () => {
    return (
      <InfoCard>
        {revisions?.map((revision) => (
          <InfoCard.Item key={`revision-${revision.id}`}>
            <div className={classes.revision}>
              <div>
                v{revision?.versjonsnr.major}.{revision?.versjonsnr.minor}.{revision?.versjonsnr.patch}
              </div>
              <div>
                <Link
                  href={
                    validOrganizationNumber(catalogId) && validUUID(revision.id) ? `/${catalogId}/${revision.id}` : '#'
                  }
                  className={classes.versionTitle}
                >
                  {getTitle(translate(revision?.anbefaltTerm?.navn))}
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
  };

  const breadcrumbList = catalogId
    ? ([
        {
          href: `/${catalogId}`,
          text: localization.catalogType.concept,
        },
        {
          href: `/${catalogId}/${concept?.id}`,
          text: getTitle(translate(concept?.anbefaltTerm?.navn, language)),
        },
      ] as BreadcrumbType[])
    : [];

  return (
    <>
      <Breadcrumbs
        baseURI={FDK_REGISTRATION_BASE_URI}
        breadcrumbList={breadcrumbList}
      />
      <PageBanner
        title={localization.catalogType.concept}
        subtitle={pageSubtitle}
        fontColor={design?.fontColor}
        backgroundColor={design?.backgroundColor}
        logo={design?.hasLogo && `/api/catalog-admin/${catalogId}/design/logo`}
        logoDescription={design?.logoDescription}
      />
      <div className='container'>
        <DetailHeading
          className={classes.detailHeading}
          headingTitle={<h2>{getTitle(translate(concept?.anbefaltTerm?.navn))}</h2>}
          subtitle={translate(concept?.fagområde, language)}
        />

        {deleteConcept.status === 'loading' && <Spinner />}
        {deleteConcept.status !== 'loading' && (
          <>
            <div className={cn(classes.status)}>
              <Tag>{concept?.status}</Tag>
            </div>
            <div className={classes.languages}>
              <ToggleButtonGroup
                items={languageOptions}
                onChange={handleLanguageChange}
                selectedValue={language}
              />
            </div>
            <div className={classes.twoColumnRow}>
              <div className={classes.definition}>
                <h3>Definisjon:</h3>
                <div>{translate(concept?.definisjon?.tekst ?? '', language)}</div>
                {concept?.kildebeskrivelse?.kilde.length > 0 && (
                  <div className={cn(classes.source)}>
                    <div>Kilde:</div>
                    <div>
                      <ul>
                        {concept?.kildebeskrivelse?.kilde?.map((kilde, i) => (
                          <li key={`kilde-${i}`}>
                            {kilde.uri ? <a href={kilde.uri}>{kilde.tekst}</a> : <span>{kilde.tekst}</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
              {hasWritePermission && (
                <div className={classes.actionButtons}>
                  <Button onClick={handleEditConcept}>Rediger</Button>
                  {!concept?.erPublisert && (
                    <Button
                      color={'danger'}
                      onClick={handleDeleteConcept}
                    >
                      Slett
                    </Button>
                  )}
                </div>
              )}
            </div>
            <div className={cn(classes.twoColumnRow, classes.bottomSpace)}>
              <div>
                <InfoCard>
                  {replacedConcepts.length > 0 && (
                    <InfoCard.Item label={`${localization.concept.replacedBy}:`}>
                      <ul>
                        {replacedConcepts.map((concept, i) => (
                          <li key={`replacedConcept-${i}`}>{translate(concept.prefLabel, language)}</li>
                        ))}
                      </ul>
                    </InfoCard.Item>
                  )}
                  <InfoCard.Item label={`${localization.concept.note}:`}>
                    <span>{translate(concept?.merknad, language)}</span>
                  </InfoCard.Item>
                  <InfoCard.Item label={`${localization.concept.example}:`}>
                    <span>{translate(concept?.eksempel, language)}</span>
                  </InfoCard.Item>
                  <InfoCard.Item label={`${localization.concept.simplifiedExplanation}:`}>
                    <span>TODO</span>
                  </InfoCard.Item>
                  <InfoCard.Item label={`${localization.concept.legalExplanation}:`}>
                    <span>TODO</span>
                  </InfoCard.Item>
                  <InfoCard.Item>
                    <div className={classes.termsRow}>
                      <h3>{`${localization.concept.allowedTerm}:`}</h3>
                      {Array.of(translate(concept?.tillattTerm, language)).length > 0 ? (
                        <ul>
                          {Array.of(translate(concept?.tillattTerm, language)).map((term, i) => (
                            <li key={`allowedTerm-${i}`}>{term}</li>
                          ))}
                        </ul>
                      ) : (
                        <span>Ingen term</span>
                      )}
                    </div>
                    <div className={classes.termsRow}>
                      <h3>{`${localization.concept.notRecommendedTerm}:`}</h3>
                      {Array.of(translate(concept?.frarådetTerm, language)).length > 0 ? (
                        <ul>
                          {Array.of(translate(concept?.frarådetTerm, language)).map((term, i) => (
                            <li key={`notRecommendedTerm-${i}`}>{term}</li>
                          ))}
                        </ul>
                      ) : (
                        <span>Ingen term</span>
                      )}
                    </div>
                  </InfoCard.Item>
                  <InfoCard.Item label={`${localization.concept.valueDomain}:`}>
                    {concept?.omfang?.uri ? (
                      <Link href={concept?.omfang?.uri}>{concept?.omfang?.tekst}</Link>
                    ) : (
                      <span>{concept?.omfang?.tekst}</span>
                    )}
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
                            <span>{localization.somethingWentWrong}</span>
                          ) : (
                            <>
                              <div className={classes.bottomSpacingSmall}>
                                <TextArea
                                  resize='vertical'
                                  value={newCommentText}
                                  onChange={handleNewCommentChange}
                                  rows={5}
                                  aria-labelledby={newCommentButtonId}
                                  aria-describedby={newCommentButtonId}
                                />
                              </div>
                              <div className={classes.bottomSpacingLarge}>
                                <Button
                                  id={newCommentButtonId}
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
                            <span>{localization.somethingWentWrong}</span>
                          ) : getHistoryData.updates?.length === 0 ? (
                            <span>{localization.history.noChanges}</span>
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
                                      {update.operations?.map((operation, i) => (
                                        <div
                                          key={`operation-${i}`}
                                          className={classes.historyOperation}
                                        >
                                          <div>
                                            {operation.op} - {operation.path}
                                          </div>
                                          <div>{`${operation.value}`}</div>
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
        )}
      </div>
    </>
  );
};

export async function getServerSideProps({ req, res, params }) {
  const session = await getServerSession(req, res, authOptions);
  const token = await getToken({ req });
  const { catalogId, conceptId } = params;

  if (!(validOrganizationNumber(catalogId) && validUUID(conceptId))) {
    return { notFound: true };
  }

  if (!(session?.user && Date.now() < token?.expires_at * 1000)) {
    return {
      redirect: {
        permanent: false,
        destination: `/auth/signin?catalogId=${catalogId}`,
      },
    };
  }

  const hasReadPermission =
    (token && hasOrganizationReadPermission(token.access_token, catalogId)) ||
    hasSystemAdminPermission(token.access_token);
  if (!hasReadPermission) {
    return {
      redirect: {
        permanent: false,
        destination: `/${catalogId}/no-access`,
      },
    };
  }

  const concept: Concept | null = await getConcept(conceptId, `${token?.access_token}`).then((response) => {
    return response.json();
  });
  if (!concept) {
    return {
      notFound: true,
    };
  }

  const getReplacedConcepts = async () => {
    if (concept?.erstattesAv?.length === 0) {
      return [];
    }

    const searchConceptsResponse = await searchConceptsByIdentifiers(concept?.erstattesAv).then((response) => {
      return response.json();
    });
    return searchConceptsResponse instanceof Response && searchConceptsResponse.status === 200
      ? (await searchConceptsResponse?.json())?.hits ?? []
      : [];
  };

  const hasWritePermission = token && hasOrganizationWritePermission(token.access_token, catalogId);
  const replacedConcepts = await getReplacedConcepts();
  const username: string = token && getUsername(token.id_token);
  const organization: Organization = await getOrganization(catalogId);
  const revisions: Concept[] | null = await getConceptRevisions(conceptId, `${token.access_token}`).then((response) => {
    return response.json() || null;
  });

  return {
    props: {
      username,
      organization,
      concept,
      revisions,
      replacedConcepts,
      hasWritePermission,
      FDK_REGISTRATION_BASE_URI: process.env.FDK_REGISTRATION_BASE_URI,
    },
  };
}

export default ConceptPage;
