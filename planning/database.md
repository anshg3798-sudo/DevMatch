# Database Design

## User

- id
- name
- email
- password
- college
- branch
- year
- bio
- skills[]
- github
- linkedin
- portfolio
- availability
- timezone
- experienceLevel
- rating
- completedProjects
- createdAt
- updatedAt

---

## Project

- id
- title
- description
- ownerId
- requiredSkills[]
- teamSize
- currentMembers[]
- status
- difficulty
- projectType
- deadline

---

## Invitation

- id
- senderId
- receiverId
- projectId
- status
- message