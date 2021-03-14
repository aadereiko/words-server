export const findLastDisallowedField = (fieldsToCheck: Array<string>, allowedFields: Array<string>): string => {;
    let dissallowdField = '';

    Object.keys(fieldsToCheck).forEach((field) => {
        if (!allowedFields.includes(field)) {
            dissallowdField = field;
        }
    });

    return dissallowdField;
} 