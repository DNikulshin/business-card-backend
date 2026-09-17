export const DEFAULT_QUERY = `query GetMyProfile {
  profile {
    name
    description
    github
    linkedin
    portfolio
    skills {
      name
    }
    experience {
      company
      position
      period
      achievements
    }
    projects {
      name
      url
    }
  }
}`;
