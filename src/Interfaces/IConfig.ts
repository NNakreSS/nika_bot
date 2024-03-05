export default interface ConfigTypes {
  chanelIds: {
    joinNotificationChanelId: String;
    leaveNotificationChanelId: String;
    customerRoleLogChanelId: String;
  };
  roleIds: {
    customerRoleId: String;
    defaultRole: String;
  };
  permissionLevels: {
    [key: number]: string;
  };
  rolePermissions: {
    [key: string]: number;
  };
}
