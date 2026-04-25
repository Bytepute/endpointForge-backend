import { faker } from '@faker-js/faker';
import { DataType } from './data-type.enum';

export const fakerMap: Record<DataType, () => any> = {
  [DataType.FAKER_PERSON_NAME]: () => faker.person.fullName(),
  [DataType.FAKER_FIRST_NAME]: () => faker.person.firstName(),
  [DataType.FAKER_LAST_NAME]: () => faker.person.lastName(),

  [DataType.FAKER_EMAIL]: () => faker.internet.email(),
  [DataType.FAKER_USERNAME]: () => faker.internet.username(),
  [DataType.FAKER_PASSWORD]: () => faker.internet.password(),

  [DataType.FAKER_AVATAR]: () => faker.image.avatar(),
  [DataType.FAKER_IMAGE_URL]: () => faker.image.url(),

  [DataType.FAKER_PHONE]: () => faker.phone.number(),

  [DataType.FAKER_UUID]: () => faker.string.uuid(),

  [DataType.FAKER_CITY]: () => faker.location.city(),
  [DataType.FAKER_COUNTRY]: () => faker.location.country(),
  [DataType.FAKER_STREET]: () => faker.location.street(),
  [DataType.FAKER_ZIPCODE]: () => faker.location.zipCode(),

  [DataType.FAKER_COMPANY]: () => faker.company.name(),
  [DataType.FAKER_JOB_TITLE]: () => faker.person.jobTitle(),

  [DataType.FAKER_PRODUCT]: () => faker.commerce.productName(),
  [DataType.FAKER_PRICE]: () => faker.commerce.price(),

  [DataType.FAKER_SENTENCE]: () => faker.lorem.sentence(),
  [DataType.FAKER_PARAGRAPH]: () => faker.lorem.paragraph(),

  [DataType.FAKER_NUMBER]: () => faker.number.int(),
  [DataType.FAKER_BOOLEAN]: () => faker.datatype.boolean(),

  [DataType.FAKER_DATE_PAST]: () => faker.date.past(),
  [DataType.FAKER_DATE_FUTURE]: () => faker.date.future(),
};
