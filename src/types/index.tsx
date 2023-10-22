export interface Company {
  name: string;
  address?: string;
  contactsName?: string;
  contactsMobile?: string;
  remark?: string;
}

export enum Operation {
  Add,
  Edit,
}

export interface Project {
  name: string;
  num: string;
  date: string;
}
