export interface Domain {
  id: string;
  name: string;
  description: string;
  iconName: string;
  color: string; // e.g. 'indigo', 'emerald', 'sky'
}

export interface SubDomain {
  id: string;
  domainId: string;
  name: string;
  description: string;
  content: string; // Markdown document content
  status: 'draft' | 'review' | 'completed';
  lastUpdated: string;
}

export interface Connection {
  id: string;
  sourceId: string; // subDomain ID
  targetId: string; // subDomain ID
  description: string; // Explanation of relationship
  type: 'dependency' | 'data-flow' | 'security' | 'integration';
}

export interface KnowledgeMapData {
  domains: Domain[];
  subDomains: SubDomain[];
  connections: Connection[];
}
