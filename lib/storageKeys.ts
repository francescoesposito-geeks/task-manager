// every key starts with the app name, so it does not clash with
// other projects opened on the same address (for example localhost:3000)
const PREFIX = "task-manager";

export const STORAGE_KEYS = {
  profiles: `${PREFIX}:profiles`,
  activeProfile: `${PREFIX}:active-profile`,
  tasks: (profileId: string) => `${PREFIX}:tasks:${profileId}`,
  columnsTrello: `${PREFIX}:columns-trello`,
  columnsEisenhower: `${PREFIX}:columns-eisenhower`,
  view: `${PREFIX}:view`
};
