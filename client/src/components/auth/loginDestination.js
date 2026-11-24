const destinations = {
  student: "/student/projects",
  recruiter: "/recruiter/search",
};

export function loginDestination(role, requested) {
  return requested && requested === destinations[role] ? requested : `/${role}/dashboard`;
}
