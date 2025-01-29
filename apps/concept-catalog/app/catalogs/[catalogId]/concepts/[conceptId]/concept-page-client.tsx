'use client';

import { FC, useEffect, useId, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  PageBanner,
  Breadcrumbs,
  BreadcrumbType,
  ConceptStatusTagProps,
  InfoCard,
  Spinner,
  Button,
  Pagination,
  DetailsPageLayout,
  Tag,
  LinkButton,
  HelpMarkdown,
} from '@catalog-frontend/ui';
import {
  localization,
  getTranslateText as translate,
  formatISO,
  validOrganizationNumber,
  validUUID,
  ensureStringArray,
  getConceptSubject,
  versionToString,
} from '@catalog-frontend/utils';
import {
  Concept,
  Comment,
  Update,
  CodeList,
  InternalField,
  AssignedUser,
  Organization,
  ReferenceDataCode,
  UnionRelation,
  RelatedConcept,
} from '@catalog-frontend/types';
import { ChatIcon, EnvelopeClosedIcon, PhoneIcon } from '@navikt/aksel-icons';
import cn from 'classnames';
import { Accordion, Chip, Switch, Tabs, Textarea } from '@digdir/designsystemet-react';
import _ from 'lodash';
import classes from './concept-page.module.scss';
import { useCreateComment, useDeleteComment, useGetComments, useUpdateComment } from '../../../../../hooks/comments';
import { useGetHistory } from '../../../../../hooks/history';
import { useDeleteConcept, usePublishConcept } from '../../../../../hooks/concepts';
import { useCatalogDesign } from '../../../../../context/catalog-design';
import RelatedConcepts from '../../../../../components/related-concepts';
import Definition from '../../../../../components/definition';

type MapType = {
  [id: string]: string;
};

type InterneFeltProps = {
  concept: Concept;
  fields: InternalField[];
  codeLists: CodeList[];
  users: AssignedUser[];
  location: 'main_column' | 'right_column';
  language: string;
};

type ConceptPageClientProps = {
  username: string;
  organization: Organization;
  concept: Concept;
  conceptStatuses: ReferenceDataCode[];
  revisions: Concept[] | null;
  hasWritePermission: boolean;
  fieldsResult: {
    internal: InternalField[];
    editable: {
      domainCodeListId: string;
    };
  };
  codeListsResult: {
    codeLists: CodeList[];
  };
  usersResult: {
    users: AssignedUser[];
  };
  conceptRelations: UnionRelation[];
  internalConceptRelations: UnionRelation[];
  relatedConcepts: RelatedConcept[];
  internalRelatedConcepts: RelatedConcept[];
  catalogPortalUrl: string;
  isValid: boolean;
};

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
    .filter((field) => field?.value !== null && field?.location === location)
    .sort((a, b) => `${translate(a?.label, language)}`.localeCompare(`${translate(b?.label, language)}`));

  return (
    <>
      {filteredFields.map(
        (field) =>
          field && (
            <InfoCard.Item
              key={`internalField-${field.id}`}
              title={`${translate(field.label, language)}:`}
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
  relatedConcepts,
  conceptRelations,
  internalConceptRelations,
  internalRelatedConcepts,
  catalogPortalUrl,
  isValid,
}: ConceptPageClientProps) => {
  const [language, setLanguage] = useState('nb');
  const [isPublished, setIsPublished] = useState(concept?.erPublisert);
  const [publishedDate, setPublishedDate] = useState(concept?.publiseringsTidspunkt);
  const router = useRouter();
  const catalogId = organization.organizationId ?? '';

  const publishConcept = usePublishConcept(catalogId);
  const deleteConcept = useDeleteConcept(catalogId);

  const handleOnChangePublished = (e) => {
    if (e.target.checked) {
      if (window.confirm(localization.publicationState.confirmPublish)) {
        publishConcept.mutate(concept?.id as string, {
          onSuccess(data) {
            setIsPublished(data.erPublisert);
            setPublishedDate(data.publiseringsTidspunkt);
          },
        });
      }
    }
  };

  const pageSubtitle = organization?.name ?? catalogId;

  const infoDataColumnRight = [
    [localization.conceptId, concept?.originaltBegrep],
    [
      <div
        key='publicationState'
        className={classes.publicationStateHeader}
      >
        {localization.publicationState.state}
        {isValid || isPublished ? (
          <HelpMarkdown
            aria-label='Info publisering'
            severity='info'
          >
            {`Viktig! Når et begrep er publisert, kan det verken slettes eller avpubliseres, men kun endres.${isPublished ? '' :  
            ' Sørg derfor for at alle opplysninger er korrekte før publisering.'}`}
          </HelpMarkdown>
        ) : (
          <HelpMarkdown
            aria-label='Valideringsfeil'
            severity='warning'
          >
            {`Publisering er ikke mulig fordi ett eller flere felt inneholder ugyldige eller manglende verdier. Klikk på 
            [Rediger begrepet](/catalogs/${catalogId}/concepts/${concept?.id}/edit?validate=1) for å åpne skjemaet og se 
            hvilke feil som må rettes for å publisere.`}
          </HelpMarkdown>
        )}
      </div>,
      <>
        <div>
          <Switch
            value='published'
            size='small'
            position='right'
            readOnly={isPublished || !hasWritePermission || !isValid}
            checked={isPublished}
            onChange={handleOnChangePublished}
          >
            {isPublished ? localization.publicationState.published : localization.publicationState.unpublished}
          </Switch>
        </div>
        <div className={classes.greyFont}>
          {isPublished
            ? `${localization.publicationState.publishedInFDK}${
                publishedDate
                  ? ' ' +
                    formatISO(publishedDate, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : ''
              }`
            : ''}
        </div>
      </>,
    ],
    [localization.concept.version, versionToString(concept?.versjonsnr)],
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
            <ul key='label-list' className={classes.labels}>
              {concept?.merkelapp?.map((label) => (
                <li key={`label-${label}`}>
                  <Chip.Toggle
                    key={`label-${label}`}
                    onClick={() => router.push(`/catalogs/${catalogId}?filter.label=${label}`)}
                  >
                    {label}
                  </Chip.Toggle>
                </li>
              ))}
            </ul>,
          ],
        ]
      : []),
    ...(concept?.endringslogelement?.endringstidspunkt
      ? [
          [
            localization.concept.dateLastUpdated,
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

  const handleEditConcept = () => {
    const revision = revisions?.find((revision) => !revision.erPublisert);
    const id = revision ? revision.id : concept?.id;
    if (validOrganizationNumber(catalogId) && validUUID(id)) {
      router.push(`/catalogs/${catalogId}/concepts/${id}/edit`);
    }
  };

  const handleDeleteConcept = () => {
    if (window.confirm(localization.concept.confirmDelete)) {
      const revision = revisions?.find((revision) => !revision.erPublisert);
      if (revision) {
        deleteConcept.mutate(revision.id as string);
      }
    }
  };

  const design = useCatalogDesign();

  const getTitle = (text: string | string[]) => (text ? text : localization.concept.noName);
  const getDetailSubtitle = () => {
    const subjectCodeList = codeListsResult?.codeLists?.find(
      (codeList) => codeList.id === fieldsResult?.editable?.domainCodeListId,
    );

    return getConceptSubject(concept, subjectCodeList);
  };

  const getStatusFromURL = (statusURI?: string | null) => {
    if (statusURI && typeof statusURI === 'string') {
      const urlParts = statusURI.split('/');
      if (urlParts.length > 0) {
        return urlParts[urlParts.length - 1] as ConceptStatusTagProps['statusKey'];
      }
    }
    return undefined;
  };

  const RevisionsTab = () => {
    return (
      <InfoCard>
        {revisions?.map((revision) => {
          const status = findStatusLabel(revision?.statusURI);
          return (
            <InfoCard.Item
              key={`revision-${revision.id}`}
              title={`${localization.versionId} ${revision.id}`}
              headingColor='light'
            >
              <div className={classes.revision}>
                <div>v{versionToString(revision?.versjonsnr)}</div>
                <div>
                  <Link
                    prefetch={false}
                    href={
                      validOrganizationNumber(catalogId) && validUUID(revision.id)
                        ? `/catalogs/${catalogId}/concepts/${revision.id}`
                        : '#'
                    }
                    className={classes.versionTitle}
                  >
                    {getTitle(translate(revision?.anbefaltTerm?.navn, language))}
                  </Link>
                </div>
                {status && (
                  <div className={cn(classes.status)}>
                    <Tag.ConceptStatus
                      statusKey={getStatusFromURL(revision?.statusURI)}
                      statusLabel={status}
                    />
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
          href: `/catalogs/${catalogId}`,
          text: localization.catalogType.concept,
        },
        {
          href: `/catalogs/${catalogId}/concepts/${concept?.id}`,
          text: getTitle(translate(concept?.anbefaltTerm?.navn, language)),
        },
      ] as BreadcrumbType[])
    : [];

  const status = findStatusLabel(concept?.statusURI);

  useEffect(() => {
    setIsPublished(concept?.erPublisert);
    setPublishedDate(concept?.publiseringsTidspunkt);
  }, [concept]);

  const CommentsTab: FC = () => {
    const [newCommentText, setNewCommentText] = useState('');
    const [updateCommentText, setUpdateCommentText] = useState<MapType>({});

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

    const handleNewCommentChange = (event) => {
      setNewCommentText(event.target.value);
    };

    const handleUpdateCommentChange = (commentId, event) => {
      setUpdateCommentText({ ...updateCommentText, ...{ [commentId]: event.target.value } });
    };

    const newCommentButtonId = useId();
    const isCommentInEditMode = (id) => id in updateCommentText;

    return getCommentsStatus == 'pending' ? (
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
                    {comment?.user?.name ?? localization.unknown}
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
                  {comment.user?.id === username && (
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
    );
  };

  const HistoryTab: FC = () => {
    const [historyCurrentPage, setHistoryCurrentPage] = useState(1);
    const { status: getHistoryStatus, data: getHistoryData } = useGetHistory({
      catalogId,
      resourceId: concept?.id,
      page: historyCurrentPage,
    });

    const handleHistoryPageChange = (page) => {
      setHistoryCurrentPage(page);
    };

    return getHistoryStatus === 'pending' ? (
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
    );
  };

  const MainColumn = () => (
    <div>
      <InfoCard>
        {!_.isEmpty(translate(concept?.definisjon?.tekst ?? '', language)) && !_.isEmpty(concept?.definisjon) && (
          <InfoCard.Item title={`${localization.concept.definition}:`}>
            <Definition
              definition={concept?.definisjon}
              language={language}
            />
          </InfoCard.Item>
        )}
        {!_.isEmpty(translate(concept?.definisjonForAllmennheten?.tekst ?? '', language)) &&
          !_.isEmpty(concept?.definisjonForAllmennheten) && (
            <InfoCard.Item title={`${localization.concept.publicDefinition}:`}>
              <Definition
                definition={concept?.definisjonForAllmennheten}
                language={language}
              />
            </InfoCard.Item>
          )}

        {!_.isEmpty(translate(concept?.definisjonForSpesialister?.tekst ?? '', language)) &&
          !_.isEmpty(concept?.definisjonForSpesialister) && (
            <InfoCard.Item title={`${localization.concept.specialistDefinition}:`}>
              <Definition
                definition={concept?.definisjonForSpesialister}
                language={language}
              />
            </InfoCard.Item>
          )}
        {!_.isEmpty(translate(concept?.merknad, language)) && (
          <InfoCard.Item title={`${localization.concept.remark}:`}>
            <span>{translate(concept?.merknad, language)}</span>
          </InfoCard.Item>
        )}
        {!_.isEmpty(translate(concept?.eksempel, language)) && (
          <InfoCard.Item title={`${localization.concept.example}:`}>
            <span>{translate(concept?.eksempel, language)}</span>
          </InfoCard.Item>
        )}
        {!_.isEmpty(translate(concept?.abbreviatedLabel, language)) && (
          <InfoCard.Item title={`${localization.concept.abbreviation}:`}>
            <span>{translate(concept?.abbreviatedLabel, language)}</span>
          </InfoCard.Item>
        )}
        {!_.isEmpty(translate(concept?.tillattTerm, language)) && (
          <InfoCard.Item title={`${localization.concept.altLabel}:`}>
            <ul>
              {ensureStringArray(translate(concept?.tillattTerm, language)).map((term, i) => (
                <li key={`altLabel-${i}`}>{term}</li>
              ))}
            </ul>
          </InfoCard.Item>
        )}
        {!_.isEmpty(translate(concept?.frarådetTerm, language)) && (
          <InfoCard.Item title={`${localization.concept.hiddenLabel}:`}>
            <ul>
              {ensureStringArray(translate(concept?.frarådetTerm, language)).map((term, i) => (
                <li key={`hiddenLabel-${i}`}>{term}</li>
              ))}
            </ul>
          </InfoCard.Item>
        )}
        {!_.isEmpty(relatedConcepts) && (
          <InfoCard.Item
            title={`${localization.formatString(localization.concept.relatedConcepts, {
              conceptCount: conceptRelations.length,
            })}`}
          >
            <RelatedConcepts
              title={getTitle(translate(concept?.anbefaltTerm?.navn, language))}
              conceptRelations={conceptRelations}
              relatedConcepts={relatedConcepts}
              validFromIncluding={concept?.gyldigFom}
              validToIncluding={concept?.gyldigTom}
            />
          </InfoCard.Item>
        )}
        {!_.isEmpty(internalRelatedConcepts) && (
          <InfoCard.Item
            title={`${localization.formatString(localization.concept.unpublishedRelatedConcepts, {
              conceptCount: internalConceptRelations.length,
            })}`}
          >
            <RelatedConcepts
              title={getTitle(translate(concept?.anbefaltTerm?.navn, language))}
              conceptRelations={internalConceptRelations}
              relatedConcepts={internalRelatedConcepts}
              validFromIncluding={concept?.gyldigFom}
              validToIncluding={concept?.gyldigTom}
            />
          </InfoCard.Item>
        )}
        {!_.isEmpty(concept?.omfang?.uri) || !_.isEmpty(concept?.omfang?.tekst) && (
          <InfoCard.Item title={`${localization.concept.valueDomain}:`}>
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
            <CommentsTab />
          </Tabs.Content>
          <Tabs.Content value={localization.changeHistory}>
            <HistoryTab />
          </Tabs.Content>
          <Tabs.Content value={localization.concept.versions}>
            <RevisionsTab />
          </Tabs.Content>
        </Tabs>
      </div>
    </div>
  );

  const RightColumn = () => (
    <InfoCard size='small'>
      {infoDataColumnRight.map(([label, value]) => (
        <InfoCard.Item
          key={`info-data-${label}`}
          title={label}
          headingColor='light'
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
  );

  return (
    <>
      <Breadcrumbs
        breadcrumbList={breadcrumbList}
        catalogPortalUrl={catalogPortalUrl}
      />
      <PageBanner
        title={localization.catalogType.concept}
        subtitle={pageSubtitle}
        fontColor={design?.fontColor}
        backgroundColor={design?.backgroundColor}
        logo={design?.hasLogo ? `/api/catalog-admin/${catalogId}/design/logo` : undefined}
        logoDescription={design?.logoDescription}
      />

      <DetailsPageLayout
        loading={deleteConcept.status === 'pending'}
        handleLanguageChange={handleLanguageChange}
        language={language}
        headingTitle={getTitle(translate(concept?.anbefaltTerm?.navn, language))}
        headingTag={
          <Tag.ConceptStatus
            statusKey={getStatusFromURL(concept?.statusURI)}
            statusLabel={status}
          />
        }
        headingSubtitle={getDetailSubtitle()}
      >
        <DetailsPageLayout.Left>
          <MainColumn />
        </DetailsPageLayout.Left>
        <DetailsPageLayout.Right>
          <RightColumn />
        </DetailsPageLayout.Right>
        <DetailsPageLayout.Buttons>
          <div className={classes.actionButtons}>
            {hasWritePermission && (
              <>
                <Button onClick={handleEditConcept}>{localization.button.edit}</Button>
                {!concept?.erPublisert && (
                  <Button
                    color={'danger'}
                    variant='secondary'
                    onClick={handleDeleteConcept}
                  >
                    {localization.button.delete}
                  </Button>
                )}
              </>
            )}
            <LinkButton
              href={`/catalogs/${catalogId}/change-requests/new?concept=${concept?.id}`}
              variant='secondary'
              fullWidth={false}
            >
              {localization.concept.suggestChanges}
            </LinkButton>
          </div>
        </DetailsPageLayout.Buttons>
      </DetailsPageLayout>
    </>
  );
};

export default ConceptPageClient;
