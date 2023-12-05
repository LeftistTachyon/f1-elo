export type Result = {
  position: number;
  positionText: string;
  driver: string;
  constructor: string;
  status: string;
};
export type Race = {
  round: number;
  date: Date;
  results: Result[];
};
