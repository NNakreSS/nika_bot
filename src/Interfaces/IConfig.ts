export default interface ConfigTypes {
  joinNotificationChanelId: String;
  leaveNotificationChanelId: String;
  customerRoleId: String;
  permissionLevels: {
    [key: number]: string;
  };
  rolePermissions: {
    [key: string]: number;
  };
}
