export default interface EventType {
  name: string;
  once: boolean;
  execute: (...args: any) => Promise<void> | void;
}
