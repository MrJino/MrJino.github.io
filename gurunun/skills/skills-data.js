// 새 Skill은 아래 배열에 추가합니다.
// {
//   id: 'unique-skill-id',
//   area: 'workspace',
//   title: { ko: '제목', en: 'Title' },
//   summary: { ko: '한 줄 설명', en: 'One-line summary' },
//   href: './unique-skill-id/',
// }
export const skillAreas = [
  {
    id: 'workspace',
    title: 'WORKSPACE',
    description: {
      ko: '프로젝트 구조와 반복 가능한 작업 흐름',
      en: 'Project structure and repeatable workflows',
    },
  },
  {
    id: 'interface',
    title: 'INTERFACE',
    description: {
      ko: '일관된 화면과 상호작용을 만드는 UI 설계 기준',
      en: 'UI design principles for consistent screens and interactions',
    },
  },
  {
    id: 'data-content',
    title: 'DATA & CONTENT',
    description: {
      ko: '콘텐츠와 데이터를 다루고 검증하는 방식',
      en: 'Methods for working with and validating content and data',
    },
  },
  {
    id: 'platform',
    title: 'PLATFORM',
    description: {
      ko: '서비스 기반과 운영 과정에서 쌓인 실전 지식',
      en: 'Practical knowledge from service foundations and operations',
    },
  },
];

export const skills = [
  {
    id: 'interface',
    area: 'interface',
    title: { ko: 'INTERFACE', en: 'INTERFACE' },
    summary: {
      ko: '일관된 화면과 상호작용을 만드는 UI 설계 기준',
      en: 'UI design principles for consistent screens and interactions',
    },
  },
];
