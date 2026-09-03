


GITHUB = """
query getUserProfile($username: String!) {
  user(login: $username) {

    login
    name
    avatarUrl
    bio

    followers {
      totalCount
    }

    following {
      totalCount
    }

    # Total public repositories
    repoCount: repositories(privacy: PUBLIC) {
      totalCount
    }

    # Contribution graph
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
            contributionLevel
          }
        }
      }
    }

    # Top repositories
    topRepositories: repositories(
      first: 100
      privacy: PUBLIC
      ownerAffiliations: OWNER
      orderBy: {
        field: STARGAZERS
        direction: DESC
      }
    ) {
      nodes {
        name
        description
        url
        stargazerCount
        forkCount

        primaryLanguage {
          name
          color
        }

        languages(
          first: 10
          orderBy: {
            field: SIZE
            direction: DESC
          }
        ) {
          edges {
            size
            node {
              name
              color
            }
          }
        }
      }
    }
  }
# PRs Merged
  mergedPRs: search(
    query: "is:pr is:merged author:$username"
    type: ISSUE
    first: 1
  ) {
    issueCount
  }
}
"""