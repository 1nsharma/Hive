
export interface Message {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export interface Node {
  id: string;
  group: number;
}

export interface Link {
  source: string;
  target: string;
}

export interface GraphData {
  nodes: Node[];
  links: Link[];
}
