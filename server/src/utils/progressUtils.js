const PROGRESS_TYPES = {
    WEIGHT: "WEIGHT",
    STEPS: "STEPS",
    FOOD: "FOOD",
};

const LOWER_CASE_PROGRESS_TYPES = Object.values(PROGRESS_TYPES).map(
    (progressType) => progressType.toLowerCase()
);

const hasExactlyOneProgressType = (doc) =>
    Object.keys(doc).filter((key) => PROGRESS_TYPES[key.toUpperCase()])
        .length === 1;

const updateProgressDocument = async (progressDocument, newProgressData) => {
    Object.entries(newProgressData).forEach(
        ([key, value]) => (progressDocument[key] = value)
    );
    await progressDocument.save();

    return progressDocument;
};

const getProgressTypeOfProgressDocument = (progressDocument) =>
    LOWER_CASE_PROGRESS_TYPES.filter(
        (progressType) => progressDocument[progressType]
    );

const formatProgressDocumentForClient = (progressDocument) => {
    const progressType = getProgressTypeOfProgressDocument(progressDocument);

    return formatProgressDocumentsForClient([progressDocument])[
        progressType
    ][0];
};

const formatProgressDocumentsForClient = (progressDocuments) => {
    const clientFormattedProgress = LOWER_CASE_PROGRESS_TYPES.reduce(
        (acc, progressType) => ({ ...acc, [progressType]: [] }),
        {}
    );

    progressDocuments.forEach((doc) => {
        const progressType = getProgressTypeOfProgressDocument(doc);
        clientFormattedProgress[progressType].push({
            date: doc.date,
            [progressType]: doc[progressType],
            id: doc._id,
        });
    });

    return clientFormattedProgress;
};

module.exports = {
    PROGRESS_TYPES,
    hasExactlyOneProgressType,
    formatProgressDocumentForClient,
    formatProgressDocumentsForClient,
    updateProgressDocument,
};
