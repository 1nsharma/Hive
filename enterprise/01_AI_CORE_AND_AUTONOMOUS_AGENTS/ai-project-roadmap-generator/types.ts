
export interface Feature {
  name: string;
  description: string;
}

export interface Milestone {
  title: string;
  duration: string;
  features: Feature[];
}

export interface Roadmap {
  projectName: string;
  projectDescription: string;
  milestones: Milestone[];
}

export interface ProjectInput {
  description: string;
  targetAudience: string;
  techStack: string;
  timeline: string;
}
