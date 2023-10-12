import { useId, useState } from 'react';
import { InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  PageBanner,
  Breadcrumbs,
  BreadcrumbType,
  ConceptSubject,
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
  ensureStringArray,
} from '@catalog-frontend/utils';
import {
  getAllCodeLists,
  getConcept,
  getConceptRelations,
  getConceptRevisions,
  getConceptStatuses,
  getFields,
  getOrganization,
  getRelatedConcepts,
  getUsers,
} from '@catalog-frontend/data-access';
import {
  Concept,
  Comment,
  Update,
  Organization,
  CodeList,
  InternalField,
  AssignedUser,
  FieldsResult,
  CodeListsResult,
  UsersResult,
  Relasjon,
  SkosConcept,
} from '@catalog-frontend/types';
import { ChatIcon, EnvelopeClosedIcon, PhoneIcon } from '@navikt/aksel-icons';
import cn from 'classnames';
import { Accordion, Tabs, Textarea } from '@digdir/design-system-react';
import classes from './concept-page.module.css';
import { useCreateComment, useDeleteComment, useGetComments, useUpdateComment } from '../../../hooks/comments';
import { useGetHistory } from '../../../hooks/history';
import { useDeleteConcept } from '../../../hooks/concepts';
import { authOptions } from '../../api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import { useCatalogDesign } from '../../../context/catalog-design';
import _ from 'lodash';
import { getToken } from 'next-auth/jwt';
import { prepareStatusList } from '@catalog-frontend/utils';
import RelatedConcepts from '../../../components/related-concepts';

type MapType = {
  [id: string]: string;
};

interface InterneFeltProps {
  concept: Concept;
  fields: InternalField[];
  codeLists: CodeList[];
  users: AssignedUser[];
  location: 'main_column' | 'right_column';
}

const InterneFelt = ({ concept, fields, codeLists, users, location }: InterneFeltProps) => {
  const getCodeName = (codeListId: string, codeId: string) => {
    const codeList = codeLists.find((codeList) => codeList.id === codeListId);
    return translate(codeList?.codes.find((code) => `${code.id}` === codeId)?.name);
  };

  const getUserName = (userId: string) => {
    return users.find((user) => user.id === userId)?.name;
  };

  const filteredFields = Object.keys(concept?.interneFelt ?? {})
    .map((fieldId) => {
      const field = fields.find((field) => field.id === fieldId);
      if (!field) {
        return null;
      }

      return {
        ...field,
        value: concept?.interneFelt[fieldId].value,
      };
    })
    .filter((field) => field !== null && field.location === location)
    .sort((a, b) => `${translate(a.label)}`.localeCompare(`${translate(b.label)}`));

  return (
    <>
      {filteredFields.map((field) => (
        <InfoCard.Item
          key={`internalField-${field.id}`}
          label={`${translate(field.label)}:`}
        >
          {(field.type === 'text_short' || field.type === 'text_long') && <span>{field.value}</span>}
          {field.type === 'boolean' && <span>{field.value ? localization.yes : localization.no}</span>}
          {field.type === 'user_list' && <span>{getUserName(field.value)}</span>}
          {field.type === 'code_list' && <span>{getCodeName(field.codeListId, field.value)}</span>}
        </InfoCard.Item>
      ))}
    </>
  );
};

export const ConceptPage = ({
  username,
  organization,
  concept,
  conceptStatuses,
  revisions,
  hasWritePermission,
  fieldsResult,
  codeListsResult,
  usersResult,
  FDK_REGISTRATION_BASE_URI,
  relatedConcepts,
  conceptRelations,
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

  const infoDataColumnRight = [
    [localization.concept.id, concept?.id],
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
    [
      localization.concept.version,
      `${concept?.versjonsnr.major}.${concept?.versjonsnr.minor}.${concept?.versjonsnr.patch}`,
    ],
    ...(concept?.gyldigFom || concept?.gyldigTom
      ? [
          [
            localization.concept.validPeriod,
            <>
              {concept?.gyldigFom && (
                <div>
                  <span className={classes.greyFont}>{localization.fromAndIncluding}: </span>
                  {`${formatISO(concept?.gyldigFom, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}`}
                </div>
              )}
              {concept?.gyldigTom && (
                <div>
                  <span className={classes.greyFont}>{localization.toAndIncluding}: </span>
                  {`${formatISO(concept?.gyldigTom, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}`}
                </div>
              )}
            </>,
          ],
        ]
      : []),
    ...(concept?.kontaktpunkt?.harEpost || concept?.kontaktpunkt?.harTelefon
      ? [
          [
            localization.concept.contactInformation,
            <>
              {concept?.kontaktpunkt?.harEpost && (
                <div
                  key='contact'
                  className={classes.contact}
                >
                  <EnvelopeClosedIcon />
                  &nbsp;
                  {concept?.kontaktpunkt?.harEpost}
                </div>
              )}
              {concept?.kontaktpunkt?.harTelefon && (
                <div
                  key='contact'
                  className={classes.contact}
                >
                  <PhoneIcon />
                  &nbsp;
                  {concept?.kontaktpunkt?.harTelefon}
                </div>
              )}
            </>,
          ],
        ]
      : []),
    ...(concept?.assignedUser
      ? [
          [
            localization.assigned,
            usersResult?.users?.find((user) => user.id === concept.assignedUser)?.name ?? localization.unknown,
          ],
        ]
      : []),
    ...(!_.isEmpty(concept?.merkelapp)
      ? [
          [
            localization.concept.label,
            <ul key='label-list'>
              {concept?.merkelapp?.map((label) => (
                <li key={`label-${label}`}>{label}</li>
              ))}
            </ul>,
          ],
        ]
      : []),
    ...(concept?.endringslogelement?.endringstidspunkt
      ? [
          [
            localization.concept.lastUpdated,
            formatISO(concept?.endringslogelement?.endringstidspunkt, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }) ?? '',
          ],
        ]
      : []),
    ...(concept?.opprettet
      ? [
          [
            localization.concept.created,
            formatISO(concept?.opprettet, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }) ?? '',
          ],
        ]
      : []),
    ...(concept?.opprettetAv ? [[localization.concept.createdBy, concept.opprettetAv]] : []),
  ];

  const findStatusLabel = (statusURI) => {
    return translate(conceptStatuses?.find((s) => s.uri === statusURI)?.label) as string;
  };

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
  const getDetailSubtitle = () => {
    const subjectCodeList = codeListsResult?.codeLists?.find(
      (codeList) => codeList.id === fieldsResult?.editable?.domainCodeListId,
    );

    return (
      <ConceptSubject
        concept={concept}
        subjectCodeList={subjectCodeList}
      />
    );
  };

  const newCommentButtonId = useId();
  const isCommentInEditMode = (id) => id in updateCommentText;

  const RevisionsTab = () => {
    return (
      <InfoCard>
        {revisions?.map((revision) => {
          const status = findStatusLabel(revision?.statusURI);
          return (
            <InfoCard.Item key={`revision-${revision.id}`}>
              <div className={classes.revision}>
                <div>
                  v{revision?.versjonsnr.major}.{revision?.versjonsnr.minor}.{revision?.versjonsnr.patch}
                </div>
                <div>
                  <Link
                    href={
                      validOrganizationNumber(catalogId) && validUUID(revision.id)
                        ? `/${catalogId}/${revision.id}`
                        : '#'
                    }
                    className={classes.versionTitle}
                  >
                    {getTitle(translate(revision?.anbefaltTerm?.navn))}
                  </Link>
                </div>
                {status && (
                  <div className={cn(classes.status)}>
                    <Tag>{status}</Tag>
                  </div>
                )}
              </div>
            </InfoCard.Item>
          );
        })}
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

  const status = findStatusLabel(concept?.statusURI);

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
          subtitle={getDetailSubtitle()}
        />

        {deleteConcept.status === 'loading' && <Spinner />}
        {deleteConcept.status !== 'loading' && (
          <>
            {status && (
              <div className={cn(classes.status)}>
                <Tag>{status}</Tag>
              </div>
            )}
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
                {concept?.definisjon?.kildebeskrivelse?.kilde.length > 0 && (
                  <div className={cn(classes.source)}>
                    <div>Kilde:</div>
                    <div>
                      <ul>
                        {concept?.definisjon?.kildebeskrivelse?.kilde?.map((kilde, i) => (
                          <li key={`kilde-${i}`}>
                            {kilde.uri ? <a href={kilde.uri}>{kilde.tekst}</a> : <span>{kilde.tekst}</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              <div className={classes.actionButtons}>
                {hasWritePermission && (
                  <>
                    <Button onClick={handleEditConcept}>Rediger</Button>
                    {!concept?.erPublisert && (
                      <Button
                        color={'danger'}
                        onClick={handleDeleteConcept}
                      >
                        Slett
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className={cn(classes.twoColumnRow, classes.bottomSpace)}>
              <div>
                <InfoCard>
                  {!_.isEmpty(translate(concept?.merknad, language)) && (
                    <InfoCard.Item label={`${localization.concept.note}:`}>
                      <span>{translate(concept?.merknad, language)}</span>
                    </InfoCard.Item>
                  )}
                  {!_.isEmpty(translate(concept?.eksempel, language)) && (
                    <InfoCard.Item label={`${localization.concept.example}:`}>
                      <span>{translate(concept?.eksempel, language)}</span>
                    </InfoCard.Item>
                  )}
                  {!_.isEmpty(translate(concept?.definisjonForAllmennheten?.tekst ?? '', language)) && (
                    <InfoCard.Item label={`${localization.concept.publicDefinition}:`}>
                      <div>{translate(concept?.definisjonForAllmennheten?.tekst ?? '', language)}</div>
                      {concept?.definisjonForAllmennheten?.kildebeskrivelse?.kilde.length > 0 && (
                        <div className={cn(classes.source, classes.paddingTop05)}>
                          <div>{localization.concept.source}:</div>
                          <div>
                            <ul>
                              {concept?.definisjonForAllmennheten?.kildebeskrivelse?.kilde?.map((kilde, i) => (
                                <li key={`kilde-${i}`}>
                                  {kilde.uri ? <a href={kilde.uri}>{kilde.tekst}</a> : <span>{kilde.tekst}</span>}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </InfoCard.Item>
                  )}

                  {!_.isEmpty(translate(concept?.definisjonForSpesialister?.tekst ?? '', language)) && (
                    <InfoCard.Item label={`${localization.concept.specialistDefinition}:`}>
                      <div>{translate(concept?.definisjonForSpesialister?.tekst ?? '', language)}</div>
                      {concept?.definisjonForSpesialister?.kildebeskrivelse?.kilde.length > 0 && (
                        <div className={cn(classes.source, classes.paddingTop05)}>
                          <div>{localization.concept.source}:</div>
                          <div>
                            <ul>
                              {concept?.definisjonForSpesialister?.kildebeskrivelse?.kilde?.map((kilde, i) => (
                                <li key={`kilde-${i}`}>
                                  {kilde.uri ? <a href={kilde.uri}>{kilde.tekst}</a> : <span>{kilde.tekst}</span>}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </InfoCard.Item>
                  )}
                  {!(
                    _.isEmpty(ensureStringArray(translate(concept?.tillattTerm, language))) &&
                    _.isEmpty(ensureStringArray(translate(concept?.frarådetTerm, language))) &&
                    _.isEmpty(concept?.abbreviatedLabel)
                  ) && (
                    <InfoCard.Item>
                      {!_.isEmpty(concept?.abbreviatedLabel) && (
                        <div className={classes.termsRow}>
                          <h3>{`${localization.concept.abbreviation}:`}</h3>
                          <ul>
                            <li>{concept?.abbreviatedLabel}</li>
                          </ul>
                        </div>
                      )}
                      {!_.isEmpty(ensureStringArray(translate(concept?.tillattTerm, language))) && (
                        <div className={classes.termsRow}>
                          <h3>{`${localization.concept.allowedTerm}:`}</h3>
                          <ul>
                            {ensureStringArray(translate(concept?.tillattTerm, language)).map((term, i) => (
                              <li key={`allowedTerm-${i}`}>{term}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {!_.isEmpty(ensureStringArray(translate(concept?.frarådetTerm, language))) && (
                        <div className={classes.termsRow}>
                          <h3>{`${localization.concept.notRecommendedTerm}:`}</h3>
                          <ul>
                            {ensureStringArray(translate(concept?.frarådetTerm, language)).map((term, i) => (
                              <li key={`notRecommendedTerm-${i}`}>{term}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </InfoCard.Item>
                  )}
                  {!_.isEmpty(relatedConcepts) && (
                    <InfoCard.Item
                      label={`${localization.formatString(localization.concept.relatedConcepts, {
                        conceptCount: conceptRelations.length,
                      })}`}
                    >
                      <RelatedConcepts
                        title={getTitle(translate(concept?.anbefaltTerm?.navn))}
                        conceptRelations={conceptRelations}
                        relatedConcepts={relatedConcepts}
                        validFromIncluding={concept?.gyldigFom}
                        validToIncluding={concept?.gyldigTom}
                      />
                    </InfoCard.Item>
                  )}
                  {!_.isEmpty(concept?.omfang) && (
                    <InfoCard.Item label={`${localization.concept.valueDomain}:`}>
                      {concept?.omfang?.uri ? (
                        <Link href={concept?.omfang?.uri}>{concept?.omfang?.tekst}</Link>
                      ) : (
                        <span>{concept?.omfang?.tekst}</span>
                      )}
                    </InfoCard.Item>
                  )}
                  <InterneFelt
                    fields={fieldsResult.internal}
                    codeLists={codeListsResult.codeLists}
                    users={usersResult.users}
                    concept={concept}
                    location='main_column'
                  />
                </InfoCard>

                <div className={classes.tabs}>
                  <Tabs
                    items={[
                      {
                        content:
                          getCommentsStatus == 'loading' ? (
                            <Spinner size='medium' />
                          ) : (
                            <>
                              <div className={classes.bottomSpacingSmall}>
                                <Textarea
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
                                          <Textarea
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
                                          <div>{JSON.stringify(operation.value)}</div>
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
                {infoDataColumnRight.map(([label, value]) => (
                  <InfoCard.Item
                    key={`info-data-${label}`}
                    label={label}
                    labelColor='light'
                  >
                    <span>{value}</span>
                  </InfoCard.Item>
                ))}
                <InterneFelt
                  fields={fieldsResult.internal}
                  codeLists={codeListsResult.codeLists}
                  users={usersResult.users}
                  concept={concept}
                  location='right_column'
                />
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

  if (!(session?.user && Date.now() < session?.accessTokenExpiresAt * 1000)) {
    return {
      redirect: {
        permanent: false,
        destination: `/auth/signin?callbackUrl=/${catalogId}/${conceptId}`,
      },
    };
  }

  const hasReadPermission =
    session &&
    (hasOrganizationReadPermission(session?.accessToken, catalogId) || hasSystemAdminPermission(session?.accessToken));
  if (!hasReadPermission) {
    return {
      redirect: {
        permanent: false,
        destination: `/${catalogId}/no-access`,
      },
    };
  }

  const concept: Concept | null = await getConcept(conceptId, `${session?.accessToken}`).then((response) => {
    if (response.ok) return response.json();
  });
  if (!concept) {
    return {
      notFound: true,
    };
  }

  const conceptStatuses = await getConceptStatuses()
    .then((response) => response.json())
    .then((body) => {
      return body?.conceptStatuses ?? [];
    })
    .then((statuses) => prepareStatusList(statuses));

  const hasWritePermission = session && hasOrganizationWritePermission(session?.accessToken, catalogId);
  const username: string = token && getUsername(token.id_token);
  const organization: Organization = await getOrganization(catalogId).then((response) => response.json());
  const revisions: Concept[] | null = await getConceptRevisions(conceptId, `${session?.accessToken}`).then(
    (response) => response.json() || null,
  );
  const fieldsResult: FieldsResult = await getFields(catalogId, `${session?.accessToken}`).then((response) =>
    response.json(),
  );
  const codeListsResult: CodeListsResult = await getAllCodeLists(catalogId, `${session?.accessToken}`).then(
    (response) => response.json(),
  );
  const usersResult: UsersResult = await getUsers(catalogId, `${session?.accessToken}`).then((response) =>
    response.json(),
  );

  const relatedConcepts: SkosConcept[] = await getRelatedConcepts(concept);
  const conceptRelations: Relasjon[] = getConceptRelations(concept);

  return {
    props: {
      username,
      organization,
      concept,
      revisions,
      fieldsResult,
      codeListsResult,
      conceptStatuses,
      usersResult,
      hasWritePermission,
      relatedConcepts,
      conceptRelations,
      FDK_REGISTRATION_BASE_URI: process.env.FDK_REGISTRATION_BASE_URI,
    },
  };
}

export default ConceptPage;
