'use client';

import { useEffect, useId, useState } from 'react';
import { useRouter } from 'next/navigation';
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
  Pagination,
} from '@catalog-frontend/ui';
import {
  localization,
  getTranslateText as translate,
  formatISO,
  validOrganizationNumber,
  validUUID,
  ensureStringArray,
} from '@catalog-frontend/utils';
import { Concept, Comment, Update, CodeList, InternalField, AssignedUser } from '@catalog-frontend/types';
import { ChatIcon, EnvelopeClosedIcon, PhoneIcon } from '@navikt/aksel-icons';
import cn from 'classnames';
import { Accordion, Switch, Tabs, Textarea, ToggleGroup } from '@digdir/design-system-react';
import _ from 'lodash';
import classes from './concept-page.module.css';
import { useCreateComment, useDeleteComment, useGetComments, useUpdateComment } from '../../../hooks/comments';
import { useGetHistory } from '../../../hooks/history';
import { useDeleteConcept, usePublishConcept } from '../../../hooks/concepts';
import { useCatalogDesign } from '../../../context/catalog-design';
import RelatedConcepts from '../../../components/related-concepts';
import Definition from '../../../components/definition';

type MapType = {
  [id: string]: string;
};

interface InterneFeltProps {
  concept: Concept;
  fields: InternalField[];
  codeLists: CodeList[];
  users: AssignedUser[];
  location: 'main_column' | 'right_column';
  language: string;
}

const InterneFelt = ({ concept, fields, codeLists, users, location, language }: InterneFeltProps) => {
  const getCodeName = (codeListId: string, codeId: string) => {
    const codeList = codeLists.find((codeList) => codeList.id === codeListId);
    return translate(codeList?.codes?.find((code) => `${code.id}` === codeId)?.name, language);
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
        value: concept?.interneFelt && concept?.interneFelt[fieldId].value,
      };
    })
    .filter((field) => field !== null && field.location === location)
    .sort((a, b) => `${translate(a?.label, language)}`.localeCompare(`${translate(b?.label, language)}`));

  return (
    <>
      {filteredFields.map(
        (field) =>
          field && (
            <InfoCard.Item
              key={`internalField-${field.id}`}
              label={`${translate(field.label, language)}:`}
            >
              {(field.type === 'text_short' || field.type === 'text_long') && <span>{field.value}</span>}
              {field.type === 'boolean' && <span>{field.value ? localization.yes : localization.no}</span>}
              {field.type === 'user_list' && <span>{getUserName(field.value ?? '')}</span>}
              {field.type === 'code_list' && <span>{getCodeName(field.codeListId ?? '', field.value ?? '')}</span>}
            </InfoCard.Item>
          ),
      )}
    </>
  );
};

export const ConceptPageClient = ({
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
}) => {
  const [language, setLanguage] = useState('nb');
  const [newCommentText, setNewCommentText] = useState('');
  const [updateCommentText, setUpdateCommentText] = useState<MapType>({});
  const [isPublished, setIsPublished] = useState(concept?.erPublisert);
  const [publishedDate, setPublishedDate] = useState(concept?.publiseringsTidspunkt);
  const router = useRouter();
  const catalogId = organization.organizationId ?? '';

  const { status: getCommentsStatus, data: getCommentsData } = useGetComments({
    orgNumber: catalogId,
    topicId: concept?.id,
  });

  const publishConcept = usePublishConcept(catalogId);
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

  const [historyCurrentPage, setHistoryCurrentPage] = useState(1);
  const { status: getHistoryStatus, data: getHistoryData } = useGetHistory({
    catalogId,
    resourceId: concept?.id,
    page: historyCurrentPage,
  });

  const handleHistoryPageChange = (page) => {
    setHistoryCurrentPage(page);
  };

  const handleOnChangePublished = (e) => {
    if (e.target.checked) {
      if (window.confirm(localization.publicationState.confirmPublish)) {
        publishConcept.mutate(concept?.id, {
          onSuccess(data) {
            setIsPublished(data.erPublisert);
            setPublishedDate(data.publiseringsTidspunkt);
          },
        });
      }
    }
  };

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
      <>
        <Switch
          value='published'
          size='small'
          position='right'
          readOnly={isPublished}
          checked={isPublished}
          onChange={handleOnChangePublished}
        >
          {localization.publicationState.published}
        </Switch>
        <div className={classes.greyFont}>
          {isPublished
            ? `${localization.publicationState.publishedInFDK} ${formatISO(publishedDate, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}`
            : localization.publicationState.unpublished}
        </div>
      </>,
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
    ...(concept?.kontaktpunkt?.harEpost || concept?.kontaktpunkt?.harTelefon
      ? [
          [
            localization.concept.contactInformation,
            <>
              {concept?.kontaktpunkt?.harEpost && (
                <div
                  key='contactEmail'
                  className={classes.contact}
                >
                  <EnvelopeClosedIcon />
                  &nbsp;
                  {concept?.kontaktpunkt?.harEpost}
                </div>
              )}
              {concept?.kontaktpunkt?.harTelefon && (
                <div
                  key='contactTl'
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
      router.push(`/${catalogId}/${id}/edit`);
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
                    {getTitle(translate(revision?.anbefaltTerm?.navn, language))}
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

  useEffect(() => {
    setIsPublished(concept?.erPublisert);
    setPublishedDate(concept?.publiseringsTidspunkt);
  }, [concept]);

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
        logo={design?.hasLogo ? `/api/catalog-admin/${catalogId}/design/logo` : undefined}
        logoDescription={design?.logoDescription}
      />
      <div className='container'>
        <DetailHeading
          className={classes.detailHeading}
          headingTitle={
            <div className={cn(classes.status)}>
              <h2>{getTitle(translate(concept?.anbefaltTerm?.navn, language))}</h2>
              {status && <Tag>{status}</Tag>}
            </div>
          }
          subtitle={getDetailSubtitle()}
        />

        {deleteConcept.status === 'loading' && <Spinner />}
        {deleteConcept.status !== 'loading' && (
          <>
            <div className={classes.twoColumnRow}>
              <div>
                <div className={classes.languages}>
                  <ToggleGroup
                    onChange={handleLanguageChange}
                    value={language}
                    size='small'
                  >
                    {languageOptions.map((item) => (
                      <ToggleGroup.Item
                        key={item.value}
                        value={item.value}
                      >
                        {item.label}
                      </ToggleGroup.Item>
                    ))}
                  </ToggleGroup>
                </div>
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
                  {!_.isEmpty(translate(concept?.definisjon?.tekst ?? '', language)) && (
                    <InfoCard.Item label={`${localization.concept.definition}:`}>
                      <Definition
                        definition={concept?.definisjon}
                        language={language}
                      />
                    </InfoCard.Item>
                  )}
                  {!_.isEmpty(translate(concept?.definisjonForAllmennheten?.tekst ?? '', language)) && (
                    <InfoCard.Item label={`${localization.concept.publicDefinition}:`}>
                      <Definition
                        definition={concept?.definisjonForAllmennheten}
                        language={language}
                      />
                    </InfoCard.Item>
                  )}

                  {!_.isEmpty(translate(concept?.definisjonForSpesialister?.tekst ?? '', language)) && (
                    <InfoCard.Item label={`${localization.concept.specialistDefinition}:`}>
                      <Definition
                        definition={concept?.definisjonForSpesialister}
                        language={language}
                      />
                    </InfoCard.Item>
                  )}
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
                  {!_.isEmpty(translate(concept?.abbreviatedLabel, language)) && (
                    <InfoCard.Item label={`${localization.concept.abbreviation}:`}>
                      <span>{translate(concept?.abbreviatedLabel, language)}</span>
                    </InfoCard.Item>
                  )}
                  {!_.isEmpty(translate(concept?.tillattTerm, language)) && (
                    <InfoCard.Item label={`${localization.concept.allowedTerm}:`}>
                      <ul>
                        {ensureStringArray(translate(concept?.tillattTerm, language)).map((term, i) => (
                          <li key={`allowedTerm-${i}`}>{term}</li>
                        ))}
                      </ul>
                    </InfoCard.Item>
                  )}
                  {!_.isEmpty(translate(concept?.frarådetTerm, language)) && (
                    <InfoCard.Item label={`${localization.concept.notRecommendedTerm}:`}>
                      <ul>
                        {ensureStringArray(translate(concept?.frarådetTerm, language)).map((term, i) => (
                          <li key={`notRecommendedTerm-${i}`}>{term}</li>
                        ))}
                      </ul>
                    </InfoCard.Item>
                  )}
                  {!_.isEmpty(relatedConcepts) && (
                    <InfoCard.Item
                      label={`${localization.formatString(localization.concept.relatedConcepts, {
                        conceptCount: conceptRelations.length,
                      })}`}
                    >
                      <RelatedConcepts
                        catalogId={catalogId}
                        title={getTitle(translate(concept?.anbefaltTerm?.navn, language))}
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
                    language={language}
                  />
                </InfoCard>

                <div className={classes.tabs}>
                  <Tabs
                    defaultValue={localization.comment.comments}
                    size='small'
                  >
                    <Tabs.List>
                      <Tabs.Tab value={localization.comment.comments}>{localization.comment.comments}</Tabs.Tab>
                      <Tabs.Tab value={localization.changeHistory}>{localization.changeHistory}</Tabs.Tab>
                      <Tabs.Tab value={localization.concept.versions}>{localization.concept.versions}</Tabs.Tab>
                    </Tabs.List>
                    <Tabs.Content value={localization.comment.comments}>
                      {getCommentsStatus == 'loading' ? (
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
                              Kommentarer ({getCommentsData?.length})
                            </div>
                            {getCommentsData?.length > 0 &&
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
                                          variant='secondary'
                                          onClick={() => handleUpdateComment(comment)}
                                        >
                                          {isCommentInEditMode(comment.id)
                                            ? localization.comment.saveComment
                                            : localization.comment.editComment}
                                        </Button>
                                        <Button
                                          variant='secondary'
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
                      )}
                    </Tabs.Content>
                    <Tabs.Content value={localization.changeHistory}>
                      {getHistoryStatus == 'loading' ? (
                        <Spinner size='medium' />
                      ) : getHistoryData?.updates?.length === 0 ? (
                        <span>{localization.history.noChanges}</span>
                      ) : (
                        <>
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
                          {getHistoryData.updates?.length > 0 && (
                            <Pagination
                              className={classes.historyPagination}
                              onChange={handleHistoryPageChange}
                              totalPages={getHistoryData.pagination.totalPages ?? 0}
                              currentPage={historyCurrentPage}
                            />
                          )}
                        </>
                      )}
                      ,
                    </Tabs.Content>
                    <Tabs.Content value={localization.concept.versions}>
                      <RevisionsTab />
                    </Tabs.Content>
                  </Tabs>
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
                  language={language}
                />
              </InfoCard>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ConceptPageClient;
